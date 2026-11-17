# cowork-hands-on

Copy-ready Microsoft 365 Copilot Cowork prompts for in-person attendees.
Intro recommends one simple, file-grounded leadership update. A collapsed optional
path offers generic two-report comparison and the four existing options, with a
project follow-up and an elective RAID/dependency extension. Advanced covers installing
the What I did with Cowork skill, finding/testing/building a custom skill, and a
filterable catalog of 40 examples adapted from the four supplied scenario decks.
Separate collapsed electives cover scheduling a reviewed task, an independently
gated email/Teams trigger, and period-close reconciliation with variance commentary.
The finance elective does not prepare filings or offer professional assurance.

This is a static text-sharing resource, not a demo generator or Microsoft 365 integration.
There are no analytics, credentials, forms, uploads, work-data storage, external fonts,
or third-party scripts. Attendees replace bracketed placeholders privately in Cowork
and review sources and drafts before sending messages or making changes.
Available sources and capabilities depend on each attendee's setup and permissions.
Browser use must remain OFF in every attendee workflow, including generated skills.
Public-research examples require approved supplied extracts/exports, not website
collection. A URL alone is not source content. Missing inputs or capabilities are
reported rather than bypassed. Fabric IQ examples do not establish Power BI, Jira,
or other connector access.
Advanced includes a copy-ready Copilot Chat prompt that helps attendees choose a
task and produce a Cowork skill-building prompt. It does not execute either workflow.

Every hands-on option uses the shared completion check: verify two source-backed
facts, identify one correction (or document none needed), and compare total effort
with the normal process. Recalled baselines and savings remain estimates, not
measured results. No survey percentages or private email/workbook content are
published.

## Optional automation follow-through

The catalog remains run-once. Automation is a separate, explicit opt-in after a
successful reviewed task and pilot-owner confirmation of capability and approval.
Participants review exact instructions, sources/refresh, timing/time zone, private
destination, and permissions before separately approving creation or activation.
They inspect an actual run, perform the completion check, then pause/delete the
exercise schedule or trigger and verify cleanup. An untested definition is not a
completed exercise; missing capability/approval means a written plan only.
This website creates no schedules, triggers, or external automation.

Instructions follow [Schedule prompts](https://learn.microsoft.com/copilot/cowork/use-cowork#schedule-prompts)
and [Set up event-driven tasks](https://learn.microsoft.com/copilot/cowork/use-cowork#set-up-event-driven-tasks),
reviewed November 17, 2026. Documentation is not evidence that the pilot has access.
The documented Automations Runs/Manage schedules views and trigger review card
may differ from a participant's interface. Never use a workaround for missing access.

## Advanced content sources

- [What I did with Cowork](https://github.com/microsoft/What-I-did-with-Cowork):
  installation steps and the directly linked `cowork-roi-report-skill-v49.zip`
  package (verified November 16, 2026). The upstream authors explicitly say this
  is not an official Microsoft Cowork skill. Time/value outputs are estimates.
- [Customize Copilot Cowork](https://learn.microsoft.com/en-us/copilot/cowork/cowork-customize):
  skill upload, guided creation, and testing in a new conversation.
- Public task packs, linked beside the Advanced catalog:
  [General](https://aka.ms/copilot-cowork-taskpack-general),
  [Marketing](https://aka.ms/copilot-cowork-taskpack-marketing), and
  [Sales](https://aka.ms/copilot-cowork-taskpack-sales).
  These link to the public resources, not locally hosted copies. Attendees should
  check each task's connector and access requirements.

The ZIP is downloaded from the upstream repository, not mirrored here. When
updating the link, use the installable skill ZIP from its README, not GitHub's
whole-repository archive. Confirm it downloads and contains a root `SKILL.md`.
Skill availability and installation remain subject to the attendee's environment
and organization policy; this website never installs a skill or reads work history.

## Editing

- `index.html`: visible prompts, session navigation, and instructions.
- `styles.css`: responsive layout and light/dark styling.
- `script.js`: clipboard copy with accessible feedback and a manual-selection fallback.
- `catalog.json`: catalog backgrounds, inputs, outputs, adapted prompts, and source slide references.
- `catalog.js`: local-only search and filters; it does not transmit or persist search terms.
- `tools/render-catalog.cjs`: regenerates the catalog's static HTML from `catalog.json`.

Keep all published text generic. Never add attendee inputs, work results, customer
identifiers, screenshots, credentials, or private reference material.
No framework, package installation, or build step is needed. Serve this directory
with a local static HTTP server to preview clipboard behavior; HTTPS or localhost
is needed for the Clipboard API. Without JavaScript, prompts remain selectable.
Run focused checks with `node --test tests\site.test.cjs` (Node.js only, no dependencies).

## Catalog selection and maintenance

The catalog reviews the detailed, runnable scenarios in:

- Copilot Cowork Nifty Fifty Scenarios: 10 selected detailed slides.
- Copilot Cowork Task Pack for All Functions: 11 selected tasks.
- Cowork Task Pack for Sales: 9 selected tasks.
- Cowork Task Pack for Marketing: 11 selected tasks.

The overlapping messaging-drift audits are combined into one entry with both source
references, giving 40 entries from 41 eligible source examples. Overview-only ideas,
testimonials, and internal presenter guidance are not catalog entries. Deck files,
speaker notes, screenshots, customer names, and private reference files are not published.

Selection retains Microsoft 365, uploaded-file, public-research, and Fabric IQ
scenarios, but the shared renderer adapts every copied prompt to the browser-OFF
pilot: public research uses approved supplied extracts/exports only.
Dynamics-dependent examples and dependencies on other partner connectors are
excluded. Explicit file-based alternatives to optional CRM connections are
retained and labeled; they never connect to or write back to a live CRM. Microsoft's
Capital Markets role skill is not an external market-data connector. No supplied
prompt explicitly requires Jira/Rovo; no Jira example was invented.

Copilot-in-Word/Excel-only examples and specialized legal/DMS dependencies are
excluded. The catalog is for trying Cowork tasks, not claiming feature availability
in every tenant. Fabric examples identify their requirement, and all prompts ask
for source evidence, gaps, one-run trials, private outputs, and separate approval
before consequential actions. Automatic sends/schedules in source prompts are
adapted to drafts and proposed schedules. Financial projections remain assumptions,
not promised or measured savings.

Edit `catalog.json`, then run `node tools\render-catalog.cjs`. Commit both the data
and regenerated `index.html`. Check synchronization with
`node tools\render-catalog.cjs --check`; tests also enforce it. Update the reviewed
source coverage test if intentionally changing the selection. The generated HTML
is committed, so GitHub Pages needs no build or runtime dependencies. Without
JavaScript, all catalog entries and expandable prompts remain readable and
selectable; JavaScript adds filters and Copy buttons.

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
