# cowork-hands-on

Copy-ready Microsoft 365 Copilot Cowork prompts for in-person attendees.
Intro has four options and a separate project follow-up. Advanced covers installing
the What I did with Cowork skill and finding, testing, and building a custom skill.

This is a static text-sharing resource, not a demo generator or Microsoft 365 integration.
There are no analytics, credentials, forms, uploads, work-data storage, external fonts,
or third-party scripts. Attendees replace bracketed placeholders privately in Cowork
and review sources and drafts before sending messages or making changes.
Available sources and capabilities depend on each attendee's setup and permissions.
Advanced includes a copy-ready Copilot Chat prompt that helps attendees choose a
task and produce a Cowork skill-building prompt. It does not execute either workflow.

## Advanced content sources

- [What I did with Cowork](https://github.com/microsoft/What-I-did-with-Cowork):
  installation steps and the directly linked `cowork-roi-report-skill-v49.zip`
  package (verified November 16, 2026). The upstream authors explicitly say this
  is not an official Microsoft Cowork skill. Time/value outputs are estimates.
- [Customize Copilot Cowork](https://learn.microsoft.com/en-us/copilot/cowork/cowork-customize):
  skill upload, guided creation, and testing in a new conversation.

The ZIP is downloaded from the upstream repository, not mirrored here. When
updating the link, use the installable skill ZIP from its README, not GitHub's
whole-repository archive. Confirm it downloads and contains a root `SKILL.md`.
Skill availability and installation remain subject to the attendee's environment
and organization policy; this website never installs a skill or reads work history.

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

## Icon attribution

`assets/copilot.webp` is the unmodified Microsoft Copilot icon displayed on
[Microsoft's Cowork adoption page](https://adoption.microsoft.com/en-us/copilot/cowork/ai-user/),
downloaded from [Microsoft's hosted asset](https://adoption.microsoft.com/wp-content/uploads/webp/2026/08/icon-microsoft-copilot.png.webp).
The page uses the shared Copilot mark, not a separately identified Cowork logo.
The icon is served locally, so visiting this site does not load it from Microsoft.
Microsoft retains rights to its trademarks; this attendee resource does not imply
Microsoft endorsement.

## Publishing

GitHub Pages publishes the repository root from `main` (Settings > Pages >
Deploy from a branch > `main` > `/ (root)`). Push reviewed changes to `main`;
GitHub's Pages deployment must finish before the live page updates.
`.nojekyll` keeps the site a plain static deployment.

- Repository: https://github.com/sgreenlee11/cowork-hands-on
- Website: https://sgreenlee11.github.io/cowork-hands-on/
