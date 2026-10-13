# Catering inquiry delivery: Netlify + Resend

## Current behavior

The existing catering form now POSTs JSON to `/api/catering-inquiry`. A Netlify Function validates the request and sends **one restaurant notification** using the server-only Resend SDK. All existing fields/styling remain. No customer confirmation email, database, payment, or catering-order confirmation is added.

The UI shows loading and disables the form while sending. Success requires HTTP success plus `accepted: true` and an email ID from the function; the function requires a successful Resend API response containing an ID. This proves API acceptance, not delivery to an inbox. Failures retain fields and offer retry/call options. Timeouts/retries keep the original request ID while the payload is unchanged. Resend's idempotency key is bound to that request ID and a hash of the complete email, so retries do not repeat the provider operation within Resend's retention window (24 hours). Refreshing the page creates a new request ID; avoid refreshing after an uncertain response.

## Files changed for delivery

- `netlify/functions/catering-inquiry.js`: HTTP handler, bounded request parsing, origin/content-type/honeypot checks, backend validation, email HTML/text, Reply-To, Resend send, timeouts, idempotency, sanitized responses, and platform rate-limit configuration.
- `netlify/functions/package.json`: ESM scope for this function only; CRA's root module settings remain unchanged.
- `src/shared/catering.mjs`: shared categories and field validation used by browser and server. Checks field types/lengths, allowed selections/event types, required delivery address, email/header control characters, valid calendar dates, and integer guests. Restaurant date uses America/Detroit.
- `src/constants/catering.js`: reuses shared category lists; recipient is no longer a frontend constant.
- `src/container/Catering/inquiry.js`: same-origin JSON request/response adapter.
- `src/container/Catering/CateringForm.jsx`: replaces mailto/draft/copy flow with real submission states; preserves fields, honeypot, error associations, and appearance.
- `src/App.js`: catering description now describes online quote requests.
- `public/_redirects`: API rewrite appears before the existing SPA fallback; existing routes still resolve.
- `netlify.toml`: CRA build/publish directory, functions directory, esbuild bundler, Node 22.
- `.env.example` and `.gitignore`: placeholders and secret/local-state exclusions.
- `package.json`/lockfile: pinned Resend 6.32.1; adds `npm run test:functions`.
- Frontend/function tests and `qa/catering-email-qa.mjs`: failure/acceptance/security/duplicate regression checks and local browser check with a mocked SDK.

## Netlify configuration (required before live testing)

1. Revoke the API key pasted into chat and create a new restricted sending key in Resend. The pasted value was not saved in source, environment files, or logs.
2. In Resend, finish the required DNS records for takesushimichigan.com (or the exact sending subdomain you selected). Wait until that sender domain is verified. Use the exact records displayed in your Resend dashboard; this repository does not change DNS.
3. In the existing Netlify project, open **Project configuration > Environment variables**. Set these for the **Functions** scope and the desired deploy context:

   | Variable | Value |
   | --- | --- |
   | RESEND_API_KEY | Newly rotated Resend sending key |
   | CATERING_FROM_EMAIL | A bare sender address on the verified domain, e.g. catering@takesushimichigan.com |
   | CONTACT_EMAIL | Restaurant notification inbox; default catering@takesushimichigan.com |

   Do not prefix these with REACT_APP_. Do not put the key in netlify.toml or a tracked file. The FROM value must be a bare email address, not a display-name expression. The customer email is used only as Reply-To, never as From.
4. Keep the site's base directory at this repository root. netlify.toml specifies `npm run build`, `build`, and `netlify/functions`. Confirm the function runtime uses Node 22. Resend requires Node 20+.
5. After deployment is approved, deploy/redeploy so function code and environment changes take effect. Do not upload only build/ as a static artifact: that omits the server function.
6. Inspect the Netlify deploy post-processing log and confirm the rate-limit rule was detected and applied. The code requests five attempts per domain/IP in 120 seconds for both `/api/catering-inquiry` and `/.netlify/functions/catering-inquiry`. Netlify native rate limits are distributed and available across plans, but enforcement may take approximately 10 seconds to catch up. Local unit/browser tests do not verify Netlify's live enforcement.

## Exact deployed-form test procedure

