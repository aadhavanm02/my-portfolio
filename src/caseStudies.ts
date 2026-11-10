// Case study content for the portfolio.
// Text supports **bold** and [link text](https://url) inline.
// Media blocks without a `src` render as placeholders; add a `src` (e.g. "/assets/...") to show a real image.

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

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "label"; text: string }
  | { type: "list"; items: string[] }
  | { type: "media"; items: MediaItem[] }
  | { type: "compare"; left: string; right: string; rows: Array<[string, string]> }
  | { type: "cards"; items: CardItem[] }
  | { type: "learnings"; items: CardItem[] }
  | {
      type: "decision";
      title: string;
      hook: string;
      before: Block[];
      turning: Block[];
      options: CardItem[];
      after: Block[];
      next: Block[];
      result: Block[];
      media?: MediaItem[];
    };

export type CaseSection = {
  id: string;
  nav: string;
  eyebrow: string;
  title: string;
  intro?: string[];
  blocks: Block[];
  protected?: boolean;
};

export type CaseStudy = {
  slug: string;
  cardTitle: string;
  cardSummary: string;
  proof: string;
  tone: ProjectTone;
  image: string;
  imageClass?: string;
  headline: string;
  lead: string[];
  meta: Array<[string, string]>;
  hero: MediaItem;
  sections: CaseSection[];
};

const p = (text: string): Block => ({ type: "p", text });
const h3 = (text: string): Block => ({ type: "h3", text });
const h4 = (text: string): Block => ({ type: "h4", text });
const label = (text: string): Block => ({ type: "label", text });
const list = (...items: string[]): Block => ({ type: "list", items });
const media = (...captions: string[]): Block => ({ type: "media", items: captions.map((caption) => ({ caption })) });
const video = (caption: string): Block => ({ type: "media", items: [{ caption, kind: "video" }] });

const feedbackLine = (question: string) =>
  p(
    `${question} Feedback is welcome on [LinkedIn](https://www.linkedin.com/in/aadhavan-m/) or by [email](mailto:aadhavanm.design@gmail.com).`,
  );

