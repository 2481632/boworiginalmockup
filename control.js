"use strict";

const control = {
  g_home: () => {
    const u = user();
    return {
      html: /* HTML */ `
        <div class="content home">
          <div style="display:flex;align-items:flex-end;gap:12px">
            <div style="flex:1">
              <div class="eyebrow">
                ${escapeHtml(u.place[1].replace(" T1", " · T1"))}
              </div>
              <h1 class="lt">Kontrolle</h1>
            </div>
            <button class="avatar" data-act="profile" aria-label="Profil">
              ${initials(u)}
            </button>
          </div>
          <button class="hero" data-act="toCam">
            <span class="ic">${icon("scan", 26)}</span>
            <span class="tx">
              <span class="t3">Bogen prüfen</span>
              <span class="fn">
                Kamera auf den Bogen richten – Ergebnis in etwa 3 Sekunden
              </span>
            </span>
            ${icon("chevR", 20, 2)}
          </button>
          <div class="stats">
            <div class="stat">
              <span class="tile a">${icon("shield", 18)}</span>
              <span class="big">${state.stats.n}</span>
              <span class="fn">Kontrollen heute</span>
            </div>
            <div class="stat">
              <span class="tile a">${icon("check", 18, 2)}</span>
              <span class="big">${state.stats.ok}</span>
              <span class="fn">Bestätigt</span>
            </div>
          </div>
          <div class="group">
            <div class="sh">Letzte Kontrollen</div>
            <div class="card">
              ${state.checks
                .slice(0, 5)
                .map((c, i) => {
                  const b = c.bow && state.bows[c.bow];
                  return b
                    ? bowRow(
                        b,
                        c.t + " · " + b.serial,
                        c.ok
                          ? '<span class="badge">Bestätigt</span>'
                          : '<span class="badge d">Auffällig</span>',
                        { action: "openCheck" },
                      )
                    : /* HTML */ `
                        <button class="bowrow" data-act="unknownCheck">
                          <span
                            class="thumb"
                            style="background-image:url(${images.head})"
                          ></span>
                          <span class="tx">
                            <span class="nm">Unbekannter Bogen</span>
                            <span class="fn">${c.t} · kein Eintrag</span>
                          </span>
                          <span class="badge d">Auffällig</span>
                          <span class="chev">${icon("chevR", 16)}</span>
                        </button>
                      `;
                })
                .join("")}
            </div>
          </div>
        </div>
      `,
    };
  },

  cam: (p) => ({
    cls: "dark cam",
    html: /* HTML */ `
      <div class="nav">
        <button class="circ" data-act="back" aria-label="Schließen">
          ${icon("x")}
        </button>
        <span class="navt ttl">${isBorderCheck() ? "Bogen prüfen" : "Bogen finden"}</span>
        <button
          class="circ"
          data-act="flash"
          aria-label="Blitz"
          style="${state.flash ? "background:#f5d34a;border-color:#f5d34a" : ""}"
        >
          ${icon("bolt")}
        </button>
      </div>
      <div class="cam-guide">
        ${scanViewfinder(p)}
        <div class="camhint" role="status">
          ${
            p.busy
              ? /* HTML */ `<span class="busy">${icon("spark", 16)} Analyse läuft …</span>`
              : p.aligned
                ? /* HTML */ `
                    <strong>Bogen richtig ausgerichtet</strong>
                    <span class="fn">Jetzt aufnehmen</span>
                  `
                : /* HTML */ `
                    <strong>Bogenkopf an der Kontur ausrichten</strong>
                    <span class="fn">Waagerecht halten · Von der Seite fotografieren</span>
                  `
          }
        </div>
      </div>
      <button class="shutter" data-act="shoot" aria-label="Aufnehmen" ${!p.aligned || p.busy ? "disabled" : ""}>
        <i></i>
      </button>
      <button class="idpill" data-act="ovId" ${p.busy ? "disabled" : ""}>
        ${icon("search", 16, 2)} ID eingeben
      </button>
    `,
  }),

  res: (p) => {
    const borderCheck = isBorderCheck();
    const b = p.id && state.bows[p.id];
    const last =
      b && (b.hist.find((e) => e.s.startsWith("Grenzkontrolle")) || {}).d;
    return {
      cls: "dark",
      html: /* HTML */ `
        <div
          class="camframe"
          style="top:110px;height:200px;left:37px;right:37px"
        >
          <span class="corner c1"></span>
          <span class="corner c2"></span>
        </div>
        <section class="ressheet" tabindex="0" aria-label="Scanergebnis">
          <div class="grab"></div>
          ${
            p.ok
              ? /* HTML */ `
                  <div class="center">
                    <span class="tile a big">${icon("check", 28)}</span>
                    <div class="eyebrow">${borderCheck ? "Bogen verifiziert" : "Bogen gefunden"}</div>
                    <h1 class="ti">${escapeHtml(b.name)}</h1>
                    <span class="fn">
                      ${p.byId ? "Per ID gefunden" : "Übereinstimmung 99 %"} ·
                      ${escapeHtml(b.pass)}
                    </span>
                  </div>
                  <div class="card">
                    <div class="kv ln">
                      <span>Hersteller</span>
                      <span>${escapeHtml(b.maker)}</span>
                    </div>
                    <div class="kv ln">
                      <span>Holzart</span>
                      <span>${escapeHtml(b.wood)}</span>
                    </div>
                    ${borderCheck ? /* HTML */ `
                      <div class="kv ln">
                        <span>Besitz</span>
                        <span>${escapeHtml(b.owner)}</span>
                      </div>
                      <div class="kv">
                        <span>Letzte Kontrolle</span>
                        <span>${last || "—"}</span>
                      </div>
                    ` : ""}
                  </div>
                  ${
                    b.status === "draft"
                      ? /* HTML */ `
                          <div class="info w">
                            ${icon("warn", 20)}
                            <span>
                              Bogenpass noch nicht ausgestellt – nur Entwurf der
                              Werkstatt.
                            </span>
                          </div>
                        `
                      : borderCheck ? /* HTML */ `
                          <div class="info">
                            ${icon("shield", 20)}
                            <span>
                              Keine CITES-geschützten Materialien
                              <br />
                              Declaration of Materials liegt vor
                            </span>
                          </div>
                        ` : ""
                  }
                  <div class="stack">
                    ${borderCheck ? /* HTML */ `
                      <button class="btn pri" data-act="confirmCheck" data-arg="${b.id}">
                        ${icon("check", 20, 2)} Kontrolle bestätigen
                      </button>
                    ` : ""}
                    <button
                      class="btn ${borderCheck ? "sec" : "pri"}"
                      data-act="${borderCheck ? "showPass" : "openBow"}"
                      data-arg="${b.id}"
                    >
                      Bogenpass anzeigen
                    </button>
                  </div>
                `
              : /* HTML */ `
                  <div class="center">
                    <span class="tile d big">${icon("x", 28)}</span>
                    <div class="eyebrow d">Nicht gefunden</div>
                    <h1 class="ti">Keine Übereinstimmung</h1>
                    <span class="fn">
                      ${p.q ? "Keine Bogen-ID „" + escapeHtml(p.q) + "“" : "0 % Match"}
                    </span>
                  </div>
                  <div class="info d">
                    ${icon("warn", 20)}
                    <span>
                      ${borderCheck
                        ? "Der Bogen ist nicht registriert oder wurde nicht vollständig erfasst."
                        : "Kein passender Bogen in dieser Sammlung gefunden."}
                    </span>
                  </div>
                  <div class="group">
                    <div class="sh">Was Sie tun können</div>
                    <div class="card">
                      <button class="row" data-act="rescan">
                        ${icon("scan")}
                        <span class="lbl">Erneut scannen</span>
                        <span class="chev">${icon("chevR", 16)}</span>
                      </button>
                      <button class="row" data-act="ovId">
                        ${icon("search")}
                        <span class="lbl">Nach Bogen-ID suchen</span>
                        <span class="chev">${icon("chevR", 16)}</span>
                      </button>
                      ${borderCheck ? /* HTML */ `<button class="row" data-act="ovNote">
                        ${icon("doc")}
                        <span class="lbl">Vorgang dokumentieren</span>
                        <span class="chev">${icon("chevR", 16)}</span>
                      </button>` : ""}
                    </div>
                  </div>
                  <div class="stack">
                    <button class="btn pri" data-act="rescan">
                      ${icon("scan", 20)} Erneut scannen
                    </button>
                    ${borderCheck ? /* HTML */ `
                      <button class="btn dan" data-act="report">
                        ${icon("warn", 20)} Als auffällig melden
                      </button>
                    ` : ""}
                  </div>
                `
          }
          ${borderCheck ? "" : /* HTML */ `
            <button class="btn lnk" data-act="backToBowList">Zurück zur Liste</button>
          `}
        </section>
      `,
    };
  },
};

