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
  before?: string;
  after: string;
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
  question: string;
  options: DecisionOption[];
  why: string;
  outcome: string;
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
          before: "Three plain tabs: Report, Follow-Up Emails, Settings.",
          after: "Five sections plus Popup Templates for Pro. Reports is a dropdown.",
          media: { caption: "Old tabs vs the new top navigation." },
        },
        {
          area: "Dashboard",
          title: "Recovery at a glance",
          before: "Six numbers and nothing else.",
          after: "Stat cards, a revenue comparison chart, a date picker and recent report tables.",
          media: { caption: "Old Report page vs the new Dashboard." },
        },
        {
          area: "Emails",
          title: "A list that shows what works",
          before: "Name, subject and timing only.",
          after: "Sent count, open rate and click rate beside each template.",
          media: { caption: "Email list with the rate columns." },
        },
        {
          area: "Emails",
          title: "Editing in a drawer",
          before: "A long WordPress form on its own page.",
          after: "A drawer beside the list: content, timing, coupon, test email and a fuller rule engine.",
          media: { caption: "The edit drawer with the rule engine open." },
        },
        {
          area: "Reports",
          title: "Reports you can search and export",
          before: "A cart table with bulk actions and little else.",
          after: "Search, status filter, export, status chips and row actions. Product Report is new.",
          media: { caption: "The Email Report table, annotated." },
        },
        {
          area: "Reports",
          title: "Every detail of one cart",
          after: "A full-page Email Log: scheduled emails, billing and shipping side by side, and the order.",
          media: { caption: "The Email Logs page." },
        },
        {
          area: "Settings",
          title: "Settings split by topic",
          before: "One long page of checkbox columns.",
          after: "A left sub-menu, toggles, chip multi-selects, and one card per setting. GDPR is new.",
          media: { caption: "Old Settings vs the new General settings." },
        },
        {
          area: "Integrations",
          title: "More ways to reach shoppers",
          before: "Email was the only channel.",
          after: "Webhook, SMS, WhatsApp and OttoKit, each with its own page and toggle.",
          media: { caption: "The Integrations page." },
        },
        {
          area: "Pro",
          title: "Popup Templates",
          before: "No way to reach shoppers who leave before checkout.",
          after: "Email capture on add to cart or exit, with captures, views and “No thanks” clicks tracked.",
          media: { caption: "The popup template list and the popup." },
        },
        {
          area: "Pro",
          title: "Upgrade to Pro",
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
      items: [
        {
          title: "Reports became a dropdown, not more tabs",
          question: "Every new feature wanted a spot in the top bar. Where do new reports live?",
          options: [
            { title: "A tab per report", body: "One click away, but the top bar fills up fast." },
            { title: "Tabs inside a Reports page", body: "Short top bar, but a second row of navigation." },
            { title: "Pills beside the table", body: "Close to the data, but easy to miss." },
            { title: "A dropdown under Reports", body: "Short top bar, reports grouped. One extra click.", chosen: true },
          ],
          why: "It keeps the main navigation short, and new reports can be added without touching it. Decided with the PM and developers.",
          outcome: "Shipped: five items in the live top bar.",
          media: [{ caption: "The four navigation versions." }, { caption: "The live top bar." }],
        },
        {
          title: "Email Logs became a full page, not a drawer",
          question: "One abandoned cart holds a lot. Where should its details open?",
          options: [
            {
              title: "A side drawer",
              body: "Consistent with the email editor, but addresses and the order table get cramped.",
              badge: "My first idea",
            },
            { title: "A full page", body: "Room for every detail, side by side. Breaks the drawer pattern.", chosen: true },
          ],
          why: "The PM and developers pushed for it: this is a detailed read, not a quick edit. Looking at how much one cart holds, I agreed.",
          outcome: "Shipped. Now I ask early: quick edit or detailed read?",
          media: [{ caption: "Drawer version." }, { caption: "Full page version." }],
        },
        {
          title: "The dashboard chart always compares two numbers",
          question: "A chart that switches with each card, or one story that's always visible?",
          options: [
            { title: "Switches with the cards", body: "Flexible, but the interaction is hidden." },
            {
              title: "A fixed comparison",
              body: "Recoverable vs recovered revenue, always together.",
              chosen: true,
            },
          ],
          why: "The gap between the two lines is what store owners care about. It shouldn't depend on finding a hidden click.",
          outcome: "Shipped: six cards above the comparison chart.",
          media: [{ caption: "Dashboard V1." }, { caption: "Dashboard V2." }, { caption: "The live dashboard." }],
        },
        {
          title: "Shoppers can skip the email popup",
          question: "Asking for an email on every Add to Cart can feel like a login wall. Require it?",
          options: [
            { title: "Always required", body: "More emails, but browsers get frustrated and leave." },
            {
              title: "Optional, owner's choice",
              body: "Fewer emails here. Shoppers still give one at checkout.",
              chosen: true,
            },
          ],
          why: "An “Email field mandatory?” toggle, plus a count of “No thanks” clicks so owners decide with data.",
          outcome: "Shipped in Pro, as part of Popup Templates.",
          media: [{ caption: "Popup with the email required." }, { caption: "Popup with “No thanks.”" }],
        },
      ],
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
          before: "Settings scattered across tabs.",
          after: "Five tabs, one job each: My Account, General, Text Label, Floating Cart Icon, Styling.",
          media: { caption: "The five tabs side by side." },
        },
        {
          area: "Dashboard",
          title: "Cart text that sounds like the store",
          before: "Fixed wording in every store.",
          after: "Every shopper-facing word editable, with defaults filled in.",
          media: { caption: "Default heading vs DNK's wording." },
        },
        {
          area: "Dashboard",
          title: "The floating cart in its own tab",
          before: "Buried inside General.",
          after: "Position, hide when empty, preset icons. Custom upload, my idea, came later.",
          media: { caption: "Floating icon next to its tab." },
        },
        {
          area: "Dashboard",
          title: "Styling that's safe to try",
          before: "Owners hesitated to change what they couldn't undo.",
          after: "Grouped controls, reset buttons, visible defaults, units in fields.",
          media: { caption: "Color reset and number default, close up." },
        },
        {
          area: "Cart",
          title: "Product suggestions",
          before: "Empty carts were dead ends; full carts were just lists.",
          after: "A featured product when empty, a “You might also like” carousel when full.",
          media: { caption: "Empty and full cart with suggestions." },
        },
        {
          area: "Cart",
          title: "A clearer coupon field",
          before: "A collapsible “Got a Discount Code?” row.",
          after: "A link that opens into a field, then a tag you remove in one tap.",
          media: { caption: "Coupon field, before and after." },
        },
        {
          area: "Cart",
          title: "A complete order summary",
          before: "No breakdown of the total.",
          after: "Shipping, tax, subtotal and savings, before checkout.",
          media: { caption: "The order summary." },
        },
        {
          area: "Cart",
          title: "A popup cart",
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
      items: [
        {
          title: "I proposed showing Pro features, not hiding them",
          question: "Features free users relied on were moving to Pro. What should they see next time?",
          options: [
            {
              title: "Hide Pro features",
              body: "A clean free dashboard, but features people used just vanish.",
              chosen: true,
              badge: "Team's choice",
            },
            {
              title: "Show them locked",
              body: "A PRO badge and upgrade note. Clear, but a busier screen.",
              badge: "My proposal",
            },
          ],
          why: "A feature that disappears feels taken away; a locked one shows what upgrading gets. I designed the badges, upgrade notes, a modal and a Free vs Pro tab.",
          outcome: "The team kept Pro out of view. Both options were weighed, which was the goal.",
          media: [{ caption: "General tab with PRO badges." }, { caption: "Upgrade modal." }, { caption: "Free vs Pro tab." }],
        },
        {
          title: "Product suggestions turned the cart into a place to shop",
          question: "Shoppers open the cart before adding anything. Show a message, or something to explore?",
          options: [
            { title: "Keep a plain list", body: "Nothing distracts from checkout, but empty carts are dead ends." },
            { title: "Suggest products", body: "Keeps shoppers browsing. The risk is clutter.", chosen: true },
          ],
          why: "Bigger orders for the store, something to explore for the shopper. Inspired by [FunnelKit Cart](https://funnelkit.com/woocommerce-cart/), kept small so it never takes over.",
          outcome: "Shipped, and reused in the popup cart.",
          media: [{ caption: "Empty cart before." }, { caption: "Empty cart after." }, { caption: "Cart with carousel." }],
        },
        {
          title: "A popup cart for stores that want it front and center",
          question: "One slide-out panel for every store, or a choice?",
          options: [
            { title: "Slide-out only", body: "Feels light, but easy to glance past." },
            { title: "Popup only", body: "Full attention, but covers the page." },
            { title: "Offer both", body: "Let each store owner choose.", chosen: true },
          ],
          why: "Neither fits every store, and centered carts were already familiar in WooCommerce, like [WooCommerce Fast Cart](https://barn2.com/woocommerce-cart/).",
          outcome: "Shipped after I left. The plugin is now named Side Cart & Popup Cart.",
          media: [{ caption: "Popup set on three screen sizes." }, { caption: "Slide-out next to popup." }],
        },
      ],
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
