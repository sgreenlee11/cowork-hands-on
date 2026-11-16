const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const prompts = [...html.matchAll(/class="prompt" id="([^"]+)"[^>]*>([\s\S]*?)<\/div>/g)];
const copyButtons = [...html.matchAll(/<button\b([^>]*data-copy="([^"]+)"[^>]*)>/g)];
const targets = copyButtons.map((match) => match[2]);

test("intro retains four options and all session copy targets resolve uniquely", () => {
  const intro = html.split('<section id="intro"')[1].split("</section>")[0];
  assert.equal((intro.match(/<article class="card"/g) || []).length, 4);
  assert.equal((intro.match(/data-copy=/g) || []).length, 5);
  assert.equal(prompts.length, 7);
  assert.equal(new Set(targets).size, targets.length);
  assert.deepEqual(targets, prompts.map((prompt) => prompt[1]));
  assert.match(html, /Then, in the same conversation/);
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
