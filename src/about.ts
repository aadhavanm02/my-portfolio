// About page content.
// Anything set to `null` or marked `placeholder: true` shows as a "to be added" slot,
// so the layout is ready and only the details need filling in.

export type AboutFact = { label: string; value: string | null };

export type JourneyItem = {
  period: string | null;
  title: string;
  place: string | null;
  body: string;
  tags?: string[];
  placeholder?: boolean;
};

export type Principle = { title: string; body: string };

export type Hobby = { title: string; body: string; icon: "sketch" | "chess" | "camera" };

export const about = {
  // Shown large at the top of the page.
  headline: "I design products people can understand at a glance, and systems teams can build on.",
  intro:
    "I'm Aadhavan, a product designer with 4+ years of experience. I've worked on WordPress and WooCommerce products used by hundreds of thousands of stores, from Astra and Spectra to CartFlows, ModernCart and Cart Abandonment Recovery.",
  // Put a photo in public/assets (e.g. /assets/aadhavan.jpg) and set it here.
  photo: null as string | null,
  facts: [
    { label: "Role", value: "Product Designer" },
    { label: "Experience", value: "4+ years" },
    { label: "Currently", value: null },
    { label: "Based in", value: null },
  ] satisfies AboutFact[],
  journey: [
    {
      period: null,
      title: "Product Designer",
      place: "Brainstorm Force",
      body: "Designed for products like Astra and Spectra, then the CartFlows family: ModernCart and Cart Abandonment Recovery. Helped build ForceUI, the shared design system.",
      tags: ["Astra", "Spectra", "CartFlows", "ModernCart", "Cart Abandonment Recovery", "ForceUI"],
    },
    {
      period: null,
      title: "Earlier experience",
      place: null,
      body: "Earlier roles, internships or freelance work will go here.",
      placeholder: true,
    },
    {
      period: null,
      title: "Education",
      place: null,
      body: "Degree, college and anything that shaped how you got into design.",
      placeholder: true,
    },
  ] satisfies JourneyItem[],
  // Taken from the case study learnings.
  principles: [
    { title: "Bring options, not verdicts.", body: "Clear trade-offs make ideas easier to decide on, whichever way it goes." },
    { title: "Let the content choose the pattern.", body: "A quick edit and a detailed read need different homes." },
    { title: "A visible gap beats a clever interaction.", body: "Show what matters without making people hunt for it." },
    { title: "Know the system's rules well.", body: "That's how you know when bending one is worth it." },
  ] satisfies Principle[],
  focus: ["User research", "Usability testing", "Design systems", "Interaction design", "Dashboards", "AI-assisted prototyping"],
  hobbies: [
    { title: "Sketching", body: "Where most ideas start, before any pixels.", icon: "sketch" },
    { title: "Chess", body: "Thinking a few moves ahead, on the board and in flows.", icon: "chess" },
    { title: "Photography", body: "Practice in framing, light and noticing details.", icon: "camera" },
  ] satisfies Hobby[],
};
