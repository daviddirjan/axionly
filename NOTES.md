# NOTES.md — Axionly.io implementation log

Working document for the execution plan in `axionly-plan.md`.
Last updated: 2026-08-22.

---

## 1. Stack recon (Phase 0)

| Item | Finding |
|---|---|
| Framework | **Astro 6.1.1** — the only dependency in `package.json`. |
| Output | **Static SSG.** No adapter, no `output` key in `astro.config.mjs`. No API routes are possible. |
| Router | File-based, `src/pages/**`. `build.format` default (`directory`). |
| Styling | Hand-written CSS. `src/styles/tokens.css` (design tokens) + `src/styles/global.css` (reset, type scale, `.btn-primary`, `.btn-ghost`, `.pill`, `.section-label`). **No Tailwind.** |
| CMS / content | **None.** No content collections, no `src/content/`, no Markdown/MDX anywhere. |
| Bilingualism | `i18n` is declared in `astro.config.mjs` (`en` default, `ro`, `prefixDefaultLocale: false`) but **never used in code**. Every RO page is a hand-maintained duplicate under `src/pages/ro/`. Shared components take strings as props; only `Header.astro`, `Footer.astro` and `ComparisonTable.astro` self-localise from `Astro.url.pathname`. |
| Metadata / SEO | All in `src/layouts/BaseLayout.astro` — there is no separate `BaseHead`/`SEO` component. It emits canonical, OG, Twitter, `hreflang`, `og:locale`, and a global JSON-LD `@graph` (`ProfessionalService` + `WebSite`). Pages inject page-level JSON-LD through `<slot name="head" />`. |
| Sitemap / robots | Hand-written static files in `public/`. Not generated. |

### Page inventory (before this work)

`index`, `services`, `how-it-works`, `about`, `resources`, `contact`, `privacy`, `cookies`, `404`
— each existing twice, at `src/pages/<name>.astro` and `src/pages/ro/<name>.astro`.

### `/resources` today

Three frontmatter-driven blocks: `articles[5]` (all `href: '#'`, `available: false` — **no article
has ever been published**), `downloads[3]` (real PDFs in `public/downloads/`), and a newsletter
form with no handler. It is a placeholder shell, not a content engine.

---

## 2. Business decisions confirmed by the founder (2026-08-22)

1. **Trust claim** → replaced with founder credentials (option B in the plan). No client logos, no
   invented references.
2. **Form submissions** → third-party static-friendly endpoint (Web3Forms / Formspree). No SSR
   adapter is being added.
3. **Pricing ladder** → Readiness Check 450 € / 3 days; AI Risk Assessment 2.500 € / 5 days;
   Deep-Dive 3.200 € / 5 days; Governance Retainer priced "from" — **number not yet confirmed**.
4. **Session scope** → Phases 0, 1, 3, 4. Phase 2 (`/about`) was already implemented before this
   work started. Phases 5, 6, 7 are deferred.

---

## 3. What is explicitly NOT being built

**No AI-governance SaaS platform.** No multi-tenant dashboard, no subscriptions, no automated AI
system inventory, no continuous in-product monitoring.

Reason: demand is not validated yet. The platform gets designed after 10–15 assessments have been
delivered manually, from whatever turns out to repeat across them. What gets built in the meantime
is internal tooling that speeds up manual delivery (report templates, reusable checklists) — and
that tooling becomes the platform specification later.

---

## 4. Blocked on human input

| # | Blocker | Where | Needed |
|---|---|---|---|
| B1 | **Form endpoint key is unset.** All forms POST nowhere until it is filled in. | `src/config/site.ts` → `FORM_ENDPOINT` | Create a free Web3Forms access key at web3forms.com (or a Formspree form ID) and paste it. **Until then every contact, newsletter and quick-check submission is lost.** |
| B2 | **Governance Retainer price** is shown as "Priced on request" rather than a number. | `/services`, `/ro/services` | Confirm a monthly figure, or leave as-is. |
| B3 | **Booking widget.** `/contact` shipped a literal dev placeholder ("Replace this block with your embedded booking widget") to production. | `src/pages/contact.astro`, `src/pages/ro/contact.astro` | A Cal.com / Calendly public URL. Placeholder text removed in the meantime; the mailto fallback is now the visible path. |
| B4 | **Readiness Check price (450 €)** is the plan's suggested figure, not a founder-confirmed one. | `src/config/site.ts` → `PRICES` | Confirm or change. Single source of truth, one edit. |
| B5 | **Extended PDF for the quick-check** ("Inventarul sistemelor AI din firma ta — șablon") does not exist. | `public/downloads/` | Produce the PDF; the quick-check email gate promises it. |

---

## 5. Legal / accuracy guardrails applied

- No compliance claim on the site asserts **certification**. The badges say *aligned* / *compliant
  practice*, and `/about` says "ISO 42001 — Aligned, certification in progress". This wording is
  correct and must not be changed to anything implying an issued certificate.
- The quick-check result is framed throughout as **orientative, not legal advice**, in both
  languages, and does not replace an assessment.
- No statement about legal obligations is written as settled fact. Anything describing what the AI
  Act requires is phrased conditionally and marked for founder review.

---

## 6. Known issues found but out of scope for this session

- `dist/` and `node_modules/` are **committed to git** (9,386 files) and `dist/` is stale — it is
  missing `axionly-og.svg`, `public/team/*.png`, `robots.txt` and `sitemap.xml`. Anyone deploying
  the checked-in `dist/` ships a broken site. Needs a `.gitignore` and an untrack commit.
- `og:image` is an **SVG** (`public/axionly-og.svg`). LinkedIn, Facebook, X and Slack do not render
  SVG OG images — link previews are blank. Needs a 1200×630 PNG. *(Phase 6.)*
- `public/sitemap.xml` is hand-maintained and already missing `/privacy`, `/cookies` and their RO
  twins. Should be replaced with `@astrojs/sitemap`. *(Phase 6.)*
- Google Fonts is loaded from `fonts.googleapis.com` in `BaseLayout.astro`, which sends visitor IPs
  to Google. `cookies.astro` and `privacy.astro` both claim no third-party services are used. This
  is a genuine inconsistency for a firm selling GDPR compliance — self-host the two font families.
  *(Phase 6, but it is the highest-priority item there.)*
- `ComparisonTable.astro` hardcoded `€2,500`/`€3,200` in English number format even on the RO page.
  Fixed in Phase 3 by routing both through `src/config/site.ts`.
- No `Button`/`Card`/`Section` primitives — card CSS is redefined in ~8 components. Refactor
  opportunity, not addressed here.

---

## 7. Change log
