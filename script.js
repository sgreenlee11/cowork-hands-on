"use strict";

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const prompt = document.getElementById(button.dataset.copy);
    const status = button.parentElement.querySelector(".copy-status");
    status.textContent = "";
    delete status.dataset.error;
    button.disabled = true;

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard is unavailable.");
      }
      await navigator.clipboard.writeText(prompt.textContent.trim());
      status.textContent = "Copied. Paste into Cowork.";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(prompt);
      selection.removeAllRanges();
      selection.addRange(range);
      status.dataset.error = "true";
      status.textContent = "Copy unavailable. Select the prompt and use your device's Copy command.";
    } finally {
      button.disabled = false;
    }
  });
});
