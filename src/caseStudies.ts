// Case study content for the portfolio.
// Text supports **bold** and [link text](https://url) inline.
// Media without a `src` renders as a placeholder; add a `src` (e.g. "/assets/...") to show a real image.
// Set `protected: true` on a section to put it behind the NDA code screen.

export type ProjectTone = "violet" | "peach";

export type MediaItem = {
  caption: string;
  kind?: "image" | "video";
  src?: string;
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
        pains: CardItem[];
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
    | { kind: "process"; steps: Array<{ label: string; body: string }>; notes?: CardItem[]; media?: MediaItem }
    | { kind: "future"; tag: string; items: CardItem[] }
    | { kind: "learnings"; items: CardItem[] }
    | { kind: "outcome"; before: string; after: string; stat: Stat; feedback: string }
  );

export type CaseStudy = {
  slug: string;
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
    media: [{ caption: "General tab with PRO badges." }, { caption: "Upgrade modal." }, { caption: "Free vs Pro tab." }],
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
    media: [{ caption: "Empty cart before." }, { caption: "Empty cart after." }, { caption: "Cart with the carousel." }],
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
    media: [{ caption: "The popup set across three screen sizes." }, { caption: "Slide-out next to popup." }],
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
      video: { kind: "video", caption: "Prototype walkthrough: a dashboard setting changes, and the storefront cart updates." },
      lanes: [
        {
          name: "Meera",
          role: "Store owner",
          about: "Runs DNK, a small clothing and footwear store on WooCommerce.",
          steps: [
            {
              title: "General: how it behaves",
              body: "Behavior only. Dropdowns first, toggles below, a one-line description on every setting.",
              media: { caption: "General tab, annotated." },
            },
            {
              title: "Text Label: sounds like DNK",
              body: "Every word a shopper sees is editable, pre-filled with sensible defaults.",
              media: { caption: "Text Label fields linked to the cart." },
            },
            {
              title: "Floating Cart Icon",
              body: "Its own tab: position, hide when empty, and preset icons.",
              media: { caption: "Floating Cart Icon tab." },
            },
            {
              title: "Styling: safe to try",
              body: "Reset buttons on colors, defaults under numbers, units inside fields.",
              media: { caption: "Styling tab, annotated." },
            },
          ],
        },
        {
          name: "Arjun",
          role: "Shopper",
          about: "Shopping at DNK for a new pair of shoes.",
          steps: [
            {
              title: "Opens an empty cart",
              body: "Instead of a dead end, a product he might like, with an add button.",
              media: { caption: "Empty cart with a suggestion." },
            },
            {
              title: "Adds shoes",
              body: "The cart slides in. A free shipping bar and “You might also like” keep him browsing.",
              media: { caption: "Side cart with the shipping bar and carousel." },
            },
            {
              title: "Applies a coupon",
              body: "A quiet link opens into a field, and the code becomes a removable tag.",
              media: { caption: "Coupon: link, field, tag." },
            },
            {
              title: "Checks out",
              body: "Shipping, tax, subtotal and savings, then one clear checkout button.",
              media: { caption: "Order summary and checkout." },
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
      intro: "Every change traces back to one of the three problems.",
      items: [
        {
          area: "Dashboard",
          title: "Settings grouped by task",
          detail: "Store owners had to hunt for settings across tabs. I split the dashboard into five tabs, each with one job: My Account for the plan and license, General for how the cart behaves, Text Label for what it says, Floating Cart Icon for the icon shoppers see on every page, and Styling for how it looks. In General, dropdowns come first and toggles below, so the page reads in one pass.",
          highlights: ["My Account", "General", "Text Label", "Floating Cart Icon", "Styling"],
          before: "Settings scattered across tabs.",
          after: "Five tabs, one job each: My Account, General, Text Label, Floating Cart Icon, Styling.",
          media: { caption: "The five tabs side by side." },
        },
        {
          area: "Dashboard",
          title: "Cart text that sounds like the store",
          detail: "The cart's wording was fixed, so it couldn't sound like the store it lived in. In Text Label, every word a shopper sees is editable, from the cart heading to the empty cart message. Each field starts filled with sensible default text, so store owners only change what they care about.",
          highlights: ["Cart heading", "Empty cart message", "Free shipping line", "Suggestion titles"],
          before: "Fixed wording in every store.",
          after: "Every shopper-facing word editable, with defaults filled in.",
          media: { caption: "Default heading vs DNK's wording." },
        },
        {
          area: "Dashboard",
          title: "The floating cart in its own tab",
          detail: "The floating cart icon is what shoppers see on every page, but its settings were buried inside General. It now has its own tab with position, hide when empty, and a set of preset icons. Custom icon upload was my idea too, and the team built it later.",
          highlights: ["Position", "Hide when empty", "Preset icons", "Custom upload"],
          before: "Buried inside General.",
          after: "Position, hide when empty, preset icons. Custom upload, my idea, came later.",
          media: { caption: "Floating icon next to its tab." },
        },
        {
          area: "Dashboard",
          title: "Styling that's safe to try",
          detail: "Store owners hesitate to change colors and sizes when they're not sure they can undo it. Styling is grouped into Colors, Icon Style, Width and Miscellaneous. Every color has a reset button, number fields show their default underneath, and units like px, % and ms sit inside the field.",
          highlights: ["Reset on every color", "Visible defaults", "Units inside fields"],
          before: "Owners hesitated to change what they couldn't undo.",
          after: "Grouped controls, reset buttons, visible defaults, units in fields.",
          media: { caption: "Color reset and number default, close up." },
        },
        {
          area: "Cart",
          title: "Product suggestions",
          detail: "An empty cart was a dead end, and a full cart gave shoppers no reason to keep browsing. The empty cart now shows a featured product and a Shop Now button, and a full cart shows a “You might also like” carousel below the items, kept small so it never covers the cart.",
          highlights: ["Featured product", "Shop Now button", "“You might also like” carousel"],
          before: "Empty carts were dead ends; full carts were just lists.",
          after: "A featured product when empty, a “You might also like” carousel when full.",
          media: { caption: "Empty and full cart with suggestions." },
        },
        {
          area: "Cart",
          title: "A clearer coupon field",
          detail: "My first version was a collapsible “Got a Discount Code?” row. It worked, but it didn't feel like applying anything. Now “Apply Coupon Code” stays a link until it's needed, opens into a field with an Apply button, and shows the applied code as a tag that can be removed in one tap.",
          highlights: ["Quiet link", "Apply button", "Removable code tag"],
          before: "A collapsible “Got a Discount Code?” row.",
          after: "A link that opens into a field, then a tag you remove in one tap.",
          media: { caption: "Coupon field, before and after." },
        },
        {
          area: "Cart",
          title: "A complete order summary",
          detail: "Shoppers couldn't see what made up their total. The order summary now lays out shipping, tax, subtotal and savings, so the total never comes as a surprise at checkout, and the checkout button is the one clear next step.",
          highlights: ["Shipping", "Tax", "Subtotal", "Savings"],
          before: "No breakdown of the total.",
          after: "Shipping, tax, subtotal and savings, before checkout.",
          media: { caption: "The order summary." },
        },
        {
          area: "Cart",
          title: "A popup cart",
          detail: "Some stores want the cart front and center, not at the edge of the screen. I designed a second cart type that opens in the middle of the page, with the full set of states for desktop, tablet and mobile.",
          highlights: ["Desktop", "Tablet", "Mobile"],
          before: "Slide-out was the only option.",
          after: "A centered popup for desktop, tablet and mobile.",
          media: { caption: "Popup cart on three screen sizes." },
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
        { label: "Week 1", body: "Rebuilt screens in ForceUI, logged 20 to 30 issues with screenshots. Launched on time." },
        { label: "Competitors", body: "Used five competing cart plugins the way a store owner would." },
        { label: "Tickets", body: "About 15 Jira tickets, each matched to a Figma section." },
        { label: "Free and Pro", body: "Designed how Pro features appear to free users." },
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
      media: { caption: "The Figma page organized by ticket." },
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

export const caseStudies: CaseStudy[] = [cartAbandonment, modernCart];
