"use strict";

(() => {
  const controls = document.getElementById("catalog-controls");
  if (!controls) return;

  const search = document.getElementById("catalog-search");
  const role = document.getElementById("catalog-function");
  const connection = document.getElementById("catalog-connection");
  const level = document.getElementById("catalog-level");
  const count = document.getElementById("catalog-count");
  const empty = document.getElementById("catalog-empty");
  const cards = Array.from(document.querySelectorAll(".catalog-card"), (element) => ({
    element,
    text: element.textContent.toLowerCase(),
  }));

  function filter() {
    const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const { element, text } of cards) {
      const matches = (!role.value || element.dataset.function === role.value)
        && (!connection.value || element.dataset.connection === connection.value)
        && (!level.value || element.dataset.level === level.value)
        && terms.every((term) => text.includes(term));
      element.hidden = !matches;
      if (matches) visible++;
    }
    count.textContent = `${visible} of ${cards.length} examples`;
    empty.hidden = visible !== 0;
  }

  search.addEventListener("input", filter);
  for (const select of [role, connection, level]) select.addEventListener("change", filter);
  document.getElementById("catalog-reset").addEventListener("click", () => {
    for (const field of [search, role, connection, level]) field.value = "";
    filter();
    search.focus();
  });
  filter();
  controls.hidden = false;
})();
