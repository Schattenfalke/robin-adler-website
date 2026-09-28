# 02 — Seitenstruktur, Komponenten & Kontaktformular

> **Zweck**: Aufbau aller Seiten, die drei Türen, Case-Cards, Kontaktformular inkl. PHP-Endpoint.
> Diese Datei wird NICHT automatisch geladen. Verweise in der Aufgabenstellung
> ausdrücklich darauf, z.B.: "Lies CLAUDE.md und docs/..., dann ...".

---

## 4. PAGE STRUCTURE & FLOW

### 4.1 Hero / Home Page (`/`)

> **Stand nach der Zwischensitzung „Lichtportale“:** Die SVG-Türen unten sind überholt.
> Verbindlich ist `docs/prototypes/lichtportale.html`, umgesetzt in `src/components/Hero/`
> (`PortalHero`, `usePortalCanvas`, `portalRenderer`). Drei Canvas-Wirbel hinter den Tür-Links,
> Positionen zur Laufzeit aus den DOM-Rechtecken gemessen, Farben aus Tokens
> (`--red-primary`, `--red-light`, `--gold-fix`, `--blue-review`). Tempo nur über `SPEED`.
**Purpose**: Introduce the 3 Doors, let user choose their path.

**Structure**:
```tsx
<Hero>
  <h1>Systeme bauen, die Menschen tragen</h1>
  <p>Nicht Systeme, von denen Menschen getragen werden.</p>
  
  <ThreeDoors>
    {/* 3 interactive SVG doors, each clickable */}
    <Door href="/build" label="BUILD" icon={CodeIcon} description="Neue Systeme, von Grund auf" />
    <Door href="/fix" label="FIX" icon={WrenchIcon} description="Bestehende Systeme verbessern" />
    <Door href="/review" label="REVIEW" icon={MagnifyingGlassIcon} description="Architektur & Code unter der Lupe" />
  </ThreeDoors>

  <DatasFlowScene />
  {/* Three.js: Floating red data nodes, rotating, subtle parallax on mouse move */}
</Hero>
```

**Animations**:
- Doors: Appear on scroll with `slideInLeft/Right` stagger
- 3D Scene: Auto-rotate, respond to mouse (subtle tilt)
- Text: Fade in, stagger letters (optional)

---

### 4.2 BUILD Section (`/build`)

**Story**: Idea → Code → Live Website (Transformation)

**Structure**:
```tsx
<BuildSection>
  <Header>
    <h2>Von der Idee zur Live-Lösung</h2>
    <p>Systeme, die dein Business skalieren, ohne dich zu skalieren.</p>
  </Header>

  <CodeToWebsiteAnimation>
    {/* 
      Step 1: Robin at desk (Higgsfield video or illustration)
      Step 2: Code appears (motion fade-in + syntax highlight)
      Step 3: Code transforms → Live website screenshot (3D flip animation)
      Trigger: On scroll into view
    */}
  </CodeToWebsiteAnimation>

  <CTA>
    <Button href="/contact">Lass mich dein BUILD starten</Button>
  </CTA>

  <CasesGrid>
    {/* 3 BUILD cases: Kurzform */}
    <CaseCard
      title="Done-With-You: Impact OS"
      image={image1}
      description="Von der Vision zur produktiven Systemstruktur in 12 Wochen."
      link="/case/impact-os"
    />
    {/* ... more cases */}
  </CasesGrid>

  <Highlight>
    {/* Higgsfield video: build-hero.mp4 as background or inline player */}
    <video src="/assets/build-hero.mp4" autoPlay muted loop />
  </Highlight>
</BuildSection>
```

**Animations** (motion):
- Code snippet: `initial: { opacity: 0, x: -100 }` → `whileInView: { opacity: 1, x: 0 }`
- Website transform: `codeTransform` preset (3D flip, 1.2s)
- Cases: Stagger in from left, hover: scale + red glow

---

### 4.3 FIX Section (`/fix`)

**Story**: Error → Analysis → Healing

