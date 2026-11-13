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
  area: string;
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
    media: [{ caption: "The four navigation versions side by side." }, { caption: "The live top bar." }],
  },
  {
    title: "Why Email Logs became a full page, not a side drawer",
    hook: "A store owner clicks on one abandoned cart. How much do they need to see, and where should it open?",
    before: [
      "In the new design, editing a follow-up email opened in a side drawer beside the list. Email Logs, the detailed view of one cart, needed a home too.",
    ],
    turningIntro: "There were two options:",
    options: [
      {
        title: "A side drawer",
        body: "Consistent with the email editor, and the list stays in view. But Email Logs holds a lot: scheduled emails, billing and shipping addresses, and the full order. In a drawer, the addresses can't sit side by side and the order table gets cramped.",
        badge: "My first proposal",
      },
      {
        title: "A full page",
        body: "Room for every detail, with addresses side by side and a full order table. The trade-off is leaving the list and a different pattern from the email editor.",
        chosen: true,
      },
    ],
    reasoning: [
      "I first proposed the drawer, for consistency. The PM and developers pushed for the full page, because this is a detailed report, not a quick edit. Looking at how much one cart holds, I agreed. The old plugin also showed these details on a full page, so existing users would recognise it.",
    ],
    next: [
      "I redesigned Email Logs as a full page: email details first, then billing and shipping side by side, then the order items with totals.",
    ],
    result: [
      "The full page shipped. It reinforced something I now ask early: is this a quick edit or a detailed read? The answer decides the pattern, not consistency alone.",
    ],
    media: [{ caption: "The drawer version." }, { caption: "The full page version." }],
  },
  {
    title: "Why the dashboard chart always compares two numbers",
    hook: "A chart that changes when you click a card sounds clever. But would store owners ever know to click?",
    before: [
      "The old Report page had six number cards and no chart at all. Store owners could see totals, but not whether recovery was improving.",
    ],
    turningIntro: "There were two options:",
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
    result: ["It shipped. The live dashboard shows the six cards above the comparison chart."],
    media: [{ caption: "Dashboard V1." }, { caption: "Dashboard V2." }, { caption: "The live dashboard." }],
  },
  {
    title: "Why shoppers can skip the email popup",
    hook: "The store needs a shopper's email to recover their cart. But asking for it every time they tap Add to Cart can feel like a login wall.",
    before: [
      "The popup asks for an email when a shopper adds to cart, so the store can follow up if they leave. A shopper who isn't logged in might see it again and again.",
    ],
    turningIntro: "There were two options:",
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
      "I designed it as a choice for the store owner, with an “Email field mandatory?” toggle. Skipping is safe because shoppers still give their email at checkout. By then they've chosen what to buy, so being asked feels necessary rather than annoying.",
    ],
    next: [
      "When the toggle is off, the popup shows a “No thanks” link with editable text. The template list counts “No thanks” clicks, so store owners can see how many shoppers skip and decide for themselves.",
    ],
    result: [
      "It shipped as part of Popup Templates in Pro. Store owners get to balance capturing emails against keeping shoppers happy, with the data to back their choice.",
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

const mcShot = (caption: string, name: McShot): MediaItem => ({ caption, ...mc(name) });
const mcRow = (caption: string, ...row: MediaFrame[]): MediaItem => ({ caption, row });

const modernCartDecisions: DecisionItem[] = [
  {
    title: "Why I wanted free users to see Pro features, not lose them",
    hook: "When ModernCart split into Free and Pro, some features that free users already relied on were moving behind a paywall. The question was what those users would see the next time they opened their settings.",
    before: [
      "The PM shared the list of which features stayed Free and which moved to Pro. Nothing was decided yet about how Pro features would appear inside the free dashboard.",
    ],
    turningIntro: "There were two options:",
    options: [
      {
        title: "Hide Pro features completely",
        body: "The free dashboard stays clean and simple. But a store owner who used a feature last week would open their settings and find it gone, with no explanation.",
        chosen: true,
        badge: "Team's choice",
      },
      {
        title: "Show them locked, with a PRO badge and a short upgrade note",
        body: "The store owner can see what moved and what Pro adds, without being blocked or pushed. The trade-off is a slightly busier screen.",
        badge: "My proposal",
      },
    ],
    reasoning: [
      "I proposed showing them, as an option for the PM and leadership to weigh. A feature that quietly disappears feels like something was taken away. A feature that's visible but locked tells people exactly what upgrading gets them. ForceUI already used PRO badges on cards, so the pattern fit the system.",
    ],
    next: [
      "I designed PRO badges, disabled fields with an inline “Upgrade now” note, an upgrade modal, and a Free vs Pro tab comparing every feature side by side.",
    ],
    result: [
      "The team chose to keep the free version focused on free features, so Pro features stay out of view for free users. Both directions were on the table when that call was made, which is what I set out to do.",
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
    hook: "A shopper taps the cart icon before adding anything, maybe out of curiosity, maybe to check something. In ModernCart, all they found was a message saying their cart was empty.",
    before: [
      "The empty cart showed only that message, with no next step. Once items were added, the cart was just a list of what the shopper had picked.",
    ],
    turningIntro: "There were two options:",
    options: [
      {
        title: "Keep the cart as a plain list",
        body: "Simple, nothing to distract from checkout. But an empty cart is a dead end, and a full cart misses the moment when the shopper is most ready to buy.",
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
      "**Empty cart:** “Your Cart Is Empty, Let's Fix That,” with a featured product the shopper can add straight from the cart, plus a Shop Now button.",
      "**Cart with items:** a “You might also like” carousel below the items, kept small so it never covers the cart. I designed it to show one or two products at a time, as styling options store owners can pick from.",
    ],
    result: [
      "The PM and the team agreed straight away, and both shipped while I was on the team. I carried the idea through the rest of the product: the popup cart uses the same suggestions, and store owners can rewrite the suggestion titles from the Text Label tab to match their store's voice.",
      "The cart is no longer a dead end. Whether it's empty or full, it always gives the shopper something to explore.",
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
    hook: "ModernCart had one way to open the cart: a panel sliding in from the side. But not every store wants its cart tucked at the edge of the screen.",
    before: ["Slide-out was the only cart type."],
    turningIntro: "While exploring new cart styles, I looked at two directions:",
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
      "Neither one is right for every store, so I proposed offering both and letting the store owner choose. Centered popup carts were already a familiar pattern in WooCommerce (for example, [WooCommerce Fast Cart](https://barn2.com/woocommerce-cart/) offers a lightbox cart in the middle of the screen), so store owners would recognize it.",
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
  image: "/assets/cart-abandonment.png",
  imageClass: "project-image--cart",
  headline: "Redesigning Cart Abandonment Recovery so store owners can see what they win back",
  hook: "The plugin's whole job is to bring back lost sales. Yet its own admin showed six numbers, no chart, and no way to export them.",
  summary:
    "Cart Abandonment Recovery tracks shoppers who leave their cart, sends timed follow-up emails, and shows store owners what came back. I redesigned the whole admin on ForceUI and designed its new features: a visual dashboard, detailed reports, new recovery channels and an email capture popup.",
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
        "It worked, but the admin looked like a plain WordPress settings page. If store owners can't see the revenue it brings back, they can't trust it, tune it, or justify upgrading to Pro.",
      pains: [
        { title: "One page, two jobs", body: "The Report tab was dashboard and report at once: six numbers, no chart." },
        { title: "Data you couldn't use", body: "No search, no filters beyond date, no export." },
        { title: "Emails without results", body: "No sent, open or click counts on any follow-up email." },
        { title: "One long settings page", body: "Long columns of checkboxes for roles and order statuses." },
        { title: "No room to grow", body: "SMS, WhatsApp, product reports and popups had nowhere to go." },
      ],
      media: { caption: "The old Report page: six number cards and a plain table." },
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
      nav: "Walkthrough",
      eyebrow: "Walkthrough",
      title: "One store owner, one shopper",
      intro: "Recovery has two sides: the owner who watches the results, and the shopper who leaves and comes back.",
      video: { kind: "video", caption: "Prototype walkthrough: Kavya checks her dashboard, edits an email, then opens one recovered cart." },
      lanes: [
        {
          name: "Kavya",
          role: "Store owner",
          about: "Runs Leaf & Loom, a small home decor store, on Cart Abandonment Recovery Pro.",
          steps: [
            {
              title: "Is it working?",
              body: "Six stat cards and a chart comparing recoverable and recovered revenue. One date picker updates it all.",
              media: { caption: "Dashboard, annotated." },
            },
            {
              title: "Which emails work?",
              body: "Each template shows sent, open and click rates. Editing opens a drawer with timing, coupon and rules.",
              media: { caption: "Email list and the edit drawer." },
            },
            {
              title: "Catch emails early",
              body: "An Add to Cart popup asks for an email, styled in Spectra, with an optional field so shoppers can skip.",
              media: { caption: "Popup template and the popup." },
            },
            {
              title: "Who came back?",
              body: "Search, filter and export the Email Report, then open one cart to see its emails, addresses and items.",
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
              body: "The popup asks for his email. He taps “No thanks” and keeps shopping.",
              media: { caption: "The popup with “No thanks.”" },
            },
            { title: "Leaves at checkout", body: "He enters his email, gets distracted, and closes the tab." },
            {
              title: "Comes back",
              body: "A follow-up 30 minutes later, a discount the next day. He buys the lamp, and Kavya's recovered revenue goes up.",
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
          area: "Structure",
          title: "Navigation built to grow",
          detail: "The old plugin had three plain tabs: Report, Follow-Up Emails and Settings. I rebuilt the top navigation on ForceUI as Dashboard, Follow Up Emails, Reports, Integrations and Settings, with Popup Templates added for Pro. Reports became a dropdown so new report types don't crowd the top bar.",
          highlights: ["ForceUI product bar", "Reports dropdown", "Room for new features"],
          before: "Three plain tabs: Report, Follow-Up Emails, Settings.",
          after: "Five sections plus Popup Templates for Pro. Reports is a dropdown.",
          media: { caption: "Old tabs vs the new top navigation." },
        },
        {
          area: "Dashboard",
          title: "Recovery at a glance",
          detail: "The old Report page showed six numbers and nothing else. The new Dashboard keeps the six stat cards, adds a chart comparing recoverable and recovered revenue over time, a date range picker, a Recent Follow Up Report table and a Product Report table, each with View All.",
          highlights: ["Six stat cards", "Revenue comparison chart", "One date picker for everything", "Recent follow-ups", "Product Report"],
          before: "Six numbers and nothing else.",
          after: "Stat cards, a revenue comparison chart, a date picker and recent report tables.",
          media: { caption: "Old Report page vs the new Dashboard." },
        },
        {
          area: "Emails",
          title: "A list that shows what works",
          detail: "Store owners couldn't tell which emails were bringing shoppers back. The template list now shows sent count, open rate and click rate beside each template, so it's clear at a glance which email does most of the work.",
          highlights: ["Sent count", "Open rate", "Click rate"],
          before: "Name, subject and timing only.",
          after: "Sent count, open rate and click rate beside each template.",
          media: { caption: "Email list with the rate columns." },
        },
        {
          area: "Emails",
          title: "Editing in a drawer",
          detail: "The old editor was a long WordPress form on its own page. Editing now opens a drawer beside the list, with the subject, body and variables, send timing, coupon, test email and WooCommerce email style grouped together. The rule engine already existed but was missing options, so I redesigned it as a toggle that reveals a simple condition builder: rule type, operator, value, add rule.",
          highlights: ["Subject, body and variables", "Send timing", "Auto coupon", "Test email", "Rule engine"],
          before: "A long WordPress form on its own page.",
          after: "A drawer beside the list: content, timing, coupon, test email and a fuller rule engine.",
          media: { caption: "The edit drawer with the rule engine open." },
        },
        {
          area: "Reports",
          title: "Reports you can search and export",
          detail: "The old cart table had bulk actions and little else. The Email Report now has search, a status filter, a date picker, Export, a country column, colored status chips and row actions to view, unsubscribe or delete. Product Report is new, showing which products are abandoned and recovered most.",
          highlights: ["Search", "Status filter", "Export", "Status chips", "Row actions", "New Product Report"],
          before: "A cart table with bulk actions and little else.",
          after: "Search, status filter, export, status chips and row actions. Product Report is new.",
          media: { caption: "The Email Report table, annotated." },
        },
        {
          area: "Reports",
          title: "Every detail of one cart",
          detail: "Opening a cart shows its Email Log on a full page: the scheduled emails with their coupon and status, billing and shipping addresses side by side, and the order items with totals. It's the detailed read a store owner needs before deciding what to do next.",
          highlights: ["Scheduled emails", "Coupon and status", "Billing and shipping", "Order items and totals"],
          after: "A full-page Email Log: scheduled emails, billing and shipping side by side, and the order.",
          media: { caption: "The Email Logs page." },
        },
        {
          area: "Settings",
          title: "Settings split by topic",
          detail: "The old settings sat on one long page, with long columns of role and order status checkboxes. Settings now has a left sub-menu: General, Coupon, Email, Recovery Report, GDPR and Advanced. Tracking is a toggle, roles and statuses are multi-select fields with chips, each setting sits in its own card, and saving shows a confirmation. Notify Recovery To Admin, Recovery Report emails and GDPR are new.",
          highlights: ["Six setting groups", "Chip multi-selects", "One card per setting", "Save confirmation", "New GDPR settings"],
          before: "One long page of checkbox columns.",
          after: "A left sub-menu, toggles, chip multi-selects, and one card per setting. GDPR is new.",
          media: { caption: "Old Settings vs the new General settings." },
        },
        {
          area: "Integrations",
          title: "More ways to reach shoppers",
          detail: "Integrations is new. Webhook, SMS, WhatsApp and OttoKit each get their own page in a left sub-menu with an enable toggle, so store owners can follow up wherever their shoppers actually reply.",
          highlights: ["Webhook", "SMS", "WhatsApp", "OttoKit"],
          before: "Email was the only channel.",
          after: "Webhook, SMS, WhatsApp and OttoKit, each with its own page and toggle.",
          media: { caption: "The Integrations page." },
        },
        {
          area: "Pro",
          title: "Popup Templates",
          detail: "A Pro feature that captures a shopper's email when they add to cart or try to leave. The list shows each template's type, emails captured, views and “No thanks” clicks. Editing opens the popup in Spectra, Brainstorm Force's page builder, while rules and coupons stay in the plugin.",
          highlights: ["Add to cart popups", "Exit popups", "Captures and views", "“No thanks” clicks", "Designed in Spectra"],
          before: "No way to reach shoppers who leave before checkout.",
          after: "Email capture on add to cart or exit, with captures, views and “No thanks” clicks tracked.",
          media: { caption: "The popup template list and the popup." },
        },
        {
          area: "Pro",
          title: "Upgrade to Pro",
          detail: "I designed how Pro features appear to free users across the Dashboard, Follow Up Emails, Product Report, Integrations and Settings, so free users can see what upgrading adds without being blocked. All of them shipped, including the blurred Product Report on the Dashboard.",
          highlights: ["Dashboard", "Follow Up Emails", "Product Report", "Integrations", "Settings"],
          after: "Pro features shown to free users in five places, including a blurred Product Report. All shipped.",
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
        { label: "Full design", body: "I designed the whole admin first." },
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
        { title: "Respect the shopper's patience.", body: "The optional email came from imagining the tenth popup." },
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
        "WooCommerce's default cart sends shoppers to a separate page right when they're about to buy. Side carts fix that, and competitors already sold them. A better cart meant more checkouts and bigger orders.",
      pains: [
        { title: "Scattered settings", body: "Related options split across tabs; floating cart settings hidden in General." },
        { title: "Off the design system", body: "Spacing, type and colors didn't follow ForceUI." },
        { title: "An empty dead end", body: "An empty cart showed one line of text and nowhere to go." },
        { title: "Just a list", body: "A full cart gave shoppers no reason to keep browsing." },
      ],
      mapping: [
        ["Settings felt scattered, with no clear structure", "Settings organized around what owners need"],
        ["An empty cart offered no next step", "An empty cart that helps shoppers find something"],
        ["The UI did not follow the design system", "Every screen in line with ForceUI"],
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
        caption: "A narrated walkthrough: Meera sets up her store's cart, then Arjun shops with it.",
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
          area: "Dashboard",
          title: "Settings grouped by task",
          detail: "Store owners had to hunt for settings across tabs. I split the dashboard into five tabs, each with one job: My Account for the plan and license, General for how the cart behaves, Text Label for what it says, Floating Cart Icon for the icon shoppers see on every page, and Styling for how it looks. In General, dropdowns come first and toggles below, so the page reads in one pass.",
          highlights: ["My Account", "General", "Text Label", "Floating Cart Icon", "Styling"],
          before: "Settings scattered across tabs.",
          after: "Five tabs, one job each: My Account, General, Text Label, Floating Cart Icon, Styling.",
          media: mcShot("Five tabs in the sidebar, each with one job. Here, General.", "general-tab"),
        },
        {
          area: "Dashboard",
          title: "Cart text that sounds like the store",
          detail: "The cart's wording was fixed, so it couldn't sound like the store it lived in. In Text Label, every word a shopper sees is editable, from the cart heading to the empty cart message. Each field starts filled with sensible default text, so store owners only change what they care about.",
          highlights: ["Cart heading", "Empty cart message", "Free shipping line", "Suggestion titles"],
          before: "Fixed wording in every store.",
          after: "Every shopper-facing word editable, with defaults filled in.",
          media: mcRow(
            "The Empty Cart fields in Text Label, and the empty cart they write.",
            mc("text-label-empty-fields", "Text Label"),
            mc("cart-empty-panel", "In the cart"),
          ),
        },
        {
          area: "Dashboard",
          title: "The floating cart in its own tab",
          detail: "The floating cart icon is what shoppers see on every page, but its settings were buried inside General. It now has its own tab with position, hide when empty, and a set of preset icons. Custom icon upload was my idea too, and the team built it later.",
          highlights: ["Position", "Hide when empty", "Preset icons", "Custom upload"],
          before: "Buried inside General.",
          after: "Position, hide when empty, preset icons. Custom upload, my idea, came later.",
          media: mcShot("Position, hide when empty, and preset icons in their own tab.", "floating-icon-card"),
        },
        {
          area: "Dashboard",
          title: "Styling that's safe to try",
          detail: "Store owners hesitate to change colors and sizes when they're not sure they can undo it. Styling is grouped into Colors, Icon Style, Width and Miscellaneous. Every color has a reset button, number fields show their default underneath, and units like px, % and ms sit inside the field.",
          highlights: ["Reset on every color", "Visible defaults", "Units inside fields"],
          before: "Owners hesitated to change what they couldn't undo.",
          after: "Grouped controls, reset buttons, visible defaults, units in fields.",
          media: mcRow(
            "Reset buttons on colors, and defaults and units on number fields.",
            mc("styling-colors", "Reset on every color"),
            mc("styling-width", "Defaults and units"),
          ),
        },
        {
          area: "Cart",
          title: "Product suggestions",
          detail: "An empty cart was a dead end, and a full cart gave shoppers no reason to keep browsing. The empty cart now shows a featured product and a Shop Now button, and a full cart shows a “You might also like” carousel below the items, kept small so it never covers the cart.",
          highlights: ["Featured product", "Shop Now button", "“You might also like” carousel"],
          before: "Empty carts were dead ends; full carts were just lists.",
          after: "A featured product when empty, a “You might also like” carousel when full.",
          media: mcRow(
            "A featured product when the cart is empty, then one or two suggestions below the items.",
            mc("cart-empty-panel", "Empty"),
            mc("cart-one-panel", "One suggestion"),
            mc("cart-two-panel", "Two suggestions"),
          ),
        },
        {
          area: "Cart",
          title: "A clearer coupon field",
          detail: "My first version was a collapsible “Got a Discount Code?” row. It worked, but it didn't feel like applying anything. Now “Apply Coupon Code” stays a link until it's needed, opens into a field with an Apply button, and shows the applied code as a tag that can be removed in one tap.",
          highlights: ["Quiet link", "Apply button", "Removable code tag"],
          before: "A collapsible “Got a Discount Code?” row.",
          after: "A link that opens into a field, then a tag you remove in one tap.",
          media: mcRow(
            "A quiet link, then a field, then a tag you remove in one tap.",
            mc("coupon-link-crop", "A quiet link"),
            mc("coupon-field-crop", "Opens into a field"),
            mc("coupon-tag-crop", "Becomes a tag"),
          ),
        },
        {
          area: "Cart",
          title: "A complete order summary",
          detail: "Shoppers couldn't see what made up their total. The order summary now lays out shipping, tax, subtotal and savings, so the total never comes as a surprise at checkout, and the checkout button is the one clear next step.",
          highlights: ["Shipping", "Tax", "Subtotal", "Savings"],
          before: "No breakdown of the total.",
          after: "Shipping, tax, subtotal and savings, before checkout.",
          media: mcRow(
            "Two order summary styles, and several codes stacked as tags.",
            mc("coupon-link-crop", "Simple list"),
            mc("summary-card-crop", "Card, total in the button"),
            mc("summary-tags-crop", "Several codes"),
          ),
        },
        {
          area: "Cart",
          title: "A popup cart",
          detail: "Some stores want the cart front and center, not at the edge of the screen. I designed a second cart type that opens in the middle of the page, with the full set of states for desktop, tablet and mobile.",
          highlights: ["Desktop", "Tablet", "Mobile"],
          before: "Slide-out was the only option.",
          after: "A centered popup for desktop, tablet and mobile.",
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
        "Every screen comes from ForceUI, shared in Figma and React. One rule kept them in sync: nobody changes a component alone. Changes go through a ticket.",
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
        body: "Number fields needed their unit (px, %, ms) inside. I designed a unit badge into the input; it shipped as plain text, still inside the field.",
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
          body: "The PM's call was simple: publish ModernCart within a week. There was no time to redesign from scratch, so the goal was to make what existed feel finished.",
          details: [
            "I rebuilt the screens with ForceUI components, then reviewed the developer build with the PM. I logged 20 to 30 issues in a shared Google Sheet, each with a screenshot and a note on spacing, alignment, type, color or responsiveness. Developers fixed them in parallel while I prepared the assets they needed.",
            "The free version went live on schedule.",
          ],
          points: ["20 to 30 issues logged", "Screenshot on every issue", "Launched on schedule"],
        },
        {
          label: "After launch",
          title: "Learning from five competitors",
          body: "With the product live, the question changed from “is it ready?” to “what should it do next?” The company bought licenses for five competing cart plugins. I installed each one on a demo site and used it as a store owner would, comparing settings, features and how much store owners could customize.",
          details: [
            "That review shaped most of what came next: preset cart icons and custom icon upload, cart position controls, style options for the cart, header and order summary, and product suggestions in the cart.",
          ],
          points: ["Side Cart WooCommerce", "FunnelKit Cart", "Mini Cart for WooCommerce", "Side Cart & Checkout", "Flycart"],
        },
        {
          label: "Tickets",
          title: "Turning ideas into tickets",
          body: "I shared what I found with the team, and the PM decided what to build first. I wrote about 15 Jira tickets, one per feature, each with a description and the designs. The Figma file was organized the same way, one section per ticket, so anyone could match a design to its ticket.",
          points: ["About 15 Jira tickets", "One Figma section per ticket"],
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
    title: "Why reviewing reported content uses a dropdown, not tick and cross buttons",
    hook: "I argued for the faster design. After several rounds of debate, the team chose a different one, and I designed that one.",
    before: [
      "The spec first said reported content should stay visible while it waited for review, like on Instagram and TikTok. The flow changed: reported content is now hidden automatically, and the brand reviews it afterwards. So merchants needed a quick way to decide, item by item, whether something goes back to visible or stays hidden.",
    ],
    turningIntro: "There were two options:",
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
      nav: "Walkthrough",
      eyebrow: "Walkthrough",
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
      nav: "Solution",
      eyebrow: "Solution",
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
          highlights: ["Single choice poll", "This or that", "Custom per brand"],
          media: { caption: "The poll and the this or that block in the feed." },
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
          highlights: ["Everyone", "Everyone except", "Only specific customers", "Restricted states"],
          media: { caption: "Access control options and the restricted views in the app." },
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
