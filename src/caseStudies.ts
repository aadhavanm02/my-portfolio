// Case study content for the portfolio.
// Text supports **bold** and [link text](https://url) inline.
// Media without a `src` renders as a placeholder; add a `src` (e.g. "/assets/...") to show a real image.
// Set `protected: true` on a section to put it behind the NDA code screen.

export type ProjectTone = "violet" | "peach";

// The uncropped screenshot behind a crop: the full view opens on the crop, then zooms out to this.
export type FullShot = {
  src: string;
  size: [number, number];
  // Where the crop sits in the full screenshot, as fractions: x, y, width, height.
  crop: [number, number, number, number];
};

export type MediaFrame = {
  src: string;
  // Natural size in pixels, so the layout is stable before the image loads.
  size: [number, number];
  label?: string;
  full?: FullShot;
};

export type MediaItem = {
  caption: string;
  kind?: "image" | "video";
  src?: string;
  // Cover frame shown before a video plays.
  poster?: string;
  // Describes the media for screen readers when no visible caption is shown.
  alt?: string;
  size?: [number, number];
  // Screenshots shown side by side at the same height.
  row?: MediaFrame[];
  // Stack the row's screenshots one above the other, each at full width.
  stack?: boolean;
  // Take the full width of a group instead of sharing a row.
  wide?: boolean;
  full?: FullShot;
};

export type CardItem = {
  title: string;
  body: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type JourneyLane = {
  name: string;
  role: string;
  about: string;
  steps: Array<{ title: string; body: string; media?: MediaItem }>;
};

export type ChangeItem = {
  area?: string;
  title: string;
  // The fuller story of the change, shown as the main paragraph.
  detail: string;
  // More paragraphs under the main one.
  details?: string[];
  before?: string;
  after: string;
  // Short key points shown as chips.
  highlights?: string[];
  media?: MediaItem;
};

export type DecisionOption = {
  title: string;
  body: string;
  chosen?: boolean;
  badge?: string;
};

export type DecisionItem = {
  title: string;
  hook: string;
  before: string[];
  turningIntro: string;
  options: DecisionOption[];
  reasoning: string[];
  next: string[];
  nextList?: string[];
  result: string[];
  media?: MediaItem[];
};

// A process step. With a `title`, it shows as its own block with fuller text, chips and a screenshot.
export type ProcessStep = {
  label: string;
  body: string;
  title?: string;
  details?: string[];
  points?: string[];
  media?: MediaItem;
};

type SectionBase = {
  id: string;
  nav: string;
  eyebrow: string;
  title: string;
  intro?: string;
  // Longer write-up under the intro: paragraphs, each with an optional label.
  story?: StoryBlock[];
  protected?: boolean;
};

export type StoryBlock = { label?: string; text: string | string[] };

export type CaseSection = SectionBase &
  (
    | {
        kind: "problem";
        // Optional business goals, shown as numbered cards before the pain points.
        goalsIntro?: string;
        goals?: CardItem[];
        pains: CardItem[];
        // Optional callout, for example what competitors offered.
        note?: CardItem;
        media?: MediaItem;
        mapping: Array<[string, string]>;
        constraints: string[];
      }
    | { kind: "journey"; video?: MediaItem; lanes: JourneyLane[] }
    | {
        kind: "solution";
        items: ChangeItem[];
        variants?: { title: string; intro: string; items: Array<{ count: string; name: string; body: string }> };
      }
    | { kind: "decisions"; items: DecisionItem[] }
    | {
        kind: "system";
        levels?: CardItem[];
        // Screenshots of the system itself, shown under the levels.
        levelsMedia?: MediaItem;
        patterns?: CardItem[];
        tokens: Array<{ sample: "type" | "color" | "icons"; label: string; value: string }>;
        note?: CardItem;
      }
    | { kind: "process"; steps: ProcessStep[]; notes?: CardItem[]; media?: MediaItem }
    | { kind: "future"; tag: string; items: CardItem[]; media?: MediaItem[] }
    | { kind: "learnings"; items: CardItem[] }
    | { kind: "outcome"; before: string; after: string; stat: Stat; feedback: string }
  );

export type CaseStudy = {
  slug: string;
  // Optional brand color. Leave it out to use the site's Flamingo orange. When set, every
  // accent inside the case study (tags, numbers, highlights, the contents rail) uses it.
  brand?: string;
  cardTitle: string;
  cardSummary: string;
  proof: string;
  tone: ProjectTone;
  image: string;
  imageClass?: string;
  headline: string;
  hook: string;
  summary: string;
  // More paragraphs under the summary.
  lead?: string[];
  stats: Stat[];
  meta: Array<[string, string]>;
  hero: MediaItem;
  sections: CaseSection[];
};

const feedback = (question: string) =>
  `${question} Feedback is welcome on [LinkedIn](https://www.linkedin.com/in/aadhavan-m/) or by [email](mailto:aadhavanm.design@gmail.com).`;

// ---------- Cart Abandonment screenshots ----------
// Bumped whenever these screenshots are replaced, so browsers fetch the new files.
const CA_VERSION = "2026-11-18";

const caSizes = {
  "dashboard-overview": [1945, 1010],
  dashboard: [1945, 2000],
  "email-list": [2000, 560],
  "rule-engine": [1065, 522],
  "email-drawer": [2000, 1347],
  "settings-general": [2000, 1140],
  "integrations-webhook": [2000, 780],
  "integrations-ottokit": [2000, 720],
  "nav-per-report": [2000, 330],
  "nav-page-tabs": [2000, 330],
  "nav-pill-tabs": [2000, 330],
  "nav-dropdown": [2000, 330],
  "topbar-live": [1100, 360],
  "email-report": [2000, 1180],
  "email-report-top": [2000, 720],
  "email-logs": [2000, 1110],
  "logs-full-page": [2000, 1511],
  "logs-drawer": [2000, 1220],
  "dashboard-switch": [2000, 990],
  "dashboard-v1": [1911, 950],
  "dashboard-v2-order": [2000, 660],
  "dashboard-v2-revenue": [2000, 660],
  "popup-no-thanks": [865, 1380],
  "popup-required": [865, 1260],
  "popups-list": [2000, 470],
  "popup-preview": [825, 464],
  "spectra-editor": [2000, 1251],
  "pro-dashboard": [905, 465],
  "pro-emails": [2000, 590],
  "old-report": [2000, 1548],
  "old-tabs": [1100, 360],
  "old-report-cards": [1766, 630],
  "old-email-list": [1760, 700],
  "old-cart": [1766, 840],
  "old-editor": [1760, 1060],
  "popup-in-plugin": [865, 1460],
  "popup-rules": [1093, 1347],
} satisfies Record<string, [number, number]>;

type CaShot = keyof typeof caSizes;

// Full screenshots behind the crops, and each crop's box in pixels (x, y, width, height).
const caFull: Partial<Record<CaShot, [string, [number, number], [number, number, number, number]]>> = {
  "dashboard-overview": ["full/dashboard", [1945, 2000], [0, 0, 1945, 1010]],
  "email-list": ["full/email-list", [2000, 1347], [0, 0, 2000, 560]],
  "rule-engine": ["full/rule-engine", [2000, 1347], [920, 268, 1065, 522]],
  "settings-general": ["full/settings-general", [2000, 1347], [0, 0, 2000, 1140]],
  "integrations-webhook": ["full/integrations-webhook", [2000, 1347], [0, 0, 2000, 780]],
  "integrations-ottokit": ["full/integrations-ottokit", [2000, 1347], [0, 0, 2000, 720]],
  "nav-per-report": ["full/nav-per-report", [2000, 1511], [0, 0, 2000, 330]],
  "nav-page-tabs": ["full/nav-page-tabs", [2000, 1347], [0, 0, 2000, 330]],
  "nav-pill-tabs": ["full/nav-pill-tabs", [2000, 1347], [0, 0, 2000, 330]],
  "nav-dropdown": ["full/nav-dropdown", [2000, 1347], [0, 0, 2000, 330]],
  "logs-drawer": ["full/logs-drawer", [2000, 1698], [0, 0, 2000, 1220]],
  "topbar-live": ["full/topbar-live", [2000, 1347], [0, 0, 1100, 360]],
  "email-report": ["full/email-report", [2000, 1347], [0, 0, 2000, 1180]],
  "email-report-top": ["full/email-report-top", [2000, 1347], [0, 0, 2000, 720]],
  "email-logs": ["full/email-logs", [2000, 1906], [0, 0, 2000, 1110]],
  "dashboard-switch": ["full/dashboard-switch", [2000, 1572], [0, 0, 2000, 990]],
  "dashboard-v1": ["full/dashboard-v1", [1911, 2000], [0, 0, 1911, 950]],
  "dashboard-v2-order": ["full/dashboard-v2-order", [2000, 1347], [0, 0, 2000, 660]],
  "dashboard-v2-revenue": ["full/dashboard-v2-revenue", [2000, 1347], [0, 0, 2000, 660]],
  "popup-no-thanks": ["full/popup-no-thanks", [1689, 2000], [795, 60, 865, 1380]],
  "popup-required": ["full/popup-required", [1689, 2000], [795, 160, 865, 1260]],
  "popup-in-plugin": ["full/popup-in-plugin", [1689, 2000], [795, 0, 865, 1460]],
  "popup-rules": ["full/popup-rules", [2000, 1347], [907, 0, 1093, 1347]],
  "old-tabs": ["full/old-tabs", [2000, 699], [0, 0, 1100, 360]],
  "old-report-cards": ["full/old-report-cards", [2000, 1547], [234, 200, 1766, 630]],
  "old-email-list": ["full/old-email-list", [2000, 824], [240, 0, 1760, 700]],
  "old-editor": ["full/old-editor", [2000, 1336], [240, 0, 1760, 1060]],
  "old-cart": ["full/old-cart", [2000, 1551], [234, 40, 1766, 840]],
  "pro-dashboard": ["full/pro-dashboard", [1916, 2000], [970, 1030, 905, 465]],
  "pro-emails": ["full/pro-emails", [2000, 1349], [0, 0, 2000, 590]],
  "popups-list": ["full/popups-list", [2000, 1347], [0, 0, 2000, 470]],
  "popup-preview": ["full/popup-preview", [1689, 2000], [815, 128, 825, 464]],
};

function ca(name: CaShot, label?: string): MediaFrame {
  const entry = caFull[name];
  const full: FullShot | undefined = entry
    ? {
        src: `/assets/cart-abandonment/${entry[0]}.webp?v=${CA_VERSION}`,
        size: entry[1],
        crop: [entry[2][0] / entry[1][0], entry[2][1] / entry[1][1], entry[2][2] / entry[1][0], entry[2][3] / entry[1][1]],
      }
    : undefined;
  return { src: `/assets/cart-abandonment/${name}.webp?v=${CA_VERSION}`, size: caSizes[name], label, full };
}

const caShot = (alt: string, name: CaShot): MediaItem => ({ caption: "", alt, ...ca(name) });
const caRow = (alt: string, ...row: MediaFrame[]): MediaItem => ({ caption: "", alt, row });

const cartAbandonmentDecisions: DecisionItem[] = [
  {
    title: "Why Reports became a dropdown instead of more tabs",
    hook: "Every new feature wanted a place in the top navigation, and the top navigation only had so much room.",
    before: [
      "The old plugin had three tabs. As the plan grew to include Product Report, Email Logs, Integrations and Popup Templates, each report sitting as its own tab would have crowded the top bar.",
    ],
    turningIntro: "I explored four directions:",
    options: [
      {
        title: "A tab for each report",
        body: "One click to any report. But the top bar fills up fast, and gets worse with every new report.",
      },
      {
        title: "Underline tabs inside a Reports page",
        body: "Keeps the top bar short. But it adds a second row of navigation inside the page.",
      },
      {
        title: "Pill tabs beside the table title",
        body: "Compact and close to the data. But easy to miss, and harder to scale beyond two reports.",
      },
      {
        title: "A dropdown under Reports in the top bar",
        body: "Keeps the top bar short and groups the reports in one place. The trade-off is one extra click.",
        chosen: true,
      },
    ],
    reasoning: [
      "In discussion with the PM and developers, we chose the dropdown. It keeps the main navigation short, and new report types can be added without touching the top bar.",
    ],
    next: [
      "I designed the Reports dropdown with Email Report and Product Report, and kept the same table layout across both so they feel like one area.",
    ],
    result: [
      "It shipped. The live plugin's top bar has five items: Dashboard, Follow Up Emails, Reports, Integrations and Settings.",
    ],
    media: [
      { caption: "A tab for each report.", alt: "Top bar with Email Logs and Product Report as separate tabs.", ...ca("nav-per-report"), wide: true },
      { caption: "Underline tabs inside a Reports page.", alt: "Email Reports and Product Reports tabs above the table card.", ...ca("nav-page-tabs"), wide: true },
      { caption: "Pill tabs beside the table title.", alt: "Emails Report and Product Report pill tabs inside the table card.", ...ca("nav-pill-tabs"), wide: true },
      { caption: "A dropdown under Reports.", alt: "Reports dropdown open with Email Report and Product Report.", ...ca("nav-dropdown"), wide: true },
      { caption: "The live top bar, with Reports open.", alt: "The live top bar with the Reports dropdown showing Follow Up and Product.", ...ca("topbar-live"), wide: true },
    ],
  },
  {
    title: "Why Email Logs became a full page, not a side drawer",
    hook: "A store owner clicks on one abandoned cart. How much do they need to see, and where should it open?",
    before: [
      "In the new design, editing a follow-up email opened in a side drawer beside the list. Email Logs, the detailed view of one cart, needed a home too.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "A side drawer",
        body: "Consistent with the email editor, and the list stays in view. But Email Logs holds a lot: scheduled emails, billing and shipping addresses, and the full order. In a drawer, the addresses can't sit side by side and the order table gets cramped.",
        badge: "My first proposal",
      },
      {
        title: "A full page",
        body: "Room for every detail, with addresses side by side and a full order table. The trade-off is leaving the list, and a different pattern from the email editor.",
        chosen: true,
      },
    ],
    reasoning: [
      "I first proposed the drawer, for consistency. The PM and developers pushed for the full page, because this is a detailed report, not a quick edit. Looking at how much one cart holds, I agreed.",
      "The old plugin also showed these details on a full page, so existing users would recognise it.",
    ],
    next: [
      "I redesigned Email Logs as a full page: email details first, then billing and shipping side by side, then the order items with totals.",
    ],
    result: [
      "The full page shipped. It reinforced something I now ask early: is this a quick edit or a detailed read? The answer decides the pattern, not consistency alone.",
    ],
    media: [{ caption: "The drawer version.", alt: "Email Log in a side drawer beside the list: addresses, order items and scheduled emails.", ...ca("logs-drawer") }, { caption: "The full page version.", alt: "Email Logs on a full page: scheduled emails, billing and shipping, order items.", ...ca("logs-full-page") }],
  },
  {
    title: "Why the dashboard chart always compares two numbers",
    hook: "A chart that changes when you click a card sounds clever. But would store owners ever know to click?",
    before: [
      "The old Report page had six number cards and no chart at all. Store owners could see totals, but not whether recovery was improving.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "One chart that switches with the cards",
        body: "Click any metric card and the chart shows that metric. Flexible, but the interaction is hidden. Store owners might never discover it, or not understand why the chart changed.",
      },
      {
        title: "A fixed chart comparing two metrics",
        body: "Recoverable revenue and recovered revenue, always shown together. Less flexible, but the most important story is always visible: how much was at risk, and how much came back.",
        chosen: true,
      },
    ],
    reasoning: [
      "I chose the fixed comparison. The gap between the two lines is what a store owner actually cares about, and it shouldn't depend on finding a hidden click.",
    ],
    next: [
      "I designed the chart with both lines in the brand colors, a legend, and a date range picker that updates the cards and the chart together. I explored two dashboard versions; the first, refined over a few rounds, became the final design.",
    ],
    result: [
      "It shipped. The live dashboard shows the six cards above the comparison chart.",
    ],
    media: [
      { caption: "The rejected idea: the chart follows the selected card.", alt: "Recoverable Orders card selected, with a single-line chart below.", ...ca("dashboard-switch"), wide: true },
      caRow("Dashboard V1, a fixed two-line comparison, and V2 with Order and Revenue tabs beside a compact chart.", ca("dashboard-v1", "V1: a fixed two-line comparison"), ca("dashboard-v2-order", "V2: Order tab"), ca("dashboard-v2-revenue", "V2: Revenue tab")),
      { caption: "The live dashboard.", alt: "The live Dashboard.", ...ca("dashboard"), wide: true }],
  },
  {
    title: "Why shoppers can skip the email popup",
    hook: "The store needs a shopper's email to recover their cart. But asking for it every time they tap Add to Cart can feel like a login wall.",
    before: [
      "The popup asks for an email when a shopper adds to cart, so the store can follow up if they leave. A shopper who isn't logged in might see it again and again.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "Always require the email",
        body: "The store captures more emails. But shoppers who are just browsing get frustrated, wonder why it's needed, and may leave the store altogether.",
      },
      {
        title: "Let store owners make it optional",
        body: "Shoppers can tap “No thanks” and keep shopping. The store captures fewer emails at this step.",
        chosen: true,
      },
    ],
    reasoning: [
      "I designed it as a choice for the store owner, with an “Email Address Is Mandatory?” toggle. Skipping is safe because shoppers still give their email at checkout.",
      "By then they've chosen what to buy, so being asked feels necessary rather than annoying.",
    ],
    next: [
      "When the toggle is off, the popup shows a “No thanks” link with editable text. The template list counts “No thanks” clicks, so store owners can see how many shoppers skip and decide for themselves.",
    ],
    result: [
      "It shipped as part of Popup Templates in Pro. Store owners get to balance capturing emails against keeping shoppers happy, with the data to back their choice.",
    ],
    media: [
      { caption: "The popup with the email required.", alt: "Popup settings with Email Address Is Mandatory turned on.", ...ca("popup-required") },
      { caption: "The popup with “No thanks.”", alt: "Popup settings with the email optional and a No Thanks text field.", ...ca("popup-no-thanks") },
    ],
  },
];

