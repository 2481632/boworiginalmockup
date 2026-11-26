"use strict";

// Suche, Filter, Sortierung und Favoriten gelten pro Demo-Konto und nur bis zum Neuladen.
const bowListSettings = new Map();
const bowNames = new Intl.Collator("de", {
  numeric: true,
  sensitivity: "base",
});

const bowSortOptions = [
  {
    title: "Erstellungsdatum",
    options: [
      ["oldest", "Älteste zuerst", (a, b) => a.createdAt - b.createdAt],
      ["newest", "Neueste zuerst", (a, b) => b.createdAt - a.createdAt],
    ],
  },
  {
    title: "Name",
    options: [
      ["name-asc", "A–Z", (a, b) => bowNames.compare(a.name, b.name)],
      ["name-desc", "Z–A", (a, b) => bowNames.compare(b.name, a.name)],
    ],
  },
];
const bowSortComparators = new Map(
  bowSortOptions.flatMap(({ options }) =>
    options.map(([value, , compare]) => [value, compare]),
  ),
);

function defaultBowFilters() {
  return { verified: "all", favoritesOnly: false, woods: new Set() };
}

function currentBowListSettings() {
  const { role, email } = user();
  const key = `${role}:${email}`;
  if (!bowListSettings.has(key)) {
    bowListSettings.set(key, {
      search: "",
      sort: "newest",
      filters: defaultBowFilters(),
      favorites: new Set(
        role === "musiker" && email === ACCOUNTS.musiker.email ? ["c12"] : [],
      ),
    });
  }
  return bowListSettings.get(key);
}

function isWorkshopList() {
  return user().role === "bauer";
}

// Beide Rollen verwenden dieselbe Ansicht und greifen auf unterschiedliche Sammlungen zu.
function listBows() {
  const ids = isWorkshopList() ? state.workshopBowIds : state.ownedBowIds;
  return ids.map((id) => state.bows[id]);
}

function visibleBows({ search, filters, sort, favorites }) {
  const query = search.trim().toLocaleLowerCase("de");
  return listBows()
    .filter((bow) =>
      [bow.name, bow.wood, bow.serial, bow.pass].some((text) =>
        text.toLocaleLowerCase("de").includes(query),
      ),
    )
    .filter((bow) => {
      const verified = bow.status === "ok";
      return (
        (filters.verified === "all" ||
          verified === (filters.verified === "yes")) &&
        (!filters.favoritesOnly || favorites.has(bow.id)) &&
        (!filters.woods.size || filters.woods.has(bow.wood))
      );
    })
    .sort(bowSortComparators.get(sort));
}

function hasBowFilters({ verified, favoritesOnly, woods }) {
  return verified !== "all" || favoritesOnly || woods.size > 0;
}

function renderBowHome() {
  const settings = currentBowListSettings();
  const bows = visibleBows(settings);
  const workshop = isWorkshopList();
  const filtered = hasBowFilters(settings.filters);
  return {
    html: /* HTML */ `
      <div class="content home bow-list">
        <header class="bow-list-heading">
          <h1 class="lt">${workshop ? "Bögen" : "Ihre Bögen"}</h1>
          <button class="avatar" data-act="profile" aria-label="Profil">
            ${initials(user())}
          </button>
        </header>
        <div class="search">
          ${icon("search", 18)}
          <input
            id="bow-search"
            type="search"
            placeholder="Name, Holz oder Bogen-ID"
            value="${escapeHtml(settings.search)}"
            aria-label="Bögen durchsuchen"
          />
          <button
            type="button"
            class="search-camera"
            data-act="toCam"
            aria-label="Bogen mit der Kamera finden"
          >
            ${icon("scan", 19)}
          </button>
        </div>
        <section class="group" aria-label="Bogenliste">
          <div class="bow-list-toolbar">
            <span class="sh" id="bow-count" role="status">
              ${bowCount(bows)}
            </span>
            <button
              class="list-pill"
              id="bow-sort-button"
              data-act="showBowSort"
              aria-haspopup="dialog"
            >
              ${icon("sort", 16)} Sortieren
            </button>
            <button
              class="list-pill${filtered ? " on" : ""}"
              id="bow-filter-button"
              data-act="showBowFilters"
              aria-haspopup="dialog"
              aria-label="${filtered ? "Filtern, Filter aktiv" : "Filtern"}"
            >
              ${icon("sliders", 16)} Filtern
            </button>
          </div>
          <div class="card" id="bow-results">
            ${renderBowResults(bows, settings.favorites)}
          </div>
        </section>
        ${
          workshop
            ? /* HTML */ `
                <button class="btn pri" data-act="newBow">
                  ${icon("plus", 20, 2)} Neuen Bogen registrieren
                </button>
              `
            : ""
        }
      </div>
    `,
  };
}

const bowListScreens = { m_home: renderBowHome, b_home: renderBowHome };

function bowCount(bows) {
  return `${bows.length} ${bows.length === 1 ? "Bogen" : "Bögen"}`;
}

function renderBowResults(bows, favorites) {
  if (!bows.length) {
    return /* HTML */ `
      <p class="fn bow-empty">Keine Bögen gefunden.</p>
    `;
  }
  return bows
    .map((bow) => renderBowListRow(bow, favorites.has(bow.id)))
    .join("");
}

