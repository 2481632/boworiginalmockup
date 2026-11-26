"use strict";

const images = {
  head: "./assets/head.jpg",
  frog: "./assets/frog.jpg",
  qr: "./assets/qr.png",
};

const iconPaths = {
  chevL: '<path d="M15 18l-6-6 6-6"/>',
  chevR: '<path d="M9 6l6 6-6 6"/>',
  dots: '<circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  shield:
    '<path d="M12 3l7 2.8V11c0 4.6-3 8-7 10-4-2-7-5.4-7-10V5.8z"/><path d="M9 12l2 2 4-4"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  star: '<path d="m12 3 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2-4.6-4.4 6.3-.9z"/>',
  sort: '<path d="M6 4v15m-3-3 3 3 3-3M12 6h9m-9 5h6m-6 5h3"/>',
  arrows: '<path d="M4 8h15l-4-4M20 16H5l4 4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM19 14h1M14 19v1M17.5 17.5h2.5v2.5h-2.5z"/>',
  scan: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M8 12h8"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
  phone:
    '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  idcard:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14.5 10h4M14.5 13.5h3"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  sliders:
    '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  logout:
    '<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9"/>',
  upload:
    '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>',
  note: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  bow: '<path d="M4.5 19.5L19.5 4.5M4.5 19.5l.8-3.2M17.2 4.7l2.3-.2-.2 2.3"/>',
  camera:
    '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  spark:
    '<path d="M12 4c.8 4.2 3.8 7.2 8 8-4.2.8-7.2 3.8-8 8-.8-4.2-3.8-7.2-8-8 4.2-.8 7.2-3.8 8-8z"/>',
  warn: '<path d="M12 4L2.5 20h19z"/><path d="M12 10v4.5M12 17.5v.3"/>',
  face: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 9.5v1M15 9.5v1M12 9.5v3.5h-1M9.5 15.5c1.5 1.2 3.5 1.2 5 0"/>',
  share:
    '<path d="M12 15V4M8 8l4-4 4 4M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0 5 5l-8.9 8.9a2.1 2.1 0 0 1-3-3l8.9-8.9a4 4 0 0 0-2-2z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
};
const icon = (n, s = 22, w = 1.8) => /* HTML */ `
  <svg
    width="${s}"
    height="${s}"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="${w}"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${iconPaths[n]}
  </svg>
`;
const escapeHtml = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const initials = (u) => (u.first[0] + u.last[0]).toUpperCase();
const nav = (l, r, t = " ", flow) => /* HTML */ `
  <div class="nav${flow ? " flow" : ""}">
    ${
      l
        ? /* HTML */ `
            <button
              class="circ"
              data-act="${l[0]}"
              aria-label="${l[2] || "Zurück"}"
            >
              ${icon(l[1])}
            </button>
          `
        : "<span></span>"
    }
    <span class="navt">${t}</span>
    ${
      r
        ? /* HTML */ `
            <button
              class="circ${r[3] ? " go" : ""}"
              data-act="${r[0]}"
              aria-label="${r[2]}"
            >
              ${icon(r[1])}
            </button>
          `
        : '<span style="width:44px"></span>'
    }
  </div>
`;
const field = (k, label, ph, type = "text", extra = "") => /* HTML */ `
  <div class="field${formErrors[k] ? " err" : ""}">
    <label for="f_${k}">${label}</label>
    <input
      id="f_${k}"
      data-f="${k}"
      type="${type}"
      placeholder="${escapeHtml(ph)}"
      value="${escapeHtml(form[k] || "")}"
      ${extra}
    />
  </div>
`;
const errline = (k) =>
  formErrors[k]
    ? /* HTML */ `
        <div class="errmsg">${escapeHtml(formErrors[k])}</div>
      `
    : "";
const badge = (b) =>
  b.status === "draft"
    ? '<span class="badge q">Entwurf</span>'
    : '<span class="badge">Verifiziert</span>';
