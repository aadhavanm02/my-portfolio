// Case study content for the portfolio.
// Text supports **bold** and [link text](https://url) inline.
// Media without a `src` renders as a placeholder; add a `src` (e.g. "/assets/...") to show a real image.
// Set `protected: true` on a section to put it behind the NDA code screen.

export type ProjectTone = "violet" | "peach";

export type MediaFrame = {
  src: string;
  // Natural size in pixels, so the layout is stable before the image loads.
  size: [number, number];
  label?: string;
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
  protected?: boolean;
};

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
  stats: Stat[];
  meta: Array<[string, string]>;
  hero: MediaItem;
  sections: CaseSection[];
};

const feedback = (question: string) =>
  `${question} Feedback is welcome on [LinkedIn](https://www.linkedin.com/in/aadhavan-m/) or by [email](mailto:aadhavanm.design@gmail.com).`;

const cartAbandonmentDecisions: DecisionItem[] = [
  {
    title: "Why Reports became a dropdown instead of more tabs",
    hook: "Every new feature wanted a spot in the top navigation, which only had so much room.",
    before: [
      "A tab per report would crowd the top bar once Product Report, Email Logs, Integrations and Popup Templates arrived.",
    ],
    turningIntro: "Four directions:",
    options: [
      {
        title: "A tab for each report",
        body: "One click to any report, but the bar fills up with every new one.",
      },
      {
        title: "Underline tabs inside a Reports page",
        body: "A short top bar, but a second row of navigation inside the page.",
      },
      {
        title: "Pill tabs beside the table title",
        body: "Compact and close to the data, but easy to miss and hard to scale past two.",
      },
      {
        title: "A dropdown under Reports in the top bar",
        body: "A short top bar with every report in one place, for one extra click.",
        chosen: true,
      },
    ],
    reasoning: [
      "With the PM and developers, we chose the dropdown: a short main navigation that new reports never touch.",
    ],
    next: [
      "Both reports share one table layout, so they feel like one area.",
    ],
    result: [
      "It shipped. The live top bar has five items: Dashboard, Follow Up Emails, Reports, Integrations and Settings.",
    ],
    media: [{ caption: "The four navigation versions side by side." }, { caption: "The live top bar." }],
  },
  {
    title: "Why Email Logs became a full page, not a side drawer",
    hook: "A store owner opens one abandoned cart. How much should they see, and where?",
    before: [
      "Email editing opened in a drawer beside the list; Email Logs, one cart's detail, needed a home too.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "A side drawer",
        body: "Matches the email editor and keeps the list in view, but a cart's emails, addresses and order get cramped.",
        badge: "My first proposal",
      },
      {
        title: "A full page",
        body: "Room for every detail, at the cost of leaving the list and breaking pattern with the editor.",
        chosen: true,
      },
    ],
    reasoning: [
      "I proposed the drawer for consistency. The PM and developers argued this is a detailed read, not a quick edit, and seeing how much one cart holds, I agreed. The old plugin used a full page too, so existing users know it.",
    ],
    next: [
      "Email details come first, then billing and shipping side by side, then the order items with totals.",
    ],
    result: [
      "It shipped. Now I ask early: quick edit or detailed read? The answer, not consistency alone, picks the pattern.",
    ],
    media: [{ caption: "The drawer version." }, { caption: "The full page version." }],
  },
  {
    title: "Why the dashboard chart always compares two numbers",
    hook: "A chart that changes when you click a card sounds clever. But would store owners ever know to click?",
    before: [
      "The old Report page had six numbers and no chart: totals, but no sign of whether recovery was improving.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "One chart that switches with the cards",
        body: "Flexible, but hidden: owners might never find it, or wonder why the chart changed.",
      },
      {
        title: "A fixed chart comparing two metrics",
        body: "Recoverable and recovered revenue, always together: less flexible, but what was at risk and what came back stay in view.",
        chosen: true,
      },
    ],
    reasoning: [
      "The gap between the lines is what owners care about; it shouldn't hide behind a click.",
    ],
    next: [
      "Both lines use brand colors, with a legend and one date picker for cards and chart. The first of two dashboard versions, refined over a few rounds, became final.",
    ],
    result: ["It shipped: six cards above the comparison chart."],
    media: [{ caption: "Dashboard V1." }, { caption: "Dashboard V2." }, { caption: "The live dashboard." }],
  },
  {
    title: "Why shoppers can skip the email popup",
    hook: "The store needs an email to recover a cart. But asking on every Add to Cart can feel like a login wall.",
    before: [
      "The add to cart popup asks for an email for follow-ups; logged-out shoppers may see it repeatedly.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "Always require the email",
        body: "More emails, but annoyed shoppers may leave.",
      },
      {
        title: "Let store owners make it optional",
        body: "Shoppers tap “No thanks” and keep shopping, so fewer emails come in at this step.",
        chosen: true,
      },
    ],
    reasoning: [
      "I made it the owner's choice with an “Email field mandatory?” toggle. Skipping is safe: shoppers still give an email at checkout, where being asked feels necessary.",
    ],
    next: [
      "With the toggle off, the popup shows an editable “No thanks” link, and the template list counts how many skip.",
    ],
    result: [
      "It shipped in Pro's Popup Templates: owners balance emails against shopper patience, with data to decide.",
    ],
    media: [{ caption: "The popup with the email required." }, { caption: "The popup with “No thanks.”" }],
  },
];

