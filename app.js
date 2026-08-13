/* Gaia interaction helpers. All page content lives in editable HTML files. */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const settings = JSON.parse(localStorage.getItem("gaia-settings") || "{}");

function saveSettings() {
  localStorage.setItem("gaia-settings", JSON.stringify(settings));
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function applySettings() {
  document.body.classList.toggle("simplified", Boolean(settings.simple));
  document.body.classList.toggle("dark", Boolean(settings.dark));
  const motion = $("#motion-toggle");
  const theme = $("#theme-toggle");
  const language = $("#language-select");
  if (motion) {
    motion.textContent = `Simplify: ${settings.simple ? "On" : "Off"}`;
    motion.setAttribute("aria-pressed", String(Boolean(settings.simple)));
  }
  if (theme) {
    theme.textContent = `Low-light: ${settings.dark ? "On" : "Off"}`;
    theme.setAttribute("aria-pressed", String(Boolean(settings.dark)));
  }
  if (language) language.value = settings.language || "en";
}

function setupPreferences() {
  $("#motion-toggle")?.addEventListener("click", () => {
    settings.simple = !settings.simple;
    saveSettings();
    applySettings();
  });
  $("#theme-toggle")?.addEventListener("click", () => {
    settings.dark = !settings.dark;
    saveSettings();
    applySettings();
  });
  $("#language-select")?.addEventListener("change", (event) => {
    settings.language = event.target.value;
    saveSettings();
    showToast("Language preference saved.");
  });
}

function setupNavigation() {
  const button = $(".menu-button");
  const navigation = $("#mobile-nav");
  button?.addEventListener("click", () => {
    navigation.hidden = !navigation.hidden;
    button.setAttribute("aria-expanded", String(!navigation.hidden));
  });
}

function setupWizards() {
  const wizard = $("[data-wizard]");
  if (!wizard) return;
  const steps = $$(".wizard-step", wizard);
  let current = 0;

  function showStep(index) {
    current = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, number) => {
      step.hidden = number !== current;
      step.setAttribute("aria-hidden", String(number !== current));
    });
    const meter = $(".progress span", wizard);
    const label = $(".progress-label strong", wizard);
    if (meter) meter.style.width = `${((current + 1) / steps.length) * 100}%`;
    if (label) label.textContent = `Step ${current + 1} of ${steps.length}`;
    window.scrollTo({ top: 0, behavior: settings.simple ? "auto" : "smooth" });
    $("h1", steps[current])?.focus({ preventScroll: true });
  }

  wizard.addEventListener("click", (event) => {
    const next = event.target.closest("[data-next-step]");
    const back = event.target.closest("[data-previous-step]");
    if (next) {
      const step = steps[current];
      if (!validateFields(step)) return;
      showStep(current + 1);
    }
    if (back) showStep(current - 1);
  });
  showStep(0);
}

function validateFields(container) {
  let valid = true;
  $$('[required]', container).forEach((field) => {
    const empty = field.type === "checkbox" ? !field.checked : !field.value.trim();
    const error = field.closest(".field")?.querySelector(".field-error");
    if (empty) {
      field.setAttribute("aria-invalid", "true");
      if (error) error.textContent = "Please complete this field before continuing.";
      valid = false;
    } else {
      field.removeAttribute("aria-invalid");
      if (error) error.textContent = "";
    }
  });
  if (!valid) $("[aria-invalid='true']", container)?.focus();
  return valid;
}

function setupForms() {
  $$('form[data-validate]').forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!validateFields(form)) event.preventDefault();
    });
  });
  $$('[data-toast]').forEach((button) =>
    button.addEventListener("click", () => showToast(button.dataset.toast)),
  );
  const signIn = $("[data-role-signin]");
  signIn?.addEventListener("submit", (event) => {
    if (!validateFields(signIn)) return;
    event.preventDefault();
    const destinations = {
      "Parent / Guardian": "parent-dashboard.html",
      "Educator / Tutor": "educator-dashboard.html",
      Student: "student-dashboard.html",
      Admin: "admin-dashboard.html",
    };
    window.location.href = destinations[$("#role").value];
  });
}

function setupChoices() {
  $$(".slot").forEach((slot) => {
    slot.addEventListener("click", () => {
      $$(".slot").forEach((item) => item.classList.remove("selected"));
      slot.classList.add("selected");
    });
  });
  $$('[data-call-control]').forEach((button) => {
    button.addEventListener("click", () => {
      const pressed = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!pressed));
      const alternate = button.dataset.alternate;
      button.dataset.alternate = button.textContent;
      button.textContent = alternate;
    });
  });
}

applySettings();
setupPreferences();
setupNavigation();
setupWizards();
setupForms();
setupChoices();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
}