1. Complete domain verification and Functions environment setup above, then obtain approval and deploy the code with the function.
2. Visit `https://takesushimichigan.com/catering` (or the approved deploy-preview URL with its own configured function variables). Open DevTools > Network.
3. Submit empty fields. Confirm inline errors and focus on the first field, with no API request.
4. Fill a clearly labeled TEST inquiry with a real email you control, phone, future event date, integer guests, allowed event type, and selection. Choose Delivery; submit without a location to check that required field. Then enter a test location. Wait at least two seconds after opening the form.
5. Click Request a catering quote once. Confirm the button/form disable while the POST is pending and no email application opens.
6. Inspect POST `/api/catering-inquiry`: successful acceptance is HTTP 200 JSON containing `accepted: true` and `emailId`. HTML from the SPA fallback or a response without acceptance must not show success.
7. Verify the accepted email ID in Resend's email activity. Check its status and then check the recipient inbox/spam folder. Inspect every field and verify Reply-To is your customer test email. Only inbox receipt or an actual Resend delivered event establishes delivery; the browser's submitted state alone does not.
8. Reply from the restaurant inbox and confirm the reply addresses the test customer. No automatic customer email should exist.
9. Test a failure using browser Network > Offline before clicking submit, then reconnect and retry. Fields must remain populated and the retry should work. For provider rejection, use a preview context with an unverified sender rather than changing production settings. Confirm the server returns an error, no success is shown, and details remain.
10. After an uncertain timeout, retry without editing/reloading. Inspect requests to confirm the same requestId; Resend should retain a single operation for that idempotency key.
11. To test backend validation without sending mail, replay the POST in DevTools with an invalid customer email or disallowed selection: expect HTTP 422. A populated `website` honeypot must be rejected. Requests from an unrelated Origin must be HTTP 403. Large bodies must be HTTP 413.
12. Verify the platform rate limit using invalid requests (not valid emails), and confirm a 429 after the threshold/enforcement delay. Wait for the window to expire before a real test.
13. Review desktop/mobile error and success states and verify existing navigation, menu/PDF, and Order Online links remain intact.

## Local checks

- `npm run test:functions`: server tests use a mocked SDK; no email is sent.
- `npm test -- --watchAll=false --runInBand`: frontend and existing restaurant regressions.
- `npm run build`: CRA production build.
- To exercise Netlify routing locally, use Netlify Dev with local untracked variables after installing its CLI. `npm start` alone does not run server functions. Do not use real provider credentials in mock QA.
- `qa/catering-email-qa.mjs` serves build/ and runs the real handler with a mocked Resend SDK, using a separately launched isolated Chrome debug instance on port 9333. Screenshots label mock acceptance explicitly.

## Security and limitations

No API secrets or customer details are logged. HTML values are escaped; text emails preserve user notes. Honeypot and minimum form age are supplementary checks, not trusted authentication. Native platform rate limiting is the primary distributed abuse limit, with origin, content-type, field/schema limits, and a 16KiB body cap as additional layers. This is not a CAPTCHA and cannot eliminate distributed bot traffic. The SDK request has a 15-second abort/timeout; the browser has a 25-second timeout.

Only the configured restaurant receives the message. Provider errors and missing/unverified configuration fail closed. Automatic delivery will remain unavailable until sender verification and Netlify environment configuration are complete.

No deployment, DNS change, Netlify environment change, or real email send was performed during implementation.

References: [Netlify Functions configuration](https://docs.netlify.com/build/functions/configuration/), [Netlify rate limits](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/), [Resend SDK](https://github.com/resend/resend-node), [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction), [Resend idempotency](https://resend.com/changelog/idempotency-keys).


## Recipient update

All notification recipients in this checkout use server-only CONTACT_EMAIL with catering@takesushimichigan.com as the default for absent/blank values. The retired CATERING_TO_EMAIL setting is ignored. Existing CATERING_FROM_EMAIL, RESEND_API_KEY, and valid customer Reply-To are unchanged. No DNS configuration is modified.

This repository contains only a catering inquiry handler. Its /contact route contains phone links and a map, not a contact form; no separate contact-email integration or jason.song address was found. Source verification covers the existing catering form, not an unidentified external contact form.

Set CONTACT_EMAIL=catering@takesushimichigan.com in the existing Netlify project's Functions scope (production and any relevant preview contexts). This setting is not placed in the frontend. The old recipient variable can remain unused; no sender or key change is required. Production deployment requires an authenticated Netlify account and the existing site identity.

Recipient override/default/invalid-value tests added. All 14 server tests and 21 frontend regressions pass. No real notification was sent during testing.


### Production publication: October 13, 2026

Deployed to the existing takesushimichigan.com Netlify site (chipper-rugelach-44600e), deployment 6acdb67be965e12a756a7c93. Set CONTACT_EMAIL=catering@takesushimichigan.com for all deploy contexts. This Netlify account does not allow Functions-only scope without an upgrade, so the recipient uses the plan-supported all-scope setting (builds/functions/runtime/post_processing). It remains a server-consumed variable and is not exposed by CRA. Sender and API key values were compared before/after and remained unchanged. The old CATERING_TO_EMAIL variable remains untouched but is ignored by the new source. DNS was not modified.

Production build and all 35 tests passed (14 server, 21 frontend). Live homepage, /contact, and /catering return HTTP 200. The live API returns HTTP 405 to GET and HTTP 422 with an email-field error for a deliberately invalid POST. The invalid POST never invokes email delivery. No real test email was sent and inbox delivery was not confirmed. The checkout has no separate contact inquiry form or handler; the recipient update covers its catering handler.

This was a direct CLI production deployment, not a Git push. Commit/push the source changes before the next Git-based deployment so that a subsequent build from master retains the new recipient logic.
