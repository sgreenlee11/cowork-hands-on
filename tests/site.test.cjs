const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf8"));
const prompts = [...html.matchAll(/class="prompt" id="([^"]+)"[^>]*>([\s\S]*?)<\/div>/g)];
const copyButtons = [...html.matchAll(/<button\b([^>]*data-copy="([^"]+)"[^>]*)>/g)];
const targets = copyButtons.map((match) => match[2]);

test("intro retains four options and all session copy targets resolve uniquely", () => {
  const intro = html.split('<section id="intro"')[1].split("</section>")[0];
  assert.equal((intro.match(/<article class="card"/g) || []).length, 4);
  assert.equal((intro.match(/data-copy=/g) || []).length, 5);
  assert.equal(prompts.length, catalog.length + 7);
  assert.equal(new Set(targets).size, targets.length);
  assert.deepEqual(targets, prompts.map((prompt) => prompt[1]));
  assert.match(html, /Then, in the same conversation/);
});

test("catalog is complete against the reviewed eligible source slides", () => {
  const expectedSlides = {
    functions: [6, 7, 11, 12, 13, 17, 18, 19, 20, 21, 22],
    sales: [9, 10, 15, 16, 17, 18, 20, 21, 24],
    marketing: [6, 7, 11, 12, 16, 17, 18, 19, 20, 21, 22],
    nifty: [10, 22, 23, 24, 33, 34, 35, 37, 38, 39],
  };
  assert.equal(catalog.length, 40);
  assert.equal(new Set(catalog.map((entry) => entry.id)).size, catalog.length);
  for (const [deck, slides] of Object.entries(expectedSlides)) {
    const actual = catalog.flatMap((entry) => entry.sources
      .filter((source) => source.deck === deck).map((source) => source.slide));
    assert.deepEqual(actual.sort((a, b) => a - b), slides);
  }
  for (const entry of catalog) {
    assert.match(entry.id, /^[a-z0-9-]+$/);
    for (const field of ["title", "background", "inputs", "output", "prompt"]) {
      assert.equal(typeof entry[field], "string");
      assert.ok(entry[field].trim().length > 0, `${entry.id}: missing ${field}`);
    }
    assert.ok(["native", "fabric"].includes(entry.connection));
    assert.ok(["Everyone", "Finance", "Leadership", "Marketing", "Sales", "Service"].includes(entry.function));
    assert.ok(["Quick start", "Multi-step", "Deep dive"].includes(entry.level));
    assert.doesNotMatch(entry.prompt, /\b(?:Dynamics|D365|HubSpot|Salesforce|monday\.com|Miro|Prezi|Box|Templafy|MaestroLabs|Harvey|Legora|HighQ)\b/i);
    if (entry.connection === "fabric") assert.match(entry.prompt, /Fabric IQ/);
    assert.ok(targets.includes(`prompt-${entry.id}`));
  }
});

test("generated catalog HTML is current and provides a no-JavaScript reading path", () => {
  const { spawnSync } = require("node:child_process");
  const result = spawnSync(process.execPath, [path.join(root, "tools", "render-catalog.cjs"), "--check"]);
  assert.equal(result.status, 0, result.stderr.toString());
  for (const entry of catalog) {
    const region = prompts.find(([, id]) => id === `prompt-${entry.id}`);
    assert.ok(region, entry.id);
    assert.match(region[2], /explicit approval for each action/);
    assert.match(region[2], /report missing or unreadable inputs/);
    assert.match(region[2], /Keep internal information and outputs private/);
  }
  assert.match(html, /<noscript>/);
  assert.equal((html.match(/class="card catalog-card"/g) || []).length, catalog.length);
});

test("catalog filters combine search, role, connection and depth, with empty and reset states", () => {
  const elements = new Map();
  for (const id of ["catalog-controls", "catalog-search", "catalog-function", "catalog-connection",
    "catalog-level", "catalog-count", "catalog-empty", "catalog-reset"]) {
    elements.set(id, {
      value: "", hidden: true, textContent: "", handlers: {},
      addEventListener(type, handler) { this.handlers[type] = handler; },
      focus() { this.focused = true; },
    });
  }
  const cards = catalog.map((entry) => ({
    dataset: { function: entry.function, connection: entry.connection, level: entry.level },
    textContent: `${entry.title} ${entry.background} ${entry.inputs} ${entry.output} ${entry.prompt}`,
    hidden: false,
  }));
  vm.runInNewContext(fs.readFileSync(path.join(root, "catalog.js"), "utf8"), {
    document: {
      getElementById: (id) => elements.get(id),
      querySelectorAll: () => cards,
    },
  });
  const get = (id) => elements.get(`catalog-${id}`);
  assert.equal(get("controls").hidden, false);
  assert.equal(get("count").textContent, "40 of 40 examples");
  get("function").value = "Marketing";
  get("connection").value = "fabric";
  get("level").value = "Deep dive";
  get("search").value = "  LAUNCH   ";
  get("search").handlers.input();
  const expected = catalog.filter((entry) => entry.function === "Marketing"
    && entry.connection === "fabric" && entry.level === "Deep dive"
    && `${entry.title} ${entry.background} ${entry.inputs} ${entry.output} ${entry.prompt}`.toLowerCase().includes("launch"));
  assert.ok(expected.length > 0 && expected.length < catalog.length);
  assert.equal(cards.filter((card) => !card.hidden).length, expected.length);
  assert.equal(get("count").textContent, `${expected.length} of 40 examples`);
  get("search").value = "no-example-matches-this";
  get("search").handlers.input();
  assert.equal(get("empty").hidden, false);
  assert.equal(cards.every((card) => card.hidden), true);
  get("reset").handlers.click();
  assert.equal(cards.every((card) => !card.hidden), true);
  assert.equal(get("empty").hidden, true);
  assert.equal(get("search").focused, true);
  assert.equal(get("count").textContent, "40 of 40 examples");
  get("search").value = "cUsToMeR  onboarding";
  get("search").handlers.input();
  const visible = cards.filter((card) => !card.hidden);
  assert.ok(visible.length > 0);
  assert.ok(visible.every((card) => /customer/i.test(card.textContent) && /onboarding/i.test(card.textContent)));
});

test("advanced links to an installable skill ZIP and separates Cowork and Chat prompts", () => {
  const advanced = html.split('<section id="advanced"')[1].split("</section>")[0];
  const download = advanced.match(/class="download-link" href="([^"]+)"/)[1];
  const url = new URL(download);
  assert.equal(url.hostname, "raw.githubusercontent.com");
  assert.match(url.pathname, /^\/microsoft\/What-I-did-with-Cowork\/main\/[^/]+\.zip$/);
  assert.match(advanced, /id="prompt-impact"/);
  assert.match(advanced, /id="prompt-skill-builder"/);
  assert.match(advanced, /Copy into Microsoft 365 Copilot Chat/);
  for (const [, href] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(html.includes(`id="${href}"`), `Missing anchor target: ${href}`);
  }
});

