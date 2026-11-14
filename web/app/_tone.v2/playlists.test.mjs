import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

function load(file, mocks, globals = {}) {
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
    ...globals,
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
  const create = load('../../lib/tone/playlist-actions.ts', {
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

const videoId = 'dQw4w9WgXcQ'

function trackWriter({
  user = { id: 'owner' },
  missing = false,
  initial = [],
  conflict = false,
  dbError = false,
} = {}) {
  let tracks = [...initial]
  let firstUpdate = true
  const calls = { writes: 0, refreshes: 0, filters: [] }
  const { addTrack } = load('../../lib/tone/track-actions.ts', {
    'next/headers': { cookies: async () => ({}) },
    'next/cache': { revalidatePath: () => calls.refreshes++ },
    '@/app/tone/youtube': {
      isVideoId: value =>
        typeof value === 'string' && /^[\w-]{11}$/.test(value),
    },
    '@/lib/supabase.server': {
      createClient: () => ({
        auth: { getUser: async () => ({ data: { user }, error: null }) },
        from: () => {
          let update
          let expected
          const filters = []
          const query = {
            select: () => query,
            eq: (key, value) => {
              filters.push([key, value])
              return query
            },
            filter: (key, operator, value) => {
              assert.equal(key, 'tracks')
              assert.equal(operator, 'eq')
              expected = value
              return query
            },
            update: value => {
              update = value
              return query
            },
            maybeSingle: async () => {
              calls.filters.push(filters)
              assert.deepEqual(filters, [
                ['id', playlistId],
                ['user_id', 'owner'],
              ])
              if (dbError)
                return {
                  data: null,
                  error: { message: 'private database failure' },
                }
              if (missing) return { data: null, error: null }
              if (!update)
                return {
                  data: { label: 'Test', tracks: [...tracks] },
                  error: null,
                }
              if (conflict && firstUpdate) {
                tracks.push('abcdefghijk')
                firstUpdate = false
              }
              const actual = `{${tracks.map(id => JSON.stringify(id)).join(',')}}`
              if (expected !== actual) return { data: null, error: null }
              tracks = [...update.tracks]
              calls.writes++
              return { data: { id: playlistId }, error: null }
            },
          }
          return query
        },
      }),
    },
  })
  return { addTrack, calls, tracks: () => tracks }
}

test('adding requires a valid session and valid identifiers', async () => {
  const anonymous = trackWriter({ user: null })
  assert.ok((await anonymous.addTrack(playlistId, videoId)).error)
  assert.equal(anonymous.calls.filters.length, 0)
  const valid = trackWriter()
  for (const [playlist, video] of [
    ['bad', videoId],
    [playlistId, 'bad'],
    [null, videoId],
  ])
    assert.ok((await valid.addTrack(playlist, video)).error)
  assert.equal(valid.calls.filters.length, 0)
})

test('missing or other-user playlist cannot be updated', async () => {
  const writer = trackWriter({ missing: true })
  assert.ok((await writer.addTrack(playlistId, videoId)).error)
  assert.equal(writer.calls.writes, 0)
})

test('adding preserves existing tracks and duplicate additions are idempotent', async () => {
  const writer = trackWriter({ initial: ['abcdefghijk'] })
  assert.equal((await writer.addTrack(playlistId, videoId)).added, true)
  assert.equal((await writer.addTrack(playlistId, videoId)).added, false)
  assert.deepEqual(writer.tracks(), ['abcdefghijk', videoId])
  assert.equal(writer.calls.writes, 1)
  assert.equal(writer.calls.refreshes, 1)
})

test('simultaneous additions preserve both tracks by retrying the changed array', async () => {
  const writer = trackWriter({ conflict: true })
  assert.equal((await writer.addTrack(playlistId, videoId)).added, true)
  assert.deepEqual(writer.tracks(), ['abcdefghijk', videoId])
  assert.equal(writer.calls.filters.length, 4)
})

test('failed track writes never claim success or leak database details', async () => {
  const writer = trackWriter({ dbError: true })
  const result = await writer.addTrack(playlistId, videoId)
  assert.ok(result.error)
  assert.equal(result.error.includes('private database'), false)
  assert.equal(writer.calls.refreshes, 0)
})

function youtube(fetch) {
  return load(
    './youtube.ts',
    {
      'server-only': {},
      he: { decode: value => value.replaceAll('&amp;', '&') },
    },
    {
      URL,
      URLSearchParams,
      AbortSignal,
      fetch,
      process: { env: { NEXT_PUBLIC_YOUTUBE_API_KEY: 'test-key' } },
    }
  )
}

test('YouTube search validates queries and requests embeddable music videos', async () => {
  let calls = 0
  const { searchTracks } = youtube(async url => {
    calls++
    assert.equal(url.searchParams.get('q'), 'song')
    assert.equal(url.searchParams.get('type'), 'video')
    assert.equal(url.searchParams.get('videoEmbeddable'), 'true')
    assert.equal(url.searchParams.get('videoCategoryId'), '10')
    return {
      ok: true,
      json: async () => ({
        items: [
          {
            id: { videoId },
            snippet: { title: 'A &amp; B', channelTitle: 'Artist' },
          },
        ],
        nextPageToken: 'NEXT',
      }),
    }
  })
  for (const query of ['', '   ', 'x'.repeat(201)])
    await assert.rejects(searchTracks(query))
  await assert.rejects(searchTracks('song', 'bad/token'))
  assert.equal(calls, 0)
  const result = await searchTracks(' song ')
  assert.equal(result.tracks[0].title, 'A & B')
  assert.equal(result.nextPageToken, 'NEXT')
})

test('track lookup preserves playlist ordering and unavailable entries', async () => {
  const { readTracks } = youtube(async () => ({
    ok: true,
    json: async () => ({
      items: [
        { id: 'abcdefghijk', snippet: { title: 'Second' } },
        { id: videoId, snippet: { title: 'First' } },
      ],
    }),
  }))
  const result = await readTracks([videoId, 'abcdefghijk', 'missing1234'])
  assert.deepEqual(
    Array.from(result, item => item.title),
    ['First', 'Second', 'Unavailable YouTube track']
  )
})

test('quota and network failures produce safe actionable errors', async () => {
  await assert.rejects(
    youtube(async () => ({ ok: false, status: 403 })).searchTracks('song'),
    /limiting requests/
  )
  await assert.rejects(
    youtube(async () => {
      throw new Error('secret URL')
    }).searchTracks('song'),
    /Couldn’t reach YouTube/
  )
})