// ModernCart screenshots (public/assets/modern-cart), cropped to the part each section is about.
const mcSizes = {
  "general-tab": [1546, 860],
  "general-pro": [948, 682],
  "general-settings": [1592, 600],
  "text-label-fields": [1432, 1080],
  "text-label-empty-fields": [800, 394],
  "floating-icon-card": [1280, 622],
  "styling-colors": [862, 454],
  "styling-width": [862, 520],
  "upgrade-modal": [701, 995],
  "free-vs-pro": [904, 526],
  "cart-empty-panel": [531, 1250],
  "cart-one-panel": [531, 1250],
  "cart-two-panel": [531, 1250],
  "coupon-link-crop": [531, 438],
  "coupon-field-crop": [531, 464],
  "coupon-tag-crop": [531, 447],
  "summary-card-crop": [531, 377],
  "summary-tags-crop": [531, 427],
  "popup-empty": [1162, 1000],
  "popup-suggest": [1162, 1000],
  "popup-items": [1093, 1001],
  "popup-items-tablet-box": [2228, 3280],
  "popup-items-mobile-box": [1200, 2556],
  "slideout-full": [2000, 1250],
  "popup-full": [2000, 1250],
  "live-preview": [2000, 1157],
  "custom-icon-card": [1760, 2060],
  "icon-preview-card": [1720, 2176],
} satisfies Record<string, [number, number]>;

type McShot = keyof typeof mcSizes;

// Bumped whenever the ModernCart screenshots are replaced, so browsers fetch the new files instead of cached ones.
const MC_VERSION = "2026-11-20b";

// Full screenshots behind the crops, and each crop's box in pixels (x, y, width, height).
const CART_X = 1469; // left edge of the slide-out cart in storefront screenshots
const mcFull: Partial<Record<McShot, [string, [number, number], [number, number, number, number]]>> = {
  "general-tab": ["full/general", [1546, 2000], [0, 0, 1546, 860]],
  "general-pro": ["full/general", [1546, 2000], [452, 420, 948, 682]],
  "text-label-empty-fields": ["full/text-label", [1313, 2000], [388, 1370, 800, 394]],
  "floating-icon-card": ["full/floating", [2000, 1248], [560, 252, 1280, 622]],
  "styling-colors": ["full/styling", [1371, 2000], [392, 182, 862, 454]],
  "styling-width": ["full/styling", [1371, 2000], [392, 1452, 862, 520]],
  "upgrade-modal": ["full/upgrade-modal", [2000, 1250], [687, 127, 701, 995]],
  "free-vs-pro": ["full/free-vs-pro", [959, 2000], [20, 86, 904, 526]],
  "cart-empty-panel": ["full/cart-empty", [2000, 1250], [CART_X, 0, 531, 1250]],
  "cart-one-panel": ["slideout-full", [2000, 1250], [CART_X, 0, 531, 1250]],
  "cart-two-panel": ["full/cart-two", [2000, 1250], [CART_X, 0, 531, 1250]],
  "coupon-link-crop": ["full/coupon-link", [2000, 1250], [CART_X, 812, 531, 438]],
  "coupon-field-crop": ["full/coupon-field", [2000, 1250], [CART_X, 786, 531, 464]],
  "coupon-tag-crop": ["full/coupon-tag", [2000, 1250], [CART_X, 803, 531, 447]],
  "summary-card-crop": ["full/summary-card", [2000, 1250], [CART_X, 873, 531, 377]],
  "summary-tags-crop": ["full/summary-tags", [2000, 1250], [CART_X, 823, 531, 427]],
  "popup-empty": ["full/popup-empty", [2000, 1250], [419, 125, 1162, 1000]],
  "popup-suggest": ["full/popup-suggest", [2000, 1250], [419, 125, 1162, 1000]],
  "popup-items": ["popup-full", [2000, 1250], [452, 124, 1093, 1001]],
};

function mcFullShot(name: McShot): FullShot | undefined {
  const entry = mcFull[name];
  if (!entry) return undefined;
  const [file, [w, h], [x, y, cw, ch]] = entry;
  return { src: `/assets/modern-cart/${file}.webp?v=${MC_VERSION}`, size: [w, h], crop: [x / w, y / h, cw / w, ch / h] };
}

function mc(name: McShot, label?: string): MediaFrame {
  return { src: `/assets/modern-cart/${name}.webp?v=${MC_VERSION}`, size: mcSizes[name], label, full: mcFullShot(name) };
}

const mcShot = (alt: string, name: McShot): MediaItem => ({ caption: "", alt, ...mc(name) });
const mcRow = (alt: string, ...row: MediaFrame[]): MediaItem => ({ caption: "", alt, row });

