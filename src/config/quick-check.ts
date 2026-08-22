/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  QUICK CHECK — scoring configuration
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This is the whole quiz. Questions, weights, thresholds and recommendations all
 * live here so they can be tuned in one file without touching any component.
 *
 * HOW SCORING WORKS
 *   1. Each answer carries a `weight`. The weights of the selected answers are
 *      added up to give a raw score.
 *   2. The score is matched against `BANDS` (first band whose `max` is >= score).
 *   3. Recommendations are collected in this order:
 *        a. every `RECOMMENDATIONS` entry whose `flag` was raised by an answer,
 *           in the order listed below (so the list is a priority order);
 *        b. then the band's own fallback recommendations;
 *      and the first `RECOMMENDATION_COUNT` are shown.
 *
 * TUNING IT
 *   - To make the tool more cautious, raise the weights or lower the band `max`
 *     values. To make it less alarming, do the reverse.
 *   - To reorder which advice surfaces first, move entries in `RECOMMENDATIONS`.
 *   - Weights are shared between languages on purpose: only the text is
 *     translated, so EN and RO can never drift apart in scoring.
 *
 * IMPORTANT — LEGAL WORDING
 *   Everything here must stay conditional ("may", "appears to", "is likely to").
 *   This tool produces an orientative indication, not a legal classification. Do
 *   not rewrite any of this copy into a statement of what the law requires of a
 *   specific organisation. Founder review required before any wording change.
 */

export type Lang = 'en' | 'ro';
export type Text = Record<Lang, string>;

/** Raised by answers, consumed by RECOMMENDATIONS. Add freely. */
export type Flag =
  | 'hr' | 'credit' | 'persons' | 'biometric' | 'provider'
  | 'shadow' | 'data' | 'vendor'
  | 'no-inventory' | 'no-policy' | 'no-owner'
  | 'unknown';

export interface Option {
  label:  Text;
  weight: number;
  flags?: Flag[];
}

export interface Question {
  id:      string;
  label:   Text;
  /** Optional clarifying line under the question. */
  help?:   Text;
  options: Option[];
}

export const RECOMMENDATION_COUNT = 3;

