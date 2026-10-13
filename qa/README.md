# UI QA: Tokyo After Dark

## Root causes and fixes

- Conflicting accumulated base/theme/mobile CSS obscured which spacing and sizing rules won. Consolidated duplicate base selectors and replaced layered media rules with a consistent responsive system.
- Hero minimum height combined a 730px floor with viewport height, leaving extra black space on tall/wide screens. Hero now uses content height, an in-flow photo/caption, and an in-flow bottom strip. Removed the photo's negative horizontal margins.
- Intro padding reached 130px on each side; other sections used unrelated 60?110px spacing. Shared section spacing now ranges from 48?72px, with common gutters, column gaps, and a 1200px content width.
- At 768px, the old 760px cutoff left narrow desktop grids and desktop navigation active. Navigation changes at 1000px; content grids stack at 800px. Grid tracks use minmax(0, 1fr) so long content can shrink and wrap.
- The JSX compiler retained the unrecognized `&nearr;` literal in Home's category and directions links. Replaced these with FiArrowUpRight SVG icons and added a regression check.
- CSS view-timeline reveal rules and opacity-zero entrance keyframes could dim/hide content while waiting on animation progress. Removed opacity gating and view-timeline reveals. Short transform-only entrances retain motion without affecting visibility. Existing reduced-motion override disables animation.
- Fixed photo heights and the menu PDF preview's cover crop clipped content. Hero/introduction/selection photos now use responsive aspect ratios; PDF preview uses intrinsic height/contain. Portrait positioning favors faces. Gallery retains deliberate horizontal scrolling inside its own container.

## Browser verification

Used installed Chrome in an isolated headless profile through the Chrome DevTools Protocol. No browser package or project dependency was added.

All four routes (`/`, `/about`, `/fullmenu`, `/contact`) were captured at 375, 768, 1440, and 1920px, with a 900px viewport height. All 16 combinations had:

- No unintended page/element horizontal overflow (gallery and category strip excluded as intentional scroll containers).
- No broken images or literal HTML entities in rendered main content.
- No application console errors or runtime exceptions.
- Opacity 1 for every rendered section.

Full-page captures are named `<page>-<width>.png`. Homepage hero/menu/gallery/visit viewport captures are also retained for readable inspection. Full-page menu captures are tall; `fullmenu-375-top.png` provides a readable menu viewport.

Additional live browser interaction checks passed:

- Mobile disclosure, Escape closing and focus restoration, mobile route selection.
- Desktop navigation through every existing route.
- Category filtering, case-insensitive Gyoza search, clearing/reset to all 47 entries.
- Menu PDF returns application/pdf.
- Gallery next/previous controls scroll to the expected snap positions.
- Fast scrolling and reload with IntersectionObserver explicitly unavailable keep all sections visible.
- Reduced motion keeps sections visible and removes animation.
- Keyboard Tab traversal and visible skip-link focus.
- Ordering links retain the exact EpiPay URL. External ordering/checkout was not exercised or changed.

`results.json` contains layout/visibility measurements. `interactions.json` contains behavior checks, rendered links, reduced-motion values, and keyboard traversal results.

## Build and tests

Production build compiled successfully. Eleven Jest/React Testing Library checks passed. Existing Node deprecation and outdated caniuse-lite notices remain toolchain notices, not application console errors.

No user screenshots were available for direct comparison. Existing restaurant data, prices, routes, logo artwork, and ordering provider were preserved. No deployment performed.

## Re-running

After `npm run build`, launch an isolated installed Chrome instance with remote debugging on port 9333. Run `node qa/browser-qa.mjs` for layout captures or `node qa/interactions.mjs` for behavioral checks. Each script serves build/ with a local SPA fallback on port 4173 and closes its own server/tab after success. Do not run both simultaneously.


## Hero transition and gallery refinement

