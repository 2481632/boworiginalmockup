"use strict";

const $ = (id) => document.getElementById(id);
const view = $("view");
const overlayRoot = $("ov");
const screens = {
  ...bowListScreens,
  ...onboarding,
  ...passes,
  ...profile,
  ...control,
  ...workshop,
};
// Die letzte Ansicht liegt oben im Stapel. „Zurück“ entfernt nur diesen Eintrag.
const stack = [];
const currentScreen = () => stack.at(-1);
let activeOverlay = null;

function draw(animation = "") {
  const { name, params } = currentScreen();
  const screen = screens[name](params);
  const scrollTop = animation ? 0 : (view.firstElementChild?.scrollTop ?? 0);
  view.innerHTML = /* HTML */ `
    <div class="scr ${screen.cls || ""} ${animation}">${screen.html}</div>
  `;
  view.firstElementChild.scrollTop = scrollTop;
}

function go(name, params = {}) {
  closeOverlay();
  stack.push({ name, params });
  draw("enter");
}

function replace(name, params = {}) {
  closeOverlay();
  stack[stack.length - 1] = { name, params };
  draw("enter");
}

function reset(name, params = {}) {
  closeOverlay();
  stack.splice(0, stack.length, { name, params });
  draw("enter");
}

function back() {
  closeOverlay();
  if (stack.length > 1) {
    stack.pop();
    clearErrors();
    draw("back");
  }
}

function openOverlay(name, params = {}, keepStill = false) {
  activeOverlay = { name, params };
  overlayRoot.innerHTML = /* HTML */ `
    <div class="${keepStill ? "still" : ""}" style="position:absolute;inset:0">
      ${overlays[name](params)}
    </div>
  `;
  const dialog = overlayRoot.querySelector("dialog");
  if (dialog) {
    dialog.showModal();
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeOverlay();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientY < bounds.top) closeOverlay();
    });
    return;
  }
  const firstInput = overlayRoot.querySelector("input:not([type=date])");
  if (firstInput && !keepStill && matchMedia("(pointer:fine)").matches) {
    setTimeout(() => firstInput.focus(), 320);
  }
}

function closeOverlay() {
  activeOverlay = null;
  overlayRoot.querySelector("dialog[open]")?.close();
  overlayRoot.innerHTML = "";
}

function redrawOverlay() {
  if (activeOverlay)
    openOverlay(activeOverlay.name, activeOverlay.params, true);
}

let toastTimer;
function toast(message, iconName = "check") {
  const notification = $("toast");
  notification.innerHTML = /* HTML */ `
    ${icon(iconName, 20, 2)}
    <span>${escapeHtml(message)}</span>
  `;
  notification.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => notification.classList.remove("show"), 2600);
}

const actions = {
  back,
  closeOverlay,
  ...onboardingActions,
  ...profileActions,
  ...passesActions,
  ...controlActions,
  ...workshopActions,
  ...bowListActions,
};

// Die Ansichten werden als HTML neu gerendert. data-act und data-submit verknüpfen sie mit den Funktionen in actions.
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-act]");
  if (!button) return;
  const action = actions[button.dataset.act];
  if (!Object.hasOwn(actions, button.dataset.act)) return;
  event.preventDefault();
  action(button.dataset.arg);
});

document.addEventListener("submit", (event) => {
  const action = actions[event.target.dataset.submit];
  if (!Object.hasOwn(actions, event.target.dataset.submit)) return;
  event.preventDefault();
  action(event.target);
});

document.addEventListener("input", (event) => {
  const input = event.target;
  const key = input.dataset.f;
  if (key) {
    form[key] = input.value;
    delete formErrors[key];
    input.closest(".field")?.classList.remove("err");
  }
  if (input.id === "bow-search") searchBows(input.value);
});

document.addEventListener("change", (event) => {
  const { id, value } = event.target;
  if (id === "demo-scan") state.scanResult = value;
  if (id === "demo-role") changeDemoRole(value);
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    activeOverlay &&
    !overlayRoot.querySelector("dialog[open]")
  )
    closeOverlay();
});

startAs("musiker");
