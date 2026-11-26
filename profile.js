"use strict";

const profile = {
  profile: () => {
    const u = user();
    const st =
      u.proof === "not_required"
        ? ["Nicht erforderlich", "var(--t2)"]
        : u.proof === "ok"
          ? ["Bestätigt", "var(--acc)"]
          : ["In Prüfung", "var(--warn)"];
    return {
      html: /* HTML */ `
        ${nav(["back", "chevL"], null)}
        <div class="content has-nav">
          <div class="center" style="gap:6px">
            <span
              class="avatar"
              style="width:88px;height:88px;font:400 26px/32px var(--serif)"
            >
              ${initials(u)}
            </span>
            <h1 class="ti" style="margin-top:4px">
              ${escapeHtml(u.first + " " + u.last)}
            </h1>
            <span
              class="badge${u.proof === "ok" ? "" : u.proof === "not_required" ? " q" : " w"}"
            >
              ${escapeHtml(u.label)} ·
              ${u.proof === "not_required" ? "kein Nachweis nötig" : u.proof === "ok" ? "bestätigt" : "in Prüfung"}
            </span>
            <span class="fn">Mitglied seit ${escapeHtml(u.since)}</span>
          </div>
          <div class="group">
            <div class="sh">Persönliche Angaben</div>
            <div class="card">
              <div class="row">
                ${icon("mail")}
                <span class="lbl">E-Mail</span>
                <span class="val">${escapeHtml(u.email)}</span>
              </div>
              <div class="row">
                ${icon("phone")}
                <span class="lbl">Telefon</span>
                <span class="val">${escapeHtml(u.phone)}</span>
              </div>
              <div class="row">
                ${icon("pin")}
                <span class="lbl">${escapeHtml(u.place[0])}</span>
                <span class="val">${escapeHtml(u.place[1])}</span>
              </div>
            </div>
          </div>
          <div class="group">
            <div class="sh">Konto</div>
            <div class="card">
              ${
                u.role === "musiker"
                  ? ""
                  : /* HTML */ `
                      <button class="row" data-act="proofInfo">
                        ${icon("idcard")}
                        <span class="lbl">Rollennachweis</span>
                        <span class="val" style="color:${st[1]}">${st[0]}</span>
                        <span class="chev">${icon("chevR", 16)}</span>
                      </button>
                    `
              }
              <button
                class="row"
                data-act="soon"
                data-arg="Passwort & Sicherheit"
              >
                ${icon("lock")}
                <span class="lbl">Passwort &amp; Sicherheit</span>
                <span class="chev">${icon("chevR", 16)}</span>
              </button>
              <button class="row" data-act="settings">
                ${icon("sliders")}
                <span class="lbl">Einstellungen</span>
                <span class="chev">${icon("chevR", 16)}</span>
              </button>
            </div>
          </div>
          <button class="btn dan" data-act="logout">
            ${icon("logout", 20)} Abmelden
          </button>
        </div>
      `,
    };
  },
  settings: () => ({
    html: /* HTML */ `
      ${nav(["back", "chevL"], null, " ", true)}
      <div class="content">
        <section class="group">
          <h1 class="ti">Einstellungen</h1>
          <div class="card">
            ${select(
              "demo-role",
              "Rolle",
              user().role,
              ROLES.map(([key, label]) => [key, label]),
            )}
            ${select(
              "demo-scan",
              "Ergebnis des Kamera-Scans",
              state.scanResult,
              [
                ["ok", "Bogen erkannt"],
                ["nf", "Nicht gefunden"],
              ],
            )}
          </div>
        </section>
      </div>
    `,
  }),
};

function select(id, label, value, options) {
  return /* HTML */ `
    <div class="field">
      <label for="${id}">${label}</label>
      <select id="${id}" class="settings-select">
        ${options
          .map(
            ([key, text]) => /* HTML */ `
              <option value="${key}" ${key === value ? "selected" : ""}>
                ${text}
              </option>
            `,
          )
          .join("")}
      </select>
    </div>
  `;
}

function startAs(role) {
  state.user = {
    ...ACCOUNTS[role],
    role,
    proof: role === "musiker" ? "not_required" : "ok",
  };
  setForm();
  reset(HOME[role]);
}

const profileActions = {
  profile() {
    go("profile");
  },
  settings() {
    go("settings");
  },
  proofInfo() {
    openOverlay("proof");
  },
  soon(t) {
    toast(t + " – im Prototyp nicht ausgearbeitet", "clock");
  },
};

function changeDemoRole(role) {
  if (!Object.hasOwn(HOME, role) || role === user().role) return;
  startAs(role);
  go("profile");
  go("settings");
  $("demo-role").focus();
}
