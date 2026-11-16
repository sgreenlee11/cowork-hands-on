# cowork-hands-on

Copy-ready Microsoft 365 Copilot Cowork prompts for in-person attendees.
Intro has four options and a separate project follow-up. Advanced is intentionally empty.

This is a static text-sharing resource, not a demo generator or Microsoft 365 integration.
There are no analytics, credentials, forms, uploads, work-data storage, external fonts,
or third-party scripts. Attendees replace bracketed placeholders privately in Cowork
and review sources and drafts before sending messages or making changes.
Available sources and capabilities depend on each attendee's setup and permissions.

## Editing

- `index.html`: visible prompts, session navigation, and instructions.
- `styles.css`: responsive layout and light/dark styling.
- `script.js`: clipboard copy with accessible feedback and a manual-selection fallback.

Keep all published text generic. Never add attendee inputs, work results, customer
identifiers, screenshots, credentials, or private reference material.
No framework, package installation, or build step is needed. Serve this directory
with a local static HTTP server to preview clipboard behavior; HTTPS or localhost
is needed for the Clipboard API. Without JavaScript, prompts remain selectable.
Run focused checks with `node --test tests\site.test.cjs` (Node.js only, no dependencies).

## Publishing

GitHub Pages publishes the repository root from `main` (Settings > Pages >
Deploy from a branch > `main` > `/ (root)`). Push reviewed changes to `main`;
GitHub's Pages deployment must finish before the live page updates.
`.nojekyll` keeps the site a plain static deployment.

- Repository: https://github.com/sgreenlee11/cowork-hands-on
- Website: https://sgreenlee11.github.io/cowork-hands-on/
