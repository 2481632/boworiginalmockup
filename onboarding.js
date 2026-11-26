"use strict";

const onboarding = {
  welcome: () => ({
    cls: "white welcome",
    html: /* HTML */ `
      <div class="wtop">
        <span class="eyebrow">Digitaler Bogenpass</span>
        <div class="wcard">
          <div class="top">
            <span class="bp">BOGENPASS</span>
            <span class="id">BGP-8F4A-291C</span>
          </div>
          <div class="mid">
            <span
              class="pic"
              style="background-image:url(${images.head})"
            ></span>
            <div>
              <div class="k">Bezeichnung</div>
              <div class="v">Violinbogen V-01</div>
              <div class="k">Holzart · Baujahr</div>
              <div class="v">Pernambuk · 2026</div>
            </div>
          </div>
          <div class="ok">${icon("shield", 18)} Frei von CITES-Materialien</div>
          <div class="mrz">
            BGP&lt;DEU&lt;VIOLINBOGEN&lt;&lt;V01&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            <br />
            8F4A291C&lt;2026&lt;PERNAMBUK&lt;&lt;BERLIN&lt;&lt;&lt;&lt;&lt;
          </div>
          <svg class="stamp" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <path
                id="st"
                d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0"
              />
            </defs>
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="rgba(255,255,255,.55)"
              stroke="currentColor"
              stroke-width="2"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            />
            <path
              d="M44 30l4 4 8-8"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <text
              x="50"
              y="54"
              text-anchor="middle"
              font-family="Vollkorn,serif"
              font-size="15"
              letter-spacing="1"
              fill="currentColor"
            >
              GEPRÜFT
            </text>
            <text
              x="50"
              y="70"
              text-anchor="middle"
              font-family="Vollkorn,serif"
              font-size="10"
              fill="currentColor"
            >
              FRA · 21.09.26
            </text>
          </svg>
        </div>
      </div>
      <div class="wbody">
        <h1>Ein Pass für Ihren Bogen.</h1>
        <p class="callout">
          Damit Ihr Bogen sicher über jede Grenze reist. Herkunft und
          Materialien fälschungssicher nachgewiesen, am Zoll in Sekunden
          geprüft.
        </p>
      </div>
      <div class="wact">
        <button class="btn pri" data-act="toSignup">Konto erstellen</button>
        <button class="btn sec" data-act="toLogin">Anmelden</button>
      </div>
    `,
  }),

  login: () => ({
    html: /* HTML */ `
      ${nav(["back", "chevL"], null, " ", 1)}
      <form class="content" data-submit="doLogin" novalidate>
        <div>
          <div class="eyebrow">Willkommen zurück</div>
          <h1 class="lt">Anmelden</h1>
        </div>
        <div class="group" style="gap:10px">
          <div class="card">
            ${field("email", "E-Mail", "name@beispiel.de", "email", 'autocomplete="username"')}${field("pw", "Passwort", "Passwort eingeben", "password", 'autocomplete="current-password"')}
          </div>
          ${
            formErrors._
              ? /* HTML */ `
                  <div class="errmsg" style="margin:0">
                    ${escapeHtml(formErrors._)}
                  </div>
                `
              : ""
          }
          <div style="text-align:right;padding-right:4px">
            <button type="button" class="link" data-act="forgot">
              Passwort vergessen?
            </button>
          </div>
        </div>
        <div class="stack">
          <button class="btn pri" type="submit">Anmelden</button>
          <div style="display:flex;align-items:center;gap:12px">
            <i style="flex:1;height:1px;background:var(--sep)"></i>
            <span class="fn" style="color:var(--t3)">oder</span>
            <i style="flex:1;height:1px;background:var(--sep)"></i>
          </div>
          <button type="button" class="btn sec" data-act="passkey">
            ${icon("face", 20)} Mit Passkey anmelden
          </button>
        </div>
        <p
          class="fn"
          style="text-align:center;font-size:15px;line-height:20px;margin:0"
        >
          Noch kein Konto?
          <button type="button" class="link" data-act="toSignup">
            Konto erstellen
          </button>
        </p>
      </form>
    `,
  }),

  signup: () => ({
    html: /* HTML */ `
      ${nav(["back", "chevL"], null, "Schritt 1 von 2", 1)}
      <form class="content" data-submit="signupNext" novalidate>
        <div class="prog">
          <i class="on"></i>
          <i></i>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <h1 class="lt">Konto erstellen</h1>
          <p class="callout">
            Ihre Angaben werden nur für den Bogenpass verwendet.
          </p>
        </div>
        <div class="group">
          <div class="sh">Person</div>
          <div class="card">
            ${field("first", "Vorname", "Vorname", "text", 'autocomplete="given-name"')}${field("last", "Nachname", "Nachname", "text", 'autocomplete="family-name"')}
          </div>
        </div>
        <div class="group">
          <div class="sh">Zugang</div>
          <div class="card">
            ${field("email", "E-Mail", "name@beispiel.de", "email", 'autocomplete="email"')}${field("pw", "Passwort", "Mindestens 8 Zeichen", "password", 'autocomplete="new-password"')}${field("pw2", "Passwort wiederholen", "Passwort wiederholen", "password", 'autocomplete="new-password"')}
          </div>
        </div>
        ${
          formErrors._
            ? /* HTML */ `
                <div class="errmsg" style="margin:0">
                  ${escapeHtml(formErrors._)}
                </div>
              `
            : ""
        }
        <button class="btn pri" type="submit">Weiter</button>
      </form>
    `,
  }),

  role: () => ({
    html: /* HTML */ `
      ${nav(["back", "chevL"], null, "Schritt 2 von 2", 1)}
      <div class="content" style="gap:22px">
        <div class="prog">
          <i class="on"></i>
          <i class="on"></i>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <h1 class="lt">Ihre Rolle</h1>
          <p class="callout">
            Wählen Sie, wie Sie den Bogenpass nutzen.
            ${form.role === "musiker" ? "Als Musikerin oder Musiker benötigen Sie keinen Rollennachweis." : "Ihr Nachweis wird vor der Freischaltung geprüft."}
          </p>
        </div>
        <div
          class="group"
          style="gap:10px"
          role="radiogroup"
          aria-label="Rolle"
        >
          ${ROLES.map(
            ([k, t, s, ic]) => /* HTML */ `
              <button
                class="role${form.role === k ? " on" : ""}"
                role="radio"
                aria-checked="${form.role === k}"
                data-act="pickRole"
                data-arg="${k}"
              >
                <span class="tile">${icon(ic)}</span>
                <span class="tx">
                  <span class="hl">${t}</span>
                  <span class="fn">${s}</span>
                </span>
                <span class="radio">
                  ${form.role === k ? icon("check", 16, 2.2) : ""}
                </span>
              </button>
            `,
          ).join("")}
        </div>
        ${
          form.role !== "musiker"
            ? /* HTML */ `
                <div class="group">
                  <div class="sh">Nachweis</div>
                  <button
                    class="upload${form.proof ? " done" : ""}${formErrors.proof ? " err" : ""}"
                    data-act="upload"
                  >
                    <span class="tile a">
                      ${icon(form.proof ? "doc" : "upload")}
                    </span>
                    <span class="tx">
                      ${
                        form.proof === 1
                          ? '<span class="hl" style="font-family:var(--sans);color:var(--acc)">Wird hochgeladen …</span><span class="fn">Bitte kurz warten</span>'
                          : form.proof
                            ? /* HTML */ `
                                <span style="font-weight:600">
                                  ${escapeHtml(form.proof)}
                                </span>
                                <span class="fn">
                                  Hochgeladen · tippen zum Ersetzen
                                </span>
                              `
                            : /* HTML */ `
                                <span style="font-weight:600;color:var(--acc)">
                                  Nachweis hochladen
                                </span>
                                <span class="fn">
                                  ${{ bauer: "Meisterbrief", grenze: "Dienstausweis", musiker: "Orchester- oder Hochschulausweis" }[form.role]}
                                  o. Ä.
                                </span>
                              `
                      }
                    </span>
                    ${
                      form.proof && form.proof !== 1
                        ? /* HTML */ `
                            <span class="badge">${icon("check", 14, 2.2)}</span>
                          `
                        : ""
                    }
                  </button>
                </div>
                ${
                  formErrors.proof
                    ? /* HTML */ `
                        <div class="errmsg">
                          ${escapeHtml(formErrors.proof)}
                        </div>
                      `
                    : ""
                }
              `
            : ""
        }
        <button class="btn pri" data-act="register">Registrieren</button>
      </div>
    `,
  }),

  pending: () => {
    const u = user();
    return {
      html: /* HTML */ `
        ${nav(null, null, " ", 1)}
        <div class="content" style="padding-top:30px">
          <div class="center">
            <span class="tile w big">${icon("clock", 28)}</span>
            <div class="eyebrow w">Nachweis eingereicht</div>
            <h1 class="ti">Prüfung ausstehend</h1>
            <p class="callout">
              Wir prüfen Ihren Nachweis als ${escapeHtml(roleLabel(u.role))}.
              Sie erhalten eine E-Mail an ${escapeHtml(u.email)}, sobald Ihr
              Konto freigeschaltet ist.
            </p>
          </div>
          <div class="card">
            <div class="kv ln">
              <span>Rolle</span>
              <span>${escapeHtml(roleLabel(u.role))}</span>
            </div>
            <div class="kv ln">
              <span>Nachweis</span>
              <span>${escapeHtml(u.file || "nachweis.pdf")}</span>
            </div>
            <div class="kv">
              <span>Status</span>
              <span class="badge w">In Prüfung</span>
            </div>
          </div>
          <div class="demoBox">
            <span class="fn">Nur im Prototyp: Prüfergebnis simulieren</span>
            <div class="two">
              <button class="btn pri" data-act="approve">
                ${icon("check", 18, 2)} Genehmigen
              </button>
              <button class="btn dan" data-act="reject">
                ${icon("x", 18, 2)} Ablehnen
              </button>
            </div>
          </div>
          <button class="btn lnk" data-act="logout">Abmelden</button>
        </div>
      `,
    };
  },

  rejected: () => ({
    html: /* HTML */ `
      ${nav(null, null, " ", 1)}
      <div class="content" style="padding-top:30px">
        <div class="center">
          <span class="tile d big">${icon("x", 28)}</span>
          <div class="eyebrow d">Nachweis abgelehnt</div>
          <h1 class="ti">Bitte neu einreichen</h1>
          <p class="callout">Ihr Nachweis konnte nicht bestätigt werden.</p>
        </div>
        <div class="info d">
          ${icon("warn", 20)}
          <span>
            Das Dokument ist nicht lesbar oder der Name stimmt nicht mit Ihrem
            Konto überein.
          </span>
        </div>
        <button class="btn pri" data-act="reupload">
          ${icon("upload", 20)} Neuen Nachweis hochladen
        </button>
        <button class="btn lnk" data-act="logout">Abmelden</button>
      </div>
    `,
  }),
};

const validEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v || "");

const onboardingActions = {
  toLogin() {
    setForm({ email: "anna.wagner@example.de" });
    go("login");
  },
  toSignup() {
    setForm({ role: "bauer" });
    go("signup");
  },
  forgot() {
    validEmail(form.email)
      ? toast("Link zum Zurücksetzen gesendet")
      : (setErrors({ email: 1, _: "Bitte zuerst Ihre E-Mail eingeben." }),
        draw());
  },
  doLogin() {
    clearErrors();
    const e = (form.email || "").trim().toLowerCase();
    if (!validEmail(e)) formErrors.email = "E-Mail";
    if (!form.pw) formErrors.pw = "Passwort";
    if (Object.keys(formErrors).length) {
      formErrors._ = "Bitte E-Mail und Passwort eingeben.";
      return draw();
    }
    const known = Object.entries(ACCOUNTS).find(([, a]) => a.email === e);
    if (state.registered && state.registered.email === e) {
      state.user = state.registered;
      return reset(
        state.user.proof === "ok" || state.user.proof === "not_required"
          ? HOME[state.user.role]
          : state.user.proof === "rejected"
            ? "rejected"
            : "pending",
      );
    }
    if (!known) {
      setErrors({ email: 1, _: "Kein Konto mit dieser E-Mail gefunden." });
      return draw();
    }
    startAs(known[0]);
  },
  passkey() {
    toast("Passkey erkannt");
    setTimeout(() => startAs("musiker"), 500);
  },
  signupNext() {
    clearErrors();
    ["first", "last"].forEach((k) => {
      if (!(form[k] || "").trim()) formErrors[k] = 1;
    });
    if (!validEmail(form.email)) formErrors.email = 1;
    if ((form.pw || "").length < 8) formErrors.pw = 1;
    if (form.pw !== form.pw2 || !form.pw2) formErrors.pw2 = 1;
    if (Object.keys(formErrors).length) {
      formErrors._ = formErrors.pw
        ? "Das Passwort braucht mindestens 8 Zeichen."
        : formErrors.pw2
          ? "Die Passwörter stimmen nicht überein."
          : formErrors.email
            ? "Bitte eine gültige E-Mail-Adresse eingeben."
            : "Bitte Vor- und Nachnamen angeben.";
      return draw();
    }
    form.role = form.role || "bauer";
    go("role");
  },
  pickRole(r) {
    if (form.role !== r) form.proof = null;
    form.role = r;
    delete formErrors.proof;
    draw();
  },
  upload() {
    if (form.proof === 1) return;
    const role = form.role;
    form.proof = 1;
    delete formErrors.proof;
    draw();
    setTimeout(() => {
      if (form.role !== role) return;
      form.proof = { bauer: "meisterbrief.pdf", grenze: "dienstausweis.pdf" }[
        role
      ];
      if (currentScreen().name === "role") draw();
    }, 900);
  },
  register() {
    const requiresProof = form.role !== "musiker";
    if (requiresProof && (!form.proof || form.proof === 1)) {
      formErrors.proof = "Bitte laden Sie einen Nachweis hoch.";
      return draw();
    }
    const a = ACCOUNTS[form.role];
    state.user = state.registered = {
      first: form.first.trim(),
      last: form.last.trim(),
      email: form.email.trim().toLowerCase(),
      phone: "—",
      place: [a.place[0], "—"],
      label: roleLabel(form.role),
      since: today(),
      role: form.role,
      proof: requiresProof ? "pending" : "not_required",
      file: requiresProof ? form.proof : null,
    };
    reset(requiresProof ? "pending" : HOME[form.role]);
  },
  approve() {
    state.user.proof = "ok";
    reset(HOME[state.user.role]);
    toast("Nachweis genehmigt – Konto freigeschaltet");
  },
  reject() {
    state.user.proof = "rejected";
    reset("rejected");
  },
  reupload() {
    setForm({
      role: state.user.role,
      first: state.user.first,
      last: state.user.last,
      email: state.user.email,
    });
    reset("role");
  },
  logout() {
    state.user = null;
    setForm({});
    reset("welcome");
  },
};
