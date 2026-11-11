// Playground: things built to explore ideas.
// "live" items run inside the site from public/playground/<folder>/index.html.
// "template" items are placeholders, ready to switch to live once a playable build exists:
// add the build under public/playground/<folder>/, set `src`, and change status to "live".

export type PlaygroundIcon = "cube" | "sneaker" | "notebook" | "chat" | "exam";

export type PlaygroundItem = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: "live" | "template";
  icon: PlaygroundIcon;
  tags: string[];
  src?: string;
  note?: string;
  pending?: string;
};

export const playgroundItems: PlaygroundItem[] = [
  {
    id: "photos-to-3d",
    title: "Photos to 3D",
    tagline: "Turn product photos into a 3D model, right in the browser.",
    description:
      "A merchant dashboard where you add up to four product photos and get a 3D model you can rotate on a phone product page. It cuts the product out of each photo, builds a shape from the outlines, and wraps the photos onto it.",
    status: "live",
    icon: "cube",
    tags: ["3D", "Computer vision", "Ecommerce"],
    src: "/playground/photos-to-3d/index.html",
    note: "Loads an image model on first use, so it can take a moment.",
  },
  {
    id: "pdp-3d-viewer",
    title: "PDP 3D Viewer",
    tagline: "A product page where the shoe turns in your hand.",
    description:
      "A mobile product detail page for a running shoe, with a 3D model in the gallery. Drag to rotate, pinch to zoom, and see it from every side before buying.",
    status: "live",
    icon: "sneaker",
    tags: ["3D", "Mobile", "Product page"],
    src: "/playground/pdp-3d-viewer/index.html",
    note: "Loads a 10MB 3D model.",
  },
  {
    id: "weave-notebook",
    title: "Weave Notebook",
    tagline: "Docs, tasks and links that connect to each other.",
    description:
      "A small notebook where anything can be linked to anything: write docs, add tasks with reminders, save links into folders, and mention one inside another. Try it with the example items.",
    status: "live",
    icon: "notebook",
    tags: ["Productivity", "Responsive", "Local-first"],
    src: "/playground/weave-notebook/index.html",
    note: "Saves only in your browser.",
  },
  {
    id: "sop-assistant",
    title: "SOP Assistant",
    tagline: "Ask a question, get the exact SOP answer.",
    description:
      "An in-page assistant for a video QC team. It searches a long operating procedure with hybrid keyword and semantic ranking, then has an AI write a short summary from only the matching sections.",
    status: "template",
    icon: "chat",
    tags: ["AI", "Search", "Internal tool"],
    pending: "Runs inside an internal tool with private content. A demo with sample content is on the way.",
  },
  {
    id: "ai-interview-practice",
    title: "AI Interview Practice",
    tagline: "Practice interviews on any topic with AI questions and feedback.",
    description:
      "Generates multiple-choice or open-ended interview questions for any topic and difficulty, evaluates typed answers, and writes a hiring-manager style report.",
    status: "template",
    icon: "exam",
    tags: ["AI", "Learning", "Full stack"],
    pending: "Needs its own server and AI key, so it can't run inside this site yet.",
  },
];