const modernCartDecisions: DecisionItem[] = [
  {
    title: "Why I wanted free users to see Pro features, not lose them",
    hook: "When ModernCart split into Free and Pro, features free users relied on moved behind a paywall. What would they see next time they opened settings?",
    before: [
      "The PM shared the list of which features stayed Free and which moved to Pro. Nothing was decided yet about how Pro features would appear inside the free dashboard.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "Hide Pro features completely",
        body: "The free dashboard stays clean and simple. But a store owner who used a feature last week would open their settings and find it gone, with no explanation.",
        chosen: true,
        badge: "Team's choice",
      },
      {
        title: "Show them locked, with a PRO badge and upgrade note",
        body: "The store owner can see what moved and what Pro adds, without being blocked or pushed. The trade-off is a slightly busier screen.",
        badge: "My proposal",
      },
    ],
    reasoning: [
      "I proposed showing them, as an option for the PM and leadership to weigh. A feature that quietly disappears feels like something was taken away. A feature that's visible but locked tells people exactly what upgrading gets them.",
      "ForceUI already used PRO badges on cards, so the pattern fit the system.",
    ],
    next: [
      "I designed PRO badges, disabled fields with an inline “Upgrade now” note, an upgrade modal, and a Free vs Pro tab comparing every feature side by side.",
    ],
    result: [
      "The team chose to keep the free version focused on free features, so Pro features stay out of view for free users, and the live plugin still works this way. Both directions were on the table when that call was made, which is what I set out to do.",
      "It reinforced how I approach this kind of work: give decision makers clear options with the reasoning behind each, knowing the right answer depends on how the business wants to position its product.",
    ],
    media: [
      mcShot("My proposal for General: a PRO badge and an inline “Upgrade now” note on each locked setting.", "general-pro"),
      mcShot("The upgrade modal, opened from a locked setting.", "upgrade-modal"),
      mcShot("The Free vs Pro tab, comparing every feature.", "free-vs-pro"),
    ],
  },
  {
    title: "Why I added product suggestions to the cart to keep shoppers browsing",
    hook: "A shopper opens the cart before adding anything. In ModernCart, all they found was an “empty cart” message.",
    before: [
      "The empty cart showed only a message saying it was empty, with no next step. Once items were added, the cart was just a list of what the shopper had picked.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "Keep the cart as a plain list",
        body: "Simple, nothing to distract from checkout. But an empty cart leads nowhere, and a full cart misses the moment when the shopper is most ready to buy.",
      },
      {
        title: "Let the cart suggest products",
        body: "Shoppers who open the cart are still in shopping mode, so a suggestion lets them keep going without leaving. The risk is clutter that pulls attention away from checking out.",
        chosen: true,
      },
    ],
    reasoning: [
      "I chose to suggest products, for two reasons. For the business, every suggestion is a chance to raise the average order value. For the shopper, a suggestion turns an empty screen into something to explore: they can tap it to see the product in detail, or add it straight from the cart.",
      "The idea came from looking at competitors. [FunnelKit Cart](https://funnelkit.com/woocommerce-cart/), one of the plugins I reviewed, already suggests products inside its side cart. I kept the suggestions small so they never take over the cart.",
    ],
    next: [],
    nextList: [
      "**Empty cart:** “Your Cart Is Empty, Let's Fix That,” a featured product to add in one tap, and a Shop Now button.",
      "**Cart with items:** a small “You might also like” carousel below the items, showing one or two products as a style owners can pick.",
    ],
    result: [
      "The PM and the team agreed straight away, and both shipped while I was on the team. I carried the idea through the rest of the product: the popup cart uses the same suggestions, and store owners can rewrite the suggestion titles from the Text Label tab.",
      "Whether it's empty or full, the cart now always gives the shopper something to explore.",
    ],
    media: [
      mcRow(
        "From an empty panel to something to explore.",
        mc("popup-empty", "Empty, no suggestion"),
        mc("cart-empty-panel", "Empty, with a suggestion"),
        mc("cart-two-panel", "Full, with the carousel"),
      ),
    ],
  },
  {
    title: "Why I proposed a popup cart for stores that want the cart front and center",
    hook: "ModernCart opened one way: a panel sliding in from the side. Not every store wants its cart at the edge.",
    before: [
      "ModernCart had one way to open the cart: a panel sliding in from the side. Slide-out was the only cart type.",
    ],
    turningIntro: "Exploring new cart styles, I weighed two directions:",
    options: [
      {
        title: "Keep only the slide-out",
        body: "The shopper still sees the page behind it, so it feels light. But it's easy to glance past.",
      },
      {
        title: "Add a popup that opens in the center of the page",
        body: "It gets the shopper's full attention. The trade-off is that it covers the page while it's open.",
        chosen: true,
        badge: "Added alongside",
      },
    ],
    reasoning: [
      "Neither one is right for every store, so I proposed offering both and letting the store owner choose.",
      "Centered popup carts were already a familiar pattern in WooCommerce (for example, [WooCommerce Fast Cart](https://barn2.com/woocommerce-cart/) offers a lightbox cart in the middle of the screen), so store owners would recognize it.",
    ],
    next: [
      "I designed the full popup set: empty, empty with suggestions, and with items and suggestions in two item styles. Each one for desktop, tablet and mobile. On smaller screens the carousel drops from two products to one so the cards stay readable.",
    ],
    result: [
      "It shipped after I left, as a Cart Type setting (Slide-out or Popup). The plugin's WordPress.org listing is now named “Modern Cart: WooCommerce Side Cart & Popup Cart.”",
    ],
    media: [
      mcRow(
        "The popup cart on desktop, tablet and mobile. On small screens the carousel drops to one product.",
        mc("popup-items", "Desktop"),
        mc("popup-items-tablet-box", "Tablet"),
        mc("popup-items-mobile-box", "Mobile"),
      ),
      mcRow(
        "The same cart as a slide-out and as a popup.",
        mc("slideout-full", "Slide-out"),
        mc("popup-full", "Popup"),
      ),
    ],
  },
];

