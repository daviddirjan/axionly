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

### Phase 1 — credibility (commit `d1da1e0`)

- `src/components/home/TrustSignals.astro` — gained an optional `statementHref` /
  `statementLinkLabel` so the credential line can link to `/about#founder`.
- `src/pages/index.astro`, `src/pages/ro/index.astro` — trust claim replaced.
- `src/components/Footer.astro`, `src/pages/contact.astro`, `src/pages/ro/contact.astro` —
  LinkedIn placeholder replaced; email now comes from config.
- `src/config/site.ts` — **new.** Single source of truth.
- `src/components/shared/FormMeta.astro` — **new.** Hidden form plumbing + offline notice.
- `src/pages/resources.astro`, `src/pages/ro/resources.astro` — newsletter form wired, GDPR
  consent checkbox added (unticked, `required`).

**Address and email were not verified.** `hello@axionly.io` and "Oradea, BH, Romania, EU" are
carried over from the existing site; nobody has confirmed the mailbox is monitored. Founder to
check — plan item 1.3.

Badge wording (plan item 1.3) was audited and left alone: "ISO 42001 — Aligned",
"GDPR — Compliant practice", and "Aligned — certification in progress" on `/about` all describe
alignment, not certification. Correct as written; do not "upgrade" this language.

### Phase 3 — pricing ladder

- `src/components/services/PricingLadder.astro` — **new.** Four-rung ladder shown above the
  detailed tier cards.
- `src/pages/readiness-check.astro`, `src/pages/ro/readiness-check.astro` — **new.** The
  450 € entry product, with `Service` + `Offer` JSON-LD and the credit-back promise stated
  explicitly on the page.
- `src/pages/services.astro`, `src/pages/ro/services.astro` — ladder + entry-point callout +
  Governance Retainer section; all prices routed through `src/config/site.ts`; the Readiness
  Check added as a third `Offer` in the `Service` schema.
- `src/components/services/ComparisonTable.astro` — prices come from config, which also fixes
  the RO page showing `€2,500` in English number format.
- `src/pages/index.astro`, `src/pages/ro/index.astro` — secondary hero CTA now points at the
  Readiness Check instead of `/services`. The free discovery call remains primary.
- `public/sitemap.xml` — added `/readiness-check`, plus the `/privacy` and `/cookies` entries
  that were already missing before this work.

Deliberately **not** added to the header navigation: it already carries six items, and the
Readiness Check is reached from the hero, `/services`, and the ladder.

### Phase 4 — Quick Check (lead-qualification tool)

- `src/config/quick-check.ts` — **new.** The entire questionnaire: 12 questions, weights, four
  score bands, and the flag-driven recommendation list. **This is the file to edit** to tune the
  tool; nothing about the quiz is defined anywhere else. Weights are shared between EN and RO
  (only the text is translated) so the two languages cannot drift apart in scoring.
- `src/components/quick-check/QuickCheck.astro` — **new.** Renders the questionnaire and result.
- `src/pages/quick-check.astro`, `src/pages/ro/evaluare-rapida.astro` — **new.**
- `src/components/Header.astro` — the language switcher previously built the alternate URL by
  adding or stripping `/ro`, which would have sent `/quick-check` to a non-existent
  `/ro/quick-check`. It now consults a `SLUG_MAP`. **Add an entry there for any future route
  whose Romanian slug differs from the English one.**
- Cross-links added from `/resources` and `/readiness-check` in both languages; both slugs added
  to `public/sitemap.xml` with correct cross-language alternates.

**Design decisions, deliberate:**

- The **full result is shown before any email is requested.** Gating the basic result behind an
  email loses most visitors; the email gate is for the extended PDF only.
- **Scoring runs entirely in the browser.** No answers leave the visitor's device unless they
  submit the email form — which is what the on-page disclaimer promises, so it must stay true. If
  anyone later adds analytics to this page, do not send answer data with it.
- The GDPR consent checkbox is **unticked and required**, with the privacy policy linked beside it.
- The result meter is deliberately not a red/green pass/fail. The tool indicates exposure; it does
  not grade anyone.
- Without JavaScript the page still renders all 12 questions plus a note explaining that a result
  cannot be calculated — rather than showing one orphan question.