**Structure**:
```tsx
<FixSection>
  <Header>
    <h2>Bestehende Systeme verbessern</h2>
    <p>Performance, Security, Architecture — we fix what hurts.</p>
  </Header>

  <ErrorToSuccessAnimation>
    {/* 
      Step 1: Website with red ⚠️ symbol (pulsing)
      Step 2: Loading bar runs (Higgsfield-generated or CSS animation)
      Step 3: ⚠️ transforms → ✓ green check (motion morph)
      Trigger: On scroll into view
    */}
    <div className="error-state">
      <WarningIcon className="pulse" />
      <WebsitePreview />
    </div>
    <LoadingBar duration={2000} />
    <div className="success-state">
      <CheckmarkIcon className="pop-in" />
      <WebsitePreview optimized={true} />
    </div>
  </ErrorToSuccessAnimation>

  <CTA>
    <Button href="/contact">Lass mich dein System checken</Button>
  </CTA>

  <CasesGrid>
    {/* 2 FIX cases */}
    <CaseCard
      title="Performance Audit → 40% schneller"
      image={image2}
      description="Von 8s Ladezeit zu 2.4s — messbarer Impact."
      link="/case/perf-audit"
    />
    {/* ... */}
  </CasesGrid>

  <Highlight>
    {/* Higgsfield video: fix-hero.mp4 */}
    <video src="/assets/fix-hero.mp4" autoPlay muted loop />
  </Highlight>
</FixSection>
```

**Animations**:
- Error icon: `pulse` keyframe (opacity flicker + scale)
- Loading bar: Width animation 0% → 100% over 2s
- Success icon: Pop-in with `scaleIn` preset
- Cases: Fade in on scroll, hover: border red, shadow red

---

### 4.4 REVIEW Section (`/review`)

**Story**: Code Under Magnifying Glass → Clarity & Classification

**Structure**:
```tsx
<ReviewSection>
  <Header>
    <h2>Architektur & Code unter der Lupe</h2>
    <p>Klarheit über das, was läuft — und was nicht.</p>
  </Header>

  <MagnifyingGlassAnimation>
    {/* 
      Step 1: Robin with magnifying glass examines code (Higgsfield video or illustration)
      Step 2: As he looks, code lines get color-coded:
              - 🟢 Green: "Good, keep it"
              - 🟡 Yellow: "Optimize possible"
              - 🔴 Red: "Critical, must fix"
      Step 3: Final view: Scoreboard with % or traffic light status
      Trigger: On scroll into view
    */}
    <div className="examine-phase">
      <div className="code-snippet">
        {/* Example code from robin-adler.de */}
        <CodeBlock language="typescript" code={`
// ✅ GOOD: Efficient API call with error handling
const useFetchUser = (userId: string) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [userId]);
  return user;
};
        `} />
      </div>
      <MagnifyingGlass>👀</MagnifyingGlass>
    </div>

    <div className="result-phase">
      <ScoreBoard
        score={82}
        breakdown={{
          green: 60,  // % good code
          yellow: 25, // % optimizable
          red: 15,    // % critical
        }}
      />
      <TrafficLight status="mixed" />
    </div>
  </MagnifyingGlassAnimation>

  <CTA>
    <Button href="/contact">Lass mich dein Projekt reviewen</Button>
  </CTA>

  <CasesGrid>
    {/* 2 REVIEW cases */}
    <CaseCard
      title="Security Audit → 3 Critical Fixes"
      image={image3}
      description="SQL Injection Risk, Exposed API Keys, CORS Misconfiguration."
      link="/case/security-audit"
    />
    {/* ... */}
  </CasesGrid>

  <Highlight>
    {/* Higgsfield video: review-hero.mp4 */}
    <video src="/assets/review-hero.mp4" autoPlay muted loop />
  </Highlight>
</ReviewSection>
```

**Animations**:
- Magnifying glass: Zoom in on code (transform: scale 1 → 1.5)
- Color coding: Stagger reveal of green/yellow/red highlights (100ms between each)
- Scoreboard: Counter animation (0 → final % over 1.5s)
- Cases: Slide in from right, hover: rotate glow

---

### 4.5 Navigation & Header

**Sticky Header** (Always accessible):
```tsx
<Header>
  <Logo href="/" text="Robin Adler" />
  
  <Nav>
    <NavLink href="/build">BUILD</NavLink>
    <NavLink href="/fix">FIX</NavLink>
    <NavLink href="/review">REVIEW</NavLink>
    <NavLink href="/#about">About</NavLink>
    <NavLink href="/contact">Contact</NavLink>
  </Nav>

  <LanguageSwitcher current={lang} options={['de', 'en']} />
</Header>
```

