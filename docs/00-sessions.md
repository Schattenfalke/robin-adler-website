# 00 — Phasenplan & Aufgabentexte

Sieben Phasen, jede eine eigene Cloud-Sitzung. Der Text unter "Aufgabe" ist zum
direkten Kopieren gedacht.

**Vor jeder Sitzung**: lokale Änderungen pushen. Die Cloud-Sitzung klont das
GitHub-Repository am aktuellen Branch — nicht deine lokale Kopie. Was nicht
gepusht ist, existiert für die Sitzung nicht.

**Nach jeder Sitzung**: Pull Request auf claude.ai/code öffnen, Diff durchsehen,
mergen. Erst dann die nächste Phase starten. Sequenziell arbeiten, nicht parallel —
mehrere Sitzungen auf derselben jungen Codebase erzeugen Merge-Konflikte statt Tempo.

---

## Phase 1 — Gerüst

**Aufgabe:**

> Lies CLAUDE.md und docs/01-architektur.md.
>
> Lege das Projektgerüst an: Vite + React 19 + TypeScript (strict) + Tailwind CSS.
> Richte i18next mit den Sprachen de und en ein, Routing über react-router mit
> /de und /en als Präfix, / leitet auf /de um.
>
> Erstelle leere Seitenkomponenten für: Startseite, build, fix, review, impressum,
> datenschutz, 404. Jede enthält vorerst nur eine Überschrift.
>
> Lege die Design-Tokens aus CLAUDE.md als CSS-Variablen in src/styles/globals.css
> an und binde sie in die Tailwind-Konfiguration ein.
>
> Keine Animationen, kein Three.js, keine Inhalte. Nur das Gerüst.
>
> Prüfe am Ende, dass npm run build ohne Warnungen durchläuft.

**Fertig wenn:** Build läuft, alle Routen erreichbar, Sprachumschaltung funktioniert.

### Nachtrag zu Phase 1

Falls Phase 1 bereits gelaufen ist, diese Punkte nachziehen:

> Lies docs/01-architektur.md, Abschnitt "Routing & Prerendering".
>
> Stelle den Build auf Prerendering um: eine echte HTML-Datei pro Route.
> Lege src/lib/routes.ts als einzige Routenquelle an. Entferne public/_redirects,
> falls vorhanden — das ist Netlify-Syntax und auf GitHub Pages wirkungslos.
> Lege stattdessen public/CNAME mit dem Inhalt robin-adler.de an.
>
> Prüfe, dass keine Next.js-Importe im Code stehen. Falls doch: next/head durch
> react-helmet-async ersetzen, next/router durch react-i18next bzw. react-router.
>
> Prüfe, dass `motion` installiert ist und nicht zusätzlich `framer-motion` —
> das ist dasselbe Paket unter altem Namen.

---

## Phase 2 — Recht & Grundlagen

Bewusst früh. Rechtstexte nachträglich einzubauen ist mühsamer, und die Seite ist
ohne sie nicht veröffentlichbar.

**Aufgabe:**

> Lies CLAUDE.md und docs/04-legal.md.
>
> Baue: Impressum und Datenschutzerklärung als Seiten in beiden Sprachen, das
> Consent-Modul src/lib/consent.ts, den Cookie-Banner mit gleichwertigen Buttons,
> das Analytics-Modul src/lib/analytics.ts mit dynamischem Nachladen, den Footer
> mit Links auf Impressum, Datenschutz und "Cookie-Einstellungen ändern".
>
> Ergänze Meta-Tags, OpenGraph, Schema.org, robots.txt und sitemap.xml.
>
> Entscheidend: Es darf vor dem Klick auf "Einverstanden" keinen einzigen Request
> an googletagmanager.com geben. Weise nach, dass das so ist.
>
> Echte Adresse und Telefonnummer sind noch nicht bekannt — setze klar markierte
> TODO-Platzhalter. Keine USt-ID, das Feld entfällt vollständig.

**Fertig wenn:** Inkognito-Fenster, Netzwerk-Tab, kein GA-Request vor Zustimmung.

---

## Phase 3 — Die drei Türen (statisch)

**Aufgabe:**

> Lies CLAUDE.md und docs/02-seiten.md, Abschnitt zur Startseite.
>
> Baue die Hero-Sektion mit den drei Türen BUILD, FIX und REVIEW als SVG-Komponenten.
> Jede Tür ist klickbar und führt auf die jeweilige Unterseite. Hover-Zustand mit
> rotem Akzent.
>
> Baue die Navigation: sticky Header mit Logo, den drei Bereichen, Kontakt und
> Sprachumschalter. Auf Mobil ein Hamburger-Menü.
>
> Noch keine 3D-Szene und keine Story-Animationen. Einfache Ein- und
> Ausblendübergänge sind erlaubt, mehr nicht.