const cartAbandonment: CaseStudy = {
  slug: "cart-abandonment-recovery",
  cardTitle: "Cart Abandonment Recovery for WooCommerce",
  cardSummary:
    "A full admin redesign so store owners can finally see the sales the plugin wins back, plus the new features planned for it.",
  proof: "300K+ active installs. Redesigned end to end on ForceUI.",
  tone: "peach",
  image: "/assets/cart-abandonment.png?v=2026-11-17",
  imageClass: "project-image--cart",
  headline: "Redesigning Cart Abandonment Recovery so store owners can see what they win back",
  hook: "The plugin's whole job is to bring back lost sales. Yet its own admin showed six numbers, no chart, and no way to export them.",
  summary:
    "Cart Abandonment Recovery tracks shoppers who leave their cart, sends timed follow-up emails and shows store owners what came back. I redesigned the whole admin on ForceUI and designed its new features: a visual dashboard, detailed reports, new recovery channels and an email capture popup.",
  lead: [
    "As the only designer, working with a PM and developers, I took the plugin from three plain tabs to a full admin. The challenge was rebuilding something people already used every day, while making room for features it had never had.",
    "Today, Cart Abandonment Recovery has 300K+ active installs ([CartFlows](https://cartflows.com/cart-abandonment), [WP Hive](https://wphive.com/plugins/woo-cart-abandonment-recovery)).",
  ],
  stats: [
    { value: "300K+", label: "Active installs" },
    { value: "2 months", label: "May to June 2025" },
    { value: "Product Designer", label: "Role, with a PM and developers" },
    { value: "WooCommerce", label: "Platform, a WordPress plugin" },
  ],
  meta: [],
  hero: {
    caption: "The new Dashboard, with the six stat cards and the revenue comparison chart.",
    src: "/assets/cart-abandonment.png?v=2026-11-17",
  },
  sections: [
    {
      kind: "problem",
      id: "the-problem",
      nav: "The Problem",
      eyebrow: "The Problem",
      title: "A recovery plugin that couldn't show what it recovered",
      intro:
        "Cart Abandonment Recovery worked. It tracked abandoned carts and sent follow-up emails. But its admin still looked like a plain WordPress settings page, and it was falling behind competing recovery plugins.",
      story: [
        {
          label: "The business problem",
          text: "For a store owner, the only reason to use a recovery plugin is the revenue it brings back. If they can't see that clearly, they can't trust it, tune it, or justify paying for more. For Brainstorm Force, that meant two things: keeping the free plugin competitive, and giving store owners a clear reason to upgrade to Pro.",
        },
        {
          label: "Why it was worth solving",
          text: "A store owner who can see recovered revenue rising over time trusts the plugin and keeps using it. A store owner who sees six static numbers has no idea what's working.",
        },
      ],
      pains: [
        {
          title: "One page, two jobs",
          body: "The Report tab was both the dashboard and the report: six number cards with no chart, then a table of carts below.",
        },
        {
          title: "Data you couldn't use",
          body: "Reports had no search, no filters beyond date, and no export, so tracking and acting on the data was hard.",
        },
        {
          title: "Emails without results",
          body: "The follow-up email list showed name, subject and timing, but not how many were sent, opened or clicked.",
        },
        {
          title: "One long settings page",
          body: "Every setting sat on one page, with long columns of checkboxes for roles and order statuses.",
        },
        {
          title: "No room to grow",
          body: "Product reports, SMS, WhatsApp and popups were planned, and the old three-tab layout had nowhere to put them.",
        },
      ],
      media: caShot("The old Report page: six number cards and a plain table.", "old-report"),
      mapping: [
        ["One page mixed the dashboard and the report", "Recovery at a glance, details one click away"],
        ["Data was hard to track or export", "Every report searchable, filterable and exportable"],
        ["The layout had no room for new features", "A structure that can grow"],
        ["The UI didn't follow the design system", "Every screen in line with ForceUI"],
      ],
      constraints: [
        "Existing users knew the old plugin",
        "Stay inside ForceUI",
        "Feature list agreed up front",
        "No access to store owners for testing",
      ],
    },
    {
      kind: "journey",
      id: "walkthrough",
      nav: "Final Solution",
      eyebrow: "Final Solution",
      title: "One store owner, one shopper",
      intro: "Recovery has two sides: the owner watching the results, and the shopper who leaves and comes back.",
      story: [
        {
          text: "**Kavya** runs Leaf & Loom, a small home decor store on WooCommerce, with Cart Abandonment Recovery Pro. **Rohan** is browsing her store for a new lamp. The video follows both: Kavya setting up recovery and checking what came back, and Rohan leaving his cart and returning to buy.",
        },
      ],
      video: {
        kind: "video",
        caption: "",
        alt: "Cart Abandonment Recovery walkthrough: Kavya sets up her store's recovery, then Rohan leaves and comes back.",
        src: "/assets/videos/cart-abandonment-walkthrough.mp4?v=2026-11-17",
        poster: "/assets/videos/cart-abandonment-walkthrough.jpg?v=2026-11-17",
      },
      lanes: [],
    },
    {
      kind: "solution",
      id: "solution",
      nav: "Solution Explanation",
      eyebrow: "Solution Explanation",
      title: "What changed, part by part",
      intro: "Every change traces back to one of four problems: a page doing two jobs, data that was hard to use, no room to grow, and screens that didn't follow the design system.",
      items: [
        {
          area: "Structure",
          title: "Navigation built to grow",
          detail: "The old plugin had three plain tabs: Report, Follow-Up Emails and Settings. I rebuilt the top navigation on ForceUI as Dashboard, Follow Up Emails, Reports, Integrations and Settings, with Popup Templates added for Pro.",
          details: [
            "Reports became a dropdown, so new report types never crowd the top bar. More in Decision 1.",
          ],
          before: "Three plain tabs: Report, Follow-Up Emails, Settings.",
          after: "Five sections with room to grow.",
          media: { ...caRow("Old tabs vs the new top navigation.", ca("old-tabs", "Before: three plain tabs"), ca("topbar-live", "After: the new top navigation, with Reports open")), caption: "", stack: true },
          highlights: ["ForceUI product bar", "Reports dropdown", "Room for new features"],
        },
        {
          area: "Dashboard",
          title: "Recovery at a glance",
          detail: "The old Report page showed six numbers and nothing else. The new Dashboard keeps the six stat cards and adds a chart comparing recoverable and recovered revenue over time, with one date range picker that updates both.",
          details: [
            "Below the chart, a Recent Follow Up Report table and a Product Report table each have View All, so the details are one click away. More in Decision 3.",
          ],
          before: "Six numbers and nothing else.",
          after: "Numbers, trend and recent activity in one view.",
          media: { ...caRow("Old Report page vs the new Dashboard.", ca("old-report-cards", "Before"), ca("dashboard-overview", "After")), caption: "" },
          highlights: ["Six stat cards", "Revenue comparison chart", "One date picker for everything", "Recent follow-ups", "Product Report"],
        },
        {
          area: "Emails",
          title: "A list that shows what works",
          detail: "Store owners couldn't tell which emails were bringing shoppers back. The template list now shows sent count, open rate and click rate beside each template, along with conversion and unsubscribe rates.",
          details: [
            "At a glance, an owner can see that the second email is doing most of the work, and tune the others.",
          ],
          before: "Name, subject and timing only.",
          after: "Results beside every template.",
          media: { ...caRow("The old Follow-Up Emails list vs the new list with sent, open, click, conversion and unsubscribe rates.", ca("old-email-list", "Before"), ca("email-list", "After")), caption: "" },
          highlights: ["Sent count", "Open rate", "Click rate"],
        },
        {
          area: "Emails",
          title: "Editing in a drawer",
          detail: "The old editor was a long WordPress form on its own page. Editing now opens a drawer beside the list, with the subject, body and variables, send timing, coupon, test email and WooCommerce email style grouped together.",
          details: [
            "The rule engine already existed, but some rule options were missing. I redesigned it on ForceUI as a toggle in the drawer that reveals a simple condition builder (rule type, operator, value, add rule), and the missing options were added.",
          ],
          before: "A long WordPress form on its own page.",
          after: "Everything in a drawer, with the list still in view.",
          media: caShot("The edit drawer with the rule engine turned on.", "rule-engine"),
          highlights: ["Subject, body and variables", "Send timing", "Auto coupon", "Test email", "Rule engine"],
        },
        {
          area: "Reports",
          title: "Reports you can search and export",
          detail: "The old cart table had bulk actions and little else. The Email Report now has search, a status filter, a date picker, Export, a country column, colored status chips, and row actions to view, unsubscribe or delete.",
          details: [
            "Product Report is new, showing which products are abandoned and recovered most.",
          ],
          before: "A cart table with bulk actions and little else.",
          after: "Find, filter and export anything.",
          media: caShot("The Follow Up Reports table with search, the status filter open, a date picker and Export.", "email-report"),
          highlights: ["Search", "Status filter", "Export", "Status chips", "Row actions", "New Product Report"],
        },
        {
          area: "Reports",
          title: "Every detail of one cart",
          detail: "Opening a cart shows its Email Log on a full page: the scheduled emails with coupon and status, billing and shipping addresses side by side, and the order items with totals.",
          details: [
            "Reschedule Emails sits right beside the email list, so an owner can act on what they see. More in Decision 2.",
          ],
          after: "The full story of one cart, on one page.",
          media: { ...caRow("The old cart detail page vs the new Email Logs page.", ca("old-cart", "Before"), ca("email-logs", "After")), caption: "" },
          highlights: ["Scheduled emails", "Coupon and status", "Billing and shipping", "Order items and totals"],
        },
        {
          area: "Settings",
          title: "Settings split by topic",
          detail: "The old settings sat on one long page, with long columns of role and order status checkboxes. Settings now has a left sub-menu: General, Coupon, Email, Recovery Report, GDPR and Advanced.",
          details: [
            "Tracking is a toggle, roles and statuses are multi-select fields with chips, each setting sits in its own card with a one-line explanation, and saving shows a confirmation. Notify Recovery To Admin, Recovery Report emails and GDPR are new.",
          ],
          before: "One long page of checkbox columns.",
          after: "Six groups, one card per setting.",
          media: caShot("General settings: a sub-menu by topic, one card per setting and a save confirmation.", "settings-general"),
          highlights: ["Six setting groups", "Chip multi-selects", "One card per setting", "Save confirmation", "New GDPR settings"],
        },
        {
          area: "Integrations",
          title: "More ways to reach shoppers",
          detail: "Integrations is new: Webhook, SMS, WhatsApp and OttoKit, each with its own page in a left sub-menu and an enable toggle.",
          details: [
            "Shoppers don't all read email. With these channels, owners can follow up wherever their shoppers actually reply.",
          ],
          before: "Email was the only channel.",
          after: "Four new channels, each with its own page.",
          media: { ...caRow("Integrations: the Webhook page with its sub-menu, and the OttoKit page.", ca("integrations-webhook", "Webhook"), ca("integrations-ottokit", "OttoKit")), caption: "" },
          highlights: ["Webhook", "SMS", "WhatsApp", "OttoKit"],
        },
        {
          area: "Pro",
          title: "Popup Templates",
          detail: "A Pro feature that captures a shopper's email when they add to cart or try to leave. The list shows each template's type, views, emails captured and “No thanks” clicks.",
          details: [
            "Editing opens the popup in Spectra, Brainstorm Force's page builder, while rules and coupons stay in the plugin. More in Decision 4.",
          ],
          before: "No way to reach shoppers who leave before checkout.",
          after: "Emails captured before checkout, with results tracked.",
          media: { ...caRow("The Popups list, and the drawer where rules and coupons stay.", ca("popups-list", "Popups list"), ca("popup-rules", "Rules and coupons")), caption: "" },
          highlights: ["Add to cart popups", "Exit popups", "Captures and views", "“No thanks” clicks", "Designed in Spectra"],
        },
        {
          area: "Pro",
          title: "Upgrade to Pro",
          detail: "I designed how Pro features appear to free users across the Dashboard, Follow Up Emails, Product Report, Integrations and Settings, without blocking anything they already use.",
          details: [
            "All of them shipped: a Pro card where the Product Report sits on the Dashboard, and PRO badges with blurred numbers in Follow Up Emails.",
          ],
          after: "Pro in view, never in the way.",
          media: { ...caRow("The free Dashboard's Pro card and the Follow Up Emails list with blurred Pro columns.", ca("pro-dashboard", "Dashboard"), ca("pro-emails", "Follow Up Emails")), caption: "" },
          highlights: ["Dashboard", "Follow Up Emails", "Product Report", "Integrations", "Settings"],
        },
      ],
    },
    {
      kind: "decisions",
      id: "critical-decisions",
      nav: "Decisions",
      eyebrow: "Critical Decisions",
      title: "Four decisions that shaped the new admin",
      items: cartAbandonmentDecisions,
    },
    {
      kind: "system",
      id: "design-system",
      nav: "Design System",
      eyebrow: "Design System",
      title: "Built on ForceUI, so it feels like family",
      intro: "Cart Abandonment Recovery sits in the CartFlows family, next to ModernCart. Rebuilding it on ForceUI, Brainstorm Force's shared design system, meant a store owner moving between these plugins finds the same layout, the same controls and the same behavior.",
      patterns: [
        {
          title: "Top navigation",
          body: "The same product bar as other Brainstorm Force plugins, with the version, help and announcements on the right.",
        },
        {
          title: "Left sub-menus",
          body: "Inside Integrations and Settings, so each channel and each group of settings gets its own page without crowding the top bar.",
        },
        {
          title: "Side drawers",
          body: "Follow-up emails and popup settings open beside their list, so store owners never lose their place.",
        },
        {
          title: "Status chips",
          body: "One table style across reports, logs and templates, with colored chips for Abandoned, Successful, Failed and Normal.",
        },
        {
          title: "Setting cards",
          body: "Every setting sits in its own card with a one-line explanation, replacing the old grey notes under each field.",
        },
        { title: "Chip multi-selects", body: "Replacing long columns of checkboxes for roles and order statuses." },
      ],
      tokens: [
        { sample: "type", label: "Type", value: "Figtree" },
        { sample: "color", label: "Accent", value: "Flamingo, CartFlows' orange" },
      ],
    },
    {
      kind: "process",
      id: "process",
      nav: "Process",
      eyebrow: "Process",
      title: "Planned up front, designed in phases",
      intro: "Unlike ModernCart, which started with a one-week deadline, this project started with a plan.",
      steps: [
        {
          label: "Research",
          title: "Learning from other recovery plugins",
          body: "Before any design, the team researched what the plugin was missing, and I was part of it. We studied competing recovery plugins, including YITH Recover Abandoned Cart and VillaTheme, and collected their screens on a References board in Figma.",
          media: caShot("Where we started: the old plugin's email editor, a long WordPress form.", "old-editor"),
        },
        {
          label: "Feature list",
          title: "Agreeing on what to build",
          body: "Everything we wanted to add went into a shared sheet, and the team decided what made the cut. That list became my brief, agreed up front with the PM and developers.",
          media: { ...caRow("Two features that made the list: new recovery channels and the email capture popup.", ca("integrations-webhook", "New channels"), ca("popups-list", "Email capture popup")), caption: "" },
        },
        {
          label: "Full design",
          title: "Designing it all first",
          body: "I designed the whole admin before any build started, so every page shared one navigation, one layout and one set of ForceUI patterns. Then the team split the work into two phases.",
          media: caShot("The Dashboard, designed with the rest of the admin before the build began.", "dashboard-overview"),
        },
        {
          label: "Phase 1",
          title: "Shipping the core admin",
          body: "The core admin came first: Dashboard, Follow Up Emails with the rule engine and coupons, Reports, Integrations and Settings.",
          points: ["Dashboard", "Follow Up Emails", "Reports", "Integrations", "Settings"],
          media: { ...caRow("Phase 1 screens: the Follow Up Reports table and General settings.", ca("email-report-top", "Reports"), ca("settings-general", "Settings")), caption: "" },
        },
        {
          label: "Phase 2",
          title: "Popup Templates, and where the plan changed",
          body: "I first designed popup editing inside the plugin itself: a drawer with a live preview, text, colors and the “No thanks” option. In discussion, the team decided to open popups in Spectra, Brainstorm Force's page builder, where store owners can customize every detail visually. The plugin keeps the popup's settings, rules and coupons.",
          details: [
            "It wasn't a choice I disagreed with, just one I didn't expect: Spectra already does visual editing well, and reusing it lets the two plugins work together.",
          ],
          media: {
            ...caRow("My in-plugin popup editor beside the Spectra editor that shipped.", ca("popup-in-plugin", "My first version, in the plugin"), ca("spectra-editor", "Shipped, in Spectra")),
            caption: "",
          },
        },
      ],
      notes: [
        {
          title: "Decisions made together",
          body: "Most decisions came out of discussions with the PM and developers, like the Reports dropdown and the full-page Email Logs. I shared versions, we talked through the trade-offs, and I updated the designs. The feedback on the finished work was positive.",
        },
      ],
    },
    {
      kind: "future",
      id: "future-scope",
      nav: "Future Scope",
      eyebrow: "Future Scope",
      title: "Where it could go next",
      intro: "The features we planned all shipped, so these are directions I'd explore next, based on what the design now makes visible.",
      tag: "Next",
      items: [
        {
          title: "Guide the popup decision",
          body: "The popup already counts “No thanks” clicks. The next step would be turning that number into guidance, for example showing how many skipped shoppers still bought, so store owners know whether making the email mandatory is worth it.",
        },
        {
          title: "Compare recovery by channel",
          body: "With email, SMS and WhatsApp all available, store owners will want to know which channel brings shoppers back. A dashboard view that splits recovered revenue by channel would answer that.",
        },
        {
          title: "Test with store owners",
          body: "There was no usability testing on this project. I'd start with the dashboard and the rule engine, the two places where store owners make the most decisions.",
        },
      ],
    },
    {
      kind: "learnings",
      id: "learnings",
      nav: "Learnings",
      eyebrow: "Learnings",
      title: "What this project taught me",
      items: [
        {
          title: "Let the content choose the pattern.",
          body: "Consistency matters, but a detailed report and a quick edit need different homes. Email Logs taught me to ask which one I'm designing before reaching for a familiar pattern.",
        },
        {
          title: "Reuse what the company already does well.",
          body: "Opening popups in Spectra instead of rebuilding an editor was faster to build and better for store owners.",
        },
        {
          title: "Balance the store's goal with the shopper's patience.",
          body: "The optional email field came from asking how a shopper would feel seeing the same popup again and again.",
        },
        {
          title: "A visible gap beats a clever interaction.",
          body: "The dashboard chart works because it always shows what was at risk and what came back.",
        },
      ],
    },
    {
      kind: "outcome",
      id: "outcome",
      nav: "Outcome",
      eyebrow: "Outcome",
      title: "From a settings page to a recovery dashboard",
      intro: "Cart Abandonment Recovery started as three plain tabs that showed six numbers. Over May and June, it became a full admin with a visual dashboard, searchable and exportable reports, detailed email logs, new recovery channels, and an email capture popup for Pro. The designs shipped, and today the plugin has 300K+ active installs.",
      before: "Three plain tabs and six numbers",
      after: "A dashboard, reports, logs, new channels and a Pro popup",
      stat: { value: "300K+", label: "Active installs today" },
      feedback: feedback("How would you have handled the Email Logs drawer versus full page question?"),
    },
  ],
};