// ─────────────────────────────────────────────────────────────────────────────
//  QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  {
    id: 'sector',
    label: {
      en: 'Which sector does your organisation operate in?',
      ro: 'În ce sector activează organizația dumneavoastră?',
    },
    options: [
      { label: { en: 'Public administration or public services', ro: 'Administrație publică sau servicii publice' }, weight: 3 },
      { label: { en: 'Banking, insurance or financial services',  ro: 'Bănci, asigurări sau servicii financiare' },  weight: 3 },
      { label: { en: 'Healthcare or medical devices',             ro: 'Sănătate sau dispozitive medicale' },          weight: 3 },
      { label: { en: 'Recruitment, HR or staffing',               ro: 'Recrutare, resurse umane sau plasare de personal' }, weight: 3 },
      { label: { en: 'Education or training',                     ro: 'Educație sau formare profesională' },          weight: 2 },
      { label: { en: 'IT, software or technology',                ro: 'IT, software sau tehnologie' },                weight: 2 },
      { label: { en: 'Retail, e-commerce or logistics',           ro: 'Retail, comerț electronic sau logistică' },    weight: 1 },
      { label: { en: 'Something else',                            ro: 'Altceva' },                                     weight: 1 },
    ],
  },
  {
    id: 'hr',
    label: {
      en: 'Do you use AI to screen CVs, rank candidates, or evaluate employees?',
      ro: 'Folosiți AI pentru trierea CV-urilor, clasificarea candidaților sau evaluarea angajaților?',
    },
    help: {
      en: 'This includes recruitment platforms that score or rank applicants automatically.',
      ro: 'Include platformele de recrutare care punctează sau clasifică automat candidații.',
    },
    options: [
      { label: { en: 'Yes, regularly',            ro: 'Da, în mod curent' },         weight: 6, flags: ['hr'] },
      { label: { en: 'We are piloting it',        ro: 'Suntem în faza de testare' }, weight: 4, flags: ['hr'] },
      { label: { en: 'No',                        ro: 'Nu' },                        weight: 0 },
      { label: { en: 'I am not sure',             ro: 'Nu sunt sigur' },             weight: 3, flags: ['hr', 'unknown'] },
    ],
  },
  {
    id: 'credit',
    label: {
      en: 'Do you use AI in credit scoring, insurance pricing, or eligibility decisions?',
      ro: 'Folosiți AI în scoring de credit, tarifare de asigurări sau decizii de eligibilitate?',
    },
    options: [
      { label: { en: 'Yes',           ro: 'Da' },            weight: 6, flags: ['credit'] },
      { label: { en: 'No',            ro: 'Nu' },            weight: 0 },
      { label: { en: 'I am not sure', ro: 'Nu sunt sigur' }, weight: 3, flags: ['credit', 'unknown'] },
    ],
  },
  {
    id: 'persons',
    label: {
      en: 'Does an AI system make or support decisions that affect individuals — customers, patients, citizens, employees?',
      ro: 'Un sistem AI ia sau susține decizii care afectează persoane — clienți, pacienți, cetățeni, angajați?',
    },
    options: [
      { label: { en: 'Yes, and the output is usually acted on directly', ro: 'Da, iar rezultatul este de regulă aplicat direct' }, weight: 6, flags: ['persons'] },
      { label: { en: 'Yes, but a person always reviews the outcome',     ro: 'Da, dar o persoană verifică întotdeauna rezultatul' }, weight: 3, flags: ['persons'] },
      { label: { en: 'No',                                              ro: 'Nu' },                                                 weight: 0 },
      { label: { en: 'I am not sure',                                   ro: 'Nu sunt sigur' },                                      weight: 3, flags: ['persons', 'unknown'] },
    ],
  },
  {
    id: 'biometric',
    label: {
      en: 'Do you use biometric identification, emotion recognition, or video analytics?',
      ro: 'Folosiți identificare biometrică, recunoașterea emoțiilor sau analiză video?',
    },
    options: [
      { label: { en: 'Yes',           ro: 'Da' },            weight: 6, flags: ['biometric'] },
      { label: { en: 'No',            ro: 'Nu' },            weight: 0 },
      { label: { en: 'I am not sure', ro: 'Nu sunt sigur' }, weight: 3, flags: ['biometric', 'unknown'] },
    ],
  },
  {
    id: 'genai',
    label: {
      en: 'Do employees use general AI assistants — ChatGPT, Copilot, Gemini, Claude — for work?',
      ro: 'Angajații folosesc asistenți AI generali — ChatGPT, Copilot, Gemini, Claude — în activitatea de lucru?',
    },
    options: [
      { label: { en: 'Yes, through accounts the company provides', ro: 'Da, prin conturi puse la dispoziție de firmă' }, weight: 2 },
      { label: { en: 'Yes, but on their own accounts',             ro: 'Da, dar pe conturi personale' },                 weight: 4, flags: ['shadow'] },
      { label: { en: 'No',                                        ro: 'Nu' },                                            weight: 0 },
      { label: { en: 'I am not sure',                             ro: 'Nu sunt sigur' },                                 weight: 3, flags: ['shadow', 'unknown'] },
    ],
  },
  {
    id: 'data',
    label: {
      en: 'Is personal or confidential data entered into those AI tools?',
      ro: 'Sunt introduse date personale sau confidențiale în aceste instrumente AI?',
    },
    help: {
      en: 'Customer records, employee data, contracts, source code, internal documents.',
      ro: 'Date despre clienți, date despre angajați, contracte, cod sursă, documente interne.',
    },
    options: [
      { label: { en: 'Yes',           ro: 'Da' },            weight: 4, flags: ['data'] },
      { label: { en: 'No',            ro: 'Nu' },            weight: 0 },
      { label: { en: 'I am not sure', ro: 'Nu sunt sigur' }, weight: 3, flags: ['data', 'unknown'] },
    ],
  },
  {
    id: 'vendor',
    label: {
      en: 'Do you rely on AI features supplied by external vendors inside your products or processes?',
      ro: 'Vă bazați pe funcții AI furnizate de terți în produsele sau procesele dumneavoastră?',
    },
    options: [
      { label: { en: 'Yes',           ro: 'Da' },            weight: 3, flags: ['vendor'] },
      { label: { en: 'No',            ro: 'Nu' },            weight: 0 },
      { label: { en: 'I am not sure', ro: 'Nu sunt sigur' }, weight: 2, flags: ['vendor', 'unknown'] },
    ],
  },
  {
    id: 'provider',
    label: {
      en: 'Do you develop an AI system that you sell, licence, or make available to others?',
      ro: 'Dezvoltați un sistem AI pe care îl vindeți, licențiați sau îl puneți la dispoziția altora?',
    },
    help: {
      en: 'Obligations differ significantly depending on whether you use an AI system or supply one.',
      ro: 'Obligațiile diferă semnificativ după cum folosiți un sistem AI sau îl furnizați.',
    },
    options: [
      { label: { en: 'Yes',           ro: 'Da' },            weight: 5, flags: ['provider'] },
      { label: { en: 'No',            ro: 'Nu' },            weight: 0 },
      { label: { en: 'I am not sure', ro: 'Nu sunt sigur' }, weight: 3, flags: ['provider', 'unknown'] },
    ],
  },
  {
    id: 'inventory',
    label: {
      en: 'Do you have a written inventory of the AI systems in use across the organisation?',
      ro: 'Aveți un inventar scris al sistemelor AI folosite în organizație?',
    },
    options: [
      { label: { en: 'Yes, and it is kept current',      ro: 'Da, și este ținut la zi' },       weight: 0 },
      { label: { en: 'Partially, or it is out of date',  ro: 'Parțial, sau nu este actualizat' }, weight: 2, flags: ['no-inventory'] },
      { label: { en: 'No',                              ro: 'Nu' },                              weight: 4, flags: ['no-inventory'] },
    ],
  },
  {
    id: 'policy',
    label: {
      en: 'Is there an internal policy governing how employees may use AI?',
      ro: 'Există o politică internă care reglementează modul în care angajații pot folosi AI?',
    },
    options: [
      { label: { en: 'Yes, written and communicated', ro: 'Da, scrisă și comunicată' },  weight: 0 },
      { label: { en: 'A draft exists',                ro: 'Există o formă de lucru' },   weight: 2, flags: ['no-policy'] },
      { label: { en: 'No',                            ro: 'Nu' },                         weight: 4, flags: ['no-policy'] },
    ],
  },
  {
    id: 'owner',
    label: {
      en: 'Who is responsible for AI compliance in your organisation?',
      ro: 'Cine răspunde de conformitatea AI în organizația dumneavoastră?',
    },
    options: [
      { label: { en: 'A named person or team',             ro: 'O persoană sau o echipă desemnată' },   weight: 0 },
      { label: { en: 'Shared informally between people',   ro: 'Împărțit informal între mai multe persoane' }, weight: 2, flags: ['no-owner'] },
      { label: { en: 'Nobody, as far as I know',           ro: 'Nimeni, din câte știu' },                weight: 3, flags: ['no-owner'] },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  BANDS — matched in order; the first band whose `max` is >= score wins.
//  Max achievable score with the weights above is 49.
// ─────────────────────────────────────────────────────────────────────────────

export interface Band {
  key:     string;
  max:     number;
  /** Visual weight only — 'low' | 'moderate' | 'elevated' | 'high'. */
  tone:    'low' | 'moderate' | 'elevated' | 'high';
  title:   Text;
  summary: Text;
  /** Used only if fewer than RECOMMENDATION_COUNT flagged items were collected. */
  fallback: Text[];
}

export const BANDS: Band[] = [
  {
    key: 'low', max: 11, tone: 'low',
    title: {
      en: 'Limited indicative exposure',
      ro: 'Expunere orientativă limitată',
    },
    summary: {
      en: 'Based on your answers, your current AI use does not show the characteristics most commonly associated with the higher-risk categories in the EU AI Act. Transparency and data-protection obligations may still apply, and the picture changes as soon as new tools are adopted.',
      ro: 'Pe baza răspunsurilor dumneavoastră, utilizarea actuală a AI nu prezintă caracteristicile asociate de regulă categoriilor de risc mai ridicat din Regulamentul UE privind IA. Este posibil să vă revină totuși obligații de transparență și de protecție a datelor, iar imaginea se schimbă imediat ce sunt adoptate instrumente noi.',
    },
    fallback: [
      { en: 'Write down the AI tools currently in use, even informally. An inventory is the one artefact every later step depends on.', ro: 'Notați instrumentele AI folosite în prezent, chiar și informal. Inventarul este singurul document de care depind toți pașii ulteriori.' },
      { en: 'Set a short internal rule on what may and may not be entered into public AI tools, before someone decides for themselves.', ro: 'Stabiliți o regulă internă scurtă despre ce poate și ce nu poate fi introdus în instrumentele AI publice, înainte ca fiecare să decidă singur.' },
      { en: 'Re-check this when you adopt a new tool or enter a regulated activity. Exposure follows the use case, not the company size.', ro: 'Reluați această verificare când adoptați un instrument nou sau intrați într-o activitate reglementată. Expunerea urmează cazul de utilizare, nu mărimea firmei.' },
    ],
  },
  {
    key: 'moderate', max: 22, tone: 'moderate',
    title: {
      en: 'Moderate indicative exposure',
      ro: 'Expunere orientativă moderată',
    },
    summary: {
      en: 'Your answers show AI being used in ways that are likely to attract obligations, most probably around transparency, data protection, and internal governance rather than the high-risk regime. The gaps here are usually organisational rather than technical.',
      ro: 'Răspunsurile arată o utilizare a AI care este probabil să atragă obligații, cel mai probabil de transparență, protecție a datelor și guvernanță internă, mai degrabă decât regimul de risc ridicat. Lacunele sunt de obicei organizaționale, nu tehnice.',
    },
    fallback: [
      { en: 'Produce a complete AI system inventory, including tools adopted without IT or legal review.', ro: 'Realizați un inventar complet al sistemelor AI, inclusiv instrumentele adoptate fără avizul IT sau juridic.' },
      { en: 'Put a written AI use policy in place and communicate it, rather than relying on individual judgement.', ro: 'Adoptați o politică scrisă de utilizare a AI și comunicați-o, în loc să vă bazați pe judecata fiecăruia.' },
      { en: 'Assign a named owner for AI compliance. Diffuse responsibility is the most common reason nothing gets done.', ro: 'Desemnați un responsabil pentru conformitatea AI. Responsabilitatea difuză este cel mai frecvent motiv pentru care nu se face nimic.' },
    ],
  },
  {
    key: 'elevated', max: 34, tone: 'elevated',
    title: {
      en: 'Elevated indicative exposure',
      ro: 'Expunere orientativă ridicată',
    },
    summary: {
      en: 'Several of your answers point to uses that may fall within the stricter parts of the EU AI Act, and the governance to support them does not yet appear to be in place. This combination — regulated use without documentation — is the one that tends to cause problems under scrutiny.',
      ro: 'Mai multe răspunsuri indică utilizări care ar putea intra sub incidența părților mai stricte ale Regulamentului UE privind IA, iar guvernanța care să le susțină nu pare să existe încă. Această combinație — utilizare reglementată fără documentație — este cea care creează de regulă probleme la o verificare.',
    },
    fallback: [
      { en: 'Establish which specific systems are in scope and on what basis, with the reasoning written down.', ro: 'Stabiliți exact ce sisteme intră în domeniul de aplicare și pe ce temei, cu raționamentul consemnat în scris.' },
      { en: 'Document the human oversight applied to each decision-supporting system, including who can override it.', ro: 'Documentați supravegherea umană aplicată fiecărui sistem care susține decizii, inclusiv cine îl poate suprascrie.' },
      { en: 'Review vendor contracts and data processing terms for the AI features you depend on.', ro: 'Revizuiți contractele cu furnizorii și clauzele de prelucrare a datelor pentru funcțiile AI de care depindeți.' },
    ],
  },
  {
    key: 'high', max: Infinity, tone: 'high',
    title: {
      en: 'High indicative exposure',
      ro: 'Expunere orientativă foarte ridicată',
    },
    summary: {
      en: 'Your answers describe AI used in areas the EU AI Act treats most seriously, without the inventory, policy, or ownership that would normally accompany it. A structured assessment is the appropriate next step — this questionnaire cannot tell you which specific obligations apply.',
      ro: 'Răspunsurile descriu utilizări ale AI în domenii pe care Regulamentul UE privind IA le tratează cu cea mai mare seriozitate, fără inventarul, politica sau responsabilul care ar trebui să le însoțească. Pasul următor potrivit este o evaluare structurată — acest chestionar nu vă poate spune ce obligații concrete vă revin.',
    },
    fallback: [
      { en: 'Treat the AI system inventory as urgent. You cannot assess obligations for systems nobody has listed.', ro: 'Tratați inventarul sistemelor AI ca urgent. Nu puteți evalua obligații pentru sisteme pe care nimeni nu le-a listat.' },
      { en: 'Have the classification of your decision-affecting systems reviewed by someone independent of the team that deployed them.', ro: 'Cereți ca încadrarea sistemelor care afectează decizii să fie verificată de cineva independent de echipa care le-a implementat.' },
      { en: 'Do not wait for a complaint or an audit to establish what your position is.', ro: 'Nu așteptați o plângere sau un audit ca să aflați care este poziția dumneavoastră.' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  FLAG-DRIVEN RECOMMENDATIONS — listed in priority order.
// ─────────────────────────────────────────────────────────────────────────────

export const RECOMMENDATIONS: { flag: Flag; text: Text }[] = [
  {
    flag: 'biometric',
    text: {
      en: 'Biometric identification and emotion recognition are among the most tightly regulated uses in the EU AI Act, and some uses are prohibited outright. Establish exactly what your system does and on what legal basis before anything else.',
      ro: 'Identificarea biometrică și recunoașterea emoțiilor se numără printre utilizările cel mai strict reglementate din Regulamentul UE privind IA, iar unele utilizări sunt interzise complet. Stabiliți exact ce face sistemul dumneavoastră și pe ce temei legal, înaintea oricărui alt pas.',
    },
  },
  {
    flag: 'hr',
    text: {
      en: 'AI used to screen candidates or evaluate employees is one of the uses the EU AI Act singles out for stricter treatment. Document how the system reaches its output and what human review sits over it.',
      ro: 'AI folosit pentru trierea candidaților sau evaluarea angajaților este una dintre utilizările pe care Regulamentul UE privind IA le tratează mai strict. Documentați cum ajunge sistemul la rezultat și ce verificare umană există deasupra lui.',
    },
  },
  {
    flag: 'credit',
    text: {
      en: 'Creditworthiness and insurance pricing decisions supported by AI are treated as sensitive under both the EU AI Act and GDPR. Confirm what is recorded about how each decision was reached.',
      ro: 'Deciziile privind bonitatea și tarifarea asigurărilor susținute de AI sunt tratate ca sensibile atât de Regulamentul UE privind IA, cât și de GDPR. Confirmați ce se înregistrează despre modul în care s-a ajuns la fiecare decizie.',
    },
  },
  {
    flag: 'provider',
    text: {
      en: 'Supplying an AI system to others generally carries heavier obligations than using one. Establish whether you are acting as a provider, a deployer, or both — the answer changes what applies to you.',
      ro: 'Furnizarea unui sistem AI către alții atrage de regulă obligații mai grele decât simpla utilizare. Stabiliți dacă acționați ca furnizor, ca utilizator sau ambele — răspunsul schimbă ce vi se aplică.',
    },
  },
  {
    flag: 'persons',
    text: {
      en: 'Where AI output is acted on directly against individuals, meaningful human oversight is usually expected. Define who can question or override the system, and record that they can.',
      ro: 'Când rezultatul AI este aplicat direct în privința unor persoane, se așteaptă de regulă o supraveghere umană efectivă. Definiți cine poate contesta sau suprascrie sistemul și consemnați acest lucru.',
    },
  },
  {
    flag: 'no-inventory',
    text: {
      en: 'Build a complete AI system inventory. Every other obligation is assessed per system, so an incomplete list means an incomplete answer.',
      ro: 'Construiți un inventar complet al sistemelor AI. Orice altă obligație se evaluează pe fiecare sistem în parte, deci o listă incompletă înseamnă un răspuns incomplet.',
    },
  },
  {
    flag: 'shadow',
    text: {
      en: 'AI tools used on personal accounts sit outside your logging, your contracts, and your control. Bring them onto managed accounts or rule them out explicitly.',
      ro: 'Instrumentele AI folosite pe conturi personale sunt în afara jurnalelor, a contractelor și a controlului dumneavoastră. Mutați-le pe conturi administrate sau interziceți-le explicit.',
    },
  },
  {
    flag: 'data',
    text: {
      en: 'Personal or confidential data entered into third-party AI tools is a data-protection question before it is an AI Act question. Confirm where that data goes and what the vendor may do with it.',
      ro: 'Datele personale sau confidențiale introduse în instrumente AI terțe reprezintă o problemă de protecția datelor înainte de a fi una de Regulament AI. Confirmați unde ajung aceste date și ce poate face furnizorul cu ele.',
    },
  },
  {
    flag: 'no-policy',
    text: {
      en: 'Put a short written AI use policy in place. It does not need to be long — it needs to exist, be communicated, and be dated.',
      ro: 'Adoptați o politică scrisă și scurtă de utilizare a AI. Nu trebuie să fie lungă — trebuie să existe, să fie comunicată și să fie datată.',
    },
  },
  {
    flag: 'no-owner',
    text: {
      en: 'Name one person accountable for AI governance. Without an owner, the inventory goes stale and the policy is never enforced.',
      ro: 'Desemnați o persoană responsabilă de guvernanța AI. Fără un responsabil, inventarul se învechește, iar politica nu este niciodată aplicată.',
    },
  },
  {
    flag: 'vendor',
    text: {
      en: 'Review what your AI vendors commit to contractually — data handling, model changes, and what they tell you when something goes wrong.',
      ro: 'Verificați ce își asumă contractual furnizorii dumneavoastră de AI — prelucrarea datelor, modificările modelelor și ce vă comunică atunci când ceva nu funcționează.',
    },
  },
  {
    flag: 'unknown',
    text: {
      en: 'Several answers were "not sure". That uncertainty is itself the finding: nobody can currently give a confident account of how AI is used here.',
      ro: 'Mai multe răspunsuri au fost „nu sunt sigur". Această incertitudine este ea însăși constatarea: momentan nimeni nu poate spune cu certitudine cum este folosit AI aici.',
    },
  },
];