**Behavior**:
- On scroll down → header bg becomes darker (opacity increase)
- On scroll up → header returns to transparent
- Mobile: Hamburger menu, full-width overlay

---

### 4.6 Case Detail Pages & Modal

**CaseModal.tsx**:
```tsx
<CaseModal isOpen={open} onClose={onClose} case={caseData}>
  <CaseHeader image={caseData.image} />
  
  <CaseBody>
    <h3>{caseData.title}</h3>
    <div className="meta">
      <span>Category: {caseData.category}</span>
      <span>Year: {caseData.year}</span>
    </div>
    
    <Section title="Problem">
      {caseData.problem}
    </Section>
    
    <Section title="Solution">
      {caseData.solution}
      {/* Embed code snippet from robin-adler.de here */}
      <CodeBlock language="typescript" code={caseData.codeExample} />
    </Section>
    
    <Section title="Result">
      {caseData.result}
      {caseData.metrics && (
        <MetricsList metrics={caseData.metrics} />
      )}
    </Section>
  </CaseBody>
  
  <CaseFooter>
    <CTA href="/contact">Ähnliches für mein Projekt</CTA>
  </CaseFooter>
</CaseModal>
```

**Cases Data Structure** (`src/lib/cases.ts`):
```tsx
export const CASES: Case[] = [
  {
    id: 'impact-os-1',
    door: 'BUILD',
    title: 'Impact OS: Von Chaos zu System',
    shortDescription: 'Solopreneurin mit 10+ Produkten → strukturiertes System in 12 Wochen',
    image: '/assets/case-impact-os.jpg',
    problem: 'Client hat zu viele Ideen, keine Struktur, alles läuft in ihrem Kopf.',
    solution: 'Impact Operating System: Clarity Phase (2w) → Strategy Phase (4w) → Build Phase (6w)',
    codeExample: `
// Example: Simple CRUD for Impact OS projects
const useImpactProject = (projectId: string) => {
  const [project, setProject] = useState(null);
  
  const updateProgress = async (phase: string, percent: number) => {
    const res = await fetch(\`/api/projects/\${projectId}\`, {
      method: 'PATCH',
      body: JSON.stringify({ phase, progress: percent }),
    });
    return res.json();
  };
  
  return { project, updateProgress };
};
    `,
    result: 'Client launched new product in 3 months (vs. 12+ before). Revenue +40%.',
    metrics: [
      { label: 'Time to Market', before: '12+ months', after: '3 months', delta: '-75%' },
      { label: 'Revenue Growth', before: '0€', after: '€18k', delta: '+∞' },
      { label: 'Decision Clarity', before: '20%', after: '85%', delta: '+65%' },
    ],
    year: 2024,
    category: 'BUILD',
    tags: ['System Design', 'Strategy', 'Scaling'],
  },
  // ... more cases
];
```

---

### 4.7 Contact Form (Self-Hosted)

**Frontend** (`components/Forms/ContactForm.tsx`):
```tsx
export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: 'build', // build | fix | review
    privacyAccepted: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.privacyAccepted) {
      alert('Please accept privacy policy.');
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        alert('Message sent! I'll get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '', service: 'build', privacyAccepted: false });
      } else {
        alert('Error sending message. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <input
        type="text"
        name="name"
        placeholder="Dein Name"
        required
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        name="email"
        placeholder="Deine E-Mail"
        required
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Telefon (optional)"
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <select
        name="service"
        value={formData.service}
        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
      >
        <option value="build">BUILD: Neue Systeme</option>
        <option value="fix">FIX: Systeme verbessern</option>
        <option value="review">REVIEW: Architektur-Check</option>
      </select>
      <textarea
        name="message"
        placeholder="Deine Nachricht"
        rows={6}
        required
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      
      <label className="privacy-checkbox">
        <input
          type="checkbox"
          name="privacy"
          checked={formData.privacyAccepted}
          required
          onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
        />
        <span>
          Ich akzeptiere die <a href="/datenschutz">Datenschutzerklärung</a> und verstehe, dass meine Daten
          gemäß DSGVO verarbeitet werden. Meine Nachricht wird nach Beantwortung gelöscht.
        </span>
      </label>

      <button type="submit" className="btn-primary">
        Nachricht senden
      </button>
    </form>
  );
};
```

**Backend** (`php-endpoint/contact.php` — deployed to domain-offensive Shared Hosting, NOT GitHub Pages):

> **Architektur-Hinweis**: GitHub Pages ist reines Static Hosting und kann kein PHP ausführen.
> Der Endpoint liegt deshalb auf dem bestehenden domain-offensive-Hosting, z.B. unter
> `https://mail.robin-adler.de/contact.php` (Subdomain per DNS A-Record auf den Shared Host).
> Das Frontend auf GitHub Pages POSTet cross-origin dorthin — CORS muss deshalb explizit
> auf `https://robin-adler.de` begrenzt werden.

