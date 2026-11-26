"use strict";

const workshop = {
  b_new: () => ({
    cls: "dark",
    html: /* HTML */ `
      <div class="newtop"></div>
      <div class="newsheet">
        <div class="grab"></div>
        ${nav(["back", "x", "Abbrechen"], ["saveBow", "check", "Speichern", 1], "Neuer Bogen", 1)}
        <div class="content" style="padding-top:4px">
          <div class="group">
            <div class="sh">Fotos</div>
            <div class="pics">
              ${[
                ["head", "Kopf"],
                ["frog", "Frosch"],
              ]
                .map(
                  ([k, t]) => /* HTML */ `
                    <button class="pic" data-act="photo" data-arg="${k}">
                      ${
                        form["p_" + k]
                          ? /* HTML */ `
                              <span
                                class="img"
                                style="background-image:url(${images[k]})"
                              ></span>
                              <span>${icon("check", 14, 2.2)} ${t}</span>
                            `
                          : /* HTML */ `
                              <span
                                class="img empty${formErrors.photo ? " err" : ""}"
                              >
                                ${icon("camera")}
                              </span>
                              <span>${t}</span>
                            `
                      }
                    </button>
                  `,
                )
                .join("")}
            </div>
          </div>
          ${
            formErrors.photo
              ? /* HTML */ `
                  <div class="errmsg">${escapeHtml(formErrors.photo)}</div>
                `
              : ""
          }
          <div class="group">
            <div class="sh">Angaben</div>
            <div class="card">
              ${field("name", "Bezeichnung", "z. B. Violinbogen V-01")}${field("wood", "Holzart", "z. B. Pernambuk")}${field("year", "Herstellungsjahr", "z. B. 2026", "text", 'inputmode="numeric" maxlength="4"')}${field("maker", "Hersteller", "Werkstatt")}${field("serial", "Seriennummer / Werkstattnummer", "z. B. BP-2026-004812")}
            </div>
          </div>
          ${
            formErrors._
              ? /* HTML */ `
                  <div class="errmsg">${escapeHtml(formErrors._)}</div>
                `
              : ""
          }
          <div class="group">
            <div class="sh">Masse &amp; Material</div>
            <div class="card">
              ${field("weight", "Gewicht", "z. B. 61,5 g")}${field("length", "Länge", "z. B. 74,5 cm")}${field("wind", "Wicklung", "z. B. Silberdraht")}
            </div>
          </div>
          <button class="btn pri" data-act="saveBow">
            Bogenpass erstellen
          </button>
        </div>
      </div>
    `,
  }),

  b_done: (p) => {
    const b = state.bows[p.id];
    return {
      html: /* HTML */ `
        ${nav(["toList", "x", "Schließen"], null, " ")}
        <div class="content has-nav">
          <div class="center">
            <span class="tile a big">${icon("check", 28)}</span>
            <div class="eyebrow">Bogenpass erstellt</div>
            <h1 class="ti">${escapeHtml(b.name)} ist registriert</h1>
          </div>
          <div class="card bd">${photos()}${kvs(b)}${cites()}</div>
          <div class="stack">
            <button class="btn pri" data-act="share" data-arg="${b.id}">
              ${icon("share", 20)} Bogenpass teilen
            </button>
            <button class="btn lnk" data-act="newBow">
              Weiteren Bogen registrieren
            </button>
          </div>
        </div>
      `,
    };
  },
};

const workshopActions = {
  newBow() {
    const n = Object.keys(state.bows).length + 1;
    setForm({
      p_head: 1,
      p_frog: 0,
      name: "",
      wood: "",
      year: String(new Date().getFullYear()),
      maker: MAKER,
      serial:
        "BP-" +
        new Date().getFullYear() +
        "-" +
        String(5020 + n).padStart(6, "0"),
      weight: "",
      length: "",
      wind: "",
    });
    currentScreen().name === "b_done" ? replace("b_new") : go("b_new");
  },
  photo(k) {
    form["p_" + k] = form["p_" + k] ? 0 : 1;
    delete formErrors.photo;
    draw();
  },
  saveBow() {
    clearErrors();
    if (!(form.name || "").trim()) formErrors.name = 1;
    if (!(form.wood || "").trim()) formErrors.wood = 1;
    if (!/^\d{4}$/.test(form.year || "")) formErrors.year = 1;
    if (!form.p_head || !form.p_frog)
      formErrors.photo =
        "Für den Bogenpass werden Fotos von Kopf und Frosch gebraucht.";
    if (formErrors.name || formErrors.wood || formErrors.year)
      formErrors._ =
        "Bitte Bezeichnung, Holzart und ein vierstelliges Herstellungsjahr angeben.";
    if (Object.keys(formErrors).length) {
      draw();
      return;
    }
    const createdAt = Date.now();
    const id = "n" + createdAt;
    const serial =
      (form.serial || "").trim().toUpperCase() ||
      "BP-" + form.year + "-" + String(createdAt).slice(-6);
    state.bows[id] = {
      id,
      createdAt,
      name: form.name.trim(),
      wood: form.wood.trim(),
      year: form.year,
      serial,
      img: "head",
      status: "ok",
      maker: (form.maker || MAKER).trim(),
      pass:
        "BGP-" +
        Math.random().toString(16).slice(2, 6).toUpperCase() +
        "-" +
        Math.random().toString(16).slice(2, 5).toUpperCase() +
        "C",
      weight: (form.weight || "—").trim(),
      length: (form.length || "—").trim(),
      wind: (form.wind || "").trim(),
      owner: isWorkshopList() ? (form.maker || MAKER).trim() : user().first + " " + user().last,
      hist: [
        historyEntry(
          today(),
          "Bogenpass ausgestellt",
          "Bogen analysiert und eindeutig erkannt",
          "doc",
        ),
        historyEntry(
          today(),
          "Registriert",
          (form.maker || MAKER).trim(),
          "plus",
        ),
      ],
    };
    currentBowIds().unshift(id);
    // Nach der Registrierung ist der neue Bogen unabhängig von der bisherigen Suche sichtbar.
    Object.assign(currentBowListSettings(), {
      search: "",
      filters: defaultBowFilters(),
    });
    replace("b_done", { id });
  },
  toList() {
    reset(HOME[user().role]);
  },
  share(id) {
    const t = "Bogenpass " + state.bows[id].pass;
    (navigator.clipboard
      ? navigator.clipboard.writeText(t)
      : Promise.reject()
    ).then(
      () => toast("Bogenpass-ID kopiert", "share"),
      () => toast("Teilen-Dialog folgt in der App", "share"),
    );
  },
};
