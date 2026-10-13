import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, config, escapeHtml } from '../functions/catering-inquiry.js';

const clock = Date.parse('2026-10-12T16:00:00Z');
const env = { RESEND_API_KEY: 'test-only-not-a-real-key', CATERING_FROM_EMAIL: 'catering@takesushimichigan.com', CATERING_TO_EMAIL: 'restaurant@example.com' };
const payload = { name: 'Test Guest', email: 'customer@example.com', phone: '(248) 555-0100', date: '2099-11-05', guests: '20', event: 'Private parties', preference: 'Delivery', location: 'Test location', selections: ['Classic sushi rolls'], budget: '$300', requests: 'No peanuts', website: '', requestId: 'd3363b2e-e577-4a71-954b-eebc243be11d', startedAt: clock - 5000 };
function request(values = payload, options = {}) {
  return new Request('https://takesushimichigan.com/api/catering-inquiry', { method: 'POST', headers: { Origin: 'https://takesushimichigan.com', 'Content-Type': 'application/json', ...options.headers }, body: JSON.stringify(values), ...options });
}
function setup(result = { data: { id: 'mock-email-id' }, error: null }, overrides = {}) {
  const sent = [];
  const handler = createHandler({ env, now: () => clock, makeClient: () => ({ emails: { send: async (mail, options) => { sent.push({ mail, options }); if (result instanceof Error) throw result; return result; } } }), ...overrides });
  return { sent, handler };
}

test('notifies only the restaurant, includes all fields, and sets customer Reply-To', async () => {
  const { handler, sent } = setup();
  const res = await handler(request());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { accepted: true, emailId: 'mock-email-id' });
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].mail.to, [env.CATERING_TO_EMAIL]);
  assert.equal(sent[0].mail.replyTo, payload.email);
  for (const value of ['Test Guest', 'customer@example.com', '(248) 555-0100', '2099-11-05', '20', 'Private parties', 'Delivery', 'Test location', 'Classic sushi rolls', '$300', 'No peanuts']) assert.ok(sent[0].mail.text.includes(value));
  assert.ok(sent[0].options.signal instanceof AbortSignal);
});

test('HTML injection is escaped, including quotes and ampersands', async () => {
  const { handler, sent } = setup();
  await handler(request({ ...payload, name: '<img src=x onerror=alert(1)>', requests: '<script>alert("x")</script> & stuff' }));
  assert.ok(!sent[0].mail.html.includes('<script>'));
  assert.ok(!sent[0].mail.html.includes('<img src=x'));
  assert.ok(sent[0].mail.html.includes('&lt;script&gt;'));
  assert.equal(escapeHtml(`"'&<>`), '&quot;&#39;&amp;&lt;&gt;');
});

test('validates fields, enums, lengths, email injection, dates, and guests on the server', async () => {
  for (const changes of [{ name: '' }, { email: 'bad' }, { email: 'x@example.com\r\nBcc: another@example.com' }, { phone: 'bad' }, { date: '2026-02-30' }, { date: '2000-01-01' }, { guests: '2.5' }, { event: 'unknown' }, { preference: 'unknown' }, { location: '' }, { selections: [] }, { selections: ['invented'] }, { requests: 'x'.repeat(2001) }]) {
    const { handler, sent } = setup();
    const res = await handler(request({ ...payload, ...changes }));
    assert.equal(res.status, 422, JSON.stringify(changes));
    assert.equal(sent.length, 0);
  }
});

test('pickup does not include a stale delivery address and optional fields have defaults', async () => {
  const { handler, sent } = setup();
  assert.equal((await handler(request({ ...payload, preference: 'Pickup', location: 'hidden stale address', budget: '', requests: '' }))).status, 200);
  assert.ok(!sent[0].mail.text.includes('hidden stale address'));
  assert.ok(sent[0].mail.text.includes('Not specified'));
});

