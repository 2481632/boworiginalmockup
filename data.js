"use strict";

const ACCOUNTS = {
  musiker: {
    first: "Anna",
    last: "Wagner",
    email: "anna.wagner@example.de",
    phone: "+49 176 76543210",
    place: ["Ort", "München, Deutschland"],
    label: "Musikerin",
    since: "20.04.2026",
  },
  grenze: {
    first: "Martin",
    last: "Schneider",
    email: "martin.schneider@zoll.de",
    phone: "+49 176 76543210",
    place: ["Dienststelle", "Flughafen Frankfurt T1"],
    label: "Grenzkontrolle",
    since: "20.04.2026",
  },
  bauer: {
    first: "Max",
    last: "Mustermann",
    email: "werkstatt@example.de",
    phone: "+49 30 1234567",
    place: ["Werkstatt", "Bogenbau Musterwerkstatt, Berlin"],
    label: "Bogenbauer",
    since: "02.02.2026",
  },
};
const ROLES = [
  ["bauer", "Bogenbauer", "Bogenpässe ausstellen", "bow"],
  ["grenze", "Grenzkontrolle", "Bögen scannen und Nachweise prüfen", "idcard"],
  ["musiker", "Musiker", "Reisefertigkeit eigener Bögen", "note"],
];
const HOME = { musiker: "m_home", grenze: "g_home", bauer: "b_home" };
const MAKER = "Bogenbau Musterwerkstatt";
const historyEntry = (d, s, t, ic) => ({ d, s, t, ic });
function bow(id, name, wood, year, serial, img, status, extra = {}) {
  return Object.assign(
    {
      id,
      name,
      wood,
      year,
      // Bei Beispieldaten entspricht das Erstellungsdatum standardmäßig dem Datum der Registrierung.
      createdAt: Date.UTC(Number(year), 5, 15),
      serial,
      img,
      status,
      maker: MAKER,
      pass:
        "BGP-" +
        ((parseInt(serial.replace(/\D/g, "")) * 7919) % 65536)
          .toString(16)
          .toUpperCase()
          .padStart(4, "0") +
        "-" +
        ((parseInt(serial.slice(-4)) * 31) % 4096)
          .toString(16)
          .toUpperCase()
          .padStart(3, "0") +
        "A",
      weight: "61,5 g",
      length: "74,5 cm",
      wind: "Silberdraht",
      owner: "Anna Wagner",
      hist: [
        historyEntry(
          "15.06." + year,
          "Bogenpass ausgestellt",
          "Bogen analysiert und eindeutig erkannt",
          "doc",
        ),
        historyEntry("15.06." + year, "Registriert", MAKER, "plus"),
      ],
    },
    extra,
  );
}
function seed() {
  const bows = {
    v01: bow(
      "v01",
      "Violinbogen V-01",
      "Pernambuk",
      "2026",
      "BP-2026-004812",
      "head",
      "ok",
      {
        pass: "BGP-8F4A-291C",
        hist: [
          historyEntry(
            "20.10.2026",
            "Besitz übertragen",
            "An Anna Wagner",
            "arrows",
          ),
          historyEntry(
            "03.10.2026",
            "Identifikation",
            "Übereinstimmung 99 %",
            "search",
          ),
          historyEntry(
            "21.09.2026",
            "Grenzkontrolle bestanden",
            "Flughafen Frankfurt, Deutschland",
            "shield",
          ),
          historyEntry(
            "04.07.2026",
            "Besitz übertragen",
            "An Max Mustermann",
            "arrows",
          ),
          historyEntry(
            "15.06.2026",
            "Bogenpass ausgestellt",
            "Bogen analysiert und eindeutig erkannt",
            "doc",
          ),
          historyEntry("15.06.2026", "Registriert", MAKER, "plus"),
        ],
      },
    ),
    c12: bow(
      "c12",
      "Konzert-Violinbogen C-12",
      "Pernambuk",
      "2025",
      "BP-2025-003491",
      "frog",
      "ok",
      { weight: "60,8 g" },
    ),
    h15: bow(
      "h15",
      "Bratschenbogen H-15",
      "Pernambuk",
      "2022",
      "BP-2022-000763",
      "head",
      "ok",
      { weight: "70,2 g", length: "74,0 cm" },
    ),
    o07: bow(
      "o07",
      "Orchesterbogen O-07",
      "Brasilholz",
      "2024",
      "BP-2024-002210",
      "head",
      "ok",
      { owner: "Orchester Musterstadt" },
    ),
    s03: bow(
      "s03",
      "Solistenbogen S-03",
      "Pernambuk",
      "2025",
      "BP-2025-001187",
      "frog",
      "ok",
      { owner: "Lea Beispiel" },
    ),
    m21: bow(
      "m21",
      "Meisterbogen M-21",
      "Carbon",
      "2023",
      "BP-2023-000954",
      "head",
      "ok",
      { owner: "Jonas Probe" },
    ),
    d02: bow(
      "d02",
      "Bratschenbogen B-02",
      "Pernambuk",
      "2026",
      "BP-2026-005020",
      "frog",
      "draft",
      {
        owner: "—",
        createdAt: Date.UTC(2026, 10, 11),
        hist: [historyEntry("11.11.2026", "Entwurf angelegt", MAKER, "plus")],
      },
    ),
  };
  return {
    bows,
    user: null,
    scanResult: "ok",
    ownedBowIds: ["v01", "c12", "h15"],
    workshopBowIds: ["v01", "c12", "o07", "s03", "m21", "d02"],
    checks: [
      { bow: "v01", t: "14:32", ok: true },
      { bow: "m21", t: "14:05", ok: true },
      { bow: null, t: "13:48", ok: false },
    ],
    stats: { n: 132, ok: 128 },
    flash: false,
  };
}
const roleLabel = (r) =>
  ({ musiker: "Musiker", grenze: "Grenzkontrolle", bauer: "Bogenbauer" })[r];

const state = seed();
const form = {};
const formErrors = {};
const user = () => state.user;
const today = () => new Date().toLocaleDateString("de-DE");
const now = () =>
  new Date().toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

function clearErrors() {
  for (const key of Object.keys(formErrors)) delete formErrors[key];
}

function setForm(values = {}) {
  for (const key of Object.keys(form)) delete form[key];
  Object.assign(form, values);
  clearErrors();
}

function setErrors(values) {
  clearErrors();
  Object.assign(formErrors, values);
}