for (const mode of ["success", "denied", "unavailable"]) {
  test(`all copy buttons: ${mode}`, async () => {
    const writes = [];
    const selections = [];
    const elements = new Map(prompts.map(([, id, textContent]) => [id, { textContent }]));
    const buttons = copyButtons.map(([, attributes, id]) => {
      const status = { textContent: "", dataset: {} };
      return {
        dataset: { copy: id, destination: attributes.match(/data-destination="([^"]+)"/)?.[1] },
        parentElement: { querySelector: () => status },
        status,
        addEventListener(_type, handler) { this.handler = handler; },
      };
    });
    vm.runInNewContext(script, {
      navigator: mode === "unavailable" ? {} : {
        clipboard: {
          async writeText(text) {
            if (mode === "denied") throw new Error("Permission denied");
            writes.push(text);
          },
        },
      },
      document: {
        querySelectorAll: () => buttons,
        getElementById: (id) => elements.get(id),
        createRange: () => ({ selectNodeContents: (element) => selections.push(element) }),
      },
      window: { getSelection: () => ({ removeAllRanges() {}, addRange() {} }) },
    });
    for (const button of buttons) {
      await button.handler();
      assert.equal(button.disabled, false);
      if (mode === "success") {
        assert.equal(writes.at(-1), elements.get(button.dataset.copy).textContent.trim());
        assert.equal(button.status.textContent, button.dataset.copy === "prompt-skill-builder"
          ? "Copied. Paste into Copilot Chat."
          : "Copied. Paste into Cowork.");
      } else {
        assert.equal(button.status.dataset.error, "true");
        assert.match(button.status.textContent, /Copy unavailable/);
        assert.equal(selections.at(-1), elements.get(button.dataset.copy));
      }
    }
  });
}

test("theme respects valid overrides and system preference", () => {
  const themeScript = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [search, dark, expected] of [
    ["?scoutTheme=light", true, "light"],
    ["?scoutTheme=dark", false, "dark"],
    ["?scoutTheme=invalid", false, "light"],
    ["", true, "dark"],
    ["", false, "light"],
  ]) {
    let actual;
    vm.runInNewContext(themeScript, {
      URLSearchParams,
      window: { location: { search }, matchMedia: () => ({ matches: dark }) },
      document: { documentElement: { setAttribute: (_name, value) => { actual = value; } } },
    });
    assert.equal(actual, expected);
  }
});