**Legal wording:** every band summary and recommendation is phrased conditionally ("may fall
within", "is likely to", "appears to"). The disclaimer states plainly that the output is
orientative, is not legal advice, is not a classification under the EU AI Act, and does not
replace an assessment. **Founder review required before publishing** — the substantive claims
about what the regulation implies are the founder's to stand behind, not ours.

**Verified in a browser** (dev server, both locales): the maximum-weight path returns the "High
indicative exposure" band with the biometric / HR / credit recommendations in priority order; the
minimum-weight path returns "Expunere orientativă limitată" with the low-band fallbacks; the
consent box is unticked and required; the privacy link is locale-correct; no console errors.

---

## 8. Summary and what remains

### Delivered (3 commits, one per phase)

| Phase | Commit | Outcome |
|---|---|---|
| 0 | — | Stack recon, this document. |
| 1 | `d1da1e0` | Unevidenced trust claim removed; 3 dead LinkedIn links fixed; contact + newsletter forms actually submit; dev placeholder removed from production; `src/config/site.ts` created. |
| 3 | `fc58a5e` | 450 € Readiness Check (EN + RO), four-rung pricing ladder, Governance Retainer tier, prices centralised, sitemap updated. |
| 4 | `e978044` | 12-question Quick Check (EN + RO) with editable scoring config, immediate result, GDPR-consented email gate. |

Phase 2 (`/about` with a real founder photo, name, background and LinkedIn) was already implemented
before this work began; it was audited, not rebuilt.

### Build state

22 pages build clean. No broken internal links. All 20 content pages carry reciprocal `hreflang`
(the two 404 pages do not — pre-existing, and they self-canonicalise, which should be fixed).

### The one thing to do first

**Set `FORM_ENDPOINT` in `src/config/site.ts`.** Until then, every form on the site — contact,
newsletter, and the Quick Check PDF request — shows a notice and falls back to email. The lead
capture built in Phase 4 produces nothing without it. Free key at web3forms.com, takes two minutes.

Then work through blockers B2–B5 in section 4.

### Deferred phases

- **Phase 5 — content.** No blog infrastructure exists (no content collections, no MDX, no
  articles). All five `/resources` article cards are `href: '#'` placeholders dated "March 2026",
  which is now in the past. Either build the collection or remove the cards — a resources page
  advertising five articles that do not exist is its own credibility problem.
- **Phase 6 — SEO/technical.** Priority order: self-host Google Fonts (the site currently
  contradicts its own cookie policy), PNG OG image, `@astrojs/sitemap`, `Person` JSON-LD on
  `/about`, RO keyword pass, Lighthouse. No cookie banner is needed **as long as** no analytics or
  third-party embeds are added — if any are, one becomes mandatory.
- **Phase 7 — conversion.** Booking widget (B3), qualification fields on the contact form,
  confirmation emails, privacy-respecting analytics (Plausible or Umami, not GA).

### Repo hygiene, unrelated but worth doing

`node_modules/` and `dist/` are committed — 9,000+ files. Add a `.gitignore` and untrack them.

---

## 8. Romanian-first locale swap (2026-08-24)

The site is now **Romanian by default**. Romanian lives at the root, English moved under `/en`.

| Before | After |
|---|---|
| `/services` (EN) | `/services` (RO) |
| `/ro/services` (RO) | `/en/services` (EN) |
| `/quick-check` (EN) | `/en/quick-check` (EN) |
| `/ro/evaluare-rapida` (RO) | `/evaluare-rapida` (RO) |

What changed:

- `astro.config.mjs` — `defaultLocale: 'ro'`, `locales: ['ro', 'en']`. `prefixDefaultLocale`
  stays `false`, so the default locale (now RO) is the unprefixed one.
- `src/pages/` — the RO duplicates moved up from `src/pages/ro/` to the root; the EN pages moved
  down into `src/pages/en/`. All internal links, `canonicalPath` and `hreflang*` values were
  rewritten to match. The RO slug exception (`evaluare-rapida` ↔ `quick-check`) is unchanged.
- `src/layouts/BaseLayout.astro` — `htmlLang` now defaults to `'ro'`; every EN page passes
  `htmlLang="en"` explicitly. `hreflang="x-default"` now points at the **Romanian** URL, and
  `WebSite.inLanguage` is `["ro", "en"]`.
- `src/components/Header.astro` / `Footer.astro` — the locale test flipped from
  `pathname.startsWith('/ro')` to `pathname.startsWith('/en')`; the prefix is `'/en'` for English
  and `''` for Romanian. `SLUG_MAP` is now keyed RO → EN. The switcher reads **RO / EN**, in that
  order, with RO active by default.
- `public/sitemap.xml` — regenerated. Romanian URLs first and at higher priority, `x-default` on
  the Romanian URL. `/readiness-check` and the Quick Check now appear in both locales (the RO
  entries for them were missing before).
- `public/_redirects` — **new.** 301s for the old `/ro/*` URLs and for `/quick-check`. Netlify /
  Cloudflare Pages syntax; **if the site is hosted somewhere else these rules do nothing** and the
  equivalent has to be configured on that host. Old English URLs like `/services` are deliberately
  *not* redirected — they still resolve, they simply serve Romanian now, and `hreflang` tells
  search engines where the English version went.

Not changed: page copy, the components, and the `FormMeta`/`QuickCheck` `lang` props (English
pages still rely on `FormMeta`'s `lang = 'en'` default).