```php
<?php
declare(strict_types=1);

// ===== CORS: nur die eigene Domain =====
$allowedOrigin = 'https://robin-adler.de';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($origin === $allowedOrigin) {
    header("Access-Control-Allow-Origin: {$allowedOrigin}");
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || $origin !== $allowedOrigin) {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ===== Payload lesen =====
$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 20000) {
    http_response_code(413);
    echo json_encode(['error' => 'Payload too large']);
    exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// ===== Honeypot (unsichtbares Feld im Frontend, muss leer sein) =====
if (!empty($data['website'] ?? '')) {
    // Bot: so tun als ob alles gut war, aber nichts senden
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

// ===== Validierung =====
$name    = trim((string)($data['name'] ?? ''));
$email   = trim((string)($data['email'] ?? ''));
$phone   = trim((string)($data['phone'] ?? ''));
$message = trim((string)($data['message'] ?? ''));
$service = (string)($data['service'] ?? 'build');
$privacy = (bool)($data['privacyAccepted'] ?? false);

$errors = [];
if ($name === '' || mb_strlen($name) > 120)              { $errors[] = 'name'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL))          { $errors[] = 'email'; }
if ($message === '' || mb_strlen($message) > 5000)       { $errors[] = 'message'; }
if (!in_array($service, ['build', 'fix', 'review'], true)){ $errors[] = 'service'; }
if (!$privacy)                                           { $errors[] = 'privacy'; }

if ($errors) {
    http_response_code(422);
    echo json_encode(['error' => 'Validation failed', 'fields' => $errors]);
    exit;
}

// Header-Injection verhindern: keine Zeilenumbrueche in Header-Feldern
foreach ([$name, $email, $phone] as $headerField) {
    if (preg_match('/[\r\n]/', $headerField)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid characters']);
        exit;
    }
}

// ===== Rate Limiting (dateibasiert, ohne DB) =====
// Speichert nur einen gehashten IP-Wert + Zeitstempel. Keine Klartext-IP => datensparsam.
$rateDir = __DIR__ . '/.ratelimit';
if (!is_dir($rateDir)) { mkdir($rateDir, 0750, true); }

$ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . date('Y-m-d'));
$rateFile = $rateDir . '/' . $ipHash;
$windowSeconds = 3600;
$maxPerWindow  = 3;

$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(
        (array)json_decode((string)file_get_contents($rateFile), true),
        static fn($ts) => is_int($ts) && $ts > time() - $windowSeconds
    );
}

if (count($hits) >= $maxPerWindow) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many requests. Bitte spaeter erneut versuchen.']);
    exit;
}

$hits[] = time();
file_put_contents($rateFile, json_encode(array_values($hits)), LOCK_EX);

// Alte Rate-Limit-Dateien aufraeumen (DSGVO: keine unnoetige Speicherung)
foreach (glob($rateDir . '/*') ?: [] as $old) {
    if (is_file($old) && filemtime($old) < time() - $windowSeconds) { @unlink($old); }
}

// ===== Mail an Robin =====
$to      = 'kontakt@robin-adler.de';
$from    = 'noreply@robin-adler.de'; // MUSS eine Adresse der eigenen Domain sein (SPF/DMARC)
$subject = sprintf('[%s] Neue Anfrage von %s', strtoupper($service), $name);

$body = implode("\n", [
    'Name:     ' . $name,
    'E-Mail:   ' . $email,
    'Telefon:  ' . ($phone !== '' ? $phone : '-'),
    'Bereich:  ' . strtoupper($service),
    '',
    'Nachricht:',
    $message,
    '',
    '---',
    'Gesendet ueber robin-adler.de am ' . date('d.m.Y H:i'),
]);

$headers = [
    'From: Robin Adler Systems <' . $from . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
];

$sent = mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['error' => 'Mail konnte nicht gesendet werden.']);
    exit;
}

// ===== Bestaetigungsmail an den Absender =====
$confirmSubject = 'Danke fuer deine Nachricht';
$confirmBody = implode("\n", [
    'Hallo ' . $name . ',',
    '',
    'danke fuer deine Nachricht. Ich habe sie erhalten und melde mich',
    'innerhalb von 24-48 Stunden bei dir.',
    '',
    'Viele Gruesse',
    'Robin Adler',
    '',
    '---',
    'Deine Daten werden ausschliesslich zur Bearbeitung dieser Anfrage',
    'verwendet und spaetestens 30 Tage nach Abschluss der Kommunikation',
    'geloescht. Details: https://robin-adler.de/datenschutz',
]);

@mail(
    $email,
    '=?UTF-8?B?' . base64_encode($confirmSubject) . '?=',
    $confirmBody,
    implode("\r\n", [
        'From: Robin Adler Systems <' . $from . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'MIME-Version: 1.0',
    ])
);

http_response_code(200);
echo json_encode(['success' => true]);
```

