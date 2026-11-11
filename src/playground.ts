// Playground: things built to explore ideas.
// "live" items run inside the site from public/playground/<folder>/index.html.
// "template" items are placeholders, ready to switch to live once a playable build exists:
// add the build under public/playground/<folder>/, set `src`, and change status to "live".

export type PlaygroundIcon = "cube" | "shirt" | "notebook" | "chat" | "exam";

export type PlaygroundItem = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: "live" | "template";
  icon: PlaygroundIcon;
  tags: string[];
  src?: string;
  // Screenshot shown as the animated preview (public/assets/playground/...).
  preview?: string;
  // Animated mock used for template items that have no playable build yet.
  mock?: "chat" | "quiz";
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
    preview: "/assets/playground/photos-to-3d.jpg",
    note: "Loads an image model on first use, so it can take a moment.",
  },
  {
    id: "virtual-try-on",
    title: "Virtual Try-On",
    tagline: "See a product on yourself before you buy it.",
    description:
      "A phone product page with a Try it on button. Take or upload a photo and an AI model dresses you in the garment, while a side panel shows what the model receives and how far along it is.",
    status: "live",
    icon: "shirt",
    tags: ["AI", "Ecommerce", "Mobile"],
    src: "/playground/try-on/index.html",
    preview: "/assets/playground/virtual-try-on.jpg",
    note: "Runs on a free AI server, so a result takes 30 to 90 seconds.",
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
    preview: "/assets/playground/weave-notebook.jpg",
    note: "Saves only in your browser.",
  },
  {
    id: "sop-assistant",
    title: "SOP Assistant",
    tagline: "Ask a question, get a short answer from a long handbook.",
    description:
      "An assistant that sits inside an internal tool. It searches a long operating procedure with hybrid keyword and semantic ranking, then writes a short summary with key points, rules, tables and images from only the matching sections.",
    status: "live",
    icon: "chat",
    tags: ["AI", "Search", "Internal tool"],
    src: "/playground/sop-assistant/index.html",
    preview: "/assets/playground/sop-assistant.jpg",
    note: "Demo with a made-up coffee chain handbook; summaries run in your browser.",
  },
  {
    id: "ai-interview-practice",
    title: "AI Interview Practice",
    tagline: "Practice interviews with questions, feedback and a final report.",
    description:
      "Pick a topic, difficulty and mode. Answer multiple-choice questions with instant explanations, or type open answers and get scored feedback, a model answer and a hiring-manager style report at the end.",
    status: "live",
    icon: "exam",
    tags: ["AI", "Learning", "Full stack"],
    src: "/playground/ai-interview/index.html",
    preview: "/assets/playground/ai-interview-practice.jpg",
    note: "Demo version: uses sample questions and scores answers in your browser.",
  },
];
