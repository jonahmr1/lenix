import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const { NextRequest, NextResponse } = require('next/server')

function load(file, mocks) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  })
  const module = { exports: {} }
  vm.runInNewContext(outputText, {
    exports: module.exports,
    module,
    URL,
    require(name) {
      if (name in mocks) return mocks[name]
      throw new Error(`Unexpected dependency: ${name}`)
    },
  })
  return module.exports
}

function callback(exchange, savedPath, cleared = []) {
  return load('../auth/callback/route.ts', {
    '@/lib/supabase.server': {
      createClient: () => ({ auth: { exchangeCodeForSession: exchange } }),
    },
    'next/headers': {
      cookies: async () => ({
        get: name =>
          name === 'tone_return_to' && savedPath
            ? { value: savedPath }
            : undefined,
        set: (...args) => cleared.push(args),
      }),
    },
    'next/server': { NextResponse },
  }).GET
}

test('successful Google callback exchanges the code and returns to Tone', async () => {
  let exchanged
  const GET = callback(async code => {
    exchanged = code
    return { error: null }
  })
  const result = await GET(
    new Request('http://localhost:3001/auth/callback?code=test&next=/tone')
  )
  assert.equal(exchanged, 'test')
  assert.equal(result.headers.get('location'), 'http://localhost:3001/tone')
})

test('callback preserves an internal return path and forwarded deployment origin', async () => {
  const GET = callback(async () => ({ error: null }))
  const result = await GET(
    new Request(
      'http://localhost/auth/callback?code=test&next=/tone?welcome=1',
      {
        headers: {
          'x-forwarded-host': 'lenix.dev',
          'x-forwarded-proto': 'https',
        },
      }
    )
  )
  assert.equal(
    result.headers.get('location'),
    'https://lenix.dev/tone?welcome=1'
  )
})

for (const next of ['https://example.org']) {
  test(`callback rejects unsafe return path ${JSON.stringify(next)}`, async () => {
    const GET = callback(async () => ({ error: null }))
    const result = await GET(
      new Request(
        `http://localhost/auth/callback?code=test&next=${encodeURIComponent(next)}`
      )
    )
    assert.equal(result.headers.get('location'), 'http://localhost/tone')
  })
}

for (const query of ['', '?error=access_denied']) {
  test(`missing/canceled callback gives a retryable error (${query || 'no query'})`, async () => {
    const GET = callback(() => {
      throw new Error('Code exchange must not run')
    })
    const result = await GET(
      new Request(`http://localhost/auth/callback${query}`)
    )
    assert.equal(
      result.headers.get('location'),
      'http://localhost/tone?auth-code-error=sign_in'
    )
  })
}

test('rejected code exchange returns to the sign-in screen', async () => {
  const result = await callback(async () => ({
    error: new Error('Expired code'),
  }))(new Request('http://localhost/auth/callback?code=test'))
  assert.equal(
    result.headers.get('location'),
    'http://localhost/tone?auth-code-error=sign_in'
  )
})

function middleware(getClaims) {
  return load('../../lib/supabase.middleware.ts', {
    './supabase': {
      supabaseUrl: 'https://example.supabase.co',
      supabaseKey: 'test-public-key',
    },
    '@supabase/ssr': {
      createServerClient: (_url, _key, { cookies }) => ({
        auth: { getClaims: () => getClaims(cookies) },
      }),
    },
    'next/server': { NextResponse },
  }).createClient
}

test('refresh forwards updated cookies to the page and browser, keeping SDK headers', async () => {
  const request = new NextRequest('http://localhost/tone')
  let refreshed = false
  const refresh = middleware(async cookies => {
    refreshed = true
    cookies.setAll(
      [
        {
          name: 'session',
          value: 'new-token',
          options: { path: '/', httpOnly: true },
        },
      ],
      {
        Pragma: 'no-cache',
        Expires: '0',
      }
    )
  })
  const result = await refresh(request)
  assert.equal(refreshed, true)
  assert.equal(request.cookies.get('session')?.value, 'new-token')
  assert.equal(result.cookies.get('session')?.value, 'new-token')
  assert.equal(result.cookies.get('session')?.httpOnly, true)
  assert.match(
    result.headers.get('x-middleware-request-cookie'),
    /session=new-token/
  )
  assert.equal(result.headers.get('pragma'), 'no-cache')
  assert.equal(result.headers.get('cache-control'), 'private, no-store')
})

test('signed-out requests remain accessible and cannot be shared-cache entries', async () => {
  const result = await middleware(async () => ({ data: null, error: null }))(
    new NextRequest('http://localhost/tone')
  )
  assert.equal(result.status, 200)
  assert.equal(result.headers.get('cache-control'), 'private, no-store')
})

test('refresh outage keeps the sign-in page reachable', async () => {
  const result = await middleware(async () => {
    throw new Error('Offline')
  })(new NextRequest('http://localhost/tone'))
  assert.equal(result.status, 200)
  assert.equal(result.headers.get('cache-control'), 'private, no-store')
})

test('Google callback resumes the playlist link and clears its short-lived cookie', async () => {
  const path = '/tone/playlist/11111111-2222-4333-8444-555555555555'
  const cleared = []
  const GET = callback(async () => ({ error: null }), path, cleared)
  const result = await GET(
    new Request('http://localhost:3000/auth/callback?code=test')
  )
  assert.equal(result.headers.get('location'), `http://localhost:3000${path}`)
  assert.equal(cleared[0][0], 'tone_return_to')
  assert.equal(cleared[0][1], '')
  assert.equal(cleared[0][2].maxAge, 0)
  assert.equal(cleared[0][2].path, '/auth/callback')
})

for (const path of [
  'https://example.org',
  '//example.org',
  '/tone/playlist/not-an-id',
]) {
  test(`invalid saved playlist destination is ignored: ${path}`, async () => {
    const GET = callback(async () => ({ error: null }), path)
    const result = await GET(
      new Request('http://localhost:3000/auth/callback?code=test')
    )
    assert.equal(result.headers.get('location'), 'http://localhost:3000/tone')
  })
}