function scanViewfinder({ aligned, busy }) {
  return /* HTML */ `
    <div class="camframe">
      <svg class="cam-preview" viewBox="0 52 900 562.5" aria-hidden="true">
        <defs>
          <!-- Kontur und Foto werden im selben Koordinatensystem waagerecht ausgerichtet. -->
          <path
            id="scan-head-outline"
            d="M-12 298 C235 288 532 257 693 230 C739 222 752 242 769 287 C784 326 796 357 822 358 Q842 358 848 345 Q851 342 853 349 L859 365 Q864 368 856 372 Q812 391 757 403 Q754 410 743 412 Q705 421 672 421 L-12 407 L-12 387 L680 407 C680 306 675 270 625 278 C470 300 217 331 -12 347 Z"
            transform="rotate(-1.4 0 400)"
            vector-effect="non-scaling-stroke"
          />
          <mask id="scan-head-mask" maskUnits="userSpaceOnUse" x="0" y="52" width="900" height="562.5">
            <rect x="0" y="52" width="900" height="562.5" fill="white" />
            <use href="#scan-head-outline" fill="black" />
          </mask>
        </defs>
        <rect x="0" y="52" width="900" height="562.5" fill="#b1b1ae" />
        ${
          aligned
            ? /* HTML */ `<image href="./assets/scan-head.jpg" width="960" height="720" transform="rotate(-1.4 0 400)" />`
            : ""
        }
        <rect class="cam-mask" x="0" y="52" width="900" height="562.5" mask="url(#scan-head-mask)" />
        ${
          aligned
            ? /* HTML */ `<use class="cam-aligned" href="#scan-head-outline" fill="none" />`
            : ""
        }
      </svg>
      <span class="corner c1"></span>
      <span class="corner c2"></span>
      <span class="corner c3"></span>
      <span class="corner c4"></span>
      ${busy ? '<span class="sweep"></span>' : ""}
    </div>
  `;
}