// ModernCart screenshots (public/assets/modern-cart), cropped to the part each section is about.
const mcSizes = {
  "general-tab": [1547, 860],
  "general-pro": [1592, 1340],
  "general-settings": [1592, 600],
  "text-label-fields": [1432, 1080],
  "text-label-empty-fields": [1432, 780],
  "floating-icon-card": [1880, 1060],
  "styling-colors": [1352, 840],
  "styling-width": [1352, 940],
  "upgrade-modal": [1010, 1650],
  "free-vs-pro": [1892, 1100],
  "cart-empty-panel": [958, 2250],
  "cart-one-panel": [958, 2250],
  "cart-two-panel": [958, 2250],
  "coupon-link-crop": [958, 810],
  "coupon-field-crop": [958, 854],
  "coupon-tag-crop": [958, 822],
  "summary-card-crop": [958, 674],
  "summary-tags-crop": [958, 766],
  "popup-empty": [2008, 1730],
  "popup-suggest": [2016, 1740],
  "popup-items": [2016, 1846],
  "popup-items-tablet-box": [2228, 3280],
  "popup-items-mobile-box": [1200, 2556],
  "slideout-full": [2000, 1125],
  "popup-full": [2000, 1125],
  "live-preview": [2000, 1157],
  "custom-icon-card": [1760, 2060],
  "icon-preview-card": [1720, 2176],
} satisfies Record<string, [number, number]>;

type McShot = keyof typeof mcSizes;

function mc(name: McShot, label?: string): MediaFrame {
  return { src: `/assets/modern-cart/${name}.webp`, size: mcSizes[name], label };
}

const mcShot = (alt: string, name: McShot): MediaItem => ({ caption: "", alt, ...mc(name) });
const mcRow = (alt: string, ...row: MediaFrame[]): MediaItem => ({ caption: "", alt, row });