const modernCart: CaseStudy = {
  slug: "modern-cart",
  cardTitle: "ModernCart for WooCommerce",
  cardSummary:
    "Took an unreleased side cart plugin to launch in one week, then turned an empty cart into a place shoppers keep browsing.",
  proof: "60K+ active installs. Ready to launch in one week.",
  tone: "peach",
  image: "/assets/modern-cart.png?v=2026-11-17c",
  imageClass: "project-image--modern",
  headline: "Redesigning ModernCart so its cart stopped being a dead end",
  hook: "ModernCart had been built by developers and left unreleased. Then the PM made the call: it goes live in one week.",
  summary:
    "ModernCart adds a side cart to WooCommerce stores, so shoppers can see and change their order from any page without leaving it. The features worked, but nobody had designed them around the owners who set it up or the people buying with it.",
  lead: [
    "As the only designer, working with a PM and developers, I made it launch-ready in that week. Until I left at the end of June 2025, I then designed what came next: a dashboard organized around what store owners actually do, and a cart that offers products when it would otherwise sit empty.",
    "The challenge was doing both on a product that was already built, inside a design system the team was still building.",
  ],
  stats: [
    { value: "60K+", label: "Active installs on [WordPress.org](https://wordpress.org/plugins/modern-cart/)" },
    { value: "3 months", label: "April to June 2025" },
    { value: "4.9 / 5", label: "Rating from 17 reviews on [WordPress.org](https://wordpress.org/plugins/modern-cart/#reviews)" },
    { value: "Product Designer", label: "Role, with a PM and developers" },
  ],
  meta: [],
  hero: {
    caption: "The ModernCart dashboard, General tab.",
    src: "/assets/modern-cart-hero.png?v=2026-11-20b",
  },
  sections: [
    {
      kind: "problem",
      id: "the-problem",
      nav: "The Problem",
      eyebrow: "The Problem",
      title: "Built, but not ready for the people using it",
      intro:
        "ModernCart was built by developers at Brainstorm Force but had never been released. The features worked, but nobody had designed it around the store owners who set it up or the shoppers who use it. With launch a week away, that gap had to close fast.",
      story: [
        {
          label: "The business problem",
          text: "WooCommerce's default cart sends shoppers to a separate cart page, which breaks their flow right when they are about to buy. Side cart plugins fix this by opening the cart on the page shoppers are already on, and competitors were already selling them. Brainstorm Force wanted ModernCart in that market as part of the CartFlows family. From a business point of view, that meant two things: more shoppers finishing checkout, and a higher average order value.",
        },
        {
          label: "Why it was worth solving",
          text: "A store owner who struggles with the settings won't set the cart up well, and a badly set up cart loses shoppers. An empty cart is also the moment a shopper is already looking for something to buy. Showing them nothing wastes it.",
        },
      ],
      pains: [
        {
          title: "Scattered settings",
          body: "Related options sat in different tabs, and some, like the floating cart settings, sat inside General where nobody would look for them.",
        },
        {
          title: "Off the design system",
          body: "Spacing, type and colors didn't follow ForceUI, so the dashboard felt unfinished.",
        },
        {
          title: "Nowhere to go",
          body: "Open the cart empty and you saw one line saying so, with nothing to look at and nowhere to go.",
        },
        {
          title: "Just a list",
          body: "Add items and the cart was a plain list, with no reason to stay and browse.",
        },
      ],
      mapping: [
        ["Scattered settings, no clear structure", "Settings grouped around owners' tasks"],
        ["An empty cart with no next step", "An empty cart that suggests something"],
        ["UI off the design system", "Every screen on ForceUI"],
      ],
      constraints: [
        "One week to launch",
        "ForceUI components unchanged",
        "Build on the existing developer build",
        "No access to owners or shoppers",
      ],
    },
    {
      kind: "journey",
      id: "walkthrough",
      nav: "Final Solution",
      eyebrow: "Final Solution",
      title: "One store, one shopper",
      intro: "ModernCart has two parts: a dashboard where store owners shape the cart, and the cart shoppers actually use. Every choice in the first shows up in the second.",
      story: [
        {
          text: "**Meera** runs DNK, a small clothing and footwear store on WooCommerce. **Arjun** is shopping there for a new pair of shoes. The video follows both: Meera setting up her cart, then Arjun shopping with it.",
        },
      ],
      video: {
        kind: "video",
        caption: "",
        alt: "ModernCart walkthrough: Meera sets up her store's cart, then Arjun shops with it.",
        src: "/assets/videos/modern-cart-walkthrough.mp4?v=2026-11-20c",
        poster: "/assets/videos/modern-cart-walkthrough.jpg?v=2026-11-20d",
      },
      lanes: [],
    },
    {
      kind: "solution",
      id: "solution",
      nav: "Solution Explanation",
      eyebrow: "Solution Explanation",
      title: "What changed, part by part",
      intro: "Every change traces back to one of the three problems: scattered settings, a cart that led nowhere, and screens that didn't follow the design system.",
      items: [
        {
          title: "Settings grouped by task",
          detail: "Store owners had to hunt for what they needed. I split the dashboard into five tabs, each with one job: My Account for the plan and license, General for how the cart behaves, Text Label for what it says, Floating Cart Icon for the icon shoppers see on every page, and Styling for how it looks.",
          before: "Settings scattered across tabs.",
          after: "Five tabs, one job each.",
          media: { caption: "", alt: "The dashboard tabs one after another: My Account, General, Text Label, Floating Cart Icon and Styling, each scrolled through.", src: "/assets/videos/modern-cart-tabs.mp4?v=2026-11-20c", size: [1546, 964] },
        },
        {
          title: "Cart text that sounds like the store",
          detail: "The wording was fixed, so it couldn't sound like the store it lived in. In Text Label, every word a shopper sees is editable, from the heading to the empty cart message and the free shipping line. Each field starts filled with sensible defaults, so owners only change what they care about.",
          before: "Fixed wording in every store.",
          after: "Every word editable, defaults filled in.",
          media: mcRow(
            "The Empty Cart fields in Text Label, and the empty cart they write.",
            mc("text-label-empty-fields", "Text Label"),
            mc("cart-empty-panel", "In the cart"),
          ),
        },
        {
          title: "The floating cart in its own tab",
          detail: "The floating cart icon is what shoppers see on every page, but its settings were buried inside General. It now has its own tab with position, hide when empty and a set of presets. Custom upload came out of my competitor review; the team designed and built it after I left.",
          before: "Buried inside General.",
          after: "Its own tab, with custom upload later.",
          media: mcShot("Position, hide when empty, and preset icons in their own tab.", "floating-icon-card"),
        },
        {
          title: "Styling that's safe to try",
          detail: "Store owners hesitate to change how the cart looks when they're not sure they can undo it. Styling is now grouped into Colors, Icon Style, Width and Miscellaneous. Each swatch has a reset button, number fields show their default underneath (“Default width: 450px”), and units like px, % and ms sit inside the input, so trying something bold never feels risky.",
          before: "Owners hesitated to change what they couldn't undo.",
          after: "Grouped, resettable, defaults in view.",
          media: mcRow(
            "Reset buttons on colors, and defaults and units on number fields.",
            mc("styling-colors", "Reset on every color"),
            mc("styling-width", "Defaults and units"),
          ),
        },
        {
          title: "Product suggestions",
          detail: "Shoppers who opened an empty cart found nothing, and a full one gave them no reason to stay. Now that state shows a featured product with a Shop Now button, and a “You might also like” carousel sits below the items once something is added.",
          before: "Empty carts showed nothing; full carts were just lists.",
          after: "Something to explore, empty or full.",
          media: mcRow(
            "A featured product when the cart is empty, then one or two suggestions below the items.",
            mc("cart-empty-panel", "Empty"),
            mc("cart-one-panel", "One suggestion"),
            mc("cart-two-panel", "Two suggestions"),
          ),
        },
        {
          title: "A clearer coupon field",
          detail: "My first version was a collapsible “Got a Discount Code?” row. It worked, but in a review the CEO pointed out that it didn't feel like applying anything. That feedback led to the redesign, and to the coupon styles store owners can pick from today. “Apply Coupon Code” now stays a link until it's needed, opens into a field with a button, and shows the code as a tag that can be removed in one tap, so the shopper always knows which discount is active.",
          before: "A collapsible “Got a Discount Code?” row.",
          after: "Link, field, removable tag.",
          media: mcRow(
            "A quiet link, then a field, then a tag you remove in one tap.",
            mc("coupon-link-crop", "A quiet link"),
            mc("coupon-field-crop", "Opens into a field"),
            mc("coupon-tag-crop", "Becomes a tag"),
          ),
        },
        {
          title: "A complete order summary",
          detail: "Shoppers couldn't see what made up their total. The order summary now lays out shipping, tax, subtotal and savings, so the final amount never comes as a surprise at checkout.",
          before: "No breakdown of the total.",
          after: "The full breakdown, before checkout.",
          media: mcRow(
            "Two order summary styles, and several codes stacked as tags.",
            mc("coupon-link-crop", "Simple list"),
            mc("summary-card-crop", "Card, total in the button"),
            mc("summary-tags-crop", "Several codes"),
          ),
        },
        {
          title: "A popup cart",
          detail: "Some stores want the cart front and center, not at the edge of the screen. I designed a second cart type that opens in the middle of the page, for desktop, tablet and mobile.",
          before: "Slide-out was the only option.",
          after: "A centered popup on every screen.",
          media: mcRow(
            "The popup cart, empty with a suggestion and with items.",
            mc("popup-suggest", "Empty, with a suggestion"),
            mc("popup-items", "With items"),
          ),
        },
      ],
      variants: {
        title: "Styles store owners can choose from",
        intro: "Not every store wants the same cart, so the parts that vary most got options.",
        items: [
          {
            count: "2",
            name: "Cart types",
            body: "Slide-out or popup. The slide-out keeps the page visible behind it; the popup takes the shopper's full attention.",
          },
          {
            count: "6",
            name: "Item layouts",
            body: "Layouts that change where the remove and quantity controls sit. Some stores want editing front and center, others prefer it quiet.",
          },
          {
            count: "2",
            name: "Order summaries",
            body: "A simple list sitting above checkout, or a card with its own heading and the total inside the button.",
          },
          {
            count: "2",
            name: "Coupon styles",
            body: "One handles a single code. The other shows several as tags, for stores that let shoppers stack discounts.",
          },
          {
            count: "1–2",
            name: "Carousel sizes",
            body: "One or two products at a time, so it fits narrow carts and wider ones.",
          },
          {
            count: "2",
            name: "Cart footers",
            body: "View Cart and Checkout, or Checkout only. Some stores want a full basket page first, others the fastest path to paying.",
          },
        ],
      },
    },
    {
      kind: "decisions",
      id: "critical-decisions",
      nav: "Decisions",
      eyebrow: "Critical Decisions",
      title: "Three decisions that shaped ModernCart",
      items: modernCartDecisions,
    },
    {
      kind: "system",
      id: "design-system",
      nav: "Design System",
      eyebrow: "Design System",
      title: "Built on ForceUI, a system I helped create",
      intro:
        "Every screen in ModernCart, the dashboard and the shopper's cart, is assembled from ForceUI. Nothing was drawn from scratch.",
      story: [
        {
          label: "Why ForceUI existed",
          text: [
            "When I joined Brainstorm Force, each plugin had its own design system. During this project, the team decided to bring them together into one shared system, ForceUI, and I worked on its atoms and molecules, while other designers built the larger patterns and templates. It lives in Figma and as React code, so designers and developers work from the same components.",
            "One rule kept the two in sync: nobody changes a component on their own. If something needed to change, it went through a ticket, so the Figma file and the code never drifted apart. The developers also kept a React Storybook of every component, which we used as a reference for how and where each one should be used.",
          ],
        },
        {
          label: "Four levels, all used in ModernCart",
          text: "ForceUI is built in layers, from the smallest pieces up to full page layouts. ModernCart uses every level.",
        },
      ],
      levels: [
        {
          title: "Atoms",
          body: "The smallest pieces: buttons, toggles, badges, inputs, dropdowns. In ModernCart, they're the toggles on each setting, the Upgrade buttons and the badges.",
        },
        {
          title: "Molecules",
          body: "Atoms combined into a reusable unit, like a toggle with its label and description. Every settings row in the dashboard is one of these.",
        },
        {
          title: "Patterns",
          body: "Larger sections that repeat across products: the top bar, the sidebar, modals and cards. ModernCart's top navigation, left menu and upgrade modal come from here.",
        },
        {
          title: "Templates",
          body: "Full page layouts. ForceUI's Admin Settings template is the shape of the ModernCart dashboard: product navigation on top, a sidebar, and cards of settings.",
        },
      ],
      levelsMedia: {
        caption: "",
        alt: "Pages from the ForceUI library in Figma, from atoms to molecules.",
        row: [
          { src: "/assets/modern-cart/forceui/buttons.webp?v=2026-11-20", size: [440, 625], label: "Atoms: Buttons", full: { src: "/assets/modern-cart/forceui/full-buttons.webp?v=2026-11-20", size: [1432, 1008], crop: [0.317, 0.0744, 0.3073, 0.62] } },
          { src: "/assets/modern-cart/forceui/input.webp?v=2026-11-20", size: [432, 414], label: "Atoms: Input Base", full: { src: "/assets/modern-cart/forceui/full-input.webp?v=2026-11-20", size: [1425, 999], crop: [0.4477, 0.0511, 0.3032, 0.4144] } },
          { src: "/assets/modern-cart/forceui/date-picker.webp?v=2026-11-20", size: [705, 626], label: "Molecules: Date Picker", full: { src: "/assets/modern-cart/forceui/full-date-picker.webp?v=2026-11-20", size: [1430, 900], crop: [0.0636, 0.1133, 0.493, 0.6956] } },
        ],
      },
      tokens: [
        { sample: "type", label: "Type", value: "Figtree, four weights" },
        { sample: "color", label: "Accent", value: "Flamingo, CartFlows' orange" },
        { sample: "icons", label: "Icons", value: "Lucide plus a WordPress set" },
      ],
      note: {
        title: "The one rule I bent",
        body: "In Styling, number fields needed their unit (px, % or ms) inside the field, so store owners always know what the number means. ForceUI's input didn't support that, so I broke the component in my design to fit a small unit badge inside it. The team shipped it as plain text instead of a badge, but the unit still sits inside the field.",
      },
    },
    {
      kind: "process",
      id: "process",
      nav: "Process",
      eyebrow: "Process",
      title: "One week to launch, then making it better",
      intro: "The work didn't follow a neat research, wireframe, UI order. It started with a deadline, moved into research once the product was live, and ran alongside the team building a new design system.",
      steps: [
        {
          label: "Week 1",
          title: "Getting it ready to publish",
          body: "The PM's call was simple: publish ModernCart within a week. There was no time to redesign from scratch, so the goal was to make what existed feel finished.",
          details: [
            "I rebuilt the screens with ForceUI components, then reviewed the developer build with the PM. I logged 20 to 30 issues in a shared Google Sheet, each with a screenshot and a note on spacing, alignment, type, color or responsiveness.",
            "Developers fixed them in parallel while I prepared the assets they needed. The free version went live on schedule.",
          ],
          points: ["Launched on schedule"],
          media: mcShot("The General tab, rebuilt with ForceUI for launch.", "general-tab"),
        },
        {
          label: "After launch",
          title: "Learning from five competitors",
          body: "With the product live, the question changed from “is it ready?” to “what should it do next?” The company bought licenses for five competing cart plugins. I installed each one on a demo site and used it as a store owner would, comparing settings, features and how much store owners could customize.",
          details: [
            "That review shaped most of what came next: preset cart icons and custom icon upload, cart position controls, style options for the cart, header and order summary, and product suggestions in the cart.",
          ],
          points: [
            "[Side Cart WooCommerce](https://wordpress.org/plugins/side-cart-woocommerce/)",
            "[FunnelKit Cart](https://funnelkit.com/woocommerce-cart/)",
            "[Mini Cart for WooCommerce](https://wordpress.org/plugins/mini-cart-for-woocommerce/)",
            "[Side Cart & Checkout](https://woocommerce.com/products/side-cart-checkout/)",
            "[Flycart](https://wordpress.org/plugins/woo-fly-cart/)",
          ],
          media: {
            caption: "",
            alt: "Three of the competitor plugins I reviewed, from their WordPress.org pages.",
            row: [
              { src: "/assets/modern-cart/competitors/funnelkit.webp?v=2026-11-20", size: [1195, 777], label: "FunnelKit Cart: settings beside a live preview" },
              { src: "/assets/modern-cart/competitors/mini-cart.webp?v=2026-11-20", size: [1167, 607], label: "Mini Cart: settings with a live preview" },
              { src: "/assets/modern-cart/competitors/side-cart.webp?v=2026-11-20", size: [867, 912], label: "Side Cart: suggestions in the cart" },
            ],
          },
        },
        {
          label: "Tickets",
          title: "Turning ideas into tickets",
          body: "I shared what I found with the team, and the PM decided what to build first. I wrote a Jira ticket for each feature, with a description and the designs.",
          details: [
            "The Figma file was organized the same way, one section per ticket, so anyone could match a design to its ticket.",
          ],
          media: mcRow("One ticket's designs: the coupon field in its three states.", mc("coupon-link-crop", "Link"), mc("coupon-field-crop", "Field"), mc("coupon-tag-crop", "Tag")),
        },
        {
          label: "Free and Pro",
          title: "Planning the Free and Pro split",
          body: "The team then started planning a Free and Pro version. The PM decided which features went where, and I designed how Pro features would appear to free users (Decision 1).",
          media: mcShot("The Free vs Pro tab, comparing every feature.", "free-vs-pro"),
        },
      ],
      notes: [
        {
          title: "Why no wireframes",
          body: "ForceUI already had the pieces I needed, so I worked in high fidelity from the start. Sketching boxes would have meant redrawing components that already existed. The trade-off was less room to explore wild ideas early, which is why the competitor review mattered so much.",
        },
        {
          title: "What I assumed",
          body: "There were no interviews or usability tests, so a few choices rest on assumptions I'd want to test: shoppers who open the cart are still in shopping mode, store owners want to change the cart's look and words without touching code, and defaults shown next to each setting make owners more willing to experiment.",
        },
      ],
    },
    {
      kind: "future",
      id: "future-scope",
      nav: "Future Scope",
      eyebrow: "Future Scope",
      title: "Ideas that shipped after I left",
      intro: "These three ideas came out of my competitor review. I suggested them and talked through with the team where each would sit; the team designed and shipped them after I left at the end of June 2025.",
      tag: "Shipped later",
      items: [
        {
          title: "Live preview",
          body: "Store owners were changing colors, icons and sizes without seeing the result until they opened their storefront. Competitors showed a preview right next to the settings, so I recommended the same. The team later designed and added a cart preview to the dashboard, showing the floating icon and the cart, both empty and with items ([v1.0.8](https://wordpress.org/plugins/modern-cart/)).",
        },
        {
          title: "Custom icon upload",
          body: "The preset icons cover most stores, but a brand with its own icon style still couldn't match it. I proposed letting store owners upload their own icon. It now sits in the Floating Cart Icon tab, under the preset icons.",
        },
        {
          title: "Cart header styling",
          body: "The competitor review showed that stores wanted control over the top of the cart, not just its colors. I suggested header styling as one of the style options, and the team added it to the Styling tab ([v1.0.1](https://wordpress.org/plugins/modern-cart/)).",
        },
      ],
      media: [
        mcRow(
          "How these ideas look in the plugin today.",
          mc("live-preview", "Live preview"),
          mc("custom-icon-card", "Custom icon upload"),
          mc("icon-preview-card", "Icon preview"),
        ),
      ],
    },
    {
      kind: "learnings",
      id: "learnings",
      nav: "Learnings",
      eyebrow: "Learnings",
      title: "What this project taught me",
      items: [
        {
          title: "A deadline decides what “done” means.",
          body: "In week one, clear, screenshot-backed feedback mattered as much as the design itself.",
        },
        {
          title: "Bring options, not verdicts.",
          body: "Laying out choices with their trade-offs makes ideas easier to discuss, whichever way the decision goes.",
        },
        {
          title: "Know the system's rules well.",
          body: "It's what tells you when bending one is worth it, and when a simpler version is good enough.",
        },
        {
          title: "Competitors show what exists, not what people need.",
          body: "Next time I'd pair a competitor review with even a few conversations with store owners.",
        },
      ],
    },
    {
      kind: "outcome",
      id: "outcome",
      nav: "Outcome",
      eyebrow: "Outcome",
      title: "From an unreleased build to a cart that keeps shoppers going",
      intro: "ModernCart started as a working build that nobody had designed for. In one week it was ready to publish. In the weeks after, it gained a dashboard organized around tasks, a cart that suggests products, and a second cart type. Several of those ideas shipped after I left, and today the plugin has 60K+ active installs.",
      before: "A working build nobody had designed for",
      after: "A task-based dashboard, a cart that suggests, and a second cart type",
      stat: { value: "60K+", label: "Active installs today" },
      feedback: feedback("How would you have handled the Free and Pro question?"),
    },
  ],
};

