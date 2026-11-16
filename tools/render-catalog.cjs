const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const entries = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf8"));
const decks = {
  functions: "Task Pack for All Functions",
  sales: "Task Pack for Sales",
  marketing: "Task Pack for Marketing",
  nifty: "Nifty Fifty Scenarios",
};
const boundaries = "Use only sources I am permitted to access. Cite evidence, label assumptions, and report missing or unreadable inputs rather than inventing facts. Keep internal information and outputs private in my Microsoft 365 workspace, not on this website. Prepare review-ready drafts. Do not send, share, publish, schedule, move, rename, delete, or update existing files or records without my explicit approval for each action. Run once; do not save a skill or create recurring runs unless I separately ask.";
const escape = (text) => text.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);

const cards = entries.map((entry) => {
  const prompt = `${entry.prompt}\n\n${boundaries}`;
  const connection = entry.connection === "fabric" ? "Fabric IQ required" : "Microsoft 365 / files / web";
  const sources = entry.sources.map((source) => `${decks[source.deck]}, slide ${source.slide}`).join("; ");
  return `        <article class="card catalog-card" id="example-${entry.id}" data-function="${escape(entry.function)}" data-connection="${entry.connection}" data-level="${escape(entry.level)}">
          <div class="catalog-tags"><span>${escape(entry.function)}</span><span>${escape(entry.level)}</span><span${entry.connection === "fabric" ? ' class="fabric-tag"' : ""}>${connection}</span></div>
          <h4>${escape(entry.title)}</h4>
          <p class="card-description">${escape(entry.background)}</p>
          <dl class="catalog-context"><dt>Bring</dt><dd>${escape(entry.inputs)}</dd><dt>Get</dt><dd>${escape(entry.output)}</dd></dl>${entry.accessNote ? `\n          <p class="activity-note">${escape(entry.accessNote)}</p>` : ""}
          <details class="catalog-prompt">
            <summary>View prompt<span class="visually-hidden">: ${escape(entry.title)}</span></summary>
            <div class="prompt" id="prompt-${entry.id}" tabindex="0" role="region" aria-label="${escape(entry.title)} prompt">${escape(prompt)}</div>
            <div class="copy-row"><button type="button" data-copy="prompt-${entry.id}" aria-label="Copy prompt: ${escape(entry.title)}">Copy prompt <span aria-hidden="true">&#8599;</span></button><span class="copy-status" role="status" aria-live="polite" aria-atomic="true"></span></div>
            <p class="catalog-source">Adapted from ${escape(sources)}.</p>
          </details>
        </article>`;
}).join("\n");

const start = "      <!-- catalog:start -->";
const end = "      <!-- catalog:end -->";
const file = path.join(root, "index.html");
const html = fs.readFileSync(file, "utf8");
const from = html.indexOf(start);
const to = html.indexOf(end);
if (from === -1 || to <= from) throw new Error("Catalog insertion markers are missing or out of order.");
const updated = html.slice(0, from + start.length) + "\n" + cards + "\n" + html.slice(to);
if (process.argv.includes("--check")) {
  if (updated !== html) {
    console.error("Catalog HTML is stale. Run node tools\\render-catalog.cjs.");
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(file, updated);
  console.log(`Rendered ${entries.length} catalog entries.`);
}
