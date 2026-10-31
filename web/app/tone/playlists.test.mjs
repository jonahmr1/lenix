import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

function load(file, mocks) {
  const { outputText } = ts.transpileModule(
    readFileSync(new URL(file, import.meta.url), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }
  )
  const module = { exports: {} }
  vm.runInNewContext(outputText, {
    exports: module.exports,
    module,
    require(name) {
      if (name in mocks) return mocks[name]
      throw new Error(`Unexpected dependency: ${name}`)
    },
  })
  return module.exports
}

function setup({
  user = { id: 'owner' },
  authError = null,
  dbError = null,
  throws = false,
} = {}) {
  const calls = { inserts: [], refreshes: [], auth: 0 }
  const create = load('./playlist-actions.ts', {
    'next/headers': { cookies: async () => ({}) },
    'next/cache': { revalidatePath: (...args) => calls.refreshes.push(args) },
    '@/lib/supabase.server': {
      createClient: () => ({
        auth: {
          getUser: async () => {
            calls.auth++
            return { data: { user }, error: authError }
          },
        },
        from: table => {
          assert.equal(table, 'playlists')
          return {
            insert: row => {
              calls.inserts.push(row)
              return {
                select: () => ({
                  single: async () => {
                    if (throws) throw new Error('offline')
                    return {
                      data: dbError ? null : { id: 'new-playlist' },
                      error: dbError,
                    }
                  },
                }),
              }
            },
          }
        },
      }),
    },
  }).createPlaylist
  return { create, calls }
}

function form(name) {
  const data = new FormData()
  if (name !== undefined) data.set('name', name)
  return data
}

test('creation trims the name and uses verified ownership, ignoring a forged owner', async () => {
  const { create, calls } = setup()
  const data = form('  Night music  ')
  data.set('user_id', 'another-user')
  const result = await create(data)
  assert.equal(result.id, 'new-playlist')
  assert.deepEqual(JSON.parse(JSON.stringify(calls.inserts)), [
    { label: 'Night music', tracks: [], user_id: 'owner' },
  ])
  assert.deepEqual(calls.refreshes, [['/tone', 'layout']])
})

for (const name of [
  undefined,
  '',
  '   ',
  'x'.repeat(101),
  new Blob(['not a name']),
]) {
  test(`invalid playlist name is rejected before database access: ${typeof name}`, async () => {
    const { create, calls } = setup()
    assert.ok((await create(form(name))).error)
    assert.equal(calls.auth, 0)
    assert.equal(calls.inserts.length, 0)
  })
}

for (const auth of [{ user: null }, { authError: { message: 'expired' } }]) {
  test('missing or invalid session cannot create a playlist', async () => {
    const { create, calls } = setup(auth)
    assert.ok((await create(form('Night music'))).error)
    assert.equal(calls.inserts.length, 0)
    assert.equal(calls.refreshes.length, 0)
  })
}

for (const failure of [
  { dbError: { message: 'private database details' } },
  { throws: true },
]) {
  test('database failure returns a safe error and does not report success', async () => {
    const { create, calls } = setup(failure)
    const result = await create(form('Night music'))
    assert.ok(result.error)
    assert.equal(result.id, undefined)
    assert.equal(result.error.includes('private database details'), false)
    assert.equal(calls.refreshes.length, 0)
  })
}

test('listing scopes the query to the verified owner and returns only summary fields', async () => {
  const calls = []
  const query = {
    select: fields => {
      calls.push(['select', fields])
      return query
    },
    eq: (field, value) => {
      calls.push(['eq', field, value])
      return query
    },
    order: (field, options) => {
      calls.push(['order', field, options.ascending])
      return query
    },
    then: resolve =>
      resolve({
        data: [{ id: 'mine', label: 'Night', tracks: ['a', 'b'] }],
        error: null,
      }),
  }
  const { readPlaylists } = load('./playlist-data.ts', { 'server-only': {} })
  const result = await readPlaylists(
    {
      from: table => {
        assert.equal(table, 'playlists')
        return query
      },
    },
    'owner'
  )
  assert.deepEqual(calls, [
    ['select', 'id, label, tracks'],
    ['eq', 'user_id', 'owner'],
    ['order', 'created_at', false],
    ['order', 'id', false],
  ])
  assert.equal(result.error, null)
  assert.deepEqual(JSON.parse(JSON.stringify(result.playlists)), [
    { id: 'mine', label: 'Night', trackCount: 2 },
  ])
})

test('listing failure remains distinguishable from an empty library', async () => {
  const { readPlaylists } = load('./playlist-data.ts', { 'server-only': {} })
  const result = await readPlaylists(
    {
      from: () => {
        throw new Error('offline')
      },
    },
    'owner'
  )
  assert.ok(result.error)
  assert.equal(result.playlists.length, 0)
})

const playlistId = '11111111-2222-4333-8444-555555555555'

function playlistReader(result) {
  const filters = []
  const query = {
    select: () => query,
    eq: (column, value) => {
      filters.push([column, value])
      return query
    },
    maybeSingle: async () => result,
  }
  const { readPlaylist } = load('./playlist-data.ts', { 'server-only': {} })
  return {
    read: id =>
      readPlaylist(
        {
          from: table => {
            assert.equal(table, 'playlists')
            return query
          },
        },
        'owner',
        id
      ),
    filters,
  }
}

test('direct playlist lookup requires both the requested ID and verified owner', async () => {
  const { read, filters } = playlistReader({
    data: { id: playlistId, label: 'Night music', tracks: ['a'] },
    error: null,
  })
  const result = await read(playlistId)
  assert.deepEqual(filters, [
    ['user_id', 'owner'],
    ['id', playlistId],
  ])
  assert.equal(result.label, 'Night music')
  assert.equal(result.trackCount, 1)
})

test('missing or inaccessible playlist is unavailable without leaking its name', async () => {
  const { read, filters } = playlistReader({ data: null, error: null })
  assert.equal(await read(playlistId), null)
  assert.deepEqual(filters, [
    ['user_id', 'owner'],
    ['id', playlistId],
  ])
})

test('invalid playlist URL never reaches the database', async () => {
  const { readPlaylist } = load('./playlist-data.ts', { 'server-only': {} })
  const client = {
    from: () => {
      throw new Error('must not query')
    },
  }
  assert.equal(await readPlaylist(client, 'owner', 'not-a-uuid'), null)
  assert.equal(await readPlaylist(client, 'owner', '../another-user'), null)
})

test('playlist database errors are retryable, not misreported as missing', async () => {
  const { read } = playlistReader({
    data: null,
    error: { message: 'private database details' },
  })
  await assert.rejects(read(playlistId), /Couldn’t load this playlist/)
})