// Built from the "Social Feed Case Study" doc. The brand and people in the walkthrough are made up.
const superfansDecisions: DecisionItem[] = [
  {
    title: "Why the dashboard shows posts as a grid, not a table",
    hook: "A feed of short videos is about what you see. Our first two dashboard layouts made merchants read instead.",
    before: [
      "The Superfans dashboard already had a familiar pattern from the app builder: a side panel of blocks and a properties panel for editing. The obvious start was to reuse it for Social Feed.",
    ],
    turningIntro: "We tried two directions before landing on a third:",
    options: [
      {
        title: "Reuse the builder layout",
        body: "Consistent with the rest of the dashboard, so merchants would feel at home. But it was built for arranging blocks, not browsing and managing a stream of videos.",
      },
      {
        title: "A table of posts",
        body: "A clear list with rows for each post. But video content looked flat in rows, and it didn't suit how merchants think about their feed.",
      },
      {
        title: "A visual layout inspired by short video apps",
        body: "A grid of thumbnails to scan, and a single post view with a phone preview and the comments beside it. Less like the rest of the dashboard, but it matched the content.",
        chosen: true,
      },
    ],
    reasoning: [
      "We dropped the first two and went with the visual layout. Consistency is a good default, but here the content type had to decide the layout.",
    ],
    next: [
      "I designed the grid view and the single post view, and recorded the change in the version log as “Removed tabular layout to make it more visual. Added grid view and single view.”",
    ],
    result: [
      "The grid and single post view became the base for everything that followed in the dashboard, from comments to Instagram import.",
    ],
    media: [{ caption: "The early table version." }, { caption: "The grid view." }],
  },
  {
    title: "Why we improved the post view instead of redesigning it",
    hook: "We found a better design. We still didn't ship it, and that was the right call.",
    before: [
      "Opening a post in the dashboard showed the comments first. To edit the post itself, merchants had to find the menu inside the comments panel.",
    ],
    turningIntro: "There were three options:",
    options: [
      {
        title: "A YouTube Shorts style view",
        body: "Just the video, with a menu to edit the post and a comment icon to open comments. Clean, and the team liked it. But it meant rebuilding a view that was already built and about to go live.",
      },
      {
        title: "Tabs for Edit Post and Comments",
        body: "Easy to switch between the two jobs. But it added another layer to a simple screen.",
      },
      {
        title: "Improve the existing view",
        body: "Keep the layout and make editing easier to reach. Less ambitious, but it could ship on time.",
        chosen: true,
      },
    ],
    reasoning: [
      "We chose to improve the existing view. The feature was close to release, and a bigger redesign would have delayed it for a gain we could add later.",
    ],
    next: [
      "I added a simple header to the post: its title, when it was posted, likes and comments, and a menu for Edit, Copy Post ID, Hide and Delete. I also explored showing post metrics (CTR, unique views, likes, comments) in the same header.",
    ],
    result: ["The improved header shipped. The metrics version is a next step the team may add later."],
    media: [{ caption: "The Tab exploration." }, { caption: "The YouTube Shorts exploration." }, { caption: "The shipped header." }],
  },
  {
    title: "Why moderation uses a dropdown, not tick and cross buttons",
    hook: "I argued for the faster design. After several rounds of debate, the team chose a different one, and I designed that one.",
    before: [
      "The spec first said reported content should stay visible while it waited for review, like on Instagram and TikTok. The flow changed: reported content is now hidden automatically, and the brand reviews it afterwards. So merchants needed a quick way to decide, item by item, whether something goes back to visible or stays hidden.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "Tick and cross buttons",
        body: "A tick makes the item visible and marks it as reviewed; a cross hides it. One click per item, which is fast for a long list. But icons on their own can be read in different ways.",
        badge: "My proposal",
      },
      {
        title: "A dropdown",
        body: "Each choice is written out in words. One extra click per item, but nothing to guess.",
        chosen: true,
        badge: "Team's choice",
      },
    ],
    reasoning: [
      "We discussed it over several rounds. The PM's point was that the buttons didn't clearly say what each action does, and our design didn't show the current status of a reported item. A status dropdown on hover solved both: the action is written out, and the status is always visible. The team went with the dropdown.",
    ],
    next: ["I updated the moderation designs to match the PM's prototype:"],
    nextList: [
      "A status dropdown on hover instead of buttons",
      "Two sections instead of three",
      "Report reasons as plain labels instead of colored tags, which pulled attention and needed a legend",
      "A button in the review popup that opens the post in the feed, so merchants can see the comments around it",
    ],
    result: [
      "The PM signed off on the updated design the next day, and the dropdown version shipped.",
      "A tick could mean “reviewed” or “visible”, and a written label removes that guess, even if it costs one more click.",
    ],
    media: [{ caption: "The tick and cross exploration." }, { caption: "The shipped dropdown." }],
  },
];

