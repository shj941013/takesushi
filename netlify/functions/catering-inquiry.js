import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import catering from '../../src/shared/catering.mjs';

const { isEmail, normalizeInquiry, validateInquiry } = catering;
const MAX_BYTES = 16384;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Netlify applies this across instances, not just one warm function process.
// Protect both the custom route and the default function URL.
export const config = {
  path: ['/api/catering-inquiry', '/.netlify/functions/catering-inquiry'],
  rateLimit: { action: 'rate_limit', windowLimit: 5, windowSize: 120, aggregateBy: ['ip', 'domain'] },
};

const json = (status, body, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
});

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

export function formatEmail(values) {
  const fields = [
    ['Customer name', values.name], ['Email', values.email], ['Phone', values.phone],
    ['Event date', values.date], ['Estimated guests', values.guests], ['Event type', values.event],
    ['Pickup / delivery preference', values.preference],
    ['Requested delivery location', values.preference === 'Delivery' ? values.location : 'Not applicable (pickup)'],
    ['Catering selections', values.selections.join(', ')], ['Budget range', values.budget || 'Not specified'],
    ['Additional requests', values.requests || 'None'],
  ];
  const notice = 'This is a catering inquiry requiring restaurant approval. No order, date, or delivery arrangement has been confirmed.';
  return {
    subject: `Take Sushi catering inquiry - ${values.date}`,
    text: ['TAKE SUSHI - CATERING INQUIRY', '', ...fields.map(([label, value]) => `${label}: ${value}`), '', notice].join('\n'),
    html: `<!doctype html><html><body style="margin:0;padding:24px;background:#f8f6f2;color:#1c1c1c;font-family:Arial,sans-serif;line-height:1.6"><div style="max-width:640px;margin:auto"><p style="color:#a52a2a;font-size:12px;letter-spacing:2px">TAKE SUSHI</p><h1 style="font-family:Georgia,serif;font-size:30px">New catering inquiry</h1><p>Reply to this email to contact the customer directly.</p><table style="width:100%;border-collapse:collapse">${fields.map(([label, value]) => `<tr><th scope="row" style="padding:12px 10px 12px 0;text-align:left;vertical-align:top;border-bottom:1px solid #ded8ce;width:34%">${escapeHtml(label)}</th><td style="padding:12px 0;border-bottom:1px solid #ded8ce;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`).join('')}</table><p style="font-size:12px;color:#655f57;margin-top:24px">${notice}</p></div></body></html>`,
  };
}

async function readJson(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid_json');
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) { await reader.cancel(); throw new Error('too_large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export function createHandler({ env = process.env, makeClient = key => new Resend(key), now = () => Date.now(), timeoutMs = 15000 } = {}) {
  return async request => {
    if (request.method !== 'POST') return json(405, { message: 'Only POST requests are supported.' }, { Allow: 'POST' });
    const origin = request.headers.get('origin');
    const allowed = new Set([new URL(request.url).origin, 'https://takesushimichigan.com', 'https://www.takesushimichigan.com']);
    if (!origin || !allowed.has(origin) || request.headers.get('sec-fetch-site') === 'cross-site') return json(403, { message: 'Please submit this form from the Take Sushi website.' });
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return json(415, { message: 'Please submit the form as JSON.' });
    const declaredLength = Number(request.headers.get('content-length'));
    if (declaredLength > MAX_BYTES) return json(413, { message: 'Your inquiry is too long. Please shorten the additional requests.' });
    let payload;
    try { payload = await readJson(request); }
    catch (error) { return json(error.message === 'too_large' ? 413 : 400, { message: 'Please check the inquiry details and try again.' }); }
    const values = normalizeInquiry(payload);
    if (!values) return json(400, { message: 'Please check the inquiry details and try again.' });
    if (values.website) return json(400, { message: 'We could not send this inquiry. Please call (248) 652-7800.' });
    const errors = validateInquiry(values, new Date(now()));
    if (Object.keys(errors).length) return json(422, { message: 'Please correct the highlighted fields.', errors });
    if (!UUID.test(payload.requestId || '') || !Number.isSafeInteger(payload.startedAt)) return json(400, { message: 'Please reload the page and try again.' });
    if (now() - payload.startedAt < 2000) return json(429, { message: 'Please take a moment to review your inquiry, then try again.' }, { 'Retry-After': '2' });
    const from = env.CATERING_FROM_EMAIL?.trim();
    const to = env.CATERING_TO_EMAIL?.trim();
    if (!env.RESEND_API_KEY || !isEmail(from) || !isEmail(to)) return json(503, { message: 'Online inquiries are temporarily unavailable. Please call (248) 652-7800.' });
    const mail = { from, to: [to], replyTo: values.email, ...formatEmail(values) };
    // Bind retry keys to the exact email so an edited payload cannot conflict.
    const digest = createHash('sha256').update(JSON.stringify(mail)).digest('hex');
    const idempotencyKey = `catering/${payload.requestId}/${digest}`;
    let timer;
    const controller = new AbortController();
    try {
      const result = await Promise.race([
        makeClient(env.RESEND_API_KEY).emails.send(mail, { idempotencyKey, signal: controller.signal }),
        new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('send_timeout')); }, timeoutMs); }),
      ]);
      if (result.error || typeof result.data?.id !== 'string' || !result.data.id) {
        // Do not return/log provider messages, credentials, or customer content.
        return json(502, { message: 'We could not send your inquiry. Please try again or call (248) 652-7800.' });
      }
      return json(200, { accepted: true, emailId: result.data.id });
    } catch {
      // A retry uses the same provider idempotency key even if acceptance was uncertain.
      return json(503, { message: 'We could not confirm that your inquiry was sent. Please retry using this form or call (248) 652-7800.' });
    } finally { clearTimeout(timer); }
  };
}

export default createHandler();
