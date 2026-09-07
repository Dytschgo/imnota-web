// Progressive enhancement: all installation instructions are readable without JS.
const tabs = [...document.querySelectorAll(".install-tabs a")];
const panels = [...document.querySelectorAll(".install-panel")];
const tabList = document.querySelector(".install-tabs");
function selectTab(tab, focus = false) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.querySelector(item.hash).hidden = !selected;
  });
  if (focus) tab.focus();
}
if (tabList) {
  tabList.setAttribute("role", "tablist");
  tabList.parentElement.classList.add("tabs-enhanced");
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", tab.hash.slice(1));
    panels[index].setAttribute("role", "tabpanel");
    panels[index].tabIndex = 0;
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      selectTab(tab);
    });
    tab.addEventListener("keydown", (event) => {
      let target;
      if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        target = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = tabs.length - 1;
      if (target !== undefined) {
        event.preventDefault();
        selectTab(tabs[target], true);
      }
      if (event.key === " ") {
        event.preventDefault();
        selectTab(tab);
      }
    });
  });
  const activateHash = () => {
    const tab = tabs.find((item) => item.hash === location.hash);
    if (tab) selectTab(tab);
  };
  selectTab(tabs.find((tab) => tab.hash === location.hash) || tabs[0]);
  window.addEventListener("hashchange", activateHash);
  document.querySelectorAll("[data-install-target]").forEach((link) => {
    link.addEventListener("click", () =>
      selectTab(document.querySelector(`#tab-${link.dataset.installTarget}`)),
    );
  });
}
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.hidden = false;
  let reset;
  button.addEventListener("click", async () => {
    const code = document.getElementById(button.dataset.copy);
    const status = document.getElementById("copy-status");
    clearTimeout(reset);
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = "Copied!";
      button.classList.add("copied");
      status.textContent = "Commands copied to clipboard.";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      code.parentElement.focus();
      button.textContent = "Select & copy";
      status.textContent =
        "Clipboard access is unavailable. The command is selected. Press Ctrl+C or Command+C to copy.";
    }
    reset = setTimeout(() => {
      button.textContent = "Copy";
      button.classList.remove("copied");
    }, 3000);
  });
});
const menu = document.querySelector(".mobile-menu");
if (menu) {
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.open = false;
    }),
  );
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) menu.open = false;
  });
}
