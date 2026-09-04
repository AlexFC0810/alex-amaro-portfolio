document.documentElement.classList.add("js");

const stageExperience = document.querySelector("[data-stage-experience]");

if (stageExperience) {
  const tabs = [...stageExperience.querySelectorAll("[role='tab']")];
  const panels = [...stageExperience.querySelectorAll("[role='tabpanel']")];

  const selectStage = (tab, moveFocus = false) => {
    const nextStage = tab.dataset.stage;

    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const selected = panel.dataset.stagePanel === nextStage;
      panel.hidden = !selected;
      panel.classList.toggle("is-active", selected);
    });

    if (moveFocus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectStage(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % tabs.length;
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (index - 1 + tabs.length) % tabs.length;

      selectStage(tabs[nextIndex], true);
    });
  });

  selectStage(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
}

const industryTarget = document.querySelector("[data-industry]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (industryTarget && !reducedMotion) {
  const industries = ["HVAC", "Dental", "Remodeling", "Med spa", "Plumbing", "Auto repair"];
  let industryIndex = 0;

  window.setInterval(() => {
    industryIndex = (industryIndex + 1) % industries.length;
    industryTarget.textContent = industries[industryIndex];
  }, 2200);
}

const copyButton = document.querySelector("[data-copy-phone]");
const copyStatus = document.querySelector("[data-copy-status]");
let copyStatusTimer;

const showCopyStatus = (message) => {
  if (!copyStatus) return;
  copyStatus.textContent = message;
  copyStatus.classList.add("is-visible");
  window.clearTimeout(copyStatusTimer);
  copyStatusTimer = window.setTimeout(() => copyStatus.classList.remove("is-visible"), 2400);
};

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const phone = copyButton.dataset.phone;

    try {
      await navigator.clipboard.writeText(phone);
      showCopyStatus("Phone number copied.");
    } catch {
      showCopyStatus("Copy unavailable. The number is +1 (888) 814-7785.");
    }
  });
}

const creativeDialog = document.querySelector("[data-creative-dialog]");
const dialogImage = creativeDialog?.querySelector("[data-dialog-image]");
const dialogCaption = creativeDialog?.querySelector("[data-dialog-caption]");
const dialogClose = creativeDialog?.querySelector("[data-dialog-close]");
let dialogTrigger = null;

if (creativeDialog && dialogImage && dialogCaption && dialogClose) {
  document.querySelectorAll("[data-full]").forEach((tile) => {
    tile.addEventListener("click", () => {
      const preview = tile.querySelector("img");
      dialogTrigger = tile;
      dialogImage.src = tile.dataset.full;
      dialogImage.alt = preview?.alt || "Selected creative artifact";
      dialogCaption.textContent = tile.dataset.caption || "";
      creativeDialog.showModal();
    });
  });

  dialogClose.addEventListener("click", () => creativeDialog.close());
  creativeDialog.addEventListener("click", (event) => {
    if (event.target === creativeDialog) creativeDialog.close();
  });
  creativeDialog.addEventListener("close", () => {
    dialogImage.removeAttribute("src");
    dialogTrigger?.focus();
  });
}

const cockpitDialog = document.querySelector("[data-cockpit-dialog]");
const cockpitOpen = document.querySelector("[data-cockpit-open]");
const cockpitClose = document.querySelector("[data-cockpit-close]");

if (cockpitDialog && cockpitOpen && cockpitClose) {
  cockpitOpen.addEventListener("click", () => {
    cockpitDialog.scrollTop = 0;
    cockpitDialog.showModal();
  });
  cockpitClose.addEventListener("click", () => cockpitDialog.close());
  cockpitDialog.addEventListener("click", (event) => {
    if (event.target === cockpitDialog) cockpitDialog.close();
  });
  cockpitDialog.addEventListener("close", () => cockpitOpen.focus());
}

const filterButtons = [...document.querySelectorAll("[data-proof-filter]")];
const proofItems = [...document.querySelectorAll("[data-proof-item]")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.proofFilter;

    filterButtons.forEach((candidate) => {
      const selected = candidate === button;
      candidate.classList.toggle("is-active", selected);
      candidate.setAttribute("aria-pressed", String(selected));
    });

    proofItems.forEach((item) => {
      const types = item.dataset.proofItem.split(" ");
      item.hidden = filter !== "all" && !types.includes(filter);
    });
  });
});