function renderBowListRow(bow, favorite) {
  const id = escapeHtml(bow.id);
  const name = escapeHtml(bow.name);
  return /* HTML */ `
    <div class="bow-list-item">
      ${bowRow(bow, bow.wood + " · " + bow.serial, badge(bow), { badgeBelow: true })}
      <button
        type="button"
        class="bow-favorite"
        id="favorite-${id}"
        data-act="toggleBowFavorite"
        data-arg="${id}"
        aria-pressed="${favorite}"
        aria-label="Favorit: ${name}"
      >
        ${icon("star", 22)}
      </button>
    </div>
  `;
}

// Beim Tippen wechseln nur die Treffer. Das Suchfeld behält Fokus und Cursorposition.
function updateBowList() {
  const settings = currentBowListSettings();
  const bows = visibleBows(settings);
  $("bow-count").textContent = bowCount(bows);
  $("bow-results").innerHTML = renderBowResults(bows, settings.favorites);
  const filterButton = $("bow-filter-button");
  const filtered = hasBowFilters(settings.filters);
  filterButton.classList.toggle("on", filtered);
  filterButton.setAttribute(
    "aria-label",
    filtered ? "Filtern, Filter aktiv" : "Filtern",
  );
}

function searchBows(query) {
  currentBowListSettings().search = query;
  updateBowList();
}

function bowListDialog(title, content) {
  return /* HTML */ `
    <dialog class="sheet bow-list-sheet" aria-labelledby="sheet-title">
      ${sheetHead(title)} ${content}
    </dialog>
  `;
}

const bowListOverlays = {
  bowSort() {
    const { sort } = currentBowListSettings();
    return bowListDialog(
      "Sortieren",
      bowSortOptions
        .map(
          ({ title, options }) => /* HTML */ `
            <fieldset class="group bow-list-field">
              <legend class="sh">${title}</legend>
              <div class="card">
                ${options
                  .map(
                    ([value, label]) => /* HTML */ `
                      <button
                        class="row bow-sort-option"
                        data-act="chooseBowSort"
                        data-arg="${value}"
                        aria-pressed="${sort === value}"
                      >
                        <span class="lbl">${label}</span>
                      </button>
                    `,
                  )
                  .join("")}
              </div>
            </fieldset>
          `,
        )
        .join(""),
    );
  },

  bowFilters() {
    const { filters } = currentBowListSettings();
    // Holzarten aus der ganzen Sammlung: Ein aktiver Filter soll keine Optionen verstecken.
    const woods = [...new Set(listBows().map((bow) => bow.wood))].sort(
      bowNames.compare,
    );
    return bowListDialog(
      "Filtern",
      /* HTML */ `
        <form class="group bow-filter-form" data-submit="applyBowFilters">
          <fieldset class="group bow-list-field">
            <legend class="sh">Verifiziert</legend>
            <div class="seg bow-verification">
              ${[
                ["all", "Alle"],
                ["yes", "Ja"],
                ["no", "Nein"],
              ]
                .map(
                  ([value, label]) => /* HTML */ `
                    <label class="bow-choice">
                      <input
                        type="radio"
                        name="verified"
                        value="${value}"
                        ${filters.verified === value ? "checked" : ""}
                      />
                      <span>${label}</span>
                    </label>
                  `,
                )
                .join("")}
            </div>
          </fieldset>
          <fieldset class="group bow-list-field">
            <legend class="sh">Favoriten</legend>
            <div class="card">
              <label class="row bow-favorite-filter">
                ${icon("star", 20)}
                <span class="lbl">Nur Favoriten</span>
                <input
                  class="bow-switch"
                  type="checkbox"
                  role="switch"
                  name="favorites"
                  ${filters.favoritesOnly ? "checked" : ""}
                />
              </label>
            </div>
          </fieldset>
          ${
            woods.length
              ? /* HTML */ `
                  <fieldset class="group bow-list-field">
                    <legend class="sh">Holzart</legend>
                    <div class="bow-wood-options">
                      ${woods
                        .map(
                          (wood) => /* HTML */ `
                            <label class="bow-choice list-pill">
                              <input
                                type="checkbox"
                                name="wood"
                                value="${escapeHtml(wood)}"
                                ${filters.woods.has(wood) ? "checked" : ""}
                              />
                              <span>${escapeHtml(wood)}</span>
                            </label>
                          `,
                        )
                        .join("")}
                    </div>
                  </fieldset>
                `
              : ""
          }
          <button class="btn pri" type="submit">Filter anwenden</button>
        </form>
      `,
    );
  },
};

const bowListActions = {
  showBowSort() {
    openOverlay("bowSort");
  },
  chooseBowSort(value) {
    currentBowListSettings().sort = value;
    closeOverlay();
    updateBowList();
  },
  showBowFilters() {
    openOverlay("bowFilters");
  },
  applyBowFilters(filterForm) {
    // Erst „Filter anwenden“ übernimmt die Auswahl. Beim Schließen wird der Entwurf verworfen.
    const values = new FormData(filterForm);
    currentBowListSettings().filters = {
      verified: values.get("verified"),
      favoritesOnly: values.has("favorites"),
      woods: new Set(values.getAll("wood")),
    };
    closeOverlay();
    updateBowList();
  },
  toggleBowFavorite(id) {
    const { favorites } = currentBowListSettings();
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    updateBowList();
    ($("favorite-" + id) || $("bow-filter-button")).focus();
  },
};