const modernCartDecisions: DecisionItem[] = [
  {
    title: "Why I wanted free users to see Pro features, not lose them",
    hook: "When ModernCart split into Free and Pro, features free users relied on moved behind a paywall. What would they see next time they opened settings?",
    before: [
      "Which features went Pro was set; how they'd appear to free users was not.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "Hide Pro features completely",
        body: "Clean and simple, but a feature used last week would just vanish, with no explanation.",
        chosen: true,
        badge: "Team's choice",
      },
      {
        title: "Show them locked, with a PRO badge and upgrade note",
        body: "Owners see what moved and what Pro adds, without being blocked. The cost: a slightly busier screen.",
        badge: "My proposal",
      },
    ],
    reasoning: [
      "I proposed showing them, for the PM and leadership to weigh. A missing feature feels taken away; a locked one shows what upgrading gets you. ForceUI already had PRO badges.",
    ],
    next: [
      "I designed PRO badges, disabled fields with an inline “Upgrade now” note, an upgrade modal and a Free vs Pro tab.",
    ],
    result: [
      "The team kept the free version focused on free features, so Pro stays hidden. Both options were weighed, which was my goal.",
      "The lesson: bring clear options and reasons; the right call depends on how the business positions its product.",
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
      "Empty, a dead end. Full, just a list of picks.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "Keep the cart as a plain list",
        body: "No distractions, but empty is a dead end and full misses the moment shoppers are most ready to buy.",
      },
      {
        title: "Let the cart suggest products",
        body: "Shoppers opening the cart are still shopping, so a suggestion keeps them going. The risk: clutter near checkout.",
        chosen: true,
      },
    ],
    reasoning: [
      "I chose suggestions for two reasons. For the business, each one can raise the average order value. For the shopper, an empty screen becomes something to explore: tap to see the product, or add it straight from the cart.",
      "The idea came from the competitor review: [FunnelKit Cart](https://funnelkit.com/woocommerce-cart/) already suggests products in its side cart. I kept suggestions small so they never take over.",
    ],
    next: [],
    nextList: [
      "**Empty cart:** “Your Cart Is Empty, Let's Fix That,” a featured product to add in one tap, and a Shop Now button.",
      "**Cart with items:** a small “You might also like” carousel below the items, showing one or two products as a style owners can pick.",
    ],
    result: [
      "The team agreed straight away; both shipped while I was there. The popup cart reuses them, and owners can rename them in Text Label.",
      "Empty or full, the cart always gives shoppers something to explore.",
    ],
    media: [
      mcRow(
        "From a dead end to something to explore.",
        mc("popup-empty", "Empty, no suggestion"),
        mc("cart-empty-panel", "Empty, with a suggestion"),
        mc("cart-two-panel", "Full, with the carousel"),
      ),
    ],
  },
  {
    title: "Why I proposed a popup cart for stores that want the cart front and center",
    hook: "ModernCart opened one way: a panel sliding in from the side. Not every store wants its cart at the edge.",
    before: ["Slide-out was the only cart type."],
    turningIntro: "Exploring new cart styles, I weighed two directions:",
    options: [
      {
        title: "Keep only the slide-out",
        body: "Light, with the page still visible. But easy to glance past.",
      },
      {
        title: "Add a popup that opens in the center of the page",
        body: "Full attention, but it covers the page while open.",
        chosen: true,
        badge: "Added alongside",
      },
    ],
    reasoning: [
      "Neither suits every store, so I proposed both and let owners choose. Centered popups were already familiar in WooCommerce, like the lightbox cart in [WooCommerce Fast Cart](https://barn2.com/woocommerce-cart/).",
    ],
    next: [
      "I designed the full popup set (empty, empty with suggestions, and items with suggestions in two item styles) for desktop, tablet and mobile. On small screens the carousel drops to one product.",
    ],
    result: [
      "It shipped after I left as a Cart Type setting: Slide-out or Popup. The WordPress.org listing is now “Modern Cart: WooCommerce Side Cart & Popup Cart.”",
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
  image: "/assets/cart-abandonment.png",
  imageClass: "project-image--cart",
  headline: "Redesigning Cart Abandonment Recovery so store owners can see what they win back",
  hook: "The plugin's whole job is to win back lost sales. Yet its own admin showed six numbers, no chart, and no way to export them.",
  summary:
    "Cart Abandonment Recovery tracks shoppers who leave their cart, sends timed follow-up emails and shows store owners what came back. I redesigned the whole admin on ForceUI and designed its new features: a visual dashboard, detailed reports, new recovery channels and an email capture popup.",
  stats: [
    { value: "300K+", label: "Active installs" },
    { value: "2 months", label: "May to June 2025" },
    { value: "Solo", label: "Only designer, with a PM and developers" },
    { value: "4", label: "Key decisions, all shipped" },
  ],
  meta: [
    ["Role", "Product Designer"],
    ["Platform", "WooCommerce plugin"],
    ["Design system", "ForceUI"],
    ["Scope", "Admin redesign, new features, Upgrade to Pro"],
  ],
  hero: {
    caption: "The new Dashboard, with the six stat cards and the revenue comparison chart.",
    src: "/assets/cart-abandonment.png",
  },
  sections: [
    {
      kind: "problem",
      id: "the-problem",
      nav: "The Problem",
      eyebrow: "The Problem",
      title: "A recovery plugin that couldn't show what it recovered",
      intro:
        "It worked, but looked like a plain WordPress settings page. If owners can't see what it recovers, they can't trust it, tune it or justify Pro.",
      pains: [
        { title: "One page, two jobs", body: "The Report tab was dashboard and report at once: six numbers, no chart." },
        { title: "Data you couldn't use", body: "No search, no filters beyond date, no export." },
        { title: "Emails without results", body: "No sent, open or click counts on any follow-up email." },
        { title: "One long settings page", body: "Long columns of checkboxes for roles and order statuses." },
        { title: "No room to grow", body: "SMS, WhatsApp, product reports and popups had nowhere to go." },
      ],
      media: { caption: "The old Report page: six number cards and a plain table." },
      mapping: [
        ["Dashboard and report on one page", "Recovery at a glance, details one click away"],
        ["Data hard to track or export", "Every report searchable, filterable and exportable"],
        ["No room for new features", "A structure that can grow"],
        ["UI outside the design system", "Every screen on ForceUI"],
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
      nav: "Walkthrough",
      eyebrow: "Walkthrough",
      title: "One store owner, one shopper",
      intro: "Recovery has two sides: the owner watching the results, and the shopper who leaves and comes back.",
      video: { kind: "video", caption: "Prototype walkthrough: Kavya checks her dashboard, edits an email, then opens one recovered cart." },
      lanes: [
        {
          name: "Kavya",
          role: "Store owner",
          about: "Runs Leaf & Loom, a small home decor store, on Pro.",
          steps: [
            {
              title: "Is it working?",
              body: "Six stat cards and a recoverable vs recovered revenue chart, set by one date picker.",
              media: { caption: "Dashboard, annotated." },
            },
            {
              title: "Which emails work?",
              body: "Each template shows sent, open and click rates; editing opens a drawer with timing, coupon and rules.",
              media: { caption: "Email list and the edit drawer." },
            },
            {
              title: "Catch emails early",
              body: "An Add to Cart popup, styled in Spectra, asks for an email that shoppers can skip.",
              media: { caption: "Popup template and the popup." },
            },
            {
              title: "Who came back?",
              body: "She filters and exports the Email Report, then opens a cart's emails, addresses, items.",
              media: { caption: "Email Report and Email Logs." },
            },
          ],
        },
        {
          name: "Rohan",
          role: "Shopper",
          about: "Browsing Leaf & Loom for a new lamp.",
          steps: [
            {
              title: "Adds a lamp",
              body: "He taps “No thanks” on the email popup and keeps shopping.",
              media: { caption: "The popup with “No thanks.”" },
            },
            { title: "Leaves at checkout", body: "He enters his email, gets distracted and closes the tab." },
            {
              title: "Comes back",
              body: "A reminder after 30 minutes, a discount the next day. He buys, and Kavya's recovered revenue rises.",
            },
          ],
        },
      ],
    },
    {
      kind: "solution",
      id: "solution",
      nav: "Solution",
      eyebrow: "Solution",
      title: "What changed, part by part",
      intro: "Every change traces back to one of the four problems.",
      items: [
        {
          title: "Navigation built to grow",
          detail: "I rebuilt the top navigation on ForceUI: Dashboard, Follow Up Emails, Reports, Integrations, Settings, and Popup Templates for Pro. Reports is a dropdown, so new reports never crowd the bar.",
          before: "Three plain tabs: Report, Follow-Up Emails, Settings.",
          after: "Five sections with room to grow.",
          media: { caption: "Old tabs vs the new top navigation." },
        },
        {
          title: "Recovery at a glance",
          detail: "The six stat cards gain a chart of recoverable against recovered revenue, one date range picker, and Recent Follow Up Report and Product Report tables with View All.",
          before: "Six numbers and nothing else.",
          after: "Numbers, trend and recent activity in one view.",
          media: { caption: "Old Report page vs the new Dashboard." },
        },
        {
          title: "A list that shows what works",
          detail: "Sent count, open rate and click rate now sit beside each template, so owners see at a glance which email brings shoppers back.",
          before: "Name, subject and timing only.",
          after: "Results beside every template.",
          media: { caption: "Email list with the rate columns." },
        },
        {
          title: "Editing in a drawer",
          detail: "Editing opens a drawer beside the list with subject, body and variables, timing, coupon, test email and WooCommerce email style. The rule engine lacked options, so it became a toggle revealing a simple builder: rule type, operator, value, add rule.",
          before: "A long WordPress form on its own page.",
          after: "Everything in a drawer, with the list still in view.",
          media: { caption: "The edit drawer with the rule engine open." },
        },
        {
          title: "Reports you can search and export",
          detail: "The Email Report gains search, a status filter, a date picker, Export, a country column, status chips and row actions (view, unsubscribe, delete). The new Product Report shows the most abandoned and recovered products.",
          before: "A cart table with bulk actions and little else.",
          after: "Find, filter and export anything.",
          media: { caption: "The Email Report table, annotated." },
        },
        {
          title: "Every detail of one cart",
          detail: "Opening a cart shows its Email Log on a full page: scheduled emails with coupon and status, billing and shipping side by side, and the order items with totals.",
          after: "The full story of one cart, on one page.",
          media: { caption: "The Email Logs page." },
        },
        {
          title: "Settings split by topic",
          detail: "A left sub-menu splits settings into General, Coupon, Email, Recovery Report, GDPR and Advanced, with a tracking toggle, chip multi-selects for roles and statuses, one card per setting and a save confirmation. Notify Recovery To Admin, Recovery Report emails and GDPR are new.",
          before: "One long page of checkbox columns.",
          after: "Six groups, one card per setting.",
          media: { caption: "Old Settings vs the new General settings." },
        },
        {
          title: "More ways to reach shoppers",
          detail: "The new Integrations area gives Webhook, SMS, WhatsApp and OttoKit each a page and an enable toggle, so owners can follow up wherever shoppers actually reply.",
          before: "Email was the only channel.",
          after: "Four new channels, each with its own page.",
          media: { caption: "The Integrations page." },
        },
        {
          title: "Popup Templates",
          detail: "A Pro feature capturing emails on add to cart or exit. The list shows each template's type, captures, views and “No thanks” clicks; editing opens in Spectra, Brainstorm Force's page builder, while rules and coupons stay in the plugin.",
          before: "No way to reach shoppers who leave before checkout.",
          after: "Emails captured before checkout, with results tracked.",
          media: { caption: "The popup template list and the popup." },
        },
        {
          title: "Upgrade to Pro",
          detail: "Pro features appear to free users in five places, Dashboard, Follow Up Emails, Product Report, Integrations and Settings, without blocking anything. All shipped, including the blurred Product Report on the Dashboard.",
          after: "Pro in view, never in the way.",
          media: { caption: "The blurred Product Report on the live Dashboard." },
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
      intro: "The same layout, controls and behavior as ModernCart and the rest of the CartFlows family.",
      patterns: [
        { title: "Top navigation", body: "The shared product bar, with version, help and news." },
        { title: "Left sub-menus", body: "One page per channel or settings group." },
        { title: "Side drawers", body: "Quick edits without losing your place." },
        { title: "Status chips", body: "Abandoned, Successful, Failed and Normal." },
        { title: "Setting cards", body: "One card per setting, one line of explanation." },
        { title: "Chip multi-selects", body: "Replacing long checkbox columns." },
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
      steps: [
        { label: "Research", body: "Studied YITH, VillaTheme and other recovery plugins on a Figma board." },
        { label: "Feature list", body: "Ideas went into a shared sheet; the team chose. That became my brief." },
        { label: "Full design", body: "I designed it all first." },
        { label: "Phase 1", body: "Dashboard, emails, Reports, Integrations and Settings." },
        { label: "Phase 2", body: "Popup Templates." },
      ],
      notes: [
        {
          title: "Where the plan changed",
          body: "I first designed popup editing inside the plugin. The team chose to open popups in Spectra, Brainstorm Force's page builder, which already does visual editing well. The plugin keeps the rules and coupons.",
        },
      ],
      media: { caption: "A slice of the References board." },
    },
    {
      kind: "future",
      id: "future-scope",
      nav: "Future Scope",
      eyebrow: "Future Scope",
      title: "Where it could go next",
      tag: "Next",
      items: [
        {
          title: "Guide the popup decision",
          body: "Turn “No thanks” clicks into advice, like how many skippers still bought.",
        },
        { title: "Compare recovery by channel", body: "Split recovered revenue by email, SMS and WhatsApp." },
        { title: "Test with store owners", body: "Start with the dashboard and the rule engine, where owners decide most." },
      ],
    },
    {
      kind: "learnings",
      id: "learnings",
      nav: "Learnings",
      eyebrow: "Learnings",
      title: "What this project taught me",
      items: [
        { title: "Let the content choose the pattern.", body: "A detailed read and a quick edit need different homes." },
        { title: "Reuse what the company does well.", body: "Spectra beat rebuilding a popup editor." },
        { title: "Respect the shopper's patience.", body: "Imagining the tenth popup made email optional." },
        { title: "A visible gap beats a clever interaction.", body: "The chart always shows what was at risk and what came back." },
      ],
    },
    {
      kind: "outcome",
      id: "outcome",
      nav: "Outcome",
      eyebrow: "Outcome",
      title: "From a settings page to a recovery dashboard",
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
    "Took an unreleased side cart plugin to launch in one week, then turned the cart from a dead end into a place shoppers keep browsing.",
  proof: "50K+ active installs. Ready to launch in one week.",
  tone: "peach",
  image: "/assets/modern-cart.png",
  imageClass: "project-image--modern",
  headline: "Redesigning ModernCart so its cart stopped being a dead end",
  hook: "ModernCart had been built by developers and left unreleased. Then the PM made the call: it goes live in one week.",
  summary:
    "ModernCart adds a side cart to WooCommerce stores, so shoppers can see and change their cart from any page. I got it launch-ready that week, then designed what came next: a dashboard organized around tasks, and a cart that suggests products instead of ending in a dead end.",
  stats: [
    { value: "50K+", label: "Active installs on [WordPress.org](https://wordpress.org/plugins/modern-cart/)" },
    { value: "1 week", label: "From unreleased build to launch" },
    { value: "Solo", label: "Only designer, with a PM and developers" },
    { value: "~15", label: "Feature tickets after launch" },
  ],
  meta: [
    ["Role", "Product Designer"],
    ["Timeline", "April to May 2025"],
    ["Design system", "ForceUI"],
    ["Scope", "Dashboard, shopper cart, new features"],
  ],
  hero: {
    caption: "The finished side cart open on DNK's storefront, next to the ModernCart dashboard.",
    src: "/assets/modern-cart.png",
  },
  sections: [
    {
      kind: "problem",
      id: "the-problem",
      nav: "The Problem",
      eyebrow: "The Problem",
      title: "Built, but not ready for the people using it",
      intro:
        "WooCommerce's default cart pulls shoppers to a new page right before they buy. Side carts fix that, and competitors already sold them. A better cart meant more checkouts and bigger orders.",
      pains: [
        { title: "Scattered settings", body: "Related options split across tabs; floating cart settings hidden in General." },
        { title: "Off the design system", body: "Spacing, type and colors didn't follow ForceUI." },
        { title: "An empty dead end", body: "An empty cart showed one line of text and nowhere to go." },
        { title: "Just a list", body: "A full cart gave shoppers no reason to keep browsing." },
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
      nav: "Walkthrough",
      eyebrow: "Walkthrough",
      title: "One store, one shopper",
      intro: "Every choice in the dashboard shows up in the cart shoppers use.",
      video: {
        kind: "video",
        caption: "",
        alt: "ModernCart walkthrough: Meera sets up her store's cart, then Arjun shops with it.",
        src: "/assets/videos/modern-cart-walkthrough.mp4",
        poster: "/assets/videos/modern-cart-walkthrough.jpg",
      },
      lanes: [],
    },
    {
      kind: "solution",
      id: "solution",
      nav: "Solution",
      eyebrow: "Solution",
      title: "What changed, part by part",
      intro: "Every change traces back to one of the three problems.",
      items: [
        {
          title: "Settings grouped by task",
          detail: "Five tabs, one job each: plan and license, behavior, wording, the floating icon and looks. In General, dropdowns sit above toggles, so it reads in one pass.",
          before: "Settings scattered across tabs.",
          after: "Five tabs, one job each.",
          media: mcShot("Five tabs in the sidebar, each with one job. Here, General.", "general-tab"),
        },
        {
          title: "Cart text that sounds like the store",
          detail: "Every word shoppers see, from the heading to the empty cart message, is editable and pre-filled, so owners only change what matters.",
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
          detail: "The icon shows on every page, so it got its own tab: position, hide when empty and preset icons. Custom upload, also my idea, came later.",
          before: "Buried inside General.",
          after: "Its own tab, with custom upload later.",
          media: mcShot("Position, hide when empty, and preset icons in their own tab.", "floating-icon-card"),
        },
        {
          title: "Styling that's safe to try",
          detail: "Styling now groups Colors, Icon Style, Width and Miscellaneous, with a reset on every color, defaults under numbers and units (px, %, ms) inside fields.",
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
          detail: "An empty cart now offers a featured product and Shop Now; a full one, a small “You might also like” carousel that never covers the items.",
          before: "Empty carts were dead ends; full carts were just lists.",
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
          detail: "My first version didn't feel like applying anything. Now “Apply Coupon Code” is a link that opens into a field, and the code becomes a tag you remove in one tap.",
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
          detail: "Shipping, tax, subtotal and savings now show before checkout, with one clear button.",
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
          detail: "For stores that want the cart front and center: a second cart type that opens mid-page, in every state for desktop, tablet and mobile.",
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
          { count: "2", name: "Cart types", body: "Slide-out keeps the page visible; popup takes full attention." },
          { count: "6", name: "Item layouts", body: "Where remove and quantity controls sit." },
          { count: "2", name: "Order summaries", body: "A simple list, or a card with the total in the button." },
          { count: "2", name: "Coupon styles", body: "One code, or several stacked as tags." },
          { count: "1–2", name: "Carousel sizes", body: "Fits narrow and wide carts." },
          { count: "2", name: "Cart footers", body: "View Cart and Checkout, or Checkout only." },
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
        "Every screen uses ForceUI, shared in Figma and React. One rule kept both in sync: no one changes a component alone; changes go through a ticket.",
      levels: [
        { title: "Atoms", body: "Toggles, buttons, badges" },
        { title: "Molecules", body: "Every settings row" },
        { title: "Patterns", body: "Top bar, sidebar, upgrade modal" },
        { title: "Templates", body: "The dashboard's Admin Settings layout" },
      ],
      tokens: [
        { sample: "type", label: "Type", value: "Figtree, four weights" },
        { sample: "color", label: "Accent", value: "Flamingo, CartFlows' orange" },
        { sample: "icons", label: "Icons", value: "Lucide plus a WordPress set" },
      ],
      note: {
        title: "The one rule I bent",
        body: "Number fields needed their unit (px, %, ms) inside. I designed a unit badge; it shipped as plain text, still inside the field.",
      },
    },
    {
      kind: "process",
      id: "process",
      nav: "Process",
      eyebrow: "Process",
      title: "One week to launch, then making it better",
      steps: [
        {
          label: "Week 1",
          title: "Getting it ready to publish",
          body: "The PM's call: publish within a week. No time to redesign, so the goal was to make what existed feel finished.",
          details: [
            "I rebuilt screens with ForceUI and reviewed the build with the PM, logging 20 to 30 issues in a shared Google Sheet, each with a screenshot and a note on spacing, alignment, type, color or responsiveness. Developers fixed them in parallel while I prepared assets.",
          ],
          points: ["Launched on schedule"],
        },
        {
          label: "After launch",
          title: "Learning from five competitors",
          body: "Once live, the question became “what next?” The company bought five competing cart plugins, and I used each on a demo site as a store owner would, comparing settings, features and customization.",
          details: [
            "That review shaped most of what followed: preset icons and custom upload, cart position, styles for the cart, header and order summary, and product suggestions.",
          ],
          points: [
            "[Side Cart WooCommerce](https://wordpress.org/plugins/side-cart-woocommerce/)",
            "[FunnelKit Cart](https://funnelkit.com/woocommerce-cart/)",
            "[Mini Cart for WooCommerce](https://wordpress.org/plugins/mini-cart-for-woocommerce/)",
            "[Side Cart & Checkout](https://woocommerce.com/products/side-cart-checkout/)",
            "[Flycart](https://wordpress.org/plugins/woo-fly-cart/)",
          ],
        },
        {
          label: "Tickets",
          title: "Turning ideas into tickets",
          body: "I shared findings and the PM set priorities. I wrote about 15 Jira tickets, one per feature with a description and designs, and organized Figma the same way, one section per ticket.",
        },
        {
          label: "Free and Pro",
          title: "Planning the Free and Pro split",
          body: "Next came Free and Pro. The PM decided what went where; I designed how Pro appears to free users (Decision 1).",
          media: mcShot("The Free vs Pro tab, comparing every feature.", "free-vs-pro"),
        },
      ],
      notes: [
        {
          title: "Why no wireframes",
          body: "ForceUI already had the pieces, so I worked in high fidelity. The competitor review made up for less early exploration.",
        },
        {
          title: "What I assumed",
          body: "Cart openers are still shopping. Owners want control without code. Visible defaults invite experimenting.",
        },
      ],
    },
    {
      kind: "future",
      id: "future-scope",
      nav: "Future Scope",
      eyebrow: "Future Scope",
      title: "Ideas that shipped after I left",
      tag: "Shipped later",
      items: [
        {
          title: "Live preview",
          body: "A cart preview beside the settings ([v1.0.8](https://wordpress.org/plugins/modern-cart/)).",
        },
        { title: "Custom icon upload", body: "Brands can match their own icon style, under the presets." },
        {
          title: "Cart header styling",
          body: "Control over the top of the cart ([v1.0.1](https://wordpress.org/plugins/modern-cart/)).",
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
        { title: "A deadline decides what “done” means.", body: "Clear, screenshot-backed feedback mattered as much as design." },
        { title: "Bring options, not verdicts.", body: "Trade-offs make ideas easy to discuss, whichever way it goes." },
        { title: "Know the system's rules well.", body: "That's how you know when bending one is worth it." },
        { title: "Competitors show what exists, not what people need.", body: "Next time, pair it with owner conversations." },
      ],
    },
    {
      kind: "outcome",
      id: "outcome",
      nav: "Outcome",
      eyebrow: "Outcome",
      title: "From an unreleased build to a cart that keeps shoppers going",
      before: "A working build nobody had designed for",
      after: "A task-based dashboard, a cart that suggests, and a second cart type",
      stat: { value: "50K+", label: "Active installs today" },
      feedback: feedback("How would you have handled the Free and Pro question?"),
    },
  ],
};

// Read time: every word a reader sees in the case study, at an average adult reading speed.
// Keys whose text never shows on the case study page (home card, image descriptions, internal ids).
const READ_SKIP = new Set([
  "slug", "tone", "image", "imageClass", "src", "poster", "kind", "id", "sample", "size", "nav", "alt",
  "cardTitle", "cardSummary", "proof", "caption",
]);
const WORDS_PER_MINUTE = 238;

function readTime(study: CaseStudy) {
  const parts: string[] = [];
  const collect = (value: unknown, key: string) => {
    if (typeof value === "string") {
      if (!READ_SKIP.has(key)) parts.push(value.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, ""));
    } else if (Array.isArray(value)) {
      value.forEach((item) => collect(item, key));
    } else if (value && typeof value === "object") {
      Object.entries(value).forEach(([childKey, child]) => collect(child, childKey));
    }
  };
  collect(study, "");
  const words = parts.join(" ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`;
}


// Built from the "Social Feed Case Study" doc. The brand and people in the walkthrough are made up.
const superfansDecisions: DecisionItem[] = [
  {
    title: "Why the dashboard shows posts as a grid, not a table",
    hook: "A feed of short videos is about what you see. Our first two layouts made merchants read.",
    before: [
      "The app builder's block and properties panels were the obvious place to start.",
    ],
    turningIntro: "Two directions before a third:",
    options: [
      {
        title: "Reuse the builder layout",
        body: "Familiar, but made for arranging blocks, not browsing videos.",
      },
      {
        title: "A table of posts",
        body: "Clear, but video looked flat in rows.",
      },
      {
        title: "A visual layout, like short video apps",
        body: "A thumbnail grid, and a single post view with a phone preview and comments. Less like the rest of the dashboard, but true to the content.",
        chosen: true,
      },
    ],
    reasoning: [
      "Consistency is a good default, but here the content had to decide the layout.",
    ],
    next: [
      "I designed both views, logged as “Removed tabular layout to make it more visual. Added grid view and single view.”",
    ],
    result: [
      "They became the base for comments, Instagram import and everything after.",
    ],
    media: [{ caption: "The early table version." }, { caption: "The grid view." }],
  },
  {
    title: "Why we improved the post view instead of redesigning it",
    hook: "We found a better design. We still didn't ship it, and that was the right call.",
    before: [
      "Posts opened on their comments; editing meant finding a menu inside the comments panel.",
    ],
    turningIntro: "Three options:",
    options: [
      {
        title: "A YouTube Shorts style view",
        body: "Just the video, an edit menu and a comment icon. The team liked it, but it meant rebuilding a finished view about to go live.",
      },
      {
        title: "Tabs for Edit Post and Comments",
        body: "Easy switching, but another layer on a simple screen.",
      },
      {
        title: "Improve the existing view",
        body: "Keep the layout, bring editing within reach. Less ambitious, but on time.",
        chosen: true,
      },
    ],
    reasoning: [
      "Release was close, and a redesign would delay it for a gain we could add later.",
    ],
    next: [
      "I added a header with title, posted time, likes, comments and a menu (Edit, Copy Post ID, Hide, Delete), and explored adding CTR and unique views.",
    ],
    result: ["The header shipped; the metrics version may come later."],
    media: [{ caption: "The Tab exploration." }, { caption: "The YouTube Shorts exploration." }, { caption: "The shipped header." }],
  },
  {
    title: "Why moderation uses a dropdown, not tick and cross buttons",
    hook: "I argued for the faster design. After several rounds, the team chose another, and I designed it.",
    before: [
      "Reported content was meant to stay visible until review, like on Instagram and TikTok. Then it changed to hide automatically for later review, so merchants needed a quick way to restore or keep each item hidden.",
    ],
    turningIntro: "Two options:",
    options: [
      {
        title: "Tick and cross buttons",
        body: "A tick restores and marks reviewed; a cross hides. Fast for long lists, but icons alone can be misread.",
        badge: "My proposal",
      },
      {
        title: "A dropdown",
        body: "Each choice written out in words. One more click per item, but nothing to guess.",
        chosen: true,
        badge: "Team's choice",
      },
    ],
    reasoning: [
      "The PM's point: the buttons didn't say what they do, and status wasn't shown. A hover status dropdown solved both.",
    ],
    next: ["I matched the moderation designs to the PM's prototype:"],
    nextList: [
      "A status dropdown on hover instead of buttons",
      "Two sections instead of three",
      "Report reasons as plain labels, not colored tags that pulled focus and needed a legend",
      "A review popup button that opens the post in the feed, with its comments",
    ],
    result: [
      "Signed off the next day and shipped. A tick could mean “reviewed” or “visible”; a label removes the guess.",
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
  hook: "Shoppers spend hours scrolling videos on Instagram and TikTok. Superfans wanted that feed in every brand's own app, with every video shoppable.",
  summary:
    "Superfans is a mobile app platform for Shopify and Shopify Plus brands. Social Feed adds a short video feed to brand apps: shoppers watch, comment, buy tagged products and post, while merchants publish, import Instagram videos and moderate. I designed both sides, from first wireframes to design QA.",
  stats: [
    { value: "10 months", label: "January to October 2026" },
    { value: "2 sides", label: "Shopper app and merchant dashboard" },
    { value: "3", label: "Key decisions, all shipped" },
    { value: "Shipped", label: "On iOS, Android and the dashboard" },
  ],
  meta: [
    ["Role", "Product Designer, from the start"],
    ["Team", "A PM and developers"],
    ["Platform", "iOS, Android and the dashboard"],
    ["Scope", "App, dashboard and design QA"],
  ],
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
        "Brands on Superfans have their own apps, but their videos, live sales and engagement live on Instagram and TikTok, with no place for that content in their app.",
      goalsIntro: "Social Feed was part of a wider Community push, with three goals:",
      goals: [
        { title: "Bring shoppers back every day", body: "With fresh brand content." },
        { title: "Collect first hand data", body: "Through quizzes and preference pickers in the feed." },
        { title: "Connect content to sales", body: "So every video leads to a product or a collection." },
      ],
      pains: [
        {
          title: "For shoppers",
          body: "Brand apps were built for buying: nothing to watch, comment on or share.",
        },
        {
          title: "For merchants",
          body: "Video for another channel takes time, and shopper posts need review and control.",
        },
        {
          title: "For the product",
          body: "Everything had to fit apps and a dashboard brands used daily.",
        },
      ],
      note: {
        title: "What competitors offered",
        body: "Tapcart, a competitor, offers shoppable video mostly via integrations like Tolstoy's “For You” feed and Yotpo's Instagram gallery: brand-curated, with no shopper posts or comments. Ours is native and social.",
      },
      mapping: [
        ["No video in brand apps", "A shoppable feed in the app"],
        ["No time for new content", "Reuse Instagram videos"],
        ["Shopper posts need control", "Moderation and access tools"],
        ["Social is new to brand apps", "A clear introduction"],
      ],
      constraints: [
        "Fit existing apps and the dashboard",
        "Work on iOS and Android",
        "Merchants control shopper posts",
        "Ship parts while others were in design",
      ],
    },
    {
      kind: "journey",
      id: "walkthrough",
      nav: "Walkthrough",
      eyebrow: "Walkthrough",
      title: "One brand, one shopper",
      intro:
        "Riya runs the app for Thread & Care, a scrubs brand; Karan, a nurse, shops with them. Both are made up.",
      video: {
        kind: "video",
        caption: "Prototype walkthrough: a merchant imports an Instagram video, then a shopper watches it, comments and buys the tagged product.",
      },
      lanes: [
        {
          name: "Riya",
          role: "Merchant",
          about: "Fills the feed and keeps it safe.",
          steps: [
            {
              title: "Brings in Instagram videos",
              body: "Links the brand's account and imports two recent videos from Your Posts.",
              media: { caption: "Link Account and the Instagram import modal." },
            },
            {
              title: "Publishes her own post",
              body: "Adds a video, tags the sweatshirt and sets it visible, with a live phone preview.",
              media: { caption: "New Post panel with the phone preview." },
            },
            {
              title: "Sees every post",
              body: "Each post opens from the grid beside its comments, with edit, hide and delete.",
              media: { caption: "Grid view and the single post view." },
            },
            {
              title: "Keeps the feed safe",
              body: "A reported comment hides automatically; she reviews it and sets feed access.",
              media: { caption: "Reported tab, review modal and Feed Access Controls." },
            },
          ],
        },
        {
          name: "Karan",
          role: "Shopper",
          about: "Shops in the Thread & Care app.",
          steps: [
            {
              title: "Finds the feed",
              body: "A Feed tab in the bottom bar, with a hint to swipe up.",
              media: { caption: "Feed tab with the swipe up hint." },
            },
            {
              title: "Watches and shops",
              body: "He taps the tag on a sweatshirt he's been eyeing and adds it to his cart.",
              media: { caption: "Feed video with the product tag." },
            },
            {
              title: "Joins the conversation",
              body: "He asks about sizing; a notification later returns him to his highlighted reply.",
              media: { caption: "Comments sheet and the highlighted comment." },
            },
            {
              title: "Posts his own video",
              body: "A week later he posts from the product page, sweatshirt already tagged.",
              media: { caption: "Posting from the product page." },
            },
          ],
        },
      ],
    },
    {
      kind: "solution",
      id: "solution",
      nav: "Solution",
      eyebrow: "Solution",
      title: "What I designed, and the problem each part solves",
      intro:
        "Each part traces back to one of the goals above.",
      items: [
        {
          title: "A feed one tap away",
          detail:
            "A Feed tab beside Home, Cart, Wishlist and Account opens a full screen vertical feed, swiped like the apps shoppers already use.",
          after: "Video, one tap away.",
          media: { caption: "Bottom bar with the Feed tab, and the feed screen." },
        },
        {
          title: "Videos you can shop",
          detail:
            "A product tag on each post takes shoppers to the product page in one tap, with likes, comments, an expandable caption, and play and pause on the video.",
          after: "Watching leads straight to buying.",
          media: { caption: "A feed video, annotated." },
        },
        {
          title: "Comments that feel complete",
          detail:
            "Comments are where a community forms, so I designed the full set: replies, edit, delete with confirmation, report with a reason, an empty state and avatar variations, plus a highlight and back button when opened from a notification.",
          after: "Complete, down to notifications.",
          media: { caption: "Comments sheet, report flow and highlighted comment." },
        },
        {
          title: "Posting your own content",
          detail:
            "Shoppers pick media (with messages for unsupported or oversized files), caption it, tag products, preview and post, with every state after covered, from under review and rejected to edited, deleted and failed upload. First timers get a slightly different flow.",
          after: "Every step and state, covered.",
          media: { caption: "The posting flow from file picker to posted." },
        },
        {
          title: "Posting from a product page",
          detail:
            "A feed icon on the product page opens posting with that product tagged, right when shoppers are looking at it.",
          after: "Share right where you shop.",
          media: { caption: "Product page with the feed icon, then the posting screen." },
        },
        {
          title: "Introducing the feed",
          detail:
            "Shoppers discover the feed through a swipe up hint, an “Introducing Social Feed” sheet, a feed section on the product page, onboarding prompts, and a banner covering explore, engage, shop and share.",
          after: "Light entry points where shoppers already are.",
          media: { caption: "Onboarding sheet and the feature banner." },
        },
        {
          title: "Interactive blocks in the feed",
          detail:
            "Blocks fill a feed slot to collect first hand data: a single choice poll (“What matters most in your scrubs?”) showing how others voted, and a this or that with two product images, custom per brand.",
          after: "Data collected inside the feed.",
          media: { caption: "The poll and the this or that block in the feed." },
        },
        {
          title: "Posts as a visual grid",
          detail:
            "Video is visual, so posts show as a thumbnail grid, with a single post view beside the comments. More in Decision 1.",
          before: "The app builder's block layout, then a table.",
          after: "A grid and a single post view.",
          media: { caption: "Grid view and single post view." },
        },
        {
          title: "Creating and editing posts",
          detail:
            "The New Post panel covers media, description, redirection, likes and comments toggles, and hidden, visible or conditional visibility, with a live phone preview and upload error states.",
          after: "Everything about a post in one panel.",
          media: { caption: "New Post panel with the preview." },
        },
        {
          title: "Reusing Instagram content",
          detail:
            "Merchants link Instagram and import several posts at once from All, Your Posts or Tagged Posts, so nothing is made twice.",
          after: "The feed filled in a few clicks.",
          media: { caption: "Link Account, then the import modal." },
        },
        {
          title: "Managing comments",
          detail:
            "Merchants reply to shoppers, edit or delete their own comments, and see each comment's report count and reasons.",
          after: "Merchants join the conversation.",
          media: { caption: "Comments in the single post view, and report details." },
        },
        {
          title: "Moderation",
          detail:
            "Reported content hides until reviewed. Feed Moderation has a Reported tab with bulk select, a Reviewed tab, and a step to restore it or keep it hidden. More in Decision 3.",
          after: "Hidden until a merchant decides.",
          media: { caption: "Reported tab and the review modal." },
        },
        {
          title: "Who can see the feed",
          detail:
            "Feed Access Controls uses customer segments: Everyone, Everyone except specific customers, or Only specific customers. Restricted shoppers can't post, comment, or both.",
          after: "Brands choose who joins in.",
          media: { caption: "Access control options and the restricted views in the app." },
        },
        {
          title: "Design QA",
          detail:
            "I led design QA across the app, dashboard, posting, moderation and feed settings, logging each issue with a screenshot and the matching design until fixed. Most were visual: spacing, alignment and mismatched states.",
          after: "Every area checked before it was called done.",
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
      steps: [
        { label: "Shopper feed", body: "January to June: three app versions; June's went to development." },
        { label: "Dashboard", body: "February to September: first layouts to grid, comments, Instagram import and post properties." },
        { label: "Shoppers posting", body: "June and July: posting, posting from the product page, and onboarding." },
        { label: "Moderation and access", body: "July to September: reports, reviews, feed settings and access." },
        { label: "Design QA", body: "October: the built product, area by area." },
      ],
      notes: [
        {
          title: "Where the idea came from",
          body: "Instagram Reels and TikTok. The spec split it in two releases, a brand-run feed with imports, likes, comments and reporting, then shopper posting with moderation, with rules like 9:16 media, 3–60s videos and 500 character comments.",
        },
        {
          title: "Versions and reviews",
          body: "The design team, PM and CEO reviewed every change in a version log. Dashboard, posting, moderation and access took the most rounds; access went from three repetitive radio options to a dropdown.",
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
          body: "CTR, unique views, likes and comments in the post header, showing what sells.",
        },
        {
          title: "More ways to take part",
          body: "Polls, order ratings and open questions as custom blocks.",
        },
        {
          title: "A cleaner post view",
          body: "Revisit the YouTube Shorts style view now the feature is live.",
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
        { title: "Let the content decide the layout.", body: "Short videos needed a grid, not a builder or a table." },
        { title: "Shipping on time is part of the design.", body: "We improved the post view and saved the better idea." },
        { title: "Every social feature needs a safety feature.", body: "Shopper posting worked with merchant control." },
        { title: "Disagree, then commit.", body: "The dropdown cost a click but removed the guess." },
        { title: "Design isn't done at handoff.", body: "QA caught the details that make it feel finished." },
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
      feedback: feedback("If you've designed community features, how would you moderate brand communities?"),
    },
  ],
};

export const caseStudies: CaseStudy[] = [superfansSocialFeed, cartAbandonment, modernCart];

caseStudies.forEach((study) => study.meta.push(["Read time", readTime(study)]));
