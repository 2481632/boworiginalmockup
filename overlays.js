"use strict";

const overlays = {
  ...bowListOverlays,
  menu: (p) => {
    const b = state.bows[p.id],
      m = p.mode;
    const items = [
      ["qr", "QR-Code anzeigen", "showQr"],
      ["clock", "Historie", "toHist"],
      [
        "doc",
        "Declaration of Materials",
        "doc",
        "Declaration of Materials|" + b.id,
      ],
      ["doc", "Expertise", "doc", "Expertise|" + b.id, "PDF"],
    ];
    if (m === "m")
      items.push(
        ["user", "Bogen verleihen", "ovLend"],
        ["tool", "Zur Reparatur freigeben", "ovRelease"],
        ["arrows", "Bogen übertragen", "ovTransfer", b.id, "", 1],
      );
    if (m === "b")
      items.push(
        b.status === "draft"
          ? ["check", "Bogenpass ausstellen", "issue"]
          : ["tool", "Reparatur eintragen", "ovRepair"],
      );
    return /* HTML */ `
      <div class="scrim clear" data-act="closeOverlay"></div>
      <div class="menu" role="menu">
        ${items
          .map(
            ([ic, t, a, arg, val, red]) => /* HTML */ `
              <button
                class="row${red ? " red" : ""}"
                role="menuitem"
                data-act="${a}"
                data-arg="${escapeHtml(arg || b.id)}"
              >
                ${icon(ic)}
                <span class="lbl">${t}</span>
                ${
                  val
                    ? /* HTML */ `
                        <span class="val">${val}</span>
                      `
                    : ""
                }
              </button>
            `,
          )
          .join("")}
      </div>
    `;
  },
  transfer: (p) => /* HTML */ `
    <div class="scrim" data-act="closeOverlay"></div>
    <form class="sheet" data-submit="doTransfer" novalidate>
      ${sheetHead("Bogen übertragen")}
      <p class="callout">
        ${escapeHtml(state.bows[p.id].name)} geht in den Besitz einer anderen
        Person über. Die Übertragung wird in der Historie dokumentiert.
      </p>
      <div class="card">
        ${field("to", "E-Mail der neuen Besitzerin / des neuen Besitzers", "name@beispiel.de", "email")}
      </div>
      ${errline("to")}
      <div class="info w">
        ${icon("warn", 20)}
        <span>Der Bogen erscheint danach nicht mehr in Ihrer Sammlung.</span>
      </div>
      <button class="btn pri" type="submit">
        ${icon("arrows", 20)} Übertragen
      </button>
    </form>
  `,
  lend: (p) => /* HTML */ `
    <div class="scrim" data-act="closeOverlay"></div>
    <form class="sheet" data-submit="doLend" novalidate>
      ${sheetHead("Bogen verleihen")}
      <p class="callout">
        Sie bleiben Eigentümerin, die Person wird als aktuelle Besitzerin
        eingetragen.
      </p>
      <div class="card">
        ${field("to", "Verliehen an (E-Mail)", "name@beispiel.de", "email")}${field("until", "Rückgabe bis", "", "date")}
      </div>
      ${errline("to")}
      <button class="btn pri" type="submit">
        ${icon("user", 20)} Verleihen
      </button>
    </form>
  `,
  release: (p) => /* HTML */ `
    <div class="scrim" data-act="closeOverlay"></div>
    <form class="sheet" data-submit="doRelease" novalidate>
      ${sheetHead("Zur Reparatur freigeben")}
      <p class="callout">
        Die Werkstatt darf danach Reparaturen an diesem Bogen eintragen.
      </p>
      <div class="card">
        ${field("shop", "Werkstatt", MAKER)}${field("what", "Anlass", "z. B. Neubehaarung")}
      </div>
      <button class="btn pri" type="submit">
        ${icon("tool", 20)} Freigeben
      </button>
    </form>
  `,
  repair: (p) => /* HTML */ `
    <div class="scrim" data-act="closeOverlay"></div>
    <form class="sheet" data-submit="doRepair" novalidate>
      ${sheetHead("Reparatur eintragen")}
      <div class="group">
        <div class="sh">Bauteil</div>
        <div class="seg">
          ${["Stange", "Frosch", "Wicklung", "Behaarung"]
            .map(
              (t) => /* HTML */ `
                <button
                  type="button"
                  class="${form.part === t ? "on" : ""}"
                  data-act="part"
                  data-arg="${t}"
                >
                  ${t}
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
      <div class="card">
        ${field("what", "Beschreibung", "z. B. Frosch-Einlage ersetzt")}
      </div>
      ${errline("what")}
      <p class="fn" style="margin:0 16px">
        Ersetzte Teile und Belege bleiben im Verlauf nachvollziehbar.
      </p>
      <button class="btn pri" type="submit">
        ${icon("check", 20, 2)} Eintragen
      </button>
    </form>
  `,
  id: () => /* HTML */ `
    <div class="scrim" data-act="closeOverlay"></div>
    <form class="sheet" data-submit="doId" novalidate>
      ${sheetHead("Bogen-ID eingeben")}
      <div class="card">
        ${field("bid", "Seriennummer oder Bogenpass-ID", "BP-2026-004812 oder BGP-8F4A-291C", "text", 'autocapitalize="characters"')}
      </div>
      ${errline("bid")}
      <button class="btn pri" type="submit">
        ${icon("search", 20, 2)} Suchen
      </button>
    </form>
  `,
  note: () => /* HTML */ `
    <div class="scrim" data-act="closeOverlay"></div>
    <form class="sheet" data-submit="doNote" novalidate>
      ${sheetHead("Vorgang dokumentieren")}
      <div class="card">
        <div class="field">
          <label for="f_note">Notiz</label>
          <textarea
            id="f_note"
            data-f="note"
            rows="4"
            placeholder="z. B. Bogen ohne Pass, Reisende/r gibt Werkstatt in Berlin an"
          >
${escapeHtml(form.note || "")}</textarea>
        </div>
      </div>
      <button class="btn pri" type="submit">Speichern</button>
    </form>
  `,
  doc: (p) => {
    const b = state.bows[p.id];
    return /* HTML */ `
      <div class="scrim" data-act="closeOverlay"></div>
      <div class="sheet">
        ${sheetHead(escapeHtml(p.t))}
        <div class="doc">
          <div class="eyebrow">${escapeHtml(p.t)}</div>
          <div class="hl" style="font-size:20px">${escapeHtml(b.name)}</div>
          ${[
            ["Seriennummer", b.serial],
            ["Hersteller", b.maker],
            ["Holzart (Stange)", b.wood],
            ["Wicklung", b.wind || "—"],
            ["Ausgestellt", b.hist[b.hist.length - 1].d],
          ]
            .map(
              ([k, v]) => /* HTML */ `
                <div class="kv ln" style="padding:8px 0">
                  <span>${k}</span>
                  <span>${escapeHtml(v)}</span>
                </div>
              `,
            )
            .join("")}
        </div>
        <p class="fn" style="margin:0;text-align:center">
          Vorschau im Prototyp – das echte Dokument ist noch nicht hinterlegt.
        </p>
      </div>
    `;
  },
  proof: () => {
    const u = user(),
      notRequired = u.proof === "not_required";
    return /* HTML */ `
      <div class="scrim" data-act="closeOverlay"></div>
      <div class="sheet">
        ${sheetHead("Rollennachweis")}
        <div class="card">
          <div class="kv ln">
            <span>Rolle</span>
            <span>${escapeHtml(u.label)}</span>
          </div>
          ${
            notRequired
              ? ""
              : /* HTML */ `
                  <div class="kv ln">
                    <span>Dokument</span>
                    <span>
                      ${escapeHtml(u.file || { bauer: "meisterbrief.pdf", grenze: "dienstausweis.pdf" }[u.role])}
                    </span>
                  </div>
                `
          }
          <div class="kv">
            <span>Status</span>
            ${notRequired ? '<span class="badge q">Nicht erforderlich</span>' : u.proof === "ok" ? '<span class="badge">Genehmigt</span>' : '<span class="badge w">Prüfung ausstehend</span>'}
          </div>
        </div>
        <p class="fn" style="margin:0 16px">
          ${notRequired ? "Für Musikerinnen und Musiker ist kein Rollennachweis erforderlich." : "Prüfzustände: Genehmigt · Prüfung ausstehend · Abgelehnt."}
        </p>
      </div>
    `;
  },
};