**`.htaccess` im selben Verzeichnis:**
```apache
# Rate-Limit-Verzeichnis nach aussen dichtmachen
<DirectoryMatch "\.ratelimit">
    Require all denied
</DirectoryMatch>

# Keine Directory-Listings
Options -Indexes
```

**DNS-Setup fuer den Endpoint:**
```
Type: A
Name: mail.robin-adler.de
Content: <IP des domain-offensive Shared Hosts>
Proxy: DNS only (kein Cloudflare-Proxy, sonst CORS-Debugging-Hoelle)
```

**Frontend-Anpassung** — Honeypot-Feld ergaenzen (unsichtbar, nur fuer Bots):
```tsx
<input
  type="text"
  name="website"
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
  style={{ position: 'absolute', left: '-9999px' }}
  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
/>
```

**Zustellbarkeit (wichtig!)**: Damit die Mails nicht im Spam landen, im domain-offensive-DNS setzen:
- **SPF**: `v=spf1 include:<domain-offensive-spf-host> -all`
- **DMARC**: `v=DMARC1; p=quarantine; rua=mailto:dmarc@robin-adler.de`
- Absender (`From:`) MUSS `@robin-adler.de` sein, niemals die Adresse des Absenders — sonst DMARC-Fail.


---


---

## 10. COMPONENT TEMPLATES & UTILITIES

### 10.1 CodeBlock Component (with Syntax Highlighting)

```tsx
// src/components/CodeBlock.tsx
import { highlight } from 'prismjs';
import 'prismjs/themes/prism-dark.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';

interface CodeBlockProps {
  language: 'typescript' | 'javascript' | 'bash' | 'json';
  code: string;
  showLineNumbers?: boolean;
}

export const CodeBlock = ({ language, code, showLineNumbers = true }: CodeBlockProps) => {
  const highlightedCode = highlight(code, require(`prismjs/components/prism-${language}`), language);

  return (
    <pre className="bg-black-secondary border border-red-primary p-4 rounded overflow-x-auto">
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  );
};
```

### 10.2 CaseCard Component

```tsx
// src/components/Cases/CaseCard.tsx
interface CaseCardProps {
  title: string;
  image: string;
  description: string;
  door: 'build' | 'fix' | 'review';
  onClick?: () => void;
}

export const CaseCard = ({ title, image, description, door, onClick }: CaseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, borderColor: '#d32f2f' }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className="case-card cursor-pointer border border-gray-muted hover:border-red-primary transition"
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="text-xs uppercase text-red-primary font-bold">{door}</span>
        <h3 className="text-xl font-bold mt-2">{title}</h3>
        <p className="text-gray-muted text-sm mt-2">{description}</p>
      </div>
    </motion.div>
  );
};
```

---

