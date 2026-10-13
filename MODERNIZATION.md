# Take Sushi modernization

## Existing architecture and inventory

React 18 / Create React App 5, React Router 6, React Icons, plain component CSS. No backend, cart, account system, reservation form, or checkout implementation exists in this repository. The original Newsletter and FooterOverlay components are unused placeholders.

- `/`: hero ordering link; founders introduction linking to About; horizontally scrolling Instagram-linked gallery with arrows; featured dishes and full-menu link.
- `/about`: restaurant history, Chef Song and Manager Yong portraits and culinary background.
- `/fullMenu` (also case-insensitive `/fullmenu`): 47 menu records, five categories plus All, dish-name search within the selected category, subcategory groups, original prices/descriptions, raw-food advisory, and sushi/sashimi PDF.
- `/contact`: Google Maps embed, street address, both phone numbers, opening hours.
- Shared navigation and footer: route links, EpiPay ordering, Facebook and Instagram, location and hours.
- Existing public SPA fallback in `public/_redirects` retained. Existing icons, manifest, robots file, and PDF retained.

## Design problems and plan

The previous menu stylesheet applied body and heading styles across every route. Fixed menu widths, very large category headings, decorative imagery, and inconsistent spacing made the site difficult to browse on mobile. Ordering disappeared from mobile navigation. Several controls were clickable SVGs; links were nested inside buttons. Images and map lacked useful accessible names.

Design system: warm ivory #F8F6F2, charcoal #1C1C1C, Japanese red #A52A2A, muted gold #B89B72. Cormorant Garamond headings and DM Sans body with local fallback fonts. Restrained square buttons, fine rules, generous spacing, and existing restaurant photographs.

Implementation sequence completed:
1. Audit route definitions, components, CSS, data, assets, external URLs, and public files.
2. Consolidate active shared styling and responsive rules; rebuild sticky navigation with persistent ordering access and keyboard-operable mobile disclosure.
3. Update Header, Chef introduction, SpecialMenu preview, Gallery, and Home composition with image-led hero, menu CTA, ordering section, and visit information.
4. Update FullMenu, Categories, SearchBar, and Menu while retaining original menu records and filter/search behavior.
5. Update AboutUs, FindUs, and Footer, share opening hours, and add phone/directions links.
6. Add semantic landmarks, focus indicators, skip link, reduced-motion support, lazy-loaded non-hero photos/map, aspect ratios, smaller team portraits, route titles, descriptive metadata, and React 18 createRoot.
7. Run regression tests and production build; record verification limitations.

No dependencies were added. Original photographs are retained; chef-web.jpg and manager-web.jpg are smaller derivatives used by the site. Legacy component CSS files remain in the repository but redesigned components no longer import those conflicting styles.

## Preservation and risks

Menu record contents are unchanged. Duplicate source IDs are handled using ID plus title for React keys. The source filename `fakemenudata.js` and historical TODO warrant review before any future menu corrections; no replacements were assumed. The separate lunch.js file is unused and remains unchanged.

The exact EpiPay store/table URL, Facebook and Instagram URLs, and Google map embed are retained. EpiPay was readable during verification and identifies TAKE SUSHI. Its ordering schedule closes at 8:00 PM whereas this repository lists restaurant hours until 8:30 PM; its Alaskan soup price also differs. Restaurant and ordering schedules may differ. This redesign does not silently synchronize either source.

## Validation

- Eight React Testing Library / Jest regression checks pass: four original routes plus menu URL casing, ordering URLs, all 47 menu names/descriptions/prices, PDF link, category filtering, case-insensitive search, no-result handling, search clearing, mobile navigation Escape/selection behavior, phone links, and map/hour presence.
- Production build run with the existing CRA toolchain.
- `git diff --check` checked for whitespace errors.
- No browser-control capability is available in this environment. Desktop/mobile visual inspection, actual browser console checks, full keyboard traversal, and third-party cart/modifier/checkout interactions are not verified. No orders were placed.
- Legacy toolchain reports an outdated caniuse-lite database and a Node fs.F_OK deprecation. Dependency upgrades are outside this visual redesign.

## Local review

Run `npm start` from this checkout, then review `/`, `/about`, `/fullmenu`, and `/contact` at 320, 390, 768, 1024, and 1440 pixels. Check gallery arrows, keyboard focus, mobile disclosure, menu search/category combinations, and PDF. Follow the ordering link to review the provider without placing an order.

No deployment or production infrastructure changes were performed.


## Tokyo After Dark revision

Updated the visual system to #101010 / #1B1B1B / #242424 surfaces, #F5F1E9 primary text, #AAA49B secondary text, #B92B2B red buttons, and #C6A675 restrained gold. The homepage uses the requested editorial headline, a separate asymmetrical photo composition, signature menu preview with restaurant photography, direct category links, a cinematic visual section, and full visit information. Shared pages and navigation use the same dark system. Entrance and hover animations respect reduced-motion settings; scroll reveals retain their CSS-based implementation.

The supplied TAKE_SUSHI_LOGO.png is now used by the shared Brand component in the header and footer. Square responsive dimensions preserve the complete artwork without cropping or stretching.

Regression coverage now also checks direct category links and invalid category URL fallback. Browser visual inspection and interactive checkout verification remain unavailable. No deployment was performed.


## Logo cleanup and browser icons

The built-in image generation editor removed the pale contour lines and perimeter border. TAKE_SUSHI_LOGO-clean.png is used for shared site branding; the original TAKE_SUSHI_LOGO.png remains unchanged. Matching 32, 192, and 512 pixel PNGs in public/ provide the browser tab icon, Apple touch icon, and application manifest icons. The manifest now uses the restaurant name rather than Create React App defaults.

Edit prompt: Remove only the thin pale outlines tracing the bamboo and letters and the perimeter border; preserve bamboo shapes, TAKE SUSHI SINCE 1995 text, teal/red colors, glow, and background. A second targeted edit removed remaining bright outlines on the red lettering. Built-in imagegen mode was used. These are generated edits rather than pixel-exact copies of the original artwork.


## Logo correction

The requested line was the outer square perimeter border, not the logo's internal contour strokes. Branding now uses TAKE_SUSHI_LOGO-transparent.png, extracted from the original supplied logo with its bamboo, lettering, and internal outlines retained. The rectangular background and outer square border were removed; alpha transparency was verified. Matching public browser/application icons were updated. The header again includes Take Sushi and JAPANESE RESTAURANT / SINCE 1995 beside the logo.

Built-in imagegen extraction prompt: Remove only the blurred rectangular background and thin outer square border; retain original bamboo, internal pale outlines, exact TAKE SUSHI SINCE 1995 text, colors, composition, and glow. This supersedes the previous cleanup. Original source remains unchanged.


## Comprehensive UI quality pass

Consolidated CSS, standardized spacing/gutters/content width, removed viewport-driven hero height and negative photo margins, corrected tablet breakpoints and minimum grid sizing, replaced literal arrow entities with React Icons, improved photo/PDF aspect ratios, and removed animation opacity gating. The existing dark identity and restaurant/menu/integration data remain intact.

Installed Chrome was available for this pass. All four pages were captured and visually reviewed at 375/768/1440/1920px. All 16 combinations passed overflow, image, entity, visibility, and application console/runtime checks. Live navigation, menu/search, PDF, gallery, keyboard, observer-failure and reduced-motion checks passed. Production build and 11 regression tests passed. Details and screenshot artifacts are in qa/README.md, qa/results.json, and qa/interactions.json. This supersedes earlier browser-verification limitations. External checkout was not exercised; no deployment occurred.