test('blocks honeypots, fast submissions, invalid IDs, and foreign origins without sending', async () => {
  const { handler, sent } = setup();
  assert.equal((await handler(request({ ...payload, website: 'spam' }))).status, 400);
  assert.equal((await handler(request({ ...payload, startedAt: clock }))).status, 429);
  assert.equal((await handler(request({ ...payload, requestId: 'invalid' }))).status, 400);
  assert.equal((await handler(request(payload, { headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' } }))).status, 403);
  assert.equal(sent.length, 0);
});

test('rejects missing origin, wrong method/content type, malformed JSON and excessive body', async () => {
  const { handler, sent } = setup();
  assert.equal((await handler(new Request('https://takesushimichigan.com/api/catering-inquiry'))).status, 405);
  assert.equal((await handler(new Request('https://takesushimichigan.com/api/catering-inquiry', { method: 'POST', body: '{}' }))).status, 403);
  assert.equal((await handler(request(payload, { headers: { Origin: 'https://takesushimichigan.com', 'Content-Type': 'text/plain' } }))).status, 415);
  assert.equal((await handler(new Request('https://takesushimichigan.com/api/catering-inquiry', { method: 'POST', headers: { Origin: 'https://takesushimichigan.com', 'Content-Type': 'application/json' }, body: '{' }))).status, 400);
  assert.equal((await handler(request({ ...payload, requests: 'x'.repeat(20000) }))).status, 413);
  assert.equal(sent.length, 0);
});

test('missing server configuration fails closed', async () => {
  const { handler, sent } = setup(undefined, { env: {} });
  const res = await handler(request());
  assert.equal(res.status, 503);
  assert.equal(sent.length, 0);
});

test('provider rejection and missing email ID never return success or expose provider details', async () => {
  for (const result of [{ error: { message: 'private provider detail' }, data: null }, { error: null, data: {} }, new Error('private provider detail')]) {
    const { handler } = setup(result);
    const res = await handler(request());
    assert.ok(res.status >= 500);
    const body = await res.text();
    assert.ok(!body.includes('private provider detail'));
    assert.ok(!body.includes('accepted'));
  }
});

test('timeout is bounded, aborts provider request, and returns a retryable error', async () => {
  let signal;
  const { handler } = setup(undefined, { timeoutMs: 5, makeClient: () => ({ emails: { send: (mail, options) => { signal = options.signal; return new Promise(() => {}); } } }) });
  assert.equal((await handler(request())).status, 503);
  assert.equal(signal.aborted, true);
});

test('unchanged retries reuse the key; an edited email has a distinct digest', async () => {
  const { handler, sent } = setup();
  await handler(request()); await handler(request()); await handler(request({ ...payload, requests: 'Changed notes' }));
  assert.equal(sent[0].options.idempotencyKey, sent[1].options.idempotencyKey);
  assert.notEqual(sent[0].options.idempotencyKey, sent[2].options.idempotencyKey);
});

test('platform rate limit covers both public endpoints', () => {
  assert.deepEqual(config.path, ['/api/catering-inquiry', '/.netlify/functions/catering-inquiry']);
  assert.deepEqual(config.rateLimit, { action: 'rate_limit', windowLimit: 5, windowSize: 120, aggregateBy: ['ip', 'domain'] });
});


test('the installed Resend SDK serializes Reply-To and idempotency correctly (mock transport)', async () => {
  const originalFetch = globalThis.fetch;
  let captured;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return new Response(JSON.stringify({ id: 'sdk-mock-email-id' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const handler = createHandler({ env, now: () => clock });
    const response = await handler(request());
    assert.equal(response.status, 200);
    assert.equal((await response.json()).emailId, 'sdk-mock-email-id');
    const mail = JSON.parse(captured.options.body);
    assert.equal(mail.reply_to, payload.email);
    assert.deepEqual(mail.to, [env.CATERING_TO_EMAIL]);
    assert.ok(new Headers(captured.options.headers).get('Idempotency-Key').startsWith('catering/'));
  } finally { globalThis.fetch = originalFetch; }
});
