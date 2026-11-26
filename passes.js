"use strict";

const passes = {
  pass: ({ id, mode }) => {
    const bow = state.bows[id];
    return {
      html: /* HTML */ `
        ${nav(["back", "chevL"], ["menu", "dots", "Mehr"])}
        <div class="content has-nav">
          <div class="center">
            <div class="eyebrow">Bogenpass</div>
            <h1 class="ti">${escapeHtml(bow.name)}</h1>
            ${bow.status === "draft" ? '<span class="badge q">Entwurf · noch nicht ausgestellt</span>' : ""}
          </div>
          <div class="card bd">${photos(bow.id)} ${kvs(bow)} ${cites()}</div>
          <div class="group">
            <div class="sh">Dokumente</div>
            ${docRows(bow)}
          </div>
          <div class="group">
            <div class="sh">Historie</div>
            ${timeline(bow)}
          </div>
          ${passActionButton(bow, mode)}
        </div>
      `,
    };
  },

  ctrl: ({ id, qr }) => {
    const bow = state.bows[id];
    return {
      cls: "white",
      html: /* HTML */ `
        ${nav(["back", "chevL"], ["menu", "dots", "Mehr"])}
        <div class="control-pass">
          <div class="center has-nav">
            <div class="eyebrow">Bogenpass</div>
            <h1 class="ti">${escapeHtml(bow.name)}</h1>
          </div>
          ${controlPassMedia(bow, qr)}
          <div class="control-pass-details">${kvs(bow)}</div>
          ${seal()}
          <div class="control-pass-footer">${cites()}</div>
        </div>
      `,
    };
  },
};

function passActionButton(bow, mode) {
  let action;
  let iconName;
  let label;
  if (mode === "m") {
    [action, iconName, label] = ["ovTransfer", "arrows", "Bogen übertragen"];
  } else if (mode === "b" && bow.status === "draft") {
    [action, iconName, label] = ["issue", "check", "Bogenpass ausstellen"];
  } else if (mode === "b") {
    [action, iconName, label] = ["ovRepair", "tool", "Reparatur eintragen"];
  } else {
    return "";
  }
  return /* HTML */ `
    <button class="btn pri" data-act="${action}" data-arg="${bow.id}">
      ${icon(iconName, 20)} ${label}
    </button>
  `;
}

function controlPassMedia(bow, showQr) {
  if (showQr) {
    return /* HTML */ `
      <button class="pass-qr" data-act="toggleQr" aria-label="Fotos zeigen">
        <img
          src="${images.qr}"
          width="226"
          height="228"
          alt="QR-Code des Bogenpasses ${escapeHtml(bow.pass)}"
        />
      </button>
    `;
  }
  return /* HTML */ `
    <button
      class="photos control-pass-photos"
      data-act="toggleQr"
      aria-label="QR-Code zeigen"
    >
      ${bowPhotoPair()}
    </button>
  `;
}

function addHist(id, s, t, ic) {
  state.bows[id].hist.unshift(historyEntry(today(), s, t, ic));
}

const passMode = () => ({ musiker: "m", bauer: "b", grenze: "g" })[user().role];

const passesActions = {
  openBow(id) {
    go("pass", { id, mode: passMode() });
  },
  ctrl(id) {
    go("ctrl", { id: id || currentScreen().params.id });
  },
  toggleQr() {
    currentScreen().params.qr = !currentScreen().params.qr;
    draw();
  },
  menu() {
    const { name, params } = currentScreen();
    openOverlay("menu", {
      id: params.id,
      mode: name === "ctrl" ? passMode() : params.mode,
    });
  },
  showQr(id) {
    closeOverlay();
    if (currentScreen().name === "ctrl") {
      currentScreen().params.qr = true;
      draw();
    } else go("ctrl", { id, qr: true });
  },
  toHist() {
    closeOverlay();
    if (currentScreen().name !== "pass")
      return go("pass", { id: currentScreen().params.id, mode: passMode() });
    const h = $("hist");
    h && h.scrollIntoView({ behavior: "smooth", block: "start" });
  },
  doc(arg) {
    const [t, id] = arg.split("|");
    openOverlay("doc", { t, id });
  },
  ovTransfer(id) {
    form.to = "";
    clearErrors();
    openOverlay("transfer", { id });
  },
  ovLend(id) {
    form.to = "";
    form.until = "";
    clearErrors();
    openOverlay("lend", { id });
  },
  ovRelease(id) {
    form.shop = MAKER;
    form.what = "";
    openOverlay("release", { id });
  },
  ovRepair(id) {
    form.part = "Frosch";
    form.what = "";
    clearErrors();
    openOverlay("repair", { id });
  },
  part(t) {
    form.part = t;
    redrawOverlay();
  },
  doTransfer() {
    const id = activeOverlay.params.id;
    if (!validEmail(form.to)) {
      setErrors({ to: "Bitte eine gültige E-Mail-Adresse eingeben." });
      return redrawOverlay();
    }
    addHist(id, "Besitz übertragen", "An " + form.to.trim(), "arrows");
    state.bows[id].owner = form.to.trim();
    state.ownedBowIds = state.ownedBowIds.filter((x) => x !== id);
    clearErrors();
    reset("m_home");
    toast("Übertragung an " + form.to.trim() + " gestartet", "arrows");
  },
  doLend() {
    const id = activeOverlay.params.id;
    if (!validEmail(form.to)) {
      setErrors({ to: "Bitte eine gültige E-Mail-Adresse eingeben." });
      return redrawOverlay();
    }
    const bis = form.until
      ? " bis " + new Date(form.until).toLocaleDateString("de-DE")
      : "";
    addHist(id, "Verliehen", "An " + form.to.trim() + bis, "user");
    clearErrors();
    closeOverlay();
    draw();
    toast("Bogen verliehen", "user");
  },
  doRelease() {
    const id = activeOverlay.params.id;
    addHist(
      id,
      "Zur Reparatur freigegeben",
      "An " + (form.shop || MAKER) + (form.what ? " · " + form.what : ""),
      "tool",
    );
    closeOverlay();
    draw();
    toast("Zur Reparatur freigegeben", "tool");
  },
  doRepair() {
    const id = activeOverlay.params.id;
    if (!(form.what || "").trim()) {
      setErrors({ what: "Bitte kurz beschreiben, was gemacht wurde." });
      return redrawOverlay();
    }
    addHist(id, "Reparatur · " + form.part, form.what.trim(), "tool");
    clearErrors();
    closeOverlay();
    draw();
    toast("Reparatur eingetragen", "tool");
  },
  issue(id) {
    id = id || currentScreen().params.id;
    const b = state.bows[id];
    b.status = "ok";
    addHist(
      id,
      "Bogenpass ausgestellt",
      "Bogen analysiert und eindeutig erkannt",
      "doc",
    );
    closeOverlay();
    draw();
    toast("Bogenpass ausgestellt");
  },
};