const cartAbandonment: CaseStudy = {
  slug: "cart-abandonment-recovery",
  cardTitle: "Cart Abandonment Recovery for WooCommerce",
  cardSummary:
    "A full admin redesign so store owners can finally see the sales the plugin wins back, plus the new features planned for it.",
  proof: "300K+ active installs. Redesigned end to end on ForceUI.",
  tone: "peach",
  image: "/assets/cart-abandonment.png",
  imageClass: "project-image--cart",
  headline: "How I Redesigned Cart Abandonment Recovery So Store Owners Could See What They Win Back",
  lead: [
    "The plugin's whole job is to bring back lost sales. Yet its own admin showed six numbers, no chart, and no way to export them.",
    "Cart Abandonment Recovery is a WooCommerce plugin from the CartFlows family. It tracks shoppers who leave items in their cart, sends them timed follow-up emails, and shows store owners how many orders and how much revenue came back. As the only designer, working with a PM and developers, I redesigned the whole admin on ForceUI and designed the new features planned for it: a visual dashboard, detailed reports, new recovery channels, and a popup that captures a shopper's email before they leave.",
    "The challenge was rebuilding a plugin people already used every day, while making room for features it had never had.",
    "Today, Cart Abandonment Recovery has 300K+ active installs ([CartFlows](https://cartflows.com/cart-abandonment), [WP Hive](https://wphive.com/plugins/woo-cart-abandonment-recovery)).",
  ],
  meta: [
    ["Role:", "Product Designer, the only designer on the team"],
    ["Duration:", "May to June 2025"],
    ["Team:", "A PM, developers, and me"],
    ["Platform:", "WooCommerce plugin for WordPress"],
    ["Design system:", "ForceUI"],
    ["Scope:", "Full admin redesign, new features, and Upgrade to Pro screens"],
  ],
  hero: {
    caption: "The new Dashboard, with the six stat cards and the revenue comparison chart.",
    src: "/assets/cart-abandonment.png",
  },
  sections: [
    {
      id: "the-problem",
      nav: "The Problem",
      eyebrow: "The Problem",
      title: "A Recovery Plugin That Couldn't Show What It Recovered",
      intro: [
        "Cart Abandonment Recovery worked. It tracked abandoned carts and sent follow-up emails. But its admin still looked like a plain WordPress settings page, and it was falling behind competing recovery plugins.",
      ],
      blocks: [
        label("The business problem"),
        p(
          "For a store owner, the only reason to use a recovery plugin is the revenue it brings back. If they can't see that clearly, they can't trust it, tune it, or justify paying for more. For Brainstorm Force, that meant two things: keeping the free plugin competitive, and giving store owners a clear reason to upgrade to Pro.",
        ),
        label("What stood in the way"),
        list(
          "**One page doing two jobs.** The Report tab was both the dashboard and the report: six number cards with no chart, then a table of carts below.",
          "**Hard to track and act on data.** Reports had no search, no filters beyond date, and no export.",
          "**No sign of which emails worked.** The follow-up email list showed name, subject and timing, but not how many were sent, opened or clicked.",
          "**Settings on one long page,** with long columns of checkboxes for roles and order statuses.",
          "**No room to grow.** New features were planned (product reports, SMS and WhatsApp, popups), and the old three-tab layout had nowhere to put them.",
        ),
        media("The old Report page, with the six number cards and the plain table below."),
        label("Why it was worth solving"),
        p(
          "A store owner who can see recovered revenue rising over time trusts the plugin and keeps using it. A store owner who sees six static numbers has no idea what's working.",
        ),
        label("Constraints"),
        list(
          "Rebuild a plugin that existing users already knew",
          "Work inside ForceUI, shared across Brainstorm Force plugins",
          "Design from a feature list agreed with the team up front",
          "No access to store owners for testing",
        ),
        {
          type: "compare",
          left: "The Main Challenges:",
          right: "The Main Goals:",
          rows: [
            ["One page mixed the dashboard and the report", "Show recovery at a glance, with details one click away"],
            ["Data was hard to track or export", "Make every report searchable, filterable and exportable"],
            ["The layout had no room for new features", "Build a structure that can grow"],
            ["The UI didn't follow the design system", "Bring every screen in line with ForceUI"],
          ],
        },
      ],
    },
    {
      id: "walkthrough",
      nav: "Walkthrough",
      eyebrow: "Walkthrough",
      title: "The Finished Design, Through One Store Owner and One Shopper",
      intro: [
        "Recovery has two sides: the store owner who sets it up and watches the results, and the shopper who leaves and, hopefully, comes back. Here's both, through one store and one shopper.",
        "**Kavya** runs Leaf & Loom, a small home decor store on WooCommerce, with Cart Abandonment Recovery Pro. **Rohan** is browsing her store for a new lamp.",
      ],
      blocks: [
        video(
          "A 60 to 90 second recording of the Figma prototype: Kavya checks her dashboard, edits a follow-up email, then opens one recovered cart.",
        ),
        h3("Part 1: Kavya sets up recovery"),
        h4("1. The dashboard: is it working?"),
        p(
          "Kavya opens the plugin and lands on the Dashboard. Six cards show recoverable orders, recovered orders, lost orders, recoverable revenue, recovered revenue and recovery rate. Below them, a chart compares recoverable and recovered revenue over time, so she can see the gap she's closing. She picks “Last month” from the date picker and everything updates.",
        ),
        media("Dashboard, annotated (cards, comparison chart, date picker, recent follow-ups)."),
        h4("2. Follow-up emails: what gets sent, and when"),
        p(
          "She opens Follow Up Emails. Each template shows how many emails were sent and its open and click rates, so she can see the second email is doing most of the work. Editing one opens a drawer beside the list: subject, body, when to send it, and an auto coupon. She turns on the rule engine so the coupon email only goes to carts over a certain value.",
        ),
        media("Email list with rates.", "The edit drawer with the rule engine open."),
        h4("3. A popup that captures emails early"),
        p(
          "Many shoppers leave before checkout, before the store has any way to reach them. Kavya sets up an Add to Cart popup that asks for an email. She designs its look in Spectra, sets its rules and coupon in the plugin, and turns off “Email field mandatory?” so shoppers can skip it.",
        ),
        media("Popup template list.", "The popup with “No thanks” shown."),
        h4("4. Reports: who left, and who came back"),
        p(
          "A week later, Kavya opens Reports and chooses Email Report. She searches for a customer, filters by status, and exports the list for her records. She opens one cart and sees everything on one page: the emails scheduled, the shopper's billing and shipping address, and what was in the cart.",
        ),
        media("Reports dropdown.", "The Email Report table.", "The Email Logs page."),
        h3("Part 2: Rohan shops at Leaf & Loom"),
        h4("1. Adding a lamp"),
        p(
          "Rohan taps Add to Cart. The popup asks for his email. He's just browsing, so he taps “No thanks” and the lamp goes straight into his cart.",
        ),
        media("The email capture popup with “No thanks.”"),
        h4("2. Leaving at checkout"),
        p("At checkout, he enters his email, then gets distracted and closes the tab."),
        h4("3. Coming back"),
        p(
          "Thirty minutes later, he gets Kavya's first follow-up email with a link back to his cart. The next day, a second email with a small discount brings him back, and he buys the lamp. On Kavya's dashboard, recovered revenue goes up.",
        ),
      ],
    },
    {
      id: "solution",
      nav: "Solution",
      eyebrow: "Solution",
      title: "What I Designed, and the Problem Each Part Solves",
      intro: [
        "Every change traces back to one of four problems: a page doing two jobs, data that was hard to use, no room to grow, and screens that didn't follow the design system.",
      ],
      blocks: [
        h3("A clearer structure"),
        h4("Navigation built to grow"),
        p(
          "The old plugin had three plain tabs: Report, Follow-Up Emails and Settings. I rebuilt the top navigation on ForceUI as Dashboard, Follow Up Emails, Reports, Integrations and Settings, with Popup Templates added for Pro. Reports became a dropdown so new report types don't crowd the top bar. More in Decision 1.",
        ),
        media("Old three tabs next to the new top navigation."),
        h3("The dashboard"),
        h4("Recovery at a glance"),
        p(
          "The old Report page showed six numbers and nothing else. The new Dashboard keeps the six stat cards, adds a chart comparing recoverable and recovered revenue over time, a date range picker, a Recent Follow Up Report table and a Product Report table, each with View All. More in Decision 3.",
        ),
        media("Old Report page next to the new Dashboard."),
        h3("Follow-up emails"),
        h4("A list that shows what works"),
        p(
          "Store owners couldn't tell which emails were bringing shoppers back. The template list now shows sent count, open rate and click rate beside each template.",
        ),
        media("Old email list next to the new one, with the rate columns highlighted."),
        h4("Editing in a drawer"),
        p(
          "The old editor was a long WordPress form on its own page. Editing now opens a drawer beside the list, with the subject, body and variables, send timing, coupon, test email and WooCommerce email style grouped together.",
        ),
        media("Old edit page next to the new drawer."),
        h4("A fuller rule engine"),
        p(
          "The rule engine already existed, but some rule options were missing. I redesigned it on ForceUI as a toggle in the email drawer that reveals a simple condition builder (rule type, operator, value, add rule), and the missing options were added.",
        ),
        media("The rule engine open inside the drawer."),
        h3("Reports and Email Logs"),
        h4("Reports you can search and export"),
        p(
          "The old cart table had bulk actions and little else. The Email Report now has search, a status filter, a date picker, Export, a country column, colored status chips and row actions to view, unsubscribe or delete. Product Report is new, showing which products are abandoned and recovered most.",
        ),
        media("The Email Report table, annotated."),
        h4("Every detail of one cart"),
        p(
          "Opening a cart shows its Email Log on a full page: the scheduled emails with coupon and status, billing and shipping addresses side by side, and the order items with totals. More in Decision 2.",
        ),
        media("The Email Logs page."),
        h3("Settings and integrations"),
        h4("Settings split by topic"),
        p(
          "The old settings sat on one long page, with long columns of role and order status checkboxes. Settings now has a left sub-menu: General, Coupon, Email, Recovery Report, GDPR and Advanced. Tracking is a toggle, roles and statuses are multi-select fields with chips, each setting sits in its own card, and saving shows a confirmation. Notify Recovery To Admin, Recovery Report emails and GDPR are new.",
        ),
        media("Old Settings page next to the new General settings."),
        h4("More ways to reach shoppers"),
        p(
          "Integrations is new: Webhook, SMS, WhatsApp and OttoKit, each with its own page in a left sub-menu and an enable toggle.",
        ),
        media("The Integrations page."),
        h3("For Pro"),
        h4("Popup Templates"),
        p(
          "A Pro feature that captures a shopper's email when they add to cart or try to leave. The list shows each template's type, emails captured, views and “No thanks” clicks. Editing opens the popup in Spectra, Brainstorm Force's page builder, while rules and coupons stay in the plugin. More in Decision 4.",
        ),
        media("The popup template list.", "The popup itself."),
        h4("Upgrade to Pro"),
        p(
          "I designed how Pro features appear to free users across the Dashboard, Follow Up Emails, Product Report, Integrations and Settings. All of them shipped, including the blurred Product Report on the Dashboard.",
        ),
        media("The blurred Product Report on the live Dashboard."),
      ],
    },
    {
      id: "critical-decisions",
      nav: "Decisions",
      eyebrow: "Critical Decisions",
      title: "Four Decisions That Shaped the New Admin",
      intro: ["Four moments where I weighed one direction against another, and why we landed where we did."],
      blocks: [
        {
          type: "decision",
          title: "Decision 1: Why Reports Became a Dropdown Instead of More Tabs",
          hook: "Every new feature wanted a place in the top navigation, and the top navigation only had so much room.",
          before: [
            p(
              "The old plugin had three tabs. As the plan grew to include Product Report, Email Logs, Integrations and Popup Templates, each report sitting as its own tab would have crowded the top bar.",
            ),
          ],
          turning: [p("I explored four directions:")],
          options: [
            {
              title: "A tab for each report.",
              body: "One click to any report. But the top bar fills up fast, and gets worse with every new report.",
            },
            {
              title: "Underline tabs inside a Reports page.",
              body: "Keeps the top bar short. But it adds a second row of navigation inside the page.",
            },
            {
              title: "Pill tabs beside the table title.",
              body: "Compact and close to the data. But easy to miss, and harder to scale beyond two reports.",
            },
            {
              title: "A dropdown under Reports in the top bar.",
              body: "Keeps the top bar short and groups the reports in one place. The trade-off is one extra click.",
            },
          ],
          after: [
            p(
              "In discussion with the PM and developers, we chose the dropdown. It keeps the main navigation short, and new report types can be added without touching the top bar.",
            ),
          ],
          next: [
            p(
              "I designed the Reports dropdown with Email Report and Product Report, and kept the same table layout across both so they feel like one area.",
            ),
          ],
          result: [
            p(
              "It shipped. The live plugin's top bar has five items: Dashboard, Follow Up Emails, Reports, Integrations and Settings.",
            ),
          ],
          media: [{ caption: "The four navigation versions side by side." }, { caption: "The live top bar." }],
        },
        {
          type: "decision",
          title: "Decision 2: Why Email Logs Became a Full Page, Not a Side Drawer",
          hook: "A store owner clicks on one abandoned cart. How much do they need to see, and where should it open?",
          before: [
            p(
              "In the new design, editing a follow-up email opened in a side drawer beside the list. Email Logs, the detailed view of one cart, needed a home too.",
            ),
          ],
          turning: [p("There were two options:")],
          options: [
            {
              title: "A side drawer.",
              body: "Consistent with the email editor, and the list stays in view. But Email Logs holds a lot: scheduled emails, billing and shipping addresses, and the full order. In a drawer, the addresses can't sit side by side and the order table gets cramped.",
            },
            {
              title: "A full page.",
              body: "Room for every detail, with addresses side by side and a full order table. The trade-off is leaving the list and a different pattern from the email editor.",
            },
          ],
          after: [
            p(
              "I first proposed the drawer, for consistency. The PM and developers pushed for the full page, because this is a detailed report, not a quick edit. Looking at how much one cart holds, I agreed. The old plugin also showed these details on a full page, so existing users would recognise it.",
            ),
          ],
          next: [
            p(
              "I redesigned Email Logs as a full page: email details first, then billing and shipping side by side, then the order items with totals.",
            ),
          ],
          result: [
            p(
              "The full page shipped. It reinforced something I now ask early: is this a quick edit or a detailed read? The answer decides the pattern, not consistency alone.",
            ),
          ],
          media: [{ caption: "The drawer version." }, { caption: "The full page version." }],
        },
        {
          type: "decision",
          title: "Decision 3: Why the Dashboard Chart Always Compares Two Numbers",
          hook: "A chart that changes when you click a card sounds clever. But would store owners ever know to click?",
          before: [
            p(
              "The old Report page had six number cards and no chart at all. Store owners could see totals, but not whether recovery was improving.",
            ),
          ],
          turning: [p("There were two options:")],
          options: [
            {
              title: "One chart that switches with the cards.",
              body: "Click any metric card and the chart shows that metric. Flexible, but the interaction is hidden. Store owners might never discover it, or not understand why the chart changed.",
            },
            {
              title: "A fixed chart comparing two metrics.",
              body: "Recoverable revenue and recovered revenue, always shown together. Less flexible, but the most important story is always visible: how much was at risk, and how much came back.",
            },
          ],
          after: [
            p(
              "I chose the fixed comparison. The gap between the two lines is what a store owner actually cares about, and it shouldn't depend on finding a hidden click.",
            ),
          ],
          next: [
            p(
              "I designed the chart with both lines in the brand colors, a legend, and a date range picker that updates the cards and the chart together. I explored two dashboard versions; the first, refined over a few rounds, became the final design.",
            ),
          ],
          result: [p("It shipped. The live dashboard shows the six cards above the comparison chart.")],
          media: [{ caption: "Dashboard V1." }, { caption: "Dashboard V2." }, { caption: "The live dashboard." }],
        },
        {
          type: "decision",
          title: "Decision 4: Why Shoppers Can Skip the Email Popup",
          hook: "The store needs a shopper's email to recover their cart. But asking for it every time they tap Add to Cart can feel like a login wall.",
          before: [
            p(
              "The popup asks for an email when a shopper adds to cart, so the store can follow up if they leave. A shopper who isn't logged in might see it again and again.",
            ),
          ],
          turning: [p("There were two options:")],
          options: [
            {
              title: "Always require the email.",
              body: "The store captures more emails. But shoppers who are just browsing get frustrated, wonder why it's needed, and may leave the store altogether.",
            },
            {
              title: "Let store owners make it optional.",
              body: "Shoppers can tap “No thanks” and keep shopping. The store captures fewer emails at this step.",
            },
          ],
          after: [
            p(
              "I designed it as a choice for the store owner, with an “Email field mandatory?” toggle. Skipping is safe because shoppers still give their email at checkout. By then they've chosen what to buy, so being asked feels necessary rather than annoying.",
            ),
          ],
          next: [
            p(
              "When the toggle is off, the popup shows a “No thanks” link with editable text. The template list counts “No thanks” clicks, so store owners can see how many shoppers skip and decide for themselves.",
            ),
          ],
          result: [
            p(
              "It shipped as part of Popup Templates in Pro. Store owners get to balance capturing emails against keeping shoppers happy, with the data to back their choice.",
            ),
          ],
          media: [{ caption: "The popup with the email required." }, { caption: "The popup with “No thanks.”" }],
        },
      ],
    },
    {
      id: "design-system",
      nav: "Design System",
      eyebrow: "Design System",
      title: "Built on ForceUI, So It Feels Like Part of the Family",
      intro: [
        "Cart Abandonment Recovery sits in the CartFlows family, next to ModernCart. Rebuilding it on ForceUI, Brainstorm Force's shared design system, meant a store owner moving between these plugins finds the same layout, the same controls and the same behavior.",
      ],
      blocks: [
        h3("The patterns I reused"),
        list(
          "**Top navigation:** the same product bar as other Brainstorm Force plugins, with the version, help and announcements on the right.",
          "**Left sub-menus:** inside Integrations and Settings, so each channel and each group of settings gets its own page without crowding the top bar.",
          "**Side drawers for quick edits:** follow-up emails and popup settings open beside their list, so store owners never lose their place.",
          "**Tables with status chips:** one table style across reports, logs and templates, with colored chips for Abandoned, Successful, Failed and Normal.",
          "**Cards with descriptions:** every setting sits in its own card with a one-line explanation, replacing the old grey notes under each field.",
          "**Multi-select fields with chips:** replacing long columns of checkboxes for roles and order statuses.",
        ),
        h3("Color and type"),
        p("The plugin uses Flamingo, CartFlows' orange, as its accent, with Figtree for type, the same as ModernCart."),
        media("One row per pattern, showing the ForceUI piece next to where it appears in the plugin."),
      ],
    },
    {
      id: "process",
      nav: "Process",
      eyebrow: "Process",
      title: "How It Came Together: Planned Up Front, Designed in Phases",
      intro: ["Unlike ModernCart, which started with a one-week deadline, this project started with a plan."],
      blocks: [
        h3("Research and a feature list"),
        p(
          "Before any design, the team researched what the plugin was missing, and I was part of it. We studied competing recovery plugins, including YITH Recover Abandoned Cart and VillaTheme, and collected their screens on a References board in Figma. Everything we wanted to add went into a shared sheet, and the team decided what made the cut. That list became my brief.",
        ),
        media("A slice of the References board."),
        h3("Designing in two phases"),
        p("I designed the whole admin first, then the team split the work into two phases:"),
        list(
          "**Phase 1:** the core admin. Dashboard, Follow Up Emails with the rule engine and coupons, Reports, Integrations and Settings.",
          "**Phase 2:** Popup Templates.",
        ),
        h3("Decisions made together"),
        p(
          "Most decisions came out of discussions with the PM and developers, like the Reports dropdown and the full-page Email Logs. I shared versions, we talked through the trade-offs, and I updated the designs. The feedback on the finished work was positive.",
        ),
        h3("Where the plan changed"),
        p(
          "I first designed popup editing inside the plugin itself. In discussion, the team decided to open popups in Spectra, Brainstorm Force's page builder, where store owners can customize every detail visually. The plugin keeps the popup's settings, rules and coupons. It wasn't a choice I disagreed with, just one I didn't expect: Spectra already does visual editing well, and reusing it lets the two plugins work together.",
        ),
      ],
    },
    {
      id: "future-scope",
      nav: "Future Scope",
      eyebrow: "Future Scope",
      title: "Where It Could Go Next",
      intro: [
        "The features we planned all shipped, so these are directions I'd explore next, based on what the design now makes visible.",
      ],
      blocks: [
        {
          type: "cards",
          items: [
            {
              title: "Help store owners decide on the popup",
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
      ],
    },
    {
      id: "learnings",
      nav: "Learnings",
      eyebrow: "Learnings & Feedback",
      title: "What This Project Taught Me",
      blocks: [
        {
          type: "learnings",
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
              title: "A visible gap tells a better story than a clever interaction.",
              body: "The dashboard chart works because it always shows what was at risk and what came back.",
            },
          ],
        },
      ],
    },
    {
      id: "outcome",
      nav: "Outcome",
      eyebrow: "Outcome",
      title: "From a Settings Page to a Recovery Dashboard",
      intro: [
        "Cart Abandonment Recovery started as three plain tabs that showed six numbers. Over May and June, it became a full admin with a visual dashboard, searchable and exportable reports, detailed email logs, new recovery channels, and an email capture popup for Pro. The designs shipped, and today the plugin has 300K+ active installs.",
      ],
      blocks: [
        feedbackLine(
          "If you've designed admin dashboards or worked on ecommerce tools, I'd love to hear how you would have handled the Email Logs drawer versus full page question.",
        ),
      ],
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
  headline: "How I Redesigned ModernCart So Its Cart Stopped Being a Dead End",
  lead: [
    "ModernCart had been built by developers and left unreleased. Then the PM made the call: it goes live in one week.",
    "ModernCart is a WooCommerce plugin that adds a side cart to a store, so shoppers can see and change their cart from any page without going to the cart page. The default WooCommerce cart page still exists; most shoppers just never need it. As the only designer on the team, working with a PM and developers, I got it ready for launch in that week, then spent the weeks after designing what came next: a dashboard organized around what store owners actually do, and a cart that suggests products instead of leaving shoppers at a dead end.",
    "The challenge was doing both on a product that was already built, inside a design system the team was still building.",
    "Today, ModernCart has 50K+ active installs on [WordPress.org](https://wordpress.org/plugins/modern-cart/).",
  ],
  meta: [
    ["Role:", "Product Designer, the only designer on the team"],
    ["Duration:", "April to May 2025"],
    ["Team:", "A PM, developers, and me"],
    ["Platform:", "WooCommerce plugin for WordPress"],
    ["Design system:", "ForceUI"],
    ["Scope:", "Store owner dashboard, shopper cart, new feature ideas"],
  ],
  hero: {
    caption: "The finished side cart open on DNK's storefront, next to the ModernCart dashboard.",
    src: "/assets/modern-cart.png",
  },
  sections: [
    {
      id: "the-problem",
      nav: "The Problem",
      eyebrow: "The Problem",
      title: "A Cart Plugin That Was Built, but Not Ready for the People Using It",
      intro: [
        "ModernCart was built by developers at Brainstorm Force but had never been released. The features worked, but nobody had designed it around the store owners who set it up or the shoppers who use it. With launch a week away, that gap had to close fast.",
      ],
      blocks: [
        label("The business problem"),
        p(
          "WooCommerce's default cart sends shoppers to a separate cart page, which breaks their flow right when they are about to buy. Side cart plugins fix this by opening the cart on the page shoppers are already on, and competitors were already selling them. Brainstorm Force wanted ModernCart in that market as part of the CartFlows family. From a business point of view, that meant two things: more shoppers finishing checkout, and a higher average order value. Both lead straight to revenue.",
        ),
        label("What stood in the way"),
        list(
          "**For store owners:** settings felt scattered. Related options sat in different tabs, and some, like the floating cart settings, sat inside General where nobody would look for them. Spacing, type and colors also didn't follow ForceUI, so the dashboard felt unfinished.",
          "**For shoppers:** the cart only did the basics. Open it empty and you saw one line saying so, with nothing to look at and nowhere to go. Add items and it was a plain list, with no reason to stay and browse.",
        ),
        label("Why it was worth solving"),
        p(
          "A store owner who struggles with the settings won't set the cart up well, and a badly set up cart loses shoppers. An empty cart is also the moment a shopper is already looking for something to buy. Showing them nothing wastes it.",
        ),
        label("Constraints"),
        list(
          "One week to launch the first version",
          "Work inside ForceUI without changing its components",
          "Build on the existing developer build, not start fresh",
          "No access to store owners or shoppers for testing",
        ),
        {
          type: "compare",
          left: "The Main Challenges:",
          right: "The Main Goals:",
          rows: [
            ["Settings felt scattered, with no clear structure", "Organize settings around what owners need"],
            ["An empty cart offered no next step", "Turn an empty cart into a helpful moment"],
            ["The UI did not follow the design system", "Bring every screen in line with ForceUI"],
          ],
        },
      ],
    },
    {
      id: "walkthrough",
      nav: "Walkthrough",
      eyebrow: "Walkthrough",
      title: "The Finished Design, Through One Store and One Shopper",
      intro: [
        "ModernCart has two parts: a dashboard where store owners shape the cart, and the cart shoppers actually use. Every choice in the first shows up in the second. Here's both, through one store and one shopper.",
        "**Meera** runs DNK, a small clothing and footwear store on WooCommerce. **Arjun** is shopping there for a new pair of shoes.",
      ],
      blocks: [
        video(
          "A 60 to 90 second recording of the Figma prototype: a setting changes in the dashboard, then the cart updates on the storefront.",
        ),
        h3("Part 1: Meera sets up her cart"),
        h4("1. General: deciding how the cart behaves"),
        p(
          "Meera wants the cart working before she worries about how it looks. General holds only behavior: turning the cart on, choosing the cart type and style, the free shipping bar, and product suggestions. Dropdowns come first and toggles sit below them, so the page reads top to bottom in one pass. Every setting has a one-line description, so she never needs the docs to know what it does.",
        ),
        media("General tab, annotated (behavior only, dropdowns then toggles, one-line descriptions)."),
        h4("2. Text Label: making the cart sound like DNK"),
        p(
          "The default cart says “Review Your Cart” and “Proceed to Checkout.” Meera wants it to sound like her store. Every word a shopper sees, from the cart heading to the empty cart message and the free shipping line, is editable here. Each field starts filled with sensible text, so she only changes what she cares about.",
        ),
        media("Text Label tab, with two fields linked to where that text appears in the cart."),
        h4("3. Floating Cart Icon: the part shoppers see on every page"),
        p(
          "The floating cart icon follows shoppers across the whole store, so it gets its own tab. Meera picks where it sits, whether it hides when the cart is empty, and an icon from the preset set that fits DNK's look.",
        ),
        media("Floating Cart Icon tab with the icon picker."),
        h4("4. Styling: matching the store's colors"),
        p(
          "Styling is grouped the way Meera thinks about it: colors, icon style, width, and animation. Every color has a reset button, and number fields show their default underneath (“Default width: 450px”), so she can experiment without worrying about breaking anything. Units like px, % and ms sit inside the field, so she always knows what the number means.",
        ),
        media("Styling tab, annotated (groups, reset buttons, defaults, units)."),
        h3("Part 2: Arjun shops at DNK"),
        h4("1. Opening the cart before adding anything"),
        p(
          "Arjun taps the floating cart out of curiosity. Instead of an empty panel, he sees a product he might like, with a button to add it right there. (Why this exists is in Decision 2.)",
        ),
        media("Empty cart with a suggested product."),
        h4("2. Adding a pair of shoes"),
        p(
          "Arjun adds shoes and the cart slides in without taking him off the page. A bar at the top tells him how much more he needs to spend for free shipping, which gives him a reason to keep looking. Below his item, “You might also like” shows a few matching products he can add in one tap.",
        ),
        media("Side cart with the free shipping bar and carousel, annotated."),
        h4("3. Applying a coupon"),
        p(
          "Arjun has a discount code. “Apply Coupon Code” stays out of the way as a link until he needs it, then opens into a field with an Apply button. Once applied, the code shows as a small tag he can remove in one tap, so he always knows which discount is active.",
        ),
        media("Coupon step 1: the link.", "Coupon step 2: the field.", "Coupon step 3: the applied tag."),
        h4("4. Checking out"),
        p("The order summary lays out shipping, tax, subtotal and savings, and the checkout button is the one clear next step."),
        media("Cart with the order summary and checkout button."),
      ],
    },
    {
      id: "solution",
      nav: "Solution",
      eyebrow: "Solution",
      title: "What I Designed, and the Problem Each Part Solves",
      intro: [
        "Every change traces back to one of the three problems: scattered settings, a cart with dead ends, and screens that didn't follow the design system.",
      ],
      blocks: [
        h3("The dashboard, for store owners"),
        h4("Settings grouped by task"),
        p(
          "Store owners had to hunt for settings across tabs. I split the dashboard into five tabs, each with one job: My Account for the plan and license, General for how the cart behaves, Text Label for what it says, Floating Cart Icon for the icon shoppers see on every page, and Styling for how it looks. In General, dropdowns come first and toggles below, so the page reads in one pass.",
        ),
        media("The five tabs side by side."),
        h4("Cart text that sounds like the store"),
        p(
          "The cart's wording was fixed, so it couldn't sound like the store it lived in. In Text Label, every word a shopper sees is editable, from the cart heading to the empty cart message. Each field starts filled with sensible default text, so store owners only change what they care about.",
        ),
        media("The same cart heading with the default text and with DNK's own wording."),
        h4("The floating cart in its own tab"),
        p(
          "The floating cart icon is what shoppers see on every page, but its settings were buried inside General. It now has its own tab with position, hide when empty, and a set of preset icons. Custom icon upload was my idea too, and the team built it later.",
        ),
        media("The floating cart icon on the storefront, next to the tab that controls it."),
        h4("Styling that's safe to try"),
        p(
          "Store owners hesitate to change colors and sizes when they're not sure they can undo it. Styling is grouped into Colors, Icon Style, Width and Miscellaneous. Every color has a reset button, number fields show their default underneath, and units like px, % and ms sit inside the field.",
        ),
        media("Close-up of one color field with its reset button, and one number field with its default and unit."),
        h4("One consistent system"),
        p(
          "Spacing, type and colors didn't match across screens. I rebuilt every screen with ForceUI components, so the whole dashboard looks and behaves like one product. More in the ForceUI section below.",
        ),
        media("A ForceUI component next to where it appears in ModernCart."),
        h3("The cart, for shoppers"),
        h4("Product suggestions"),
        p(
          "An empty cart was a dead end, and a full cart gave shoppers no reason to keep browsing. The empty cart now shows a featured product and a Shop Now button, and a full cart shows a “You might also like” carousel below the items. More in Decision 2.",
        ),
        media("Empty cart with suggestions.", "Full cart with suggestions."),
        h4("A clearer coupon field"),
        p(
          "My first version was a collapsible “Got a Discount Code?” row. It worked, but it didn't feel like applying anything. Now “Apply Coupon Code” stays a link until it's needed, opens into a field with an Apply button, and shows the applied code as a tag that can be removed in one tap.",
        ),
        media("Before and after of the coupon field.", "The three steps: link, field, applied tag."),
        h4("A complete order summary"),
        p(
          "Shoppers couldn't see what made up their total. The order summary now lays out shipping, tax, subtotal and savings, so the total never comes as a surprise at checkout.",
        ),
        media("The order summary in the cart."),
        h4("A popup cart"),
        p(
          "Some stores want the cart front and center, not at the edge of the screen. I designed a second cart type that opens in the middle of the page, for desktop, tablet and mobile. More in Decision 3.",
        ),
        media("The popup cart across three screen sizes."),
        h3("Styles store owners can choose from"),
        p("Not every store wants the same cart, so I designed options for the parts that vary most between stores."),
        h4("Cart type"),
        p("Slide-out or popup. The slide-out keeps the page visible behind it; the popup takes the shopper's full attention."),
        h4("Cart item layout"),
        p(
          "Six layouts that change where the remove and quantity controls sit. Some stores want editing the cart to be front and center, others want it quiet.",
        ),
        media("The six layouts side by side."),
        h4("Order summary"),
        p(
          "Two styles. One is a simple list above the checkout button. The other is a card with its own heading, with the total inside the checkout button, right where the shopper acts.",
        ),
        media("Order summary style 1.", "Order summary style 2."),
        h4("Coupon"),
        p("Two styles. One handles a single code. The other shows several codes as tags, for stores that let shoppers stack discounts."),
        media("Single code.", "Multiple codes."),
        h4("Suggestions carousel"),
        p("One or two products at a time, so it fits narrow carts and wider ones."),
        media("The carousel layouts."),
        h4("Cart footer"),
        p(
          "View Cart and Checkout, or Checkout only. Some stores want shoppers to see a full cart page first, others want the fastest path to checkout.",
        ),
        media("Footer with View Cart and Checkout.", "Footer with Checkout only."),
      ],
    },
    {
      id: "critical-decisions",
      nav: "Decisions",
      eyebrow: "Critical Decisions",
      title: "Three Decisions That Shaped ModernCart",
      intro: ["Three moments where I chose one direction over another, and why."],
      blocks: [
        {
          type: "decision",
          title: "Decision 1: Why I Wanted Free Users to See Pro Features, Not Lose Them",
          hook: "When ModernCart split into Free and Pro, some features that free users already relied on were moving behind a paywall. The question was what those users would see the next time they opened their settings.",
          before: [
            p(
              "The PM shared the list of which features stayed Free and which moved to Pro. Nothing was decided yet about how Pro features would appear inside the free dashboard.",
            ),
          ],
          turning: [p("There were two options:")],
          options: [
            {
              title: "Hide Pro features completely.",
              body: "The free dashboard stays clean and simple. But a store owner who used a feature last week would open their settings and find it gone, with no explanation.",
            },
            {
              title: "Show them locked, with a PRO badge and a short upgrade note.",
              body: "The store owner can see what moved and what Pro adds, without being blocked or pushed. The trade-off is a slightly busier screen.",
            },
          ],
          after: [
            p(
              "I proposed showing them, as an option for the PM and leadership to weigh. A feature that quietly disappears feels like something was taken away. A feature that's visible but locked tells people exactly what upgrading gets them. ForceUI already used PRO badges on cards, so the pattern fit the system.",
            ),
          ],
          next: [
            p(
              "I designed PRO badges, disabled fields with an inline “Upgrade now” note, an upgrade modal, and a Free vs Pro tab comparing every feature side by side.",
            ),
          ],
          result: [
            p(
              "The team chose to keep the free version focused on free features, so Pro features stay out of view for free users. Both directions were on the table when that call was made, which is what I set out to do. It reinforced how I approach this kind of work: give decision makers clear options with the reasoning behind each, knowing the right answer depends on how the business wants to position its product.",
            ),
          ],
          media: [
            { caption: "General tab with PRO badges." },
            { caption: "Upgrade modal." },
            { caption: "Free vs Pro tab." },
          ],
        },
        {
          type: "decision",
          title: "Decision 2: Why I Added Product Suggestions to the Cart to Keep Shoppers Browsing",
          hook: "A shopper taps the cart icon before adding anything, maybe out of curiosity, maybe to check something. In ModernCart, all they found was a message saying their cart was empty.",
          before: [
            p(
              "The empty cart showed only that message, with no next step. Once items were added, the cart was just a list of what the shopper had picked.",
            ),
          ],
          turning: [p("There were two options:")],
          options: [
            {
              title: "Keep the cart as a plain list.",
              body: "Simple, nothing to distract from checkout. But an empty cart is a dead end, and a full cart misses the moment when the shopper is most ready to buy.",
            },
            {
              title: "Let the cart suggest products.",
              body: "Shoppers who open the cart are still in shopping mode, so a suggestion lets them keep going without leaving. The risk is clutter that pulls attention away from checking out.",
            },
          ],
          after: [
            p(
              "I chose to suggest products, for two reasons. For the business, every suggestion is a chance to raise the average order value. For the shopper, a suggestion turns an empty screen into something to explore: they can tap it to see the product in detail, or add it straight from the cart.",
            ),
            p(
              "The idea came from looking at competitors. [FunnelKit Cart](https://funnelkit.com/woocommerce-cart/), one of the plugins I reviewed, already suggests products inside its side cart. I kept the suggestions small so they never take over the cart.",
            ),
          ],
          next: [
            list(
              "**Empty cart:** “Your Cart Is Empty, Let's Fix That,” with a featured product the shopper can add straight from the cart, plus a Shop Now button.",
              "**Cart with items:** a “You might also like” carousel below the items, kept small so it never covers the cart. I designed it to show one or two products at a time, as styling options store owners can pick from.",
            ),
          ],
          result: [
            p(
              "The PM and the team agreed straight away, and both shipped while I was on the team. I carried the idea through the rest of the product: the popup cart uses the same suggestions, and store owners can rewrite the suggestion titles from the Text Label tab to match their store's voice.",
            ),
            p("The cart is no longer a dead end. Whether it's empty or full, it always gives the shopper something to explore."),
          ],
          media: [
            { caption: "Empty cart before." },
            { caption: "Empty cart after." },
            { caption: "Cart with the carousel." },
          ],
        },
        {
          type: "decision",
          title: "Decision 3: Why I Proposed a Popup Cart for Stores That Want the Cart Front and Center",
          hook: "ModernCart had one way to open the cart: a panel sliding in from the side. But not every store wants its cart tucked at the edge of the screen.",
          before: [p("Slide-out was the only cart type.")],
          turning: [p("While exploring new cart styles, I looked at two directions:")],
          options: [
            {
              title: "Keep only the slide-out.",
              body: "The shopper still sees the page behind it, so it feels light. But it's easy to glance past.",
            },
            {
              title: "Add a popup that opens in the center of the page.",
              body: "It gets the shopper's full attention. The trade-off is that it covers the page while it's open.",
            },
          ],
          after: [
            p(
              "Neither one is right for every store, so I proposed offering both and letting the store owner choose. Centered popup carts were already a familiar pattern in WooCommerce (for example, [WooCommerce Fast Cart](https://barn2.com/woocommerce-cart/) offers a lightbox cart in the middle of the screen), so store owners would recognize it.",
            ),
          ],
          next: [
            p(
              "I designed the full popup set: empty, empty with suggestions, and with items and suggestions in two item styles. Each one for desktop, tablet and mobile. On smaller screens the carousel drops from two products to one so the cards stay readable.",
            ),
          ],
          result: [
            p(
              "It shipped after I left, as a Cart Type setting (Slide-out or Popup). The plugin's WordPress.org listing is now named “Modern Cart: WooCommerce Side Cart & Popup Cart.”",
            ),
          ],
          media: [{ caption: "Popup set across three screen sizes." }, { caption: "Slide-out next to popup." }],
        },
      ],
    },
    {
      id: "design-system",
      nav: "Design System",
      eyebrow: "Design System",
      title: "Built on ForceUI, a Shared System I Helped Create",
      intro: [
        "Every screen in ModernCart, the dashboard and the shopper's cart, is assembled from ForceUI. Nothing was drawn from scratch.",
      ],
      blocks: [
        h3("Why ForceUI existed"),
        p(
          "When I joined Brainstorm Force, each plugin had its own design system. During this project, the team decided to bring them together into one shared system, ForceUI, and I was part of building it. It lives in Figma and as React code, so designers and developers work from the same components.",
        ),
        p(
          "One rule kept the two in sync: nobody changes a component on their own. If something needed to change, it went through a ticket, so the Figma file and the code never drifted apart.",
        ),
        h3("Four levels, all used in ModernCart"),
        p("ForceUI is built in layers, from the smallest pieces up to full page layouts. ModernCart uses every level."),
        {
          type: "cards",
          items: [
            {
              title: "Atoms",
              body: "The smallest pieces: buttons, toggles, badges, inputs, dropdowns. In ModernCart, they're the toggles on each setting, the Upgrade buttons and the badges.",
            },
            {
              title: "Molecules",
              body: "Atoms combined into a reusable unit, like a toggle with its label and description, or a dropdown with a title. Every settings row in the dashboard is one of these.",
            },
            {
              title: "Patterns",
              body: "Larger sections that repeat across products: the top bar, the sidebar, modals and cards. ModernCart's top navigation, left menu and upgrade modal all come from here.",
            },
            {
              title: "Templates",
              body: "Full page layouts. ForceUI's Admin Settings template is the shape of the ModernCart dashboard: product navigation on top, a sidebar, and cards of settings.",
            },
          ],
        },
        media("Four rows, each showing one ForceUI piece next to where it appears in ModernCart."),
        h3("Type, color and icons"),
        list(
          "**Type:** Figtree, with one scale from large display sizes down to 12px text, each in four weights.",
          "**Color:** ModernCart uses Flamingo, CartFlows' orange, because ModernCart sits under the CartFlows family.",
          "**Icons:** Lucide for general icons, plus a WordPress set so the dashboard feels at home inside WordPress.",
        ),
        media("The typography page.", "The color palette."),
        h3("The one place I bent the rule"),
        p(
          "In Styling, number fields needed their unit (px, % or ms) inside the field, so store owners always know what the number means. ForceUI's input didn't support that, so I broke the component in my design to fit a small unit badge inside it. The team shipped it as plain text instead of a badge, but the unit still sits inside the field.",
        ),
        media("The icon size field, with the unit inside."),
      ],
    },
    {
      id: "process",
      nav: "Process",
      eyebrow: "Process",
      title: "How It Came Together: One Week to Launch, Then Making It Better",
      intro: [
        "The work didn't follow a neat research, wireframe, UI order. It started with a deadline, moved into research once the product was live, and ran alongside the team building a new design system.",
      ],
      blocks: [
        h3("Week 1: getting it ready to publish"),
        p(
          "The PM's call was simple: publish ModernCart within a week. There was no time to redesign from scratch, so the goal was to make what existed feel finished.",
        ),
        p(
          "I rebuilt the screens with ForceUI components, then reviewed the developer build with the PM. I logged 20 to 30 issues in a shared Google Sheet, each with a screenshot and a note on spacing, alignment, type, color or responsiveness. Developers fixed them in parallel while I prepared the assets they needed.",
        ),
        p("The free version went live on schedule."),
        media("A few rows from the feedback sheet, with names blurred."),
        h3("After launch: learning from competitors"),
        p(
          "With the product live, the question changed from “is it ready?” to “what should it do next?” The company bought licenses for five competing cart plugins: Side Cart WooCommerce, FunnelKit Cart, Mini Cart for WooCommerce, Side Cart & Checkout, and Flycart. I installed each one on a demo site and used it as a store owner would, comparing settings, features and how much store owners could customize.",
        ),
        p(
          "That review shaped most of what came next: preset cart icons and custom icon upload, cart position controls, style options for the cart, header and order summary, and product suggestions in the cart.",
        ),
        media("A side-by-side of two or three competitor settings pages."),
        h3("Turning ideas into tickets"),
        p(
          "I shared what I found with the team, and the PM decided what to build first. I wrote about 15 Jira tickets, one per feature, each with a description and the designs. The Figma file was organized the same way, one section per ticket, so anyone could match a design to its ticket.",
        ),
        media("The Figma page organized by ticket."),
        h3("Planning the Free and Pro split"),
        p(
          "The team then started planning a Free and Pro version. The PM decided which features went where, and I designed how Pro features would appear to free users (Decision 1).",
        ),
        h3("What I assumed"),
        p("There were no interviews or usability tests on this project, so a few choices rest on assumptions I'd want to test:"),
        list(
          "Shoppers who open the cart are still in shopping mode, so a suggestion helps more than it distracts.",
          "Store owners want to change the cart's look and words without touching code.",
          "Defaults shown next to each setting make store owners more willing to experiment.",
        ),
        h3("Why there were no wireframes"),
        p(
          "ForceUI already had the pieces I needed, so I worked in high fidelity from the start. Sketching boxes would have meant redrawing components that already existed. The trade-off was less room to explore wild ideas early, which is why the competitor review mattered so much.",
        ),
      ],
    },
    {
      id: "future-scope",
      nav: "Future Scope",
      eyebrow: "Future Scope",
      title: "Where ModernCart Could Go Next",
      intro: [
        "Not everything I proposed was built while I was there. These three ideas came out of my competitor review, and the team shipped them after I moved on.",
      ],
      blocks: [
        {
          type: "cards",
          items: [
            {
              title: "A live preview in the dashboard",
              body: "Store owners were changing colors, icons and sizes without seeing the result until they opened their storefront. Competitors showed a preview right next to the settings, so I recommended the same for ModernCart. The team later added a cart preview to the dashboard, with a view of the floating cart icon and of the cart itself, both empty and with items ([changelog, version 1.0.8](https://wordpress.org/plugins/modern-cart/)).",
            },
            {
              title: "Custom icon upload",
              body: "The preset icons cover most stores, but a brand with its own icon style still couldn't match it. I proposed letting store owners upload their own icon. It now sits in the Floating Cart Icon tab, under the preset icons.",
            },
            {
              title: "Cart header styling",
              body: "The competitor review showed that stores wanted control over the top of the cart, not just its colors. I suggested header styling as one of the style options. The team added cart header customization to the Styling tab ([changelog, version 1.0.1](https://wordpress.org/plugins/modern-cart/)).",
            },
          ],
        },
      ],
    },
    {
      id: "learnings",
      nav: "Learnings",
      eyebrow: "Learnings & Feedback",
      title: "What This Project Taught Me",
      blocks: [
        {
          type: "learnings",
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
      ],
    },
    {
      id: "outcome",
      nav: "Outcome",
      eyebrow: "Outcome",
      title: "From an Unreleased Build to a Cart That Keeps Shoppers Going",
      intro: [
        "ModernCart started as a working build that nobody had designed for. In one week it was ready to publish. In the weeks after, it gained a dashboard organized around tasks, a cart that suggests products, and a second cart type. Several of those ideas shipped after I left, and today the plugin has 50K+ active installs.",
      ],
      blocks: [
        feedbackLine(
          "If you've designed settings for a plugin or worked on a WooCommerce store, I'd love to hear how you would have handled the Free and Pro question.",
        ),
      ],
    },
  ],
};

export const caseStudies: CaseStudy[] = [cartAbandonment, modernCart];
