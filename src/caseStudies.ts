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
  // Tags one screenshot in a row as a dropped version or the one that shipped.
  status?: "dropped" | "shipped";
  // Draws a browser window bar on top. Full desktop screenshots get one automatically.
  browser?: boolean;
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
  // Marks a screenshot in a decision as a version that was dropped or one that shipped.
  status?: "dropped" | "shipped";
  // Phone screens: keeps a row of tall screens to a comfortable width instead of filling the column.
  phone?: boolean;
  // Draws a browser window bar on top. Full desktop screenshots get one automatically.
  browser?: boolean;
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
  detail?: string;
  // The change told in three beats: what I noticed, what I did, and why it works.
  noticed?: string;
  did?: string;
  why?: string;
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
  // Why this option was set aside. Marks the option as dropped.
  dropped?: string;
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
  // A plain bullet list under the text.
  bullets?: string[];
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
        pains?: CardItem[];
        // Optional callout, for example what competitors offered.
        note?: CardItem;
        media?: MediaItem;
        // Each row reads Challenge, Goal and, optionally, Constraint.
        mapping: Array<[string, string, string?]>;
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
        tokens?: Array<{ sample: "type" | "color" | "icons"; label: string; value: string }>;
        note?: CardItem;
      }
    | { kind: "process"; steps: ProcessStep[]; notes?: CardItem[]; media?: MediaItem }
    | { kind: "future"; tag: string; items: CardItem[]; media?: MediaItem[] }
    | { kind: "learnings"; items: CardItem[] }
    | { kind: "outcome"; before: string; after: string; stat: Stat; feedback?: string }
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
    turningIntro: "I explored four directions.",
    options: [
      {
        title: "A tab for each report",
        body: "One click to any report.",
        dropped: "The top bar fills up fast, and gets worse with every new report.",
      },
      {
        title: "Underline tabs inside a Reports page",
        body: "Keeps the top bar short.",
        dropped: "It adds a second row of navigation inside the page.",
      },
      {
        title: "Pill tabs beside the table title",
        body: "Compact and close to the data.",
        dropped: "Easy to miss, and hard to scale beyond two reports.",
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
      "It shipped. The live plugin's top bar has five items, Dashboard, Follow Up Emails, Reports, Integrations and Settings.",
    ],
    media: [
      { caption: "A tab for each report.", status: "dropped", alt: "Top bar with Email Logs and Product Report as separate tabs.", ...ca("nav-per-report"), wide: true },
      { caption: "Underline tabs inside a Reports page.", status: "dropped", alt: "Email Reports and Product Reports tabs above the table card.", ...ca("nav-page-tabs"), wide: true },
      { caption: "Pill tabs beside the table title.", status: "dropped", alt: "Emails Report and Product Report pill tabs inside the table card.", ...ca("nav-pill-tabs"), wide: true },
      { caption: "A dropdown under Reports.", alt: "Reports dropdown open with Email Report and Product Report.", ...ca("nav-dropdown"), wide: true },
      { caption: "The live top bar, with Reports open.", status: "shipped", alt: "The live top bar with the Reports dropdown showing Follow Up and Product.", ...ca("topbar-live"), wide: true },
    ],
  },
  {
    title: "Why Email Logs became a full page, not a side drawer",
    hook: "A store owner clicks on one abandoned cart. How much do they need to see, and where should it open?",
    before: [
      "In the new design, editing a follow-up email opened in a side drawer beside the list. Email Logs, the detailed view of one cart, needed a home too.",
    ],
    turningIntro: "There were two options.",
    options: [
      {
        title: "A side drawer",
        body: "Consistent with the email editor, and the list stays in view.",
        dropped: "Email Logs holds a lot, from scheduled emails to billing and shipping addresses and the full order. In a drawer, the addresses can't sit side by side and the order table gets cramped.",
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
      "I redesigned Email Logs as a full page, with email details first, then billing and shipping side by side, then the order items with totals.",
    ],
    result: [
      "The full page shipped. It reinforced something I now ask early. Is this a quick edit or a detailed read? The answer decides the pattern, not consistency alone.",
    ],
    media: [{ caption: "The drawer version, my first proposal.", status: "dropped", alt: "Email Log in a side drawer beside the list, with addresses, order items and scheduled emails.", ...ca("logs-drawer") }, { caption: "The full page version.", status: "shipped", alt: "Email Logs on a full page, with scheduled emails, billing and shipping, and order items.", ...ca("logs-full-page") }],
  },
  {
    title: "Why the dashboard chart always compares two numbers",
    hook: "A chart that changes when you click a card sounds clever. But would store owners ever know to click?",
    before: [
      "The old Report page had six number cards and no chart at all. Store owners could see totals, but not whether recovery was improving.",
    ],
    turningIntro: "There were two options.",
    options: [
      {
        title: "One chart that switches with the cards",
        body: "Click any metric card and the chart shows that metric, so one chart covers everything.",
        dropped: "The interaction is hidden. Store owners might never discover it, or not understand why the chart changed.",
      },
      {
        title: "A fixed chart comparing two metrics",
        body: "Recoverable revenue and recovered revenue, always shown together. Less flexible, but the most important story is always visible, how much was at risk and how much came back.",
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
      { caption: "The chart follows the selected card.", status: "dropped", alt: "Recoverable Orders card selected, with a single-line chart below.", ...ca("dashboard-switch"), wide: true },
      caRow("Dashboard V1, a fixed two-line comparison, and V2 with Order and Revenue tabs beside a compact chart.", ca("dashboard-v1", "V1: a fixed two-line comparison"), ca("dashboard-v2-order", "V2: Order tab"), ca("dashboard-v2-revenue", "V2: Revenue tab")),
      { caption: "The live dashboard.", status: "shipped", alt: "The live Dashboard.", ...ca("dashboard"), wide: true }],
  },
  {
    title: "Why shoppers can skip the email popup",
    hook: "The store needs a shopper's email to recover their cart. But asking for it every time they tap Add to Cart can feel like a login wall.",
    before: [
      "The popup asks for an email when a shopper adds to cart, so the store can follow up if they leave. A shopper who isn't logged in might see it again and again.",
    ],
    turningIntro: "There were two options.",
    options: [
      {
        title: "Always require the email",
        body: "The store captures more emails.",
        dropped: "Shoppers who are just browsing get frustrated, wonder why it's needed, and may leave altogether.",
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
      { caption: "The popup with “No thanks.”", status: "shipped", alt: "Popup settings with the email optional and a No Thanks text field.", ...ca("popup-no-thanks") },
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
  "popup-items-tablet-box": ["full/popup-tablet", [1536, 2048], [170, 144, 1196, 1760]],
  "popup-items-mobile-box": ["full/popup-mobile", [780, 1690], [40, 100, 700, 1491]],
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
    turningIntro: "There were two ways to handle it.",
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
        dropped: "The team chose a cleaner free dashboard, so Pro features stay hidden for now.",
        badge: "My proposal",
      },
    ],
    reasoning: [
      "I proposed showing them, as an option for the PM and leadership to weigh. A feature that quietly disappears feels like something was taken away. A feature that's visible but locked tells people exactly what upgrading gets them.",
    ],
    next: [
      "I designed PRO badges, disabled fields with an inline “Upgrade now” note, an upgrade modal, and a Free vs Pro tab comparing every feature side by side.",
    ],
    result: [
      "The team chose to keep the free version focused on free features, so Pro features stay out of view for free users, and the live plugin still works this way. Both directions were on the table when that call was made, which is what I set out to do.",
      "It reinforced how I approach this kind of work. I give decision makers clear options with the reasoning behind each, knowing the right answer depends on how the business wants to position its product.",
    ],
    media: [
      { ...mcShot("My proposal for General: a PRO badge and an inline “Upgrade now” note on each locked setting.", "general-pro"), status: "dropped" },
      mcShot("The upgrade modal, opened from a locked setting.", "upgrade-modal"),
      mcShot("The Free vs Pro tab, comparing every feature.", "free-vs-pro"),
    ],
  },
  {
    title: "Why I added product suggestions to the cart to keep shoppers browsing",
    hook: "A shopper opens the cart before adding anything. In ModernCart, all they found was an “empty cart” message.",
    before: [
      "There was no next step from that message. Once items were added, the cart was just a list of what the shopper had picked.",
    ],
    turningIntro: "There were two ways to go.",
    options: [
      {
        title: "Keep the cart as a plain list",
        body: "Simple, nothing to distract from checkout.",
        dropped: "An empty cart leads nowhere, and a full cart misses the moment when the shopper is most ready to buy.",
      },
      {
        title: "Let the cart suggest products",
        body: "Shoppers who open the cart are still in shopping mode, so a suggestion lets them keep going without leaving. The risk is clutter that pulls attention away from checking out.",
        chosen: true,
      },
    ],
    reasoning: [
      "I chose to suggest products, for two reasons. For the business, every suggestion is a chance at a bigger order. For the shopper, a suggestion turns an empty screen into something to explore. They can tap it to see the product in detail, or add it straight from the cart.",
      "The idea came from looking at competitors. [FunnelKit Cart](https://funnelkit.com/woocommerce-cart/), one of the plugins I reviewed, already suggests products inside its side cart. I kept the suggestions small so they never take over the cart.",
    ],
    next: [],
    nextList: [
      "**Empty cart:** “Your Cart Is Empty, Let's Fix That,” a featured product to add in one tap, and a Shop Now button.",
      "**Cart with items:** a small “You might also like” carousel below the items, showing one or two products as a style owners can pick.",
    ],
    result: [
      "The PM and the team agreed straight away, and both shipped. I carried the idea through the rest of the product. The popup cart uses the same suggestions, and store owners can rewrite the suggestion titles from the Text Label tab.",
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
    hook: "ModernCart opened one way, with a panel sliding in from the side. Not every store wants its cart at the edge.",
    before: [
      "Every store got the same slide-out panel, whatever it sold and however its pages were laid out.",
    ],
    turningIntro: "Exploring new cart styles, I weighed two directions.",
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
      "I designed the full popup set, empty, empty with suggestions, and with items and suggestions in two item styles, each for desktop, tablet and mobile. On smaller screens the carousel drops from two products to one so the cards stay readable.",
    ],
    result: [
      "It shipped as a Cart Type setting (Slide-out or Popup), and the plugin's WordPress.org listing now names both cart types in its title.",
    ],
    media: [
      mcRow(
        "The popup cart on desktop, tablet and mobile. On small screens the carousel drops to one product.",
        mc("popup-items", "Desktop"),
        mc("popup-items-tablet-box", "Tablet"),
        mc("popup-items-mobile-box", "Mobile"),
      ),
    ],
  },
];

const cartAbandonment: CaseStudy = {
  slug: "cart-abandonment-recovery",
  cardTitle: "Cart Abandonment Recovery",
  cardSummary:
    "An admin that finally shows store owners the sales the plugin wins back.",
  proof: "300K+ active installs, redesigned end to end",
  tone: "peach",
  image: "/assets/cart-abandonment.png?v=2026-11-17",
  imageClass: "project-image--cart",
  headline: "Redesigning Cart Abandonment Recovery to show 300K+ stores the revenue they win back",
  hook: "The plugin's whole job is to bring back lost sales. Yet its own admin showed six numbers, no chart, and no way to export them.",
  summary:
    "Cart Abandonment Recovery tracks shoppers who leave their cart, sends timed follow-up emails and shows store owners what came back. I redesigned the whole admin on ForceUI and designed its new features, a visual dashboard, detailed reports, new recovery channels and an email capture popup.",
  lead: [
    "As the only designer, working with a PM and developers, I took the plugin from three plain tabs to a full admin. The challenge was rebuilding something people already used every day, while making room for features it had never had. The toughest question was how to ask shoppers for an email without turning Add to Cart into a login wall.",
    "Today, Cart Abandonment Recovery has 300K+ active installs ([CartFlows](https://cartflows.com/cart-abandonment), [WP Hive](https://wphive.com/plugins/woo-cart-abandonment-recovery)).",
  ],
  stats: [
    { value: "300K+", label: "Active installs" },
    { value: "2 months", label: "May to June 2025" },
    { value: "Designer", label: "With a PM and developers" },
    { value: "WooCommerce", label: "WordPress plugin" },
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
          text: "For a store owner, the only reason to use a recovery plugin is the revenue it brings back. If they can't see that clearly, they can't trust it, tune it, or justify paying for more. For Brainstorm Force, that meant two things, keeping the free plugin competitive and giving store owners a clear reason to upgrade to Pro.",
        },
        {
          label: "Why it was worth solving",
          text: "A store owner who can see recovered revenue rising over time trusts the plugin and keeps using it. A store owner who sees six static numbers has no idea what's working.",
        },
      ],
      pains: [
        {
          title: "One page, two jobs",
          body: "The Report tab was both the dashboard and the report, with six number cards, no chart and a table of carts below.",
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
      media: caShot("The old Report page, with six number cards and a plain table.", "old-report"),
      mapping: [
        ["One page mixed the dashboard and the report", "Recovery at a glance, details one click away", "Existing users knew the old plugin"],
        ["Data was hard to track or export", "Every report searchable, filterable and exportable", "No access to store owners for testing"],
        ["The layout had no room for new features", "A structure that can grow", "Feature list agreed up front"],
        ["The UI didn't follow the design system", "Every screen in line with ForceUI", "Stay inside ForceUI"],
      ],
    },
    {
      kind: "journey",
      id: "walkthrough",
      nav: "Final Solution",
      eyebrow: "Final Solution",
      title: "How a forgotten checkout turns into a recovered sale",
      intro: "Recovery has two sides, the owner watching the results and the shopper who leaves and comes back.",
      story: [
        {
          text: "**Kavya** runs Leaf & Loom, a small home decor store on WooCommerce, with Cart Abandonment Recovery Pro. **Rohan** is browsing her store for a new lamp. The video follows both, Kavya setting up recovery and checking what came back, and Rohan leaving his cart and returning to buy.",
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
      title: "From six numbers to a dashboard, reports and new channels",
      intro: "The dashboard, the navigation, the email logs and the popup each get a full story in the decisions below. These are the other changes, each tracing back to data that was hard to use or a layout with no room to grow.",
      items: [
        {
          area: "Emails",
          title: "Follow-up emails that show results",
          noticed: "Store owners couldn't tell which emails brought shoppers back, and editing one meant a long WordPress form on its own page.",
          did: "Put sent count, open, click, conversion and unsubscribe rates beside each template. Editing moved into a drawer beside the list, with subject, body, timing, coupon, test email and a simple rule builder.",
          why: "Owners can spot the template doing most of the work and tune the rest without losing their place.",
          before: "Name, subject and timing, edited on a separate page.",
          after: "Results beside every template, edited in a drawer.",
          media: { ...caRow("The old Follow-Up Emails list vs the new list with sent, open, click, conversion and unsubscribe rates.", ca("old-email-list", "Before"), ca("email-list", "After")), caption: "" },
          highlights: ["Sent count", "Open and click rates", "Edit drawer", "Rule engine"],
        },
        {
          area: "Reports",
          title: "Reports you can search and export",
          noticed: "The old cart table had bulk actions and little else.",
          did: "Gave the Email Report search, a status filter, a date picker, Export, a country column, colored chips and row actions. A new Product Report shows which items are abandoned and won back most.",
          why: "Owners can find any cart and take the numbers wherever they need them.",
          before: "A cart table with bulk actions and little else.",
          after: "Find, filter and export anything.",
          media: caShot("The Follow Up Reports table with search, the status filter open, a date picker and Export.", "email-report"),
          highlights: ["Search", "Status filter", "Export", "Status chips", "Row actions", "New Product Report"],
        },
        {
          area: "Settings",
          title: "Settings split by topic",
          noticed: "Settings sat on one endless page, full of role and status checkbox columns.",
          did: "Added a left sub-menu with six groups, turned tracking into a toggle and checkboxes into multi-select chips, and gave each setting a card with a one-line explanation. Admin alerts, Recovery Report emails and GDPR are new.",
          why: "Small groups and plain explanations make a big settings area feel light.",
          before: "One long page of checkbox columns.",
          after: "Six groups, one card per setting.",
          media: caShot("General settings, with a sub-menu by topic, one card per setting and a save confirmation.", "settings-general"),
          highlights: ["Six setting groups", "Chip multi-selects", "One card per setting", "Save confirmation", "New GDPR settings"],
        },
        {
          area: "Integrations",
          title: "More ways to reach shoppers",
          noticed: "Email was the only channel, yet not every shopper reads their inbox.",
          did: "Added Integrations with Webhook, SMS, WhatsApp and OttoKit, each on its own page with an enable toggle.",
          why: "Owners can follow up wherever their shoppers actually reply.",
          before: "Email was the only channel.",
          after: "Four new channels, each with its own page.",
          media: { ...caRow("The Webhook page with its sub-menu, and the OttoKit page.", ca("integrations-webhook", "Webhook"), ca("integrations-ottokit", "OttoKit")), caption: "" },
          highlights: ["Webhook", "SMS", "WhatsApp", "OttoKit"],
        },
        {
          area: "Pro",
          title: "Upgrade to Pro",
          noticed: "Free users needed to see what Pro adds without losing anything they use.",
          did: "Designed how Pro appears across five areas. All of it shipped, including a Pro card where the Product Report sits on the Dashboard and PRO badges with blurred numbers beside email templates.",
          why: "Showing the upgrade beside the feature sells it without blocking anyone.",
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
      title: "A dropdown, a full page, a fixed chart and a skippable popup",
      items: cartAbandonmentDecisions,
    },
    {
      kind: "system",
      id: "design-system",
      nav: "Design System",
      eyebrow: "Design System",
      title: "Built on ForceUI, a system I helped create",
      intro:
        "Cart Abandonment Recovery sits in the CartFlows family, next to ModernCart. Rebuilding it on ForceUI, Brainstorm Force's shared design system, means a store owner moving between these plugins finds the same layout, the same controls and the same behavior.",
      story: [
        {
          label: "Why ForceUI existed",
          text: "When I joined Brainstorm Force, each plugin had its own design system, so every product looked and behaved a little differently. The team decided to bring them together into one shared system, ForceUI. It lives in Figma and as React code, so designers and developers work from the same components.",
        },
        {
          label: "My part in creating it",
          text: [
            "I worked on its atoms and molecules, while other designers built the larger patterns and templates.",
            "One rule kept Figma and code in sync. Nobody changed a component on their own. If something needed to change, it went through a ticket, so the two never drifted apart. The developers also kept a React Storybook of every component, which we used as a reference for how and where each one should be used.",
          ],
        },
        {
          label: "Four levels, all used here",
          text: "ForceUI is built in layers, from the smallest pieces up to full page layouts, and this plugin uses every level.",
        },
      ],
      levels: [
        {
          title: "Atoms",
          body: "The smallest pieces, like buttons, toggles, badges, inputs and dropdowns. Here they are the enable toggles, the status chips and the Export button.",
        },
        {
          title: "Molecules",
          body: "Atoms combined into a reusable unit, like a toggle with its label and description. Every setting card is one of these.",
        },
        {
          title: "Patterns",
          body: "Larger sections that repeat across products, like the top bar, sub-menus, drawers and tables. The email drawer and the settings sub-menu come from here.",
        },
        {
          title: "Templates",
          body: "Full page layouts. The Dashboard and Settings pages follow ForceUI's admin templates, with product navigation on top and cards of content below.",
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
        { sample: "type", label: "Type", value: "Figtree, four weights" },
        { sample: "color", label: "Accent", value: "Flamingo, CartFlows' orange" },
        { sample: "icons", label: "Icons", value: "Lucide plus a WordPress set" },
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
          media: caShot("Where we started, the old plugin's email editor in a long WordPress form.", "old-editor"),
        },
        {
          label: "Feature list",
          title: "Agreeing on what to build",
          body: "Everything we wanted to add went into a shared sheet, and the team decided what made the cut. That list became my brief, agreed up front with the PM and developers.",
          media: { ...caRow("Two features that made the list, new recovery channels and the email capture popup.", ca("integrations-webhook", "New channels"), ca("popups-list", "Email capture popup")), caption: "" },
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
          body: "The core admin came first, with Dashboard, Follow Up Emails with the rule engine and coupons, Reports, Integrations and Settings.",
          points: ["Dashboard", "Follow Up Emails", "Reports", "Integrations", "Settings"],
          media: { ...caRow("Phase 1 screens, the Follow Up Reports table and General settings.", ca("email-report-top", "Reports"), ca("settings-general", "Settings")), caption: "" },
        },
        {
          label: "Phase 2",
          title: "Popup Templates, and where the plan changed",
          body: "I first designed popup editing inside the plugin itself, as a drawer with a live preview, text, colors and the “No thanks” option. In discussion, the team decided to open popups in Spectra, Brainstorm Force's page builder, where store owners can customize every detail visually. The plugin keeps the popup's settings, rules and coupons.",
          details: [
            "It wasn't a choice I disagreed with, just one I didn't expect. Spectra already does visual editing well, and reusing it lets the two plugins work together.",
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
      title: "What the new dashboard makes possible next",
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
      title: "What redesigning a plugin people already rely on taught me",
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
    },
  ],
};

const modernCart: CaseStudy = {
  slug: "modern-cart",
  cardTitle: "ModernCart, a side cart",
  cardSummary:
    "A side cart that keeps shoppers browsing instead of leaving the page.",
  proof: "60K+ active installs, launch-ready in one week",
  tone: "peach",
  image: "/assets/modern-cart.png?v=2026-11-17c",
  imageClass: "project-image--modern",
  headline: "How an unreleased side cart grew to 60K+ stores by keeping shoppers adding more to their carts",
  hook: "ModernCart had been built by developers and left unreleased. Then the PM decided it would go live in one week.",
  summary:
    "ModernCart adds a side cart to WooCommerce stores, so shoppers can see and change their order from any page without leaving it. The features worked, but nobody had designed them around the owners who set it up or the people buying with it.",
  lead: [
    "As the only designer, working with a PM and developers, I made it launch-ready in that week. Then I designed what came next, a dashboard organized around what store owners actually do and a cart that offers products when it would otherwise sit empty.",
    "The challenge was doing both on a product that was already built, inside a design system the team was still building. The hardest call came later, when ModernCart split into Free and Pro and features existing users relied on were about to vanish.",
  ],
  stats: [
    { value: "60K+", label: "Active installs" },
    { value: "3 months", label: "April to June 2025" },
    { value: "4.9 / 5", label: "[Rated on WordPress.org](https://wordpress.org/plugins/modern-cart/#reviews)" },
    { value: "Designer", label: "With a PM and developers" },
  ],
  meta: [],
  hero: {
    caption: "The ModernCart dashboard, clicking through each settings tab and the Free vs Pro page.",
    src: "/assets/videos/modern-cart-tour.mp4?v=2026-11-28",
    poster: "/assets/videos/modern-cart-tour.jpg?v=2026-11-21",
  },
  sections: [
    {
      kind: "problem",
      id: "the-problem",
      nav: "The Problem",
      eyebrow: "The Problem",
      title: "Built, but not ready for the people using it",
      intro:
        "With launch a week away, the cart had to work for two groups at once, the store owners setting it up and the shoppers using it.",
      story: [
        {
          label: "The business problem",
          text: "WooCommerce's default cart sends shoppers to a separate cart page, which breaks their flow right when they are about to buy. Side cart plugins fix this by opening the cart on the page shoppers are already on, and competitors were already selling them. Brainstorm Force wanted ModernCart in that market as part of the CartFlows family. For the business, that meant two things, more shoppers finishing checkout and a higher average order value.",
        },
        {
          label: "Why it was worth solving",
          text: [
            "Store owners who can't find their way around the settings leave the cart on its defaults, or never switch it on. Shoppers who open an empty cart and find one line of text have nowhere to go, even though that is exactly when they are looking for something to buy. A full cart that is only a list gives them no reason to keep browsing either.",
            "Each of those costs the store a sale. A badly set up cart loses shoppers at the last step, and every empty cart that shows nothing is a missed chance to add one more item. For Brainstorm Force, a cart that owners could set up in minutes was also what would win installs and good reviews against side carts that were already on the market.",
          ],
        },
      ],
      mapping: [
        ["Scattered settings, with options like the floating cart buried in General", "Settings grouped around owners' tasks", "Build on the existing developer build"],
        ["An empty cart with one line of text and no next step", "An empty cart that suggests something", "No access to owners or shoppers"],
        ["A full cart that was only a list", "Suggestions below the items", "ForceUI components unchanged"],
        ["Spacing, type and colors off the design system", "Every screen on ForceUI", "One week to launch"],
      ],
    },
    {
      kind: "journey",
      id: "walkthrough",
      nav: "Final Solution",
      eyebrow: "Final Solution",
      title: "How shoppers end up adding more without searching again",
      intro: "ModernCart has two parts, a dashboard where store owners shape the cart and the cart shoppers actually use. Every choice in the first shows up in the second.",
      story: [
        {
          text: [
            "**Meera** runs DNK, a small clothing and footwear store on WooCommerce. **Arjun** is shopping there for a new pair of shoes. The video follows both of them.",
            "Meera works through the dashboard one tab at a time. She switches the cart on, rewrites the empty cart message in her store's voice, places the floating cart icon and matches the colors to her brand.",
            "Arjun adds a pair of shoes and the cart slides in without taking him off the page. It suggests something to go with them, shows the full total with shipping, and takes him to checkout in one tap.",
          ],
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
      title: "From scattered settings to a cart that suggests",
      intro: "Every change traces back to scattered settings, a cart that led nowhere, or screens that didn't follow the design system.",
      items: [
        {
          title: "Settings grouped by task",
          noticed: "Store owners had to hunt across tabs for basic settings.",
          did: "Split the dashboard into five tabs with one job each, My Account, General, Text Label, Floating Cart Icon and Styling.",
          why: "When every tab has a single purpose, owners know where to look before they click.",
          before: "Settings scattered across tabs.",
          after: "Five tabs, one job each.",
          media: { caption: "", alt: "The dashboard tabs one after another, My Account, General, Text Label, Floating Cart Icon and Styling, each scrolled through.", src: "/assets/videos/modern-cart-tabs.mp4?v=2026-11-20c", size: [1546, 964] },
        },
        {
          title: "Cart text that sounds like the store",
          noticed: "The wording was fixed, so every cart sounded the same.",
          did: "Made every shopper-facing word editable in Text Label, from the heading to the free shipping line, with each field prefilled.",
          why: "Good defaults mean owners only change what they care about.",
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
          noticed: "The icon shoppers see on every page was buried inside General.",
          did: "Gave it a dedicated tab with position, hide when empty and presets. Custom upload came from my competitor review and shipped later.",
          why: "Settings should be as easy to find as the thing they control is to see.",
          before: "Buried inside General.",
          after: "Its own tab, with custom upload later.",
          media: mcShot("Position, hide when empty, and preset icons in their own tab.", "floating-icon-card"),
        },
        {
          title: "Styling that's safe to try",
          noticed: "Owners hesitate to restyle the cart when they're unsure they can undo it.",
          did: "Grouped Styling into four areas, added a reset to every swatch, showed defaults under number fields and put units inside inputs.",
          why: "An easy way back makes bold changes feel safe.",
          before: "Owners hesitated to change what they couldn't undo.",
          after: "Grouped, resettable, defaults in view.",
          media: mcRow(
            "Reset buttons on colors, and defaults and units on number fields.",
            mc("styling-colors", "Reset on every color"),
            mc("styling-width", "Defaults and units"),
          ),
        },
        {
          title: "A clearer coupon field and order summary",
          noticed: "My first collapsible “Got a Discount Code?” row didn't feel like applying anything, as the CEO pointed out in a review. Shoppers also couldn't see what made up their total.",
          did: "Turned the coupon into a link that opens into a field with a button and shows the active code as a removable tag. The summary now lists shipping, tax, subtotal and savings.",
          why: "Shoppers always see which discount is on and what they will pay, so nothing surprises them at checkout.",
          before: "A vague coupon row and no breakdown.",
          after: "Removable code tags and the full total.",
          media: mcRow(
            "A quiet link opens into a field, the code becomes a tag, and the summary shows the full total.",
            mc("coupon-link-crop", "A quiet link"),
            mc("coupon-tag-crop", "Code as a tag"),
            mc("summary-card-crop", "Full summary"),
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
            body: "Slide-out or popup. The slide-out keeps the page visible behind it, and the popup takes the shopper's full attention.",
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
            count: "1 or 2",
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
      title: "Locked or hidden, plain or suggestive, side or center",
      items: modernCartDecisions,
    },
    {
      kind: "system",
      id: "design-system",
      nav: "Design System",
      eyebrow: "Design System",
      title: "Built on ForceUI",
      intro:
        "Every screen in ModernCart, the dashboard and the shopper's cart, is made from ForceUI components, so nothing was drawn from scratch. In launch week that meant swapping the old screens for ForceUI parts rather than redesigning them. The one place I bent the system was Styling, where number fields needed their unit (px, % or ms) inside the input.",
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
          body: "The PM wanted ModernCart published within a week. There was no time to redesign from scratch, so the goal was to make what existed feel finished.",
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
            "That review shaped most of what came next, from preset cart icons and custom icon upload to cart position controls, style options for the cart, header and order summary, and product suggestions in the cart.",
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
          body: "My competitor review turned into a list of ideas. I shared them with the team, the PM decided the order, and I wrote a Jira ticket for each one with a description and the designs. The Figma file followed the same structure, one section per ticket. These ideas from that list shipped.",
          bullets: [
            "Product suggestions inside the cart, later reused in the popup cart",
            "A popup cart, now a Cart Type setting next to the slide-out",
            "A live cart preview in the dashboard, showing the floating icon and the cart, empty and with items (version 1.0.8)",
            "Cart header styling in the Styling tab (version 1.0.1)",
            "Custom icon upload for the floating cart icon",
            "A clearer coupon field that opens from a link and shows the code as a removable tag",
          ],
          media: mcRow("One ticket's designs, the coupon field in its three states.", mc("coupon-link-crop", "Link"), mc("coupon-field-crop", "Field"), mc("coupon-tag-crop", "Tag")),
        },
        {
          label: "No wireframes",
          title: "Why no wireframes, and why I built from ForceUI",
          body: "ForceUI already had the pieces I needed, so I worked in high fidelity from the start. Sketching boxes would have meant redrawing components that already existed. The trade-off was less room to explore wild ideas early, which is why the competitor review mattered so much.",
        },
      ],
      notes: [
        {
          title: "What I assumed",
          body: "There were no interviews or usability tests, so a few choices rest on assumptions I'd want to test. Shoppers who open the cart are still in shopping mode, store owners want to change the cart's look and words without touching code, and defaults shown next to each setting make owners more willing to experiment.",
        },
      ],
    },
    {
      kind: "future",
      id: "future-scope",
      nav: "Future Scope",
      eyebrow: "Future Scope",
      title: "Ideas from my review that shipped later",
      intro: "These three ideas came out of my competitor review. I suggested them and talked through with the team where each would sit, and they shipped in later versions.",
      tag: "Shipped later",
      items: [
        {
          title: "Live preview",
          body: "Owners changed colors and icons without seeing the result until they opened their store. Competitors showed a preview beside the settings, so I recommended one. It now shows the cart empty and with items ([v1.0.8](https://wordpress.org/plugins/modern-cart/)).",
        },
        {
          title: "Custom icon upload",
          body: "The preset icons cover most stores, but a brand with its own icon style couldn't match it. I proposed letting owners upload their own icon. It now sits in the Floating Cart Icon tab, under the presets.",
        },
        {
          title: "Cart header styling",
          body: "The competitor review showed that stores wanted control over the top of the cart, not just its colors. I suggested header styling as a style option, and it was added to Styling ([v1.0.1](https://wordpress.org/plugins/modern-cart/)).",
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
      title: "What a one-week launch taught me",
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
      intro: "ModernCart started as a working build that nobody had designed for. In one week it was ready to publish, and in the weeks after it gained a dashboard organized around tasks, a cart that suggests products, and a second cart type.",
      before: "A working build nobody had designed for",
      after: "A task-based dashboard, a cart that suggests, and a second cart type",
      stat: { value: "60K+", label: "Active installs today" },
    },
  ],
};

// Built from the "Social Feed Case Study" doc. The brand and people in the walkthrough are made up.
const SF_VERSION = "2026-11-26";

const sfSizes = {
  "a-comment": [750, 1627],
  "a-feed": [750, 1627],
  "a-post": [750, 1627],
  "ac-except": [1920, 1428],
  "ac-only": [1920, 1428],
  banner: [1920, 1280],
  "d-error": [1920, 1545],
  "d-grid": [1920, 1428],
  "d-import": [1920, 1428],
  "d-link": [1920, 1428],
  "d-linked": [1920, 1428],
  "d-loading": [1920, 1545],
  "d-newpost": [1920, 1527],
  "d-reports": [1920, 1428],
  "d-single": [1920, 1428],
  log: [1334, 3184],
  "m-multi": [1920, 1428],
  "m-reported": [1920, 1428],
  "m-review": [1920, 1428],
  "m-reviewed": [1920, 1428],
  "m-settings": [1920, 1428],
  "o-pdp": [750, 1626],
  "o-sheet": [750, 1627],
  "o-swipe": [750, 1627],
  "p-caption": [750, 1624],
  "p-comments": [750, 1626],
  "p-delete": [750, 1626],
  "p-empty": [750, 1626],
  "p-feed-paused": [750, 1624],
  "p-feed": [750, 1624],
  "p-highlight": [750, 1624],
  "p-own": [750, 1626],
  "p-replies": [750, 1626],
  "p-report": [750, 1626],
  "p-report2": [750, 1626],
  "pdp-feed": [750, 1626],
  "pdp-post": [750, 1626],
  polls: [2000, 1745],
  qa: [2600, 1049],
  "u-caption": [750, 1626],
  "u-edit": [750, 1627],
  "u-large": [750, 1626],
  "u-multi": [750, 1626],
  "u-picker": [750, 1626],
  "u-posted": [750, 1627],
  "u-preview": [750, 1626],
  "u-rejected": [750, 1626],
  "u-review": [750, 1626],
  "u-search": [750, 1626],
  "u-unsupported": [750, 1626],
} as const;

type SfShot = keyof typeof sfSizes;

const sfIsPhone = (size: readonly [number, number]) => size[1] > size[0] * 1.6;
const sf = (name: SfShot, label?: string, status?: MediaFrame["status"]): MediaFrame => ({ src: `/assets/superfans/${name}.webp?v=${SF_VERSION}`, size: [...sfSizes[name]] as [number, number], label, status });
const sfShot = (caption: string, name: SfShot): MediaItem => ({ caption, alt: caption, src: sf(name).src, size: sf(name).size, phone: sfIsPhone(sfSizes[name]) });
const sfRow = (caption: string, ...row: MediaFrame[]): MediaItem => ({ caption, alt: caption, row, phone: row.every((f) => sfIsPhone(f.size)) });

const superfansDecisions: DecisionItem[] = [
  {
    title: "Why the dashboard shows posts as a grid, not a table",
    hook: "A feed of short videos is about what you see. Our first two dashboard layouts made merchants read instead.",
    before: [
      "The Superfans dashboard already had a familiar pattern from the app builder, a side panel of blocks with a properties panel for editing. The obvious start was to reuse it for Social Feed.",
    ],
    turningIntro: "We tried two directions before landing on a third.",
    options: [
      {
        title: "Reuse the builder layout",
        body: "Consistent with the rest of the dashboard, so merchants would feel at home.",
        dropped: "It was built for arranging blocks, not browsing and managing a stream of videos.",
      },
      {
        title: "A table of posts",
        body: "A clear list with rows for each post.",
        dropped: "Video content looked flat in rows, and it didn't suit how merchants think about their feed.",
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
    media: [{ ...sfShot("The grid view that shipped.", "d-grid"), status: "shipped" }],
  },
  {
    title: "Why we improved the post view instead of redesigning it",
    hook: "We found a better design. We still didn't ship it, and that was the right call.",
    before: [
      "Opening a post in the dashboard showed the comments first. To edit the post itself, merchants had to find the menu inside the comments panel.",
    ],
    turningIntro: "There were three options.",
    options: [
      {
        title: "A YouTube Shorts style view",
        body: "Just the video, with a menu to edit the post and a comment icon to open comments. Clean, and the team liked it.",
        dropped: "It meant redoing a view that was finished and about to go live.",
      },
      {
        title: "Tabs for Edit Post and Comments",
        body: "Easy to switch between the two jobs.",
        dropped: "It added another layer to a simple screen.",
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
      "I added a simple header to the post with its title, when it was posted, likes and comments, and a menu for Edit, Copy Post ID, Hide and Delete. I also explored showing post metrics (CTR, unique views, likes, comments) in the same header.",
    ],
    result: ["The improved header shipped. The metrics version is a next step the team may add later."],
    media: [{ ...sfShot("The single post view with the improved header that shipped.", "d-single"), status: "shipped" }],
  },
  {
    title: "Why moderation uses a dropdown, not tick and cross buttons",
    hook: "I argued for the faster design. After several rounds of debate, the team chose a different one, and I designed that one.",
    before: [
      "The spec first said reported content should stay visible while it waited for review, like on Instagram and TikTok. Then the flow changed. Reported content is now hidden automatically, and the brand reviews it afterwards. So merchants needed a quick way to decide, item by item, whether something goes back to visible or stays hidden.",
    ],
    turningIntro: "There were two options.",
    options: [
      {
        title: "Tick and cross buttons",
        body: "A tick makes the item visible and marks it as reviewed; a cross hides it. One click per item, which is fast for a long list.",
        dropped: "Icons on their own can be read in different ways, and the design didn't show a reported item's current status.",
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
      "We discussed it over several rounds. The PM's point was that the buttons didn't clearly say what each action does, and our design didn't show the current status of a reported item. A status dropdown on hover solved both. The action is written out, and the status is always visible. The team went with the dropdown.",
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
    media: [{ ...sfShot("The status dropdown that shipped, in the Reported tab.", "m-reported"), status: "shipped" }],
  },
];

const superfansSocialFeed: CaseStudy = {
  slug: "superfans-social-feed",
  brand: "#915EE9",
  cardTitle: "Social Feed for Superfans",
  cardSummary:
    "A video feed shoppers can buy from, and merchants can moderate.",
  proof: "TikTok-style shopping inside every brand's own app",
  tone: "violet",
  image: "/assets/superfans/overview.webp?v=2026-11-26",
  imageClass: "project-image--superfans",
  headline: "Bringing shoppable short video to Superfans, the app builder behind 5,000+ Shopify brands",
  hook: "Shoppers spend hours scrolling videos on Instagram and TikTok. Superfans wanted that same feed inside every brand's own app, where every video could be shopped.",
  summary:
    "Superfans is a mobile app platform for Shopify and Shopify Plus brands. Social Feed adds a short video feed to a brand's app. Shoppers watch, like, comment, buy tagged products and post their own content, while merchants publish posts, bring in their Instagram videos, and moderate what their community shares. I designed both sides of the feature, from the first wireframes to design QA on the built product.",
  lead: [
    "Along the way, I argued for a faster moderation flow, lost that debate, and then designed the option the team picked.",
  ],
  stats: [
    { value: "10 months", label: "January to October 2026" },
    { value: "2 sides", label: "Shopper app and dashboard" },
    { value: "iOS, Android", label: "Plus the merchant dashboard" },
    { value: "Designer", label: "From the start, with a PM" },
  ],
  meta: [],
  hero: {
    caption: "The merchant's Social Feed dashboard, with a post in the phone preview beside its comments.",
    src: "/assets/superfans/overview.webp?v=2026-11-26",
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
      goalsIntro: "Social Feed was part of a wider Community push at Superfans. The product spec set three goals for it.",
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
        ["Brand apps had no place for video content", "Bring a shoppable video feed into the app", "Work on both iOS and Android"],
        ["Merchants lacked time to create new content", "Let them reuse their Instagram videos", "Ship parts while others were still in design"],
        ["Shopper posts and comments needed control", "Give merchants moderation and access tools", "Merchants control anything shoppers post"],
        ["Social features are new to brand apps", "Introduce the feed clearly to shoppers", "Fit existing brand apps and the Superfans dashboard"],
      ],
    },
    {
      kind: "journey",
      id: "walkthrough",
      nav: "Final Solution",
      eyebrow: "Final Solution",
      title: "How a brand's short video becomes a sale in the app",
      intro:
        "Riya manages the app for Thread & Care, a scrubs brand on Superfans. Karan is a nurse who shops with them. Both are made up for this story.",
      video: {
        kind: "video",
        caption: "Prototype walkthrough, where a merchant imports an Instagram video, then a shopper watches it, comments and buys the tagged product.",
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
              media: sfShot("The Instagram import modal, after linking the account.", "d-import"),
            },
            {
              title: "Publishes a post of her own",
              body: "Adds a video, writes a description, tags the sweatshirt and sets it visible, with a phone preview beside the form.",
              media: sfShot("New Post panel with the phone preview.", "d-newpost"),
            },
            {
              title: "Sees everything at a glance",
              body: "The grid shows every post; opening one shows the video beside its comments, with likes and a menu to edit, hide or delete.",
              media: sfShot("The grid view of every post.", "d-grid"),
            },
            {
              title: "Keeps the feed safe",
              body: "A reported comment is hidden automatically. She reviews it in the Reported tab and decides who can see the feed at all.",
              media: sfShot("Reviewing a reported post.", "m-review"),
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
              media: sfRow("Feed tab with the swipe up hint.", sf("p-feed"), sf("o-swipe")),
            },
            {
              title: "Watches and shops",
              body: "A video shows the sweatshirt he's been eyeing, tagged right on it. He taps the tag and adds it to his cart.",
              media: sfRow("Feed video with the product tag.", sf("u-posted"), sf("p-caption")),
            },
            {
              title: "Joins the conversation",
              body: "Asks about sizing and replies to another shopper. A notification later brings him back to his highlighted reply.",
              media: sfRow("Comments sheet and the highlighted comment.", sf("p-comments"), sf("p-highlight")),
            },
            {
              title: "Posts his own video",
              body: "A week later he posts a video of his new sweatshirt from the product page, with the product already tagged.",
              media: sfRow("Posting from the product page.", sf("pdp-feed"), sf("pdp-post")),
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
      title: "Video, posting and moderation, built for both sides",
      intro:
        "The grid view, the post view and moderation each get a full story in the decisions below. The rest traces back to four goals, bringing video into the app, saving merchants time, keeping shopper content under control and introducing something new clearly.",
      items: [
        {
          area: "App",
          title: "Watch, shop and answer in one feed",
          noticed: "Brand apps had no place for video, and a video that can't be bought from is just entertainment.",
          did: "Added a Feed tab to the bottom bar that opens a full screen vertical feed. Each post carries a product tag that opens the product page in one tap, plus likes, comments and an expandable caption. Polls and this or that questions fill a slot like a video, so brands collect first hand answers inside the scroll.",
          why: "Shoppers already know this pattern, and buying and answering are built into it.",
          after: "Watching, buying and answering in one feed.",
          highlights: ["Feed tab", "Product tag", "Polls", "This or that"],
          media: sfRow("The feed with the Feed tab, a product tag on a post, and the expanded caption.", sf("p-feed"), sf("u-posted"), sf("p-caption")),
        },
        {
          area: "App",
          title: "Comments that feel complete",
          noticed: "Comments are where a community forms, so half a system wouldn't do.",
          did: "Designed replies, editing, deleting with confirmation, reporting with a reason, an empty state and avatar variations. Anything opened from a notification is highlighted, with a back button.",
          why: "Covering every state makes the conversation feel trustworthy.",
          after: "A complete comments system, down to notifications.",
          highlights: ["Replies", "Edit and delete", "Report with reason", "Highlighted from notifications"],
          media: sfRow("Comments, reporting with a reason, the confirmation and a highlighted comment.", sf("p-comments"), sf("p-report"), sf("p-report2"), sf("p-highlight")),
        },
        {
          area: "Posting",
          title: "Posting, from the feed or a product page",
          noticed: "Shoppers needed a simple way to share, and the best moment to post about a product is while looking at it.",
          did: "Covered choosing media, captions, tagging several products and a preview, then every state after sharing, from under review to rejected, published or failed to upload. A feed icon on the product page starts a post with that item already tagged.",
          why: "A shopper always knows what happened to their post, and posting about a product takes one step less.",
          after: "A full posting flow, also one tap away on the product page.",
          highlights: ["Multiple product tags", "Under review", "Upload failed", "Product pre-tagged"],
          media: sfRow("Tagging products, the preview, under review, and posting from a product page.", sf("u-multi"), sf("u-preview"), sf("u-review"), sf("pdp-post")),
        },
        {
          area: "Onboarding",
          title: "Introducing the feed",
          noticed: "A feed is new in a shopping app, so shoppers need to discover it.",
          did: "Designed a swipe up hint, an “Introducing Social Feed” sheet, a section on the product page, onboarding prompts, and a banner covering explore, engage, shop and share.",
          why: "Light hints where shoppers already are beat a long tutorial.",
          after: "Light entry points that explain the feed where shoppers already are.",
          highlights: ["Swipe up hint", "Intro sheet", "Feed section on the PDP", "Feature banner"],
          media: { ...sfRow("The Introducing Social Feed sheet, the version on the product page, and the feature banner.", sf("o-sheet"), sf("o-pdp"), sf("banner")), phone: false },
        },
        {
          area: "Dashboard",
          title: "Merchant posts, new or from Instagram",
          noticed: "Merchants needed one place to set up a post, and shouldn't have to create content twice.",
          did: "Designed a New Post panel with media upload, description, redirection, like and comment toggles and visibility beside a live phone preview. Merchants can also link Instagram and import several posts at once from their own or tagged posts.",
          why: "Seeing the result while editing removes guesswork, and what brands already have fills the feed in a few clicks.",
          after: "New posts with a live preview, or existing Instagram videos in a few clicks.",
          highlights: ["Live preview", "Redirection", "Instagram import", "Multi-select"],
          media: sfRow("The New Post panel with its preview, and the Instagram import modal.", sf("d-newpost"), sf("d-import")),
        },
        {
          area: "Access",
          title: "Who can see the feed",
          noticed: "Some brands want the feed open to everyone, others only to certain customers.",
          did: "Designed Feed Access Controls with Everyone, Everyone except specific customers, or Only specific customers, using segments. Restricted shoppers see clear app states for posting, commenting or both.",
          why: "When access is limited, shoppers should know why instead of hitting a wall.",
          after: "Brands decide who can view, post and comment, and the app explains it.",
          media: { ...sfRow("Access control options, and the restricted views in the app.", sf("ac-only"), sf("a-comment"), sf("a-feed")), phone: false },
          highlights: ["Everyone", "Everyone except", "Only specific customers", "Restricted states"],
        },
      ],
    },
    {
      kind: "decisions",
      id: "critical-decisions",
      nav: "Decisions",
      eyebrow: "Critical Decisions",
      title: "A grid over a table, shipping over perfect, a dropdown over buttons",
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
          body: "Instagram Reels and TikTok, where brands show products inside a stream of videos. The PM's spec split the work into two releases, first a brand-run feed with imports, likes, comments and reporting, then shopper posting with the moderation it needs. It also fixed rules like vertical 9:16 media, 3 to 60 second videos and a 500 character comment limit.",
        },
        {
          title: "Versions and reviews",
          body: "Every change was reviewed by the design team, the PM and the CEO, with a version log on the canvas. The dashboard, posting flow, moderation and access controls took the most iterations; access controls moved from three radio options, which felt repetitive, to the live dropdown.",
        },
        {
          title: "Design QA",
          body: "Once each area was built, I reviewed it against the designs and logged every issue with a screenshot and the matching design for developers to fix. Most issues were visual, like spacing, alignment and states that didn't match.",
        },
      ],
      media: sfShot("The version log cards from the design file.", "log"),
    },
    {
      kind: "future",
      id: "future-scope",
      nav: "Future Scope",
      eyebrow: "Future Scope",
      title: "Analytics, new blocks and a second look at the post view",
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
      title: "What ten months on a social feature taught me",
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
    },
  ],
};


// ---------- Expenzo screenshots ----------
// Exported from the project's Figma file at 2x. Bump when replaced.
const EX_VERSION = "2026-11-22b";

const exSizes = {
  splash: [784, 1700], reminder: [784, 1700], home: [784, 1700], camera: [784, 1700], scanning: [784, 1700],
  "scan-status": [784, 1700], "scan-done": [784, 1700], record: [784, 1700], "select-category": [784, 954],
  "add-category": [784, 1700], "record-category": [784, 1700], "home-updated": [784, 1700], analytics: [784, 1700],
  "repeat-edit": [784, 1700], "repeat-sheet": [784, 520], "repeat-set": [784, 1700], "analytics-export": [784, 1700],
  export: [784, 1700], exported: [784, 1700], "failed-notified": [784, 1700], "failed-popup": [784, 1700],
  "record-empty": [784, 1700], "tax-sheet": [784, 500], "fab-menu": [720, 340], "manual-record": [784, 1700],
  "first-scanning": [784, 1700], "first-two-status": [784, 1700], "first-being-scanned": [784, 1700], "first-add": [784, 1700],
  "first-analytics": [784, 1700], "first-home": [784, 1700], "var-home-same": [784, 1700], "var-home-green": [784, 1700],
  filter: [784, 1700], "var-txn-old": [784, 1700], "sketch-00": [453, 854], "sketch-02": [453, 854], "sketch-04": [453, 854],
  "sketch-06": [453, 854], "sketch-08": [453, 854], "sketch-10": [453, 854], "ledger-excel": [1620, 480], zoho: [930, 605],
  bookipi: [930, 605],
} satisfies Record<string, [number, number]>;

type ExShot = keyof typeof exSizes;

const ex = (name: ExShot, label?: string, status?: MediaFrame["status"]): MediaFrame => ({ src: `/assets/expenzo/${name}.webp?v=${EX_VERSION}`, size: exSizes[name], label, status });
const isPhone = (size: [number, number]) => size[1] > size[0] * 1.6;
const exShot = (alt: string, name: ExShot): MediaItem => ({ caption: "", alt, src: ex(name).src, size: exSizes[name], phone: isPhone(exSizes[name]) });
const exRow = (alt: string, ...row: MediaFrame[]): MediaItem => ({ caption: "", alt, row, phone: row.some((f) => isPhone(f.size)) });
// Shows the alt text as a visible caption, so a Dropped or Shipped tag has a line to sit on.
const exCap = (item: MediaItem): MediaItem => ({ ...item, caption: item.alt ?? "" });

const expenzoDecisions: DecisionItem[] = [
  {
    title: "Why scanning runs in the background instead of holding the screen",
    hook: "Ravi has a month of receipts to get through. Should he stare at a progress bar for each one?",
    before: [
      "In my first flow, a scan opened a pop-up that stayed until the receipt was read. Checking on a scan meant opening a separate “Receipt Being Scanned” page, and failed scans sat in their own list.",
    ],
    turningIntro: "I worked through three versions.",
    options: [
      {
        title: "Wait on the scanning pop-up",
        body: "Simple to build and easy to follow, one receipt at a time.",
        dropped: "With a stack of bills, waiting on every scan turns automation back into a chore.",
      },
      {
        title: "Two status rows and a status page",
        body: "“Receipts Being Scanned” and “Scan Receipt Failed” on All Transactions, each opening its own page.",
        dropped: "Two rows for one job, and an extra page just to learn whether a scan worked.",
      },
      {
        title: "Scan in the background, then notify",
        body: "One “Receipt Scan Status” row, a notification when reading finishes, and a tap straight into the filled-in expense.",
        chosen: true,
      },
    ],
    reasoning: [
      "Zoho Expense lets people keep using the app while a receipt is read, and that answered my ambiguity about whether the overlay should block the screen. Merging the rows and adding a notification removed the trip to a status page.",
    ],
    next: [
      "I merged both statuses into a single row, added “Receipt autoscanning completed” and “Receipt auto scanning failed” notifications, and sent successful scans directly to Record Expense.",
    ],
    result: [
      "The final flow lets Ravi scan, keep browsing, and review each receipt when it's ready.",
    ],
    media: [
      exRow(
        "First, two status rows and a page for checking a scan. Finally, one status row and a notification when the scan is read.",
        ex("first-two-status", "Two status rows", "dropped"),
        ex("first-being-scanned", "A status page", "dropped"),
        ex("scan-status", "One status row", "shipped"),
        ex("scan-done", "Notified when done", "shipped"),
      ),
    ],
  },
  {
    title: "Why the scanning pop-up lost its “Add Manually” button",
    hook: "Three buttons on a pop-up that only needs to say “please wait”. Which ones earn their place?",
    before: [
      "Following Zoho Expense, the first scanning pop-up offered Wait for Autoscan, Add Manually and Delete Receipt. OCR reads receipts with 85% to 95% accuracy, dropping to about 75% on poor photos or handwriting, so a manual route felt necessary.",
    ],
    turningIntro: "I weighed three versions of that pop-up.",
    options: [
      {
        title: "Wait, Add Manually and Delete",
        body: "Every route is available at once.",
        dropped: "Testers couldn't tell whether Add Manually stopped the scan or saved the receipt, and typing isn't needed while a scan might still work.",
      },
      {
        title: "Wait and Retake",
        body: "Retake would replace Delete, for a blurry photo.",
        dropped: "A retake makes more sense after a failure than during a scan, and Delete still lets people undo a mistake.",
      },
      {
        title: "Wait and Delete while scanning, Add Manually and Retake on failure",
        body: "Each choice shows up only when it's useful.",
        chosen: true,
      },
    ],
    reasoning: [
      "The manual route didn't disappear. It moved to the moment it matters, when a scan fails, with the receipt photo already attached to the empty form.",
    ],
    next: [
      "I rebuilt the scanning pop-up with two actions and designed a separate “Scanning Failed” pop-up offering Add Manually or Retake Receipt.",
    ],
    result: [
      "Fewer choices while waiting, and a clear way forward when reading fails.",
    ],
    media: [
      exRow(
        "The first scanning pop-up with three buttons, then the final pop-ups with two actions while scanning, and the failure state.",
        ex("first-scanning", "Three buttons", "dropped"),
        ex("scanning", "While scanning", "shipped"),
        ex("failed-popup", "When a scan fails", "shipped"),
      ),
    ],
  },
  {
    title: "Why the expense form copies the ledgers owners already keep",
    hook: "Articles told me what businesses should track. Ledgers told me what they actually write down.",
    before: [
      "My early expense form had a name, an amount and a category. General research on small businesses was too broad to say which fields mattered for GST.",
    ],
    turningIntro: "There were two ways to decide the fields.",
    options: [
      {
        title: "A generic expense form",
        body: "Quick to fill and familiar from personal finance apps.",
        dropped: "It missed what accountants need for GST, like invoice number, GST number, merchant and tax split.",
      },
      {
        title: "Fields taken from real records",
        body: "Match the columns in owners' notebooks and sales and purchase sheets.",
        chosen: true,
      },
    ],
    reasoning: [
      "A small business owner who runs a 10-person printing company showed me his handwritten expense book and the Excel sheet he sends his auditor. Interviews with four more owners confirmed the same structure.",
    ],
    next: [
      "Record Expense follows that format, with date, time, name, invoice or reference number, GST number, merchant, category, amount and tax type. A secondary-research question shaped the tax field. Within a state, 18% GST splits into 9% CGST and 9% SGST, while sales across states use IGST.",
    ],
    result: [
      "An owner can check a scanned receipt against the same columns they already know, and the export lines up with what the accountant expects.",
    ],
    media: [
      { ...exCap(exShot("A real expense notebook and the sales sheet sent to the auditor, with the columns that shaped the form.", "ledger-excel")), wide: true },
      exRow("The Record Expense form and the tax type choice.", ex("record", "Record Expense"), ex("tax-sheet", "Choosing the tax type")),
    ],
  },
  {
    title: "Why exporting got its own screen instead of a menu item",
    hook: "An export that lives behind three dots works for one file. GST filing needs the right file.",
    before: [
      "In the first cut, the Analytic Report had a three-dot menu with Share, Export as PDF and Export as XLS. Analytics only listed data by week, month or year.",
    ],
    turningIntro: "There were two versions.",
    options: [
      {
        title: "Export from a three-dot menu",
        body: "Fast, and out of the way.",
        dropped: "No way to pick dates or transaction types, and my self-review asked whether anyone would find the menu at all.",
      },
      {
        title: "A dedicated Export screen",
        body: "Pick a date range, Expense, Income or Both, the B2B and B2C groupings, and Excel or PDF.",
        chosen: true,
      },
    ],
    reasoning: [
      "GST work runs on deadlines in a month, and an accountant needs purchases and sales split the way the return is filed. Zoho Books groups its reports by sales and expenses, which suggested the categories.",
      "Testers also asked to filter by specific dates and by category, so the same thinking went into a new Filter page.",
    ],
    next: [
      "I moved export to an icon on the Analytic Report that opens the Export screen, added a “File exported” notification, and designed a Filter page with transaction type, B2B and B2C groupings and expense categories.",
    ],
    result: [
      "Ajay, one of the testers, singled out filtering by B2B and B2C and exporting to Excel or PDF as what made tax reporting easier.",
    ],
    media: [
      exRow(
        "Exporting from a three-dot menu, then the final Export screen and the Filter page.",
        ex("first-analytics", "Three-dot menu", "dropped"),
        ex("export", "Export screen", "shipped"),
        ex("filter", "Filter page", "shipped"),
      ),
    ],
  },
];

const expenzo: CaseStudy = {
  slug: "expenzo",
  brand: "#3F6E4E",
  cardTitle: "Expenzo, an expense tracker",
  cardSummary:
    "Scan a receipt, get the GST details filled in, export it for the accountant.",
  proof: "5 owner interviews, 3 usability tests",
  tone: "peach",
  image: "/assets/expenzo/card.png?v=2026-11-22b",
  imageClass: "project-image--expenzo",
  headline: "Designing an expense tracker that turns a month of paper receipts into a GST-ready file",
  hook: "Before every GST deadline, small business owners sit down with a pile of bills, a notebook and an Excel sheet, and type it all in by hand.",
  summary:
    "Expenzo is a concept mobile app for small business owners in India. It scans receipts, fills in the invoice and GST details, sorts expenses into categories, repeats regular bills and exports a file that's ready for the accountant.",
  lead: [
    "I designed it on my own over three months, from picking the problem out of 18 options to a tested prototype. I interviewed five business owners, studied five competing apps and tested the first version with three people.",
    "The challenge was that the people who need automation most trust it least. One owner had tried scanning apps and found that correcting their mistakes took as long as typing. The hardest call was how much of the scanning to hide, and how much to show.",
  ],
  stats: [
    { value: "Concept", label: "Self-initiated, not shipped" },
    { value: "3 months", label: "Sep to Nov 2024" },
    { value: "5 owners", label: "Interviewed for research" },
    { value: "Designer", label: "Solo, research to prototype" },
  ],
  meta: [],
  hero: {
    caption: "Expenzo's home, a receipt being scanned, the filled-in expense and the Export screen.",
    src: "/assets/expenzo/hero.webp?v=2026-11-22b",
    browser: false,
  },
  sections: [
    {
      kind: "problem",
      id: "the-problem",
      nav: "The Problem",
      eyebrow: "The Problem",
      title: "Bookkeeping that happens in notebooks, spreadsheets and a monthly rush",
      intro:
        "Small business owners keep their own records, usually in a mix of paper ledgers, receipts and Excel. Every month, someone has to turn that pile into numbers an accountant can file.",
      story: [
        {
          label: "What I heard",
          text: [
            "Kalim runs an IT services company and enters every expense twice, once in Excel and once in Tally. For GST, “it's often a rush at the end of the month to organize everything properly and submit it on time.”",
            "Raja runs eight cars for a travel business. Fuel and maintenance go into a paper ledger, income into Excel, and when the two don't match, finding the mistake “can take hours.”",
          ],
        },
        {
          label: "Why it was worth solving",
          text: "Missed entries and wrong categories lead to inaccurate reports, and inaccurate GST records can mean penalties. Owners also lose time they'd rather spend running the business.",
        },
      ],
      goalsIntro: "What the app needed to do for a business.",
      goals: [
        { title: "Save time", body: "Take repetitive entry off the owner's plate." },
        { title: "Cut errors", body: "Read receipts instead of retyping them." },
        { title: "Show where money goes", body: "A clear picture of income and spending each month." },
        { title: "Stay ready for GST", body: "Records organized in the format an accountant files." },
      ],
      pains: [
        { title: "Typing everything twice", body: "Receipts go into a ledger first, then into Excel or Tally." },
        { title: "Receipts go missing", body: "Lost or damaged paper leaves gaps in the records." },
        { title: "Small costs slip through", body: "Kumar, who runs a 40-room hostel, said small expenses he forgets to note throw off his totals." },
        { title: "A monthly deadline scramble", body: "Invoices are sorted for the accountant in a hurry before filing." },
      ],
      note: {
        title: "What existing apps offered",
        body: "Of the five apps I studied, only Zoho Expense could scan receipts, and it tracked expenses without income. Bookipi, FinArt, Zenmoney and Axio had no scanning and no export.",
      },
      media: { ...exShot("A real expense notebook and the Excel sheet sent to an auditor.", "ledger-excel"), wide: true },
      mapping: [
        ["Typing receipts in by hand", "Scan a receipt and review what it read", "OCR is never 100% accurate"],
        ["Records scattered across paper and Excel", "Income and expenses in one place", "Owners who aren't tech-savvy"],
        ["A rush to prepare GST files", "An export shaped for the accountant", "Indian GST rules"],
        ["Regular bills entered every month", "Transactions that repeat on their own", "Solo concept project"],
      ],
    },
    {
      kind: "journey",
      id: "walkthrough",
      nav: "Final Solution",
      eyebrow: "Final Solution",
      title: "How one GST reminder becomes a file ready for the accountant",
      intro: "The prototype follows Ravi, a 47-year-old owner of a small printing business, through one month's filing day.",
      video: { kind: "video", caption: "Prototype walkthrough video, to be added." },
      lanes: [
        {
          name: "Ravi",
          role: "Business owner",
          about: "Ravi has a month of receipts on his desk and a GST deadline coming up. Here's his session in Expenzo, step by step.",
          steps: [
            { title: "A reminder on filing day", body: "“Hi Ravi S, finalize your monthly expenses.” He gathers his receipts.", media: exShot("Expenzo's reminder notification on the lock screen.", "reminder") },
            { title: "Scan from the center of the nav", body: "He taps the scan button and photographs the first receipt.", media: exShot("The home screen with the scan button in the middle of the bottom bar.", "home") },
            { title: "Keep going while it reads", body: "A pop-up shows progress. He taps Wait for Autoscan and carries on browsing.", media: exShot("Scanning in progress, 40% completed.", "scanning") },
            { title: "Notified when it's done", body: "A notification says the receipt is read. One tap opens the filled-in expense.", media: exShot("The scan-complete notification over All Transactions.", "scan-done") },
            { title: "Fix the category", body: "“Material” doesn't fit, so he creates “Printing Supply” and saves the expense.", media: exShot("Adding a new expense category.", "add-category") },
            { title: "Spot the repeating bill", body: "In Analytics he notices the internet bill comes every month, and sets it to repeat monthly.", media: exShot("Choosing how often a transaction repeats.", "repeat-set") },
            { title: "Export for the accountant", body: "He picks the dates, the transaction types and Excel, then sends the file on.", media: exShot("The Export screen.", "export") },
          ],
        },
      ],
    },
    {
      kind: "solution",
      id: "solution",
      nav: "Solution Explanation",
      eyebrow: "Solution Explanation",
      title: "From a pile of receipts to records an accountant can file",
      intro: "Each part answers something an owner told me, or something that broke in testing.",
      items: [
        {
          title: "A home that answers “how's this month going?”",
          noticed: "Owners wanted to see money in and out at a glance, and most finance apps open on a summary card.",
          did: "Put total balance, this month's income and expense, and the latest transactions on home, with scanning in the middle of the bottom bar.",
          why: "The most frequent job sits under the thumb, and the numbers that matter are the first thing on screen.",
          before: "Records spread across paper and Excel.",
          after: "Income, expense and recent activity on one screen.",
          media: exRow("Home, and the add menu for entering income or an expense by hand.", ex("home", "Home"), ex("fab-menu", "Add income or expense")),
        },
        {
          title: "Categories that fit the business",
          noticed: "Interviewees track costs like rent, materials and fuel their own way, and a fixed list never quite fits.",
          did: "Offered common categories in a sheet, plus a “+” to create one, with its own icon colour and a choice of expense or income.",
          why: "Reports only help when the buckets match how the owner thinks.",
          before: "Every printing cost filed under “Material”.",
          after: "“Printing Supply”, made in a few taps.",
          media: exRow("Choosing a category, creating one, and the expense saved with it.", ex("select-category", "Select category"), ex("add-category", "Add category"), ex("record-category", "Saved")),
        },
        {
          title: "Bills that repeat themselves",
          noticed: "Utilities, wages, rent and internet come every month, and owners enter them again each time. Kumar asked for this directly.",
          did: "Added a repeat option to any transaction, by week, month or year, borrowing the idea from Zenmoney.",
          why: "Anything predictable shouldn't need typing twice.",
          before: "The same bill entered every month.",
          after: "Set once, logged automatically.",
          media: exRow("Picking a repeat interval for the internet bill.", ex("repeat-edit", "Edit expense"), ex("repeat-sheet", "Repeat by week, month or year")),
        },
        {
          title: "Analytics with real filters",
          noticed: "Testers wanted specific dates and categories, not just week, month or year.",
          did: "Gave the Analytic Report a weekly income and expense chart, a summary, month navigation on the right for the thumb, and a Filter page.",
          why: "Owners check by month for GST and by category to see where money goes.",
          before: "Fixed weekly, monthly or yearly lists.",
          after: "Dates, types and categories to filter by.",
          media: exRow("The Analytic Report and its Filter page.", ex("analytics", "Analytic Report"), ex("filter", "Filter")),
        },
        {
          title: "A way forward when scanning fails",
          noticed: "OCR struggles with poor photos and handwriting, and Kalim had already given up on one inaccurate scanner.",
          did: "Designed a failure notification and pop-up with Add Manually or Retake Receipt, which opens the form with the receipt photo already attached.",
          why: "Trust comes from handling the misses well, not from promising there won't be any.",
          before: "A failed scan meant starting over.",
          after: "Add it by hand, receipt attached.",
          media: exRow("The failure notification, the choice, and the form with the receipt attached.", ex("failed-notified", "Failure notification"), ex("failed-popup", "Add manually or retake"), ex("record-empty", "Receipt attached")),
        },
      ],
    },
    {
      kind: "decisions",
      id: "critical-decisions",
      nav: "Decisions",
      eyebrow: "Critical Decisions",
      title: "Wait or keep going, three buttons or two, generic or familiar, menu or screen",
      items: expenzoDecisions,
    },
    {
      kind: "system",
      id: "design-system",
      nav: "Design System",
      eyebrow: "Design System",
      title: "A small system built for money on a phone",
      intro: "Expenzo didn't have a design system to start from, so I set up text styles, colours and components in Figma as the screens took shape.",
      patterns: [
        { title: "Balance card", body: "Total balance with this month's income and expense, in the theme green." },
        { title: "Transaction row", body: "Category icon, name, party, amount and time, with green for money in and red for money out." },
        { title: "Input card", body: "A label above the value, used for every field in Record Expense and Export." },
        { title: "Notification cards", body: "Reminder, scan complete, scan failed and file exported, sharing one layout." },
      ],
      tokens: [
        { sample: "type", label: "Type", value: "Ten text styles, from 12px dates to a 24px total balance" },
        { sample: "color", label: "Colours", value: "Theme green, price green and red, and light category tints" },
        { sample: "icons", label: "Icons", value: "Outline icons, one tint per category" },
      ],
      note: {
        title: "Colour carries meaning",
        body: "Green and red appear only on amounts, so they always mean money in or out. Abrar, a tester with no finance background, said that alone helped him understand what was coming in and going out.",
      },
    },
    {
      kind: "process",
      id: "process",
      nav: "Process",
      eyebrow: "Process",
      title: "From a guess about receipts to a tested prototype",
      intro: "I worked in milestones, and each one ended with a review that changed the next.",
      steps: [
        {
          label: "Choosing the problem",
          title: "Picking one problem out of 18",
          body: "I reviewed 18 problem statements and chose expense management for small businesses, then split it into the user's problem and the business goal.",
          points: ["Fintech", "Small business owners", "India"],
        },
        {
          label: "Hypothesis",
          title: "Sketching the first guess",
          body: "My first hypothesis was a scan button that reads a receipt, saves it as an expense and exports a monthly Excel file for the auditor. I sketched it on paper, screen by screen.",
          details: [
            "Secondary research on small business finance left me with more questions than answers, and for a while the project stalled. Writing down a hypothesis turned that fog into specific questions I could go and answer.",
          ],
          media: exRow("Paper sketches of the first scan flow.", ex("sketch-00"), ex("sketch-02"), ex("sketch-04"), ex("sketch-06")),
        },
        {
          label: "Ambiguities",
          title: "Turning questions into research",
          body: "I listed what I didn't know and answered each one before designing further.",
          points: [
            "Should an expense tracker track income too?",
            "What does a GST filing report contain?",
            "Why does 18% GST show up as 9% and 9%?",
            "Should a scan block the screen?",
            "What if a receipt has no invoice or GST number?",
          ],
        },
        {
          label: "Competitors",
          title: "Studying five apps",
          body: "I used Bookipi, FinArt, Zoho Expense, Zenmoney and Axio, noting what each did well and what was missing.",
          details: [
            "Zoho Expense showed background scanning, Zenmoney repeat transactions, Bookipi tutorial videos after sign-up, and FinArt and Axio reading bank SMS. Only Zoho could scan receipts, and none of them exported a GST-ready file.",
          ],
          media: { ...exRow("Two of the apps I studied, Zoho Expense and Bookipi.", ex("zoho", "Zoho Expense"), ex("bookipi", "Bookipi")), browser: false },
        },
        {
          label: "Interviews",
          title: "Talking to five business owners",
          body: "I started with a printing-company owner and then interviewed four more, an IT services owner, a valve manufacturer that exports 99% of its output, a 40-room hostel owner and a car travel operator.",
          details: [
            "Everyone mixed paper and Excel, and the bigger businesses added Tally. Manual entry, lost receipts and the monthly GST rush came up again and again.",
            "Not everyone wanted automation. Hareendran, the manufacturer, prefers manual entry because “it gives us more control over the data”. That pushed me to make every scan easy to review and correct.",
          ],
          points: ["Paper plus Excel everywhere", "Automation only if accurate", "Excel for the accountant", "Reminders and repeats"],
        },
        {
          label: "First cut",
          title: "The first full version",
          body: "I designed the first high-fidelity screens around Ravi's filing-day journey, with research notes pinned next to each decision.",
          media: exRow("Screens from the first cut.", ex("first-home", "Home"), ex("first-scanning", "Scanning"), ex("first-add", "Add transaction"), ex("first-analytics", "Analytics")),
        },
        {
          label: "Testing",
          title: "Self-review and three usability tests",
          body: "I reviewed the first cut against consistency, clarity and affordance, had teammates critique it, and gave three people a 14-step task to complete.",
          details: [
            "Abrar, with no finance background, didn't know where to start after logging in, which led to onboarding with tutorial videos. Ajay liked the B2B and B2C export and recurring transactions, and asked for bulk import from Excel. Kalim wanted Tally integration and automatic GST calculation.",
          ],
          points: [
            "Scan and home icons both looked active",
            "Expense and Income as tabs was the wrong pattern",
            "The icon picker had no signifier",
            "Filters needed dates and categories",
          ],
          media: exRow("Home before and after. The scan and home icons first shared one active colour.", ex("var-home-same", "Before"), ex("home", "After")),
        },
        {
          label: "Final",
          title: "Covering the edges",
          body: "Beyond the main journey, the final prototype covers a failed scan, entering income or an expense by hand, and a first-time user flow with sign-in, SMS and location permissions and tutorial videos.",
          media: exRow("Manual entry and the failed-scan path.", ex("fab-menu", "Add by hand"), ex("manual-record", "Blank expense form"), ex("failed-popup", "When a scan fails")),
        },
      ],
      notes: [
        {
          title: "A concept, not a launch",
          body: "Expenzo was never built or released, so there are no usage numbers. What I can show is the research behind each choice and how testing changed the design.",
        },
        {
          title: "What I'd test next",
          body: "Whether owners trust a scan enough to skip checking every field, and whether the B2B and B2C groupings match how different accountants want their files.",
        },
      ],
    },
    {
      kind: "future",
      id: "future-scope",
      nav: "Future Scope",
      eyebrow: "Future Scope",
      title: "Where Expenzo could go after the prototype",
      intro: "These ideas came from interviews, testing and competitors, and were left out to keep the first version focused.",
      tag: "Next",
      items: [
        { title: "Reading bank SMS", body: "FinArt and Axio create transactions from bank messages. For owners who rely on SMS alerts as their record, this would remove even more typing." },
        { title: "Tally and Excel import", body: "Ajay asked for bulk import, and Kalim and Hareendran both run their books in Tally. Syncing with it would meet them where they already work." },
        { title: "Copy into the GST tool", body: "The government's offline GST tool accepts data pasted from Excel. A matching export would turn filing into a copy and paste." },
        { title: "Several people, one account", body: "Let an owner give staff access to add expenses while keeping control of sensitive numbers, as Zoho Books does." },
        { title: "Matching receipts to the ledger", body: "Check uploaded receipts against existing entries and flag duplicates or mismatches." },
        { title: "Working offline", body: "Record expenses without a connection and sync later, for owners on the road or with patchy internet." },
      ],
    },
    {
      kind: "learnings",
      id: "learnings",
      nav: "Learnings",
      eyebrow: "Learnings",
      title: "What designing for paper-first businesses taught me",
      items: [
        { title: "Feeling stuck is part of the work.", body: "The stall after secondary research ended once I wrote down a hypothesis and turned it into questions." },
        { title: "Real records beat general research.", body: "One expense book and one auditor sheet told me more about the form than any article." },
        { title: "Ask what people use instead.", body: "When someone doesn't use an app, their notebook or spreadsheet is the real competitor." },
        { title: "Solve the important 80%.", body: "Testers suggested far more than one version could hold, so I fixed what blocked the main journey and logged the rest." },
      ],
    },
    {
      kind: "outcome",
      id: "outcome",
      nav: "Outcome",
      eyebrow: "Outcome",
      title: "From typing every receipt to reviewing what the app read",
      intro: "Expenzo started as a guess that owners struggle with receipts. Interviews, five competitor apps and three usability tests turned it into a prototype that scans in the background, records expenses in the format accountants use, repeats regular bills and exports a file ready for GST.",
      before: "Paper ledgers, Excel and a monthly rush",
      after: "Scan, review, repeat and export in one app",
      stat: { value: "5", label: "Business owners whose records shaped the design" },
    },
  ],
};

export const caseStudies: CaseStudy[] = [superfansSocialFeed, cartAbandonment, modernCart, expenzo];