function bowRow(
  bow,
  metadata,
  status,
  { action = "openBow", badgeBelow = false } = {},
) {
  return /* HTML */ `
    <button
      class="bowrow"
      data-act="${action}"
      data-arg="${escapeHtml(bow.id)}"
    >
      <span
        class="thumb"
        style="background-image:url(${images[bow.img]})"
      ></span>
      <span class="tx">
        <span class="nm">${escapeHtml(bow.name)}</span>
        <span class="fn">${escapeHtml(metadata)}</span>
        ${badgeBelow ? status : ""}
      </span>
      ${badgeBelow ? "" : status}
      <span class="chev">${icon("chevR", 16)}</span>
    </button>
  `;
}
const kvs = (b) =>
  [
    ["Holzart", b.wood],
    ["Baujahr", b.year],
    ["Seriennummer", b.serial],
    [
      "Gewicht · Länge",
      [b.weight, b.length].filter((x) => x && x !== "—").join(" · ") || "—",
    ],
    ["Wicklung", b.wind || "—"],
  ]
    .map(
      ([k, v]) => /* HTML */ `
        <div class="kv">
          <span>${k}</span>
          <span>${escapeHtml(v)}</span>
        </div>
      `,
    )
    .join("");
const cites = () => /* HTML */ `
  <div class="cites">
    ${icon("shield", 20)}
    <span>Enthält keine Teile von Arten, die durch CITES geschützt sind.</span>
  </div>
`;
function bowPhotoPair() {
  return /* HTML */ `
    <span class="photo" style="background-image:url(${images.head})"></span>
    <span class="photo f" style="background-image:url(${images.frog})"></span>
  `;
}

function photos(bowId) {
  if (!bowId) {
    return /* HTML */ `
      <div class="photos">${bowPhotoPair()}</div>
    `;
  }
  return /* HTML */ `
    <button
      class="photos"
      data-act="ctrl"
      data-arg="${bowId}"
      aria-label="Kontrollansicht öffnen"
    >
      ${bowPhotoPair()}
    </button>
  `;
}

const timeline = (b) => /* HTML */ `
  <div class="card tl" id="hist">
    ${b.hist
      .map(
        (e, i) => /* HTML */ `
          <div class="ev">
            <div class="rail">
              <span class="dot${i ? "" : " on"}">${icon(e.ic, 16)}</span>
              <span class="line"></span>
            </div>
            <div class="evt">
              <span class="cap">${escapeHtml(e.d)}</span>
              <span class="hl">${escapeHtml(e.s)}</span>
              <span class="fn">${escapeHtml(e.t)}</span>
            </div>
          </div>
        `,
      )
      .join("")}
  </div>
`;
const seal = () => /* HTML */ `
  <svg class="seal" viewBox="0 0 242 243" aria-hidden="true">
    <defs>
      <path id="sc" d="M121 121m-96 0a96 96 0 1 1 192 0a96 96 0 1 1-192 0" />
    </defs>
    <circle
      cx="121"
      cy="121"
      r="118"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
    />
    <circle
      cx="121"
      cy="121"
      r="80"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
    />
    <text
      font-family="Vollkorn,serif"
      font-size="15"
      letter-spacing="2.4"
      fill="currentColor"
    >
      <textPath href="#sc">
        BOGENBAU MUSTERWERKSTATT · BOGENBAUMEISTER · BERLIN ·
      </textPath>
    </text>
    <g fill="none" stroke="currentColor" stroke-width="1.6">
      <rect x="78" y="88" width="56" height="64" />
      <rect x="110" y="72" width="46" height="66" />
      <path d="M62 170L182 92M70 172l-6 2 2-6" />
    </g>
  </svg>
`;
const docRows = (b) => /* HTML */ `
  <div class="card">
    <button
      class="row"
      data-act="doc"
      data-arg="Declaration of Materials|${b.id}"
    >
      ${icon("doc")}
      <span class="lbl">Declaration of Materials</span>
      <span class="chev">${icon("chevR", 16)}</span>
    </button>
    <button class="row" data-act="doc" data-arg="Expertise|${b.id}">
      ${icon("doc")}
      <span class="lbl">Expertise</span>
      <span class="val">PDF</span>
      <span class="chev">${icon("chevR", 16)}</span>
    </button>
  </div>
`;
const sheetHead = (t) => /* HTML */ `
  <div class="grab"></div>
  <div class="shead">
    <h2 class="ti" id="sheet-title" style="font-size:22px">${t}</h2>
    <button
      class="circ"
      type="button"
      data-act="closeOverlay"
      aria-label="Schließen"
    >
      ${icon("x")}
    </button>
  </div>
`;