The prior gallery split a panoramic image, heading row, and fixed-width scrolling thumbnails into separate compositions. The new gallery uses a shared 1200px container: a roughly 58% featured-photo column beside editorial text, followed by a four-column thumbnail grid on desktop and two-column grid on tablet/mobile. All photos use a consistent 4:3 ratio. Removed the oversized link underline, native scrolling strip, and separate full-width photo panel. Original photos and Instagram links remain available.

The hero's discovery area is now a semantic footer within the hero. A restrained 24px desktop / 16px mobile separation leads into a full-width #29231F brand band with larger labels and gold diamond accents. Labels wrap as intact units on mobile. The discovery link still targets #welcome.

Featured gallery navigation supports previous/next, direct thumbnail selection, Left/Right, Home, and End. Buttons disable at the first/last photo. Selected thumbnails expose aria-pressed; photo captions and counts announce changes. No autoplay or hidden content was introduced.

Chrome captures and checks at 375, 768, 1440, and 1920px passed with no unexpected overflow, broken images, literal entities, or console/runtime errors. Live gallery buttons, keyboard boundary behavior, existing navigation, menu filtering/search, PDF access, reduced motion, and visible keyboard focus passed. Production build succeeded; 13 regression tests passed.

Latest screenshots: gallery-transition-home-<width>.png and gallery-transition-<width>-hero.png / -welcome-strip.png / -gallery-section.png. Measurements: gallery-transition-results.json. Run node qa/gallery-transition-qa.mjs to reproduce the focused capture set. interactions.mjs now checks the featured-photo controls instead of the superseded scroll strip. No deployment performed.


## Decorative band removal

Removed the decorative category band markup and all welcome-strip/brand-band CSS, including its background, separators, and spacing. Hero now directly precedes #welcome (The Experience). The Experience top padding is 28?40px instead of the general 48?72px section spacing. The existing hero footer and #welcome discovery anchor are preserved. No replacement banner was added.

Production build and all 13 regression tests passed. Chrome checks at 375, 768, 1440, and 1920px found no overflow, broken images, entities, or console errors. New captures include gallery-transition-<width>-intro.png and refreshed homepage images. Earlier band captures are historical; this note supersedes the previous brand-band implementation. No deployment occurred.


## Catering extension

Added /catering and a single homepage promotion after The Experience, preserving existing design and functionality. Build and 19 tests passed. Homepage and Catering Chrome checks at all four widths passed with no overflow, broken images, entities, or application console/runtime errors. Live form checks passed. See CATERING.md for the temporary call/email-draft workflow and the exact TODO recipient setting. No email was sent and no deployment occurred. Run qa/catering-qa.mjs and qa/catering-form-qa.mjs with an isolated debug Chrome on port 9333 to repeat the checks.


## Automatic catering delivery implementation

The mailto workflow has been replaced with same-origin POST to a Netlify function using server-only Resend. The shared .mjs validation module is deliberately compatible with both CRA and Node. Production build succeeds; 21 frontend/regression tests and 12 server/SDK tests pass. Browser QA at 375/768/1440/1920px exercised the real function with a mocked SDK: initial rejection preserves fields, retry uses the same idempotency key, explicit acceptance disables repeat submission, no mailto flow remains, and layouts have no overflow. Provider and SDK transport tests are mocks; no real email was sent.

Screenshots: catering-email-375-error.png, catering-email-375-accepted-mock.png, catering-email-768.png, catering-email-1440.png, catering-email-1920.png. Results: catering-email-results.json. Run node qa/catering-email-qa.mjs with isolated Chrome on port 9333 to repeat. The browser bundle was checked to exclude Resend API/environment references. The built API redirect precedes the SPA fallback. Netlify deployment/rate-limit processing and real mailbox delivery remain unverified until an approved deploy after DNS verification.

See CATERING.md for changed files, Netlify Functions environment setup, rotated-key instructions, and the exact deployed-form test procedure. This supersedes earlier draft-only catering instructions. No deployment or real send was performed.
