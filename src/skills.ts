// Skills page content. Every proof points at a real case study section,
// so the page reads as evidence rather than a list of claims.
// `study` is a case study slug and `section` is that section's id (see caseStudies.ts).

export type SkillGroup = "Research & Strategy" | "UX & Interaction" | "Visual & Systems" | "Delivery & Collaboration";

export type SkillVisual =
  | "nav"
  | "interaction"
  | "chart"
  | "layers"
  | "research"
  | "cart"
  | "options"
  | "timeline"
  | "devices"
  | "writing";

export type SkillProof = {
  study: string;
  section: string;
  sectionLabel: string;
  text: string;
};

export type Skill = {
  id: string;
  name: string;
  group: SkillGroup;
  definition: string;
  visual: SkillVisual;
  proofs: SkillProof[];
};

export const skillGroups: SkillGroup[] = [
  "Research & Strategy",
  "UX & Interaction",
  "Visual & Systems",
  "Delivery & Collaboration",
];

export const skills: Skill[] = [
  {
    id: "information-architecture",
    name: "Information architecture",
    group: "UX & Interaction",
    definition: "Structuring a product so people find things where they expect them, and so it has room to grow.",
    visual: "nav",
    proofs: [
      {
        study: "cart-abandonment-recovery",
        section: "critical-decisions",
        sectionLabel: "Decision 01",
        text: "Weighed four navigation patterns and chose a Reports dropdown, so new reports never crowd the top bar.",
      },
      {
        study: "modern-cart",
        section: "solution",
        sectionLabel: "Solution",
        text: "Regrouped scattered settings into five tabs, each with one job.",
      },
    ],
  },
  {
    id: "interaction-design",
    name: "Interaction design",
    group: "UX & Interaction",
    definition: "Choosing the right pattern for the moment: a quick edit, a detailed read, or a small action.",
    visual: "interaction",
    proofs: [
      {
        study: "cart-abandonment-recovery",
        section: "critical-decisions",
        sectionLabel: "Decision 02",
        text: "Moved Email Logs from a drawer to a full page once it was clear this was a detailed read, not a quick edit.",
      },
      {
        study: "modern-cart",
        section: "solution",
        sectionLabel: "Solution",
        text: "Reworked the coupon field from a question into an action: a link, a field, then a removable tag.",
      },
    ],
  },
  {
    id: "data-visualization",
    name: "Dashboard & data design",
    group: "Visual & Systems",
    definition: "Turning numbers into a story people can act on at a glance.",
    visual: "chart",
    proofs: [
      {
        study: "cart-abandonment-recovery",
        section: "critical-decisions",
        sectionLabel: "Decision 03",
        text: "Chose a fixed chart comparing recoverable and recovered revenue over a hidden, click-to-switch chart.",
      },
      {
        study: "cart-abandonment-recovery",
        section: "solution",
        sectionLabel: "Solution",
        text: "Added open and click rates beside each follow-up email, so owners can see which ones work.",
      },
    ],
  },
  {
    id: "design-systems",
    name: "Design systems",
    group: "Visual & Systems",
    definition: "Building and using shared components so products look and behave like one family.",
    visual: "layers",
    proofs: [
      {
        study: "modern-cart",
        section: "design-system",
        sectionLabel: "Design System",
        text: "Helped build ForceUI, used at every level from atoms to templates, and knew when to bend one of its rules.",
      },
      {
        study: "cart-abandonment-recovery",
        section: "design-system",
        sectionLabel: "Design System",
        text: "Rebuilt a whole admin on ForceUI patterns: sub-menus, drawers, status chips and setting cards.",
      },
    ],
  },
  {
    id: "competitive-research",
    name: "Competitive research",
    group: "Research & Strategy",
    definition: "Learning what already exists, and where the gaps are, before deciding what to build.",
    visual: "research",
    proofs: [
      {
        study: "modern-cart",
        section: "process",
        sectionLabel: "Process",
        text: "Installed five competing cart plugins and used each one as a store owner would. That review shaped most features.",
      },
      {
        study: "cart-abandonment-recovery",
        section: "process",
        sectionLabel: "Process",
        text: "Studied competing recovery plugins on a Figma References board before turning ideas into a feature list.",
      },
    ],
  },
  {
    id: "product-thinking",
    name: "Product & business thinking",
    group: "Research & Strategy",
    definition: "Designing for what the user needs and what the business needs, at the same time.",
    visual: "cart",
    proofs: [
      {
        study: "modern-cart",
        section: "critical-decisions",
        sectionLabel: "Decision 02",
        text: "Turned the empty cart into product suggestions: something to explore for shoppers, a bigger order for the store.",
      },
      {
        study: "cart-abandonment-recovery",
        section: "solution",
        sectionLabel: "Solution",
        text: "Designed how Pro features appear to free users in five places, all of which shipped.",
      },
    ],
  },
  {
    id: "stakeholder-collaboration",
    name: "Stakeholder collaboration",
    group: "Delivery & Collaboration",
    definition: "Bringing clear options and trade-offs, so decisions are easy to make together.",
    visual: "options",
    proofs: [
      {
        study: "modern-cart",
        section: "critical-decisions",
        sectionLabel: "Decision 01",
        text: "Proposed showing Pro features locked. The team chose differently, and both options were weighed, which was the goal.",
      },
      {
        study: "cart-abandonment-recovery",
        section: "process",
        sectionLabel: "Process",
        text: "Worked through most decisions with the PM and developers, sharing versions and talking through trade-offs.",
      },
    ],
  },
  {
    id: "shipping",
    name: "Shipping under a deadline",
    group: "Delivery & Collaboration",
    definition: "Deciding what “done” means when time is short, and keeping developers unblocked.",
    visual: "timeline",
    proofs: [
      {
        study: "modern-cart",
        section: "process",
        sectionLabel: "Process",
        text: "Took an unreleased build to launch in one week, logging 20 to 30 screenshot-backed issues for parallel fixes.",
      },
      {
        study: "modern-cart",
        section: "process",
        sectionLabel: "Process",
        text: "Wrote about 15 Jira tickets after launch, each matched to its own section in Figma.",
      },
    ],
  },
  {
    id: "responsive-design",
    name: "Responsive design",
    group: "Visual & Systems",
    definition: "Making one design hold up on every screen, not just the one it was drawn on.",
    visual: "devices",
    proofs: [
      {
        study: "modern-cart",
        section: "critical-decisions",
        sectionLabel: "Decision 03",
        text: "Designed the popup cart set for desktop, tablet and mobile, dropping the carousel to one product on small screens.",
      },
    ],
  },
  {
    id: "ux-writing",
    name: "UX writing",
    group: "UX & Interaction",
    definition: "Choosing words that guide people, and letting products speak in their own voice.",
    visual: "writing",
    proofs: [
      {
        study: "modern-cart",
        section: "walkthrough",
        sectionLabel: "Walkthrough",
        text: "Made every word a shopper sees editable, pre-filled with sensible defaults, from the cart heading to the empty state.",
      },
      {
        study: "modern-cart",
        section: "critical-decisions",
        sectionLabel: "Decision 02",
        text: "Rewrote the empty cart from a dead-end message into “Your Cart Is Empty, Let's Fix That.”",
      },
    ],
  },
];

export const tools = ["Figma", "ForceUI", "Jira", "Google Sheets", "React", "AI-assisted prototyping"];