**Fertig wenn:** Die drei Türen sehen gut aus und funktionieren auf Mobil und Desktop.

---

## Phase 4 — BUILD komplett

Die erste Bereichsseite vollständig, als Muster für die beiden anderen.

**Aufgabe:**

> Lies CLAUDE.md, docs/02-seiten.md und docs/03-animationen.md.
>
> Baue die BUILD-Seite vollständig: Überschrift, die Story-Animation
> Code → Website, ein Call-to-Action, drei Case-Karten mit Modal für Details.
>
> Die Animation startet bei useInView und respektiert prefers-reduced-motion.
>
> Für die Case-Inhalte und das Video noch keine echten Daten verwenden — lege
> die Datenstruktur in src/lib/cases.ts an und fülle sie mit klar als TODO
> markierten Platzhaltern.

**Fertig wenn:** Die Animation läuft flüssig, auch auf dem Handy. Kein Ruckeln.

Halte hier an und sieh dir das Ergebnis in Ruhe an, bevor du weitermachst. Was hier
nicht überzeugt, wird durch zwei weitere Kopien davon nicht besser.

---

## Phase 5 — FIX und REVIEW

**Aufgabe:**

> Lies CLAUDE.md, docs/02-seiten.md und docs/03-animationen.md.
>
> Baue die Seiten FIX und REVIEW nach demselben Muster wie BUILD.
>
> FIX: Warnsymbol, das über eine Ladephase in einen grünen Haken übergeht.
> REVIEW: Lupe über Code-Zeilen, die nacheinander grün, gelb oder rot markiert
> werden, danach eine Auswertung.
>
> Verwende dieselben Komponenten wie auf der BUILD-Seite, wo immer das möglich ist.
> Doppelten Code vermeiden.

---

## Phase 6 — 3D-Szene & Kontaktformular

**Aufgabe:**

> Lies CLAUDE.md, docs/02-seiten.md und docs/03-animationen.md.
>
> Baue die Three.js-Datenfluss-Szene für die Startseite: dunkles Drahtgitter-Objekt,
> rote Partikel, langsame Eigenrotation, leichte Reaktion auf die Mausposition.
> Bei prefers-reduced-motion ein statisches Standbild ausliefern.
>
> Baue das Kontaktformular mit Honeypot-Feld und Datenschutz-Checkbox. Ziel ist
> die Umgebungsvariable VITE_CONTACT_API.
>
> Lege die Datei php-endpoint/contact.php im Repo ab. Sie wird nicht von hier
> deployt, sondern manuell hochgeladen — dokumentiere das in einer README daneben.
>
> Achte auf das Performance-Budget: Three.js gehört in einen eigenen Chunk und
> wird per lazy loading nachgeladen.

---

## Phase 7 — Go-Live

**Aufgabe:**

> Lies CLAUDE.md und docs/05-deployment.md.
>
> Richte den GitHub-Actions-Workflow für das Deployment auf GitHub Pages ein,
> lege die CNAME-Datei an, optimiere den Build (Chunking, Kompression, Preloading
> der Schriften).
>
> Prüfe ausdrücklich: Ruft man eine Unterseite direkt auf, kommt HTTP 200 und
> nicht 404. Die 404.html ist eine echte Fehlerseite, kein Routing-Hack.
>
> Arbeite die Go-Live-Checkliste aus docs/05-deployment.md Punkt für Punkt ab und
> gib mir am Ende eine Liste dessen, was ich selbst erledigen muss.

---

## Was Robin selbst erledigt

Diese Dinge kann keine Cloud-Sitzung übernehmen:

- Higgsfield-Videos erzeugen und nach `public/assets/` legen
- Schriften herunterladen und nach `public/fonts/` legen
- Case-Inhalte schreiben — Problem, Lösung, Ergebnis je Case
- `contact.php` per FTP auf das Shared Hosting laden und testen
- DNS setzen: CNAME für die Hauptdomain, A-Record für die Mail-Subdomain
- SPF und DMARC eintragen, sonst landen die Formularmails im Spam
- GA4-Konto einrichten: AVV akzeptieren, Aufbewahrung auf 2 Monate, Google Signals aus
- Search Console verifizieren und Sitemap einreichen
- Echte Adressdaten ins Impressum eintragen