const superfansSocialFeed: CaseStudy = {
  slug: "superfans-social-feed",
  brand: "#915EE9",
  cardTitle: "Social Feed for Superfans",
  cardSummary:
    "A shoppable short video feed inside brands' own apps, where shoppers watch, comment, buy and post, and merchants keep it safe from the Superfans dashboard.",
  proof: "Shipped across iOS, Android and the merchant dashboard.",
  tone: "violet",
  image: "/assets/superfans-dashboard.png",
  imageClass: "project-image--superfans",
  headline: "How I designed Social Feed so brand apps became a place to watch, post and shop",
  hook: "Shoppers spend hours scrolling videos on Instagram and TikTok. Superfans wanted that same feed inside every brand's own app, where every video could be shopped.",
  summary:
    "Superfans is a mobile app platform for Shopify and Shopify Plus brands. Social Feed adds a short video feed to a brand's app: shoppers watch, like, comment, buy tagged products and post their own content, while merchants publish posts, bring in their Instagram videos, and moderate what their community shares. I designed both sides of the feature, from the first wireframes to design QA on the built product.",
  stats: [
    { value: "10 months", label: "January to October 2026" },
    { value: "2 sides", label: "Shopper app and merchant dashboard" },
    { value: "iOS, Android", label: "Platforms, plus the merchant dashboard" },
    { value: "Product Designer", label: "Role from the start, with a PM and developers" },
  ],
  meta: [],
  hero: {
    caption: "The shopper's feed on a phone, next to the merchant's Social Feed dashboard.",
    src: "/assets/superfans-dashboard.png",
  },
  sections: [
    {
      kind: "problem",
      id: "the-problem",
      nav: "The Problem",
      eyebrow: "The Problem",
      title: "Brands were selling on social platforms, not in their own apps",
      intro:
        "Brands on Superfans have their own shopping apps, but much of their selling and engagement happens elsewhere. They post videos on Instagram and TikTok, run live sales on social platforms, and send shoppers back and forth between apps. Inside their own app, there was no place for that kind of content.",
      goalsIntro: "Social Feed was part of a wider Community push at Superfans. The product spec set three goals for it:",
      goals: [
        { title: "Bring shoppers back every day", body: "With fresh content from the brand." },
        {
          title: "Collect first hand data",
          body: "From shoppers, through interactive blocks in the feed such as quizzes and preference pickers.",
        },
        { title: "Connect content to sales", body: "So every video can lead to a product or a collection." },
      ],
      pains: [
        {
          title: "For shoppers",
          body: "Brand apps were built for buying, not browsing. No feed to watch, nothing to comment on, no way to share their own look.",
        },
        {
          title: "For merchants",
          body: "Fresh video for one more channel takes time, and once shoppers can post, merchants need ways to review and control it.",
        },
        {
          title: "For the product",
          body: "Video, comments, posting, moderation and access all had to fit an app and dashboard brands used every day.",
        },
      ],
      note: {
        title: "What competitors offered",
        body: "Tapcart, a competing app platform, offers shoppable video mainly through third party integrations such as Tolstoy's “For You” feed and Yotpo's shoppable Instagram gallery. That content is curated by the brand, and shoppers don't post or comment inside the app. We set out to build a native feed that works as a community, where shoppers take part.",
      },
      mapping: [
        ["Brand apps had no place for video content", "Bring a shoppable video feed into the app"],
        ["Merchants lacked time to create new content", "Let them reuse their Instagram videos"],
        ["Shopper posts and comments needed control", "Give merchants moderation and access tools"],
        ["Social features are new to brand apps", "Introduce the feed clearly to shoppers"],
      ],
      constraints: [
        "Fit existing brand apps and the Superfans dashboard",
        "Work on both iOS and Android",
        "Merchants control anything shoppers post",
        "Ship parts while others were still in design",
      ],
    },
    {
      kind: "journey",
      id: "walkthrough",
      nav: "Final Solution",
      eyebrow: "Final Solution",
      title: "One brand, one shopper",
      intro:
        "Riya manages the app for Thread & Care, a scrubs brand on Superfans. Karan is a nurse who shops with them. Both are made up for this story.",
      video: {
        kind: "video",
        caption: "Prototype walkthrough: a merchant imports an Instagram video, then a shopper watches it, comments and buys the tagged product.",
      },
      lanes: [
        {
          name: "Riya",
          role: "Merchant",
          about: "Fills the feed and keeps it safe from the Superfans dashboard.",
          steps: [
            {
              title: "Brings in Instagram videos",
              body: "Links the brand's account, opens the import window and picks two recent videos from Your Posts, without creating anything new.",
              media: { caption: "Link Account and the Instagram import modal." },
            },
            {
              title: "Publishes a post of her own",
              body: "Adds a video, writes a description, tags the sweatshirt and sets it visible, with a phone preview beside the form.",
              media: { caption: "New Post panel with the phone preview." },
            },
            {
              title: "Sees everything at a glance",
              body: "The grid shows every post; opening one shows the video beside its comments, with likes and a menu to edit, hide or delete.",
              media: { caption: "Grid view and the single post view." },
            },
            {
              title: "Keeps the feed safe",
              body: "A reported comment is hidden automatically. She reviews it in the Reported tab and decides who can see the feed at all.",
              media: { caption: "Reported tab, review modal and Feed Access Controls." },
            },
          ],
        },
        {
          name: "Karan",
          role: "Shopper",
          about: "A nurse who shops with Thread & Care in their app.",
          steps: [
            {
              title: "Finds the feed",
              body: "A new Feed tab sits in the bottom bar, and a short hint shows him he can swipe up for more.",
              media: { caption: "Feed tab with the swipe up hint." },
            },
            {
              title: "Watches and shops",
              body: "A video shows the sweatshirt he's been eyeing, tagged right on it. He taps the tag and adds it to his cart.",
              media: { caption: "Feed video with the product tag." },
            },
            {
              title: "Joins the conversation",
              body: "Asks about sizing and replies to another shopper. A notification later brings him back to his highlighted reply.",
              media: { caption: "Comments sheet and the highlighted comment." },
            },
            {
              title: "Posts his own video",
              body: "A week later he posts a video of his new sweatshirt from the product page, with the product already tagged.",
              media: { caption: "Posting from the product page." },
            },
          ],
        },
      ],
    },
    {
      kind: "solution",
      id: "solution",
      nav: "Solution Explanation",
      eyebrow: "Solution Explanation",
      title: "What I designed, and the problem each part solves",
      intro:
        "Every part traces back to one of four goals: bring video into the app, save merchants time, keep shopper content under control, and introduce something new clearly.",
      items: [
        {
          area: "App",
          title: "A feed one tap away",
          detail:
            "Brand apps had no place for video. I added a Feed tab to the bottom bar, next to Home, Cart, Wishlist and Account, with a full screen vertical feed shoppers swipe through, like the apps they already use every day.",
          after: "A Feed tab with a full screen vertical video feed.",
          highlights: ["Feed tab", "Full screen", "Vertical video"],
          media: { caption: "Bottom bar with the Feed tab, and the feed screen." },
        },
        {
          area: "App",
          title: "Videos you can shop",
          detail:
            "A video that can't be bought from is just entertainment. Each post can carry a product tag, so shoppers go from watching to the product page in one tap. Likes, comments, a caption that expands, and play and pause sit on the video.",
          after: "From watching to the product page in one tap.",
          highlights: ["Product tag", "Likes and comments", "Expandable caption", "Play and pause"],
          media: { caption: "A feed video, annotated." },
        },
        {
          area: "App",
          title: "Comments that feel complete",
          detail:
            "Comments are where a community forms, so I designed the full set: replies, editing, deleting with confirmation, reporting with a reason, an empty state and avatar variations. When a notification opens a comment, it's highlighted after a moment, with a back button to return.",
          after: "A complete comments system, down to notifications.",
          highlights: ["Replies", "Edit and delete", "Report with reason", "Highlighted from notifications"],
          media: { caption: "Comments sheet, report flow and highlighted comment." },
        },
        {
          area: "Posting",
          title: "Posting your own content",
          detail:
            "Shoppers needed a simple way to share. The posting flow covers picking media (with clear messages for unsupported or oversized files), writing a caption, tagging one or more products, previewing and posting, then what happens next: under review, rejected, posted, edited, deleted, or failed to upload. First time and returning users get slightly different flows.",
          after: "A full posting flow, with every state after posting covered.",
          highlights: ["Multiple product tags", "Under review", "Upload failed", "First time flow"],
          media: { caption: "The posting flow from file picker to posted." },
        },
        {
          area: "Posting",
          title: "Posting from a product page",
          detail:
            "The best moment to post about a product is when you're looking at it. A feed icon on the product page lets shoppers post with that product already tagged.",
          after: "Share a product right where you're looking at it.",
          highlights: ["Feed icon on the product page", "Product pre-tagged"],
          media: { caption: "Product page with the feed icon, then the posting screen." },
        },
        {
          area: "Onboarding",
          title: "Introducing the feed",
          detail:
            "A feed is new in a shopping app, so shoppers need to discover it. I designed a swipe up hint, an “Introducing Social Feed” sheet, a feed section on the product page, onboarding prompts, and a banner explaining what they can do: explore, engage, shop and share.",
          after: "Light entry points that explain the feed where shoppers already are.",
          highlights: ["Swipe up hint", "Intro sheet", "Feed section on the PDP", "Feature banner"],
          media: { caption: "Onboarding sheet and the feature banner." },
        },
        {
          area: "App",
          title: "Interactive blocks in the feed",
          detail:
            "One of the spec's goals was collecting first hand data. Interactive blocks fill a slot in the feed like a video, so shoppers swipe into them the same way: a single choice poll (“What matters most in your scrubs?”) that shows how others voted, and a this or that question with two product images. They're built as custom blocks for each brand, based on what it wants to learn.",
          after: "First hand data, collected inside the feed itself.",
          media: { caption: "The poll and the this or that block in the feed." },
          highlights: ["Single choice poll", "This or that", "Custom per brand"],
        },
        {
          area: "Dashboard",
          title: "Posts as a visual grid",
          detail:
            "Video posts are visual, so they're shown as a grid of thumbnails, with a single post view that puts the video next to its comments. More in Decision 1.",
          before: "The app builder's block layout, then a table of posts.",
          after: "A grid of thumbnails and a single post view beside its comments.",
          highlights: ["Grid view", "Single post view", "Phone preview"],
          media: { caption: "Grid view and single post view." },
        },
        {
          area: "Dashboard",
          title: "Creating and editing posts",
          detail:
            "The New Post panel covers media upload, description, redirection, likes and comments on or off, and visibility (hidden, visible or conditional), with a live phone preview. Loading and error states cover slow or failed uploads.",
          after: "Everything about a post in one panel, with a live preview.",
          highlights: ["Redirection", "Likes and comments toggles", "Conditional visibility", "Live preview"],
          media: { caption: "New Post panel with the preview." },
        },
        {
          area: "Dashboard",
          title: "Reusing Instagram content",
          detail:
            "Merchants shouldn't have to create content twice. They can link their Instagram account and import posts from All, Your Posts or Tagged Posts, picking several at once.",
          after: "Existing Instagram videos fill the feed in a few clicks.",
          highlights: ["Link account", "Your and tagged posts", "Multi-select"],
          media: { caption: "Link Account, then the import modal." },
        },
        {
          area: "Dashboard",
          title: "Managing comments",
          detail:
            "Merchants can reply to shoppers, and edit or delete their own comments, from the dashboard. Reported comments show how many reports they've had and why.",
          after: "Merchants take part in the conversation and see what's been reported.",
          highlights: ["Reply", "Edit and delete", "Report counts and reasons"],
          media: { caption: "Comments in the single post view, and report details." },
        },
        {
          area: "Moderation",
          title: "Moderation",
          detail:
            "Once shoppers can post, merchants need to review what's shared. Reported content is hidden automatically until it's reviewed. Feed Moderation has a Reported tab with bulk select, a Reviewed tab, and a review step where merchants make content visible again or keep it hidden. More in Decision 3.",
          after: "A review queue where reported content waits hidden until a merchant decides.",
          highlights: ["Auto hidden", "Reported tab", "Bulk select", "Reviewed tab"],
          media: { caption: "Reported tab and the review modal." },
        },
        {
          area: "Access",
          title: "Who can see the feed",
          detail:
            "Some brands want the feed open to everyone, others only to certain customers. Feed Access Controls lets merchants choose Everyone, Everyone except specific customers, or Only specific customers, using customer segments. Restricted shoppers see clear states in the app: post restricted, comment restricted, or both.",
          after: "Brands decide who can view, post and comment, and the app explains it.",
          media: { caption: "Access control options and the restricted views in the app." },
          highlights: ["Everyone", "Everyone except", "Only specific customers", "Restricted states"],
        },
        {
          area: "After build",
          title: "Design QA",
          detail:
            "I led design QA on the built product: reviewing each area against the designs, logging issues with screenshots and the matching design, and working with developers until they were fixed. It ran across the app, the dashboard, shopper posting, moderation and feed settings.",
          after: "Every area reviewed against the designs before it was called done.",
          highlights: ["App", "Dashboard", "Posting", "Moderation", "Feed settings"],
          media: { caption: "A few rows from a QA feedback sheet." },
        },
      ],
    },
    {
      kind: "decisions",
      id: "critical-decisions",
      nav: "Decisions",
      eyebrow: "Critical Decisions",
      title: "Three decisions that shaped Social Feed",
      items: superfansDecisions,
    },
    {
      kind: "process",
      id: "process",
      nav: "Process",
      eyebrow: "Process",
      title: "How it came together: ten months, five stages",
      intro:
        "Social Feed didn't arrive in one release. It grew in stages, each building on the last, while earlier parts were already being built.",
      steps: [
        { label: "Shopper feed", body: "January to June: three app versions before the June version was marked ready for development." },
        { label: "Dashboard", body: "February to September: from the first layouts to the grid, comments, Instagram import and post properties." },
        { label: "Shoppers posting", body: "June and July: the posting flow, posting from the product page, and onboarding." },
        { label: "Moderation and access", body: "July to September: reported content, reviews, feed settings and who can see the feed." },
        { label: "Design QA", body: "October: reviewing the built product area by area." },
      ],
      notes: [
        {
          title: "Where the idea came from",
          body: "Instagram Reels and TikTok, where brands show products inside a stream of videos. The PM's spec split the work into two releases: first a brand-run feed with imports, likes, comments and reporting, then shopper posting with the moderation it needs. It also fixed rules like vertical 9:16 media, 3 to 60 second videos and a 500 character comment limit.",
        },
        {
          title: "Versions and reviews",
          body: "Every change was reviewed by the design team, the PM and the CEO, with a version log on the canvas. The dashboard, posting flow, moderation and access controls took the most iterations; access controls moved from three radio options, which felt repetitive, to the live dropdown.",
        },
        {
          title: "Design QA",
          body: "Once each area was built, I reviewed it against the designs and logged every issue with a screenshot and the matching design for developers to fix. Most issues were visual: spacing, alignment and states that didn't match.",
        },
      ],
      media: { caption: "The version log cards from the dashboard." },
    },
    {
      kind: "future",
      id: "future-scope",
      nav: "Future Scope",
      eyebrow: "Future Scope",
      title: "Where Social Feed could go next",
      tag: "Next",
      items: [
        {
          title: "Post metrics for merchants",
          body: "CTR, unique views, likes and comments in the post header, so merchants see which videos actually lead to sales.",
        },
        {
          title: "More ways to take part",
          body: "Polls, order ratings and open questions as custom blocks, for more engagement and more first hand data.",
        },
        {
          title: "A cleaner post view",
          body: "The YouTube Shorts style post view we liked but didn't ship is worth revisiting now that the feature is live.",
        },
      ],
    },
    {
      kind: "learnings",
      id: "learnings",
      nav: "Learnings",
      eyebrow: "Learnings",
      title: "What this project taught me",
      items: [
        { title: "Let the content decide the layout.", body: "Short videos needed a visual grid, not the builder layout or a table." },
        { title: "Shipping on time is part of the design.", body: "We improved the post view and saved the better idea for later." },
        { title: "Every social feature needs a safety feature.", body: "Shopper posting worked because merchants could review and control it." },
        { title: "Disagree, then commit.", body: "A labelled dropdown cost a click but removed the guesswork, so I designed it." },
        { title: "Design isn't done at handoff.", body: "Reviewing the built product caught the details that make it feel finished." },
      ],
    },
    {
      kind: "outcome",
      id: "outcome",
      nav: "Outcome",
      eyebrow: "Outcome",
      title: "From a shopping app to a place to hang out",
      before: "Brand apps built only for buying",
      after: "Videos to shop, comments, shopper posts and tools to keep it safe",
      stat: { value: "Shipped", label: "Across the app and the dashboard, in ten months" },
      feedback: feedback("If you've designed social or community features, how would you approach moderation for brand communities?"),
    },
  ],
};

export const caseStudies: CaseStudy[] = [superfansSocialFeed, cartAbandonment, modernCart];