let alignmentTimer;
let scanTimer;

function simulateAlignment() {
  const scanner = currentScreen();
  const preview = scanner.params;
  clearTimeout(alignmentTimer);
  // Die Demo wechselt vom leeren Sucher zum ausgerichteten Referenzfoto.
  alignmentTimer = setTimeout(() => {
    if (currentScreen() !== scanner || scanner.params !== preview) return;
    preview.aligned = true;
    draw();
  }, 2300);
}

function isBorderCheck() {
  return user().role === "grenze";
}

function scanCandidates() {
  return isBorderCheck() ? Object.values(state.bows) : listBows();
}

const controlActions = {
  backToBowList() {
    reset(HOME[user().role]);
  },
  toCam() {
    go("cam");
    simulateAlignment();
  },
  flash() {
    state.flash = !state.flash;
    draw();
  },
  shoot() {
    const scanner = currentScreen();
    if (!scanner.params.aligned || scanner.params.busy) return;
    scanner.params.busy = true;
    draw();
    clearTimeout(scanTimer);
    scanTimer = setTimeout(() => {
      // Ein verspätetes Scanergebnis soll eine inzwischen geöffnete Ansicht nicht ersetzen.
      if (currentScreen() !== scanner) return;
      scanner.params.busy = false;
      const match =
        state.scanResult === "ok" &&
        scanCandidates().find((bow) => bow.id === "v01");
      go("res", match ? { ok: 1, id: match.id } : { ok: 0 });
    }, 2300);
  },
  rescan() {
    closeOverlay();
    while (stack.length > 1 && currentScreen().name !== "cam") stack.pop();
    if (currentScreen().name !== "cam") stack.push({ name: "cam", params: {} });
    currentScreen().params = {};
    draw("back");
    simulateAlignment();
  },
  ovId() {
    form.bid = "";
    clearErrors();
    openOverlay("id");
  },
  doId() {
    const q = (form.bid || "").trim();
    if (!q) {
      setErrors({ bid: "Bitte eine ID eingeben." });
      return redrawOverlay();
    }
    const n = q.toUpperCase().replace(/\s/g, "");
    const b = scanCandidates().find((bow) => bow.serial === n || bow.pass === n);
    clearErrors();
    if (currentScreen().name === "res") stack.pop();
    go("res", b ? { ok: 1, id: b.id, byId: 1 } : { ok: 0, q });
  },
  ovNote() {
    form.note = "";
    openOverlay("note");
  },
  doNote() {
    closeOverlay();
    toast("Vorgang dokumentiert", "doc");
  },
  confirmCheck(id) {
    state.checks.unshift({ bow: id, t: now(), ok: true });
    state.stats.n++;
    state.stats.ok++;
    addHist(
      id,
      "Grenzkontrolle bestanden",
      user().place[1].replace(" T1", "") + ", Deutschland",
      "shield",
    );
    reset("g_home");
    toast("Kontrolle bestätigt");
  },
  report() {
    state.checks.unshift({ bow: null, t: now(), ok: false });
    state.stats.n++;
    reset("g_home");
    toast("Als auffällig gemeldet", "warn");
  },
  showPass(id) {
    go("ctrl", { id });
  },
  openCheck(id) {
    go("ctrl", { id });
  },
  unknownCheck() {
    toast("Kein Bogenpass vorhanden – Vorgang wurde gemeldet", "warn");
  },
};
