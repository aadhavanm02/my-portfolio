// Playground: things built to explore ideas.
// Every project lives in its own folder: public/playground/projects/<name>/.
//   index.html  the page shown on the site (a phone or browser frame around the app, or the app itself)
//   app/        the app, when it is shown inside a frame
// Shared pieces (the iPhone mockup, the walkthrough player) live in public/playground/shared/.
// Projects sit under projects/ so their folders never cover the /playground/<id> case study pages.
// "live" items run from `src`. "template" items are placeholders until a playable build exists.
// Set `hidden: true` to keep a project in the code but leave it off the page.

export type PlaygroundIcon = "cube" | "shirt" | "notebook" | "chat" | "exam" | "pill" | "briefcase" | "canvas" | "books";

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
  // A short case study, shown on its own page at /playground/<id>.
  study?: PlaygroundStudy;
  // Kept in the code but not shown on the page.
  hidden?: boolean;
};

export type PlaygroundStudy = {
  kind: string;
  // How the demo works, shown above it.
  demoNote: string;
  // Taller demos (desktop walkthroughs) get more room.
  demoHeight?: number;
  intro: string[];
  facts: Array<{ label: string; value: string }>;
  problem: { title: string; body: string[] };
  audience: Array<{ name: string; body: string }>;
  features: Array<{ title: string; body: string }>;
  decisions: Array<{ title: string; body: string }>;
  edges: { intro: string; items: string[] };
  images: Array<{ src: string; size: [number, number]; caption: string }>;
  next: string[];
};

const allPlaygroundItems: PlaygroundItem[] = [
  {
    id: "library",
    title: "The Library",
    tagline: "A calm neighbourhood library you walk through, borrow from and read in.",
    description:
      "A 3D library that runs in the browser on desktop and phone. Make a library card, walk the racks, pick up real public-domain books, sign the register at the issue desk and read with real page turns: two pages on a big screen, one on a phone.",
    status: "live",
    icon: "books",
    tags: ["3D", "Web and phone", "Reading"],
    src: "/playground/projects/library/index.html",
    preview: "/assets/playground/library.jpg",
    note: "Real-time 3D: it takes a few seconds to open, and works best on a recent phone or laptop.",
    study: {
      kind: "Concept · 3D web app for desktop and phone",
      demoNote: "This is the working app. Switch between desktop and iPhone, make your library card and walk in. Arrow keys or WASD on desktop, the joystick on a phone. Only one view runs at a time, and both share your progress.",
      demoHeight: 860,
      intro: [
        "Reading apps show books as a grid of covers. You never wander, never notice the book next to the one you came for, and never have the small ritual of borrowing something and taking it home.",
        "The Library puts that back. It is a warm, quiet room you walk through in the browser, with signed racks, a librarian at the issue desk and a reading table by the window. Every book in it is in the public domain, so the openings you read are the real text.",
      ],
      facts: [
        { label: "Type", value: "Self-initiated concept" },
        { label: "Platforms", value: "Web, on desktop and phone" },
        { label: "Built with", value: "Real-time 3D in the browser" },
        { label: "Books", value: "40 public-domain titles in 12 sections" },
      ],
      problem: {
        title: "Reading apps are lists. Libraries are places.",
        body: [
          "The best part of a library is not search. It is walking past a shelf and stopping, the librarian who remembers you, and the stamp that makes a book yours for two weeks.",
          "The challenge was to make that feel calm rather than like a game: no score, no quests, no clutter over the room. And it had to work with one thumb on a phone as well as with a keyboard on a laptop.",
        ],
      },
      audience: [
        { name: "Readers who miss browsing", body: "People who read on a screen but miss stumbling on a book. The racks are grouped like a real library, so wandering is the feature." },
        { name: "Students meeting the classics", body: "Austen, Tagore, Doyle, Keats and more, with their real opening pages, a link to the full text, and no sign-up." },
        { name: "People on a phone", body: "A joystick for walking, a card that folds out of the way, and a reader that becomes a single page with large, comfortable text." },
      ],
      features: [
        { title: "Your library card", body: "Pick a name and a look before you walk in. The card stays in the corner with what you are reading, what is in your hands and what you have borrowed." },
        { title: "A room to walk through", body: "Twelve signed sections, from Classics and Poetry to Indian writing and Science fiction. A map in the corner, name tags on people, and a regular reading in the armchair." },
        { title: "The issue desk", body: "Hold up to five books, then sign the register. Your name goes in by hand and the librarian stamps it ISSUED, due in 14 days." },
        { title: "The reading table", body: "Sit down and read for an hour without borrowing. Your seat is saved while the hour runs, even if you get up." },
        { title: "Take them home", body: "Walk out the front door with your borrowed books and you arrive in your own room, with a desk and a lamp, to keep reading." },
        { title: "A reader that feels like paper", body: "Page curls you can drag, light, sepia and night themes, text size, and ribbon bookmarks. On a big screen the book opens as two pages; on a phone it is one." },
      ],
      decisions: [
        { title: "A library card, not a game HUD", body: "Everything on top of the room is a library object: a brass plaque for where you are, a library card for your status, a stamp-red badge for counts. Cream paper, library green and stamp red, with a serif for titles and another for reading." },
        { title: "Real text, or honest samples", body: "Books marked with a ribbon open with their real public-domain text. The others say Sample pages up front and link to the full book on Project Gutenberg, instead of pretending." },
        { title: "Limits that feel like a library", body: "You can only carry five books, and borrowing means signing the register. The limits are explained the way a librarian would: “Your hands are full. Register or put some back first.”" },
        { title: "Built for one thumb", body: "On a phone the joystick sits under the right thumb, the card folds into a pill, the map grows when tapped, and prompts sit above the thumb zone. Graphics run a little lighter on touch screens to save battery." },
        { title: "Two pages on desktop, one on a phone", body: "A wide screen opens the book flat, and the right-hand page turns over the spine with the next page printed on its back. A phone keeps a single page so the text never gets small." },
        { title: "Never break on a bad save", body: "Progress is saved in the browser and checked every time the app opens, so an old or edited save can't break it. If a device can't run 3D it says so plainly, and reduced motion turns the page-turn animation off." },
      ],
      edges: {
        intro: "The moments that need a clear answer, written in the librarian's voice.",
        items: [
          "Hands full: register at the desk or put a book back",
          "Trying to read a borrowed book while still at the library",
          "The hour at the reading table runs out",
          "Returning borrowed books at the desk",
          "No name on the card: you visit as a guest with a friendly made-up name",
          "Bookmarks, last page and progress kept for every book",
          "Start over clears the card, books and bookmarks on this device",
          "A device that can't start 3D gets a plain message instead of a blank screen",
        ],
      },
      images: [
        { src: "/assets/playground/library/setup.webp", size: [1600, 1000], caption: "Making your library card. The reader behind it updates as you pick." },
        { src: "/assets/playground/library/hall.webp", size: [1600, 1000], caption: "The main hall: signed racks, people with name tags and the library card in the corner." },
        { src: "/assets/playground/library/desk.webp", size: [1600, 1000], caption: "The issue desk and the reading table by the window." },
        { src: "/assets/playground/library/mybooks.webp", size: [1600, 1000], caption: "My books: what is in your hands and what you have borrowed, with due dates." },
        { src: "/assets/playground/library/mobile.webp", size: [780, 1688], caption: "On a phone: joystick, a folded library card and a map that grows when tapped." },
      ],
      next: [
        "Full texts for every book, streamed from Project Gutenberg",
        "A list view of the racks for people who would rather not walk in 3D",
        "Saving your card across devices",
        "More rooms: a children's corner and a quiet study",
      ],
    },
  },
  {
    id: "shortlist",
    title: "Shortlist",
    tagline: "Daily job matches, a tailored resume for each one, and referrals from people inside.",
    description:
      "A job search app for India with a web and an Android version. It ranks up to 20 jobs a day, rewrites your resume for each one without inventing anything, and lets verified employees refer one person at a time.",
    status: "live",
    icon: "briefcase",
    tags: ["AI", "Web and Android", "Two-sided"],
    src: "/playground/projects/shortlist/index.html",
    preview: "/assets/playground/shortlist.jpg?v=2",
    note: "The working app on web and iPhone, with live AI resume reading, tailoring and refining.",
    study: {
      kind: "Concept · web and Android",
      demoNote: "This is the working app. Switch between the web app and the iPhone, add your resume or use the sample profile, then tailor it to a job. AI runs live on Gemini; jobs and referrers are example companies.",
      demoHeight: 860,
      intro: [
        "Job hunting in India means scrolling four job boards, rewriting the same resume for every role, and messaging strangers on LinkedIn for a referral that rarely comes.",
        "Shortlist puts all three in one place. It finds the best matches every day, tailors your resume to each one, and connects you with someone inside the company who has agreed to refer.",
      ],
      facts: [
        { label: "Type", value: "Self-initiated concept" },
        { label: "Platforms", value: "Web app and Android" },
        { label: "Screens", value: "97, including 40+ edge cases" },
        { label: "AI", value: "Resume tailoring and refining" },
      ],
      problem: {
        title: "Three jobs that shouldn't be separate",
        body: [
          "Finding a role, tailoring a resume and getting referred are usually three different apps and a lot of copy and paste. Referrals are the most valuable and the least fair: they depend on who you know, and the people willing to refer get flooded.",
          "So the design had two sides to serve. Candidates need a clear, honest path to a referral. Referrers need a way to help without being spammed.",
        ],
      },
      audience: [
        { name: "Job seekers", body: "Want fewer, better matches and a resume that fits each role, without the AI making things up." },
        { name: "Referrers", body: "Employees happy to help someone in, as long as it takes minutes and stays one person at a time." },
      ],
      features: [
        { title: "20 matches a day", body: "Ranked by title, skills, experience and salary from LinkedIn, Naukri, Indeed and company pages, each with a match score and referral signals." },
        { title: "A resume for every job", body: "AI suggests changes you accept or reject one by one, a single chat message refines the rest, and it downloads as a one-page PDF." },
        { title: "Referrals, one at a time", body: "A verified employee posts an opening. The first person in line gets reviewed, and the opening locks while they're being referred." },
        { title: "A clear status at every step", body: "Candidates follow a timeline from request to outcome, with a chat thread beside it." },
      ],
      decisions: [
        { title: "One person per opening, first come first served", body: "Referrers refer one candidate at a time and the opening locks while they do. It protects referrers from a flood and gives candidates a fair queue instead of a lottery." },
        { title: "Openings reopen on their own", body: "If a candidate isn't selected, withdraws, or a request gets no reply in 7 days, the opening reopens and the next person moves up. Nobody waits on a slot forever." },
        { title: "AI that only rewrites what's true", body: "Tailoring suggests edits rather than writing a new resume, and every change can be rejected. The rule on screen is simple: it never invents anything." },
        { title: "Limits that keep it fair", body: "Five active requests per candidate, one request per opening, and a 7-day timer on every reply." },
      ],
      edges: {
        intro: "Under every step of the flow sits what can go wrong and what happens next. A few of them:",
        items: [
          "Someone requested the same opening first, so the draft is saved and you're notified when it frees up",
          "The referrer is busy, so the opening shows as locked with a notify-me option",
          "A request gets no reply in 7 days, so it expires and the opening reopens",
          "The referrer leaves the company, so their openings pause until they verify again",
          "The tailored resume goes over one page, so you trim before sending",
          "The daily AI limit is reached, so a lighter model or a wait is offered",
        ],
      },
      images: [
        { src: "/assets/playground/shortlist/flow.webp", size: [2400, 1540], caption: "The full flow for both sides, an opening's states, and what happens when each step goes wrong." },
      ],
      next: [
        "Connect live AI for tailoring and the refine chat, through a small server so no key lives in the page.",
        "Test the referral queue with a few real referrers to see whether one-at-a-time feels fair from both sides.",
      ],
    },
  },
  {
    id: "strip",
    title: "Strip",
    tagline: "Track your tablets the way they look in your hand.",
    description:
      "In India most medicine comes in foil strips, yet tracker apps show a number and a list. Strip scans the real strip, rebuilds it on screen, and lets you pop a tablet to log a dose.",
    status: "live",
    icon: "pill",
    tags: ["Health", "Mobile", "Accessibility"],
    src: "/playground/projects/strip/index.html",
    preview: "/assets/playground/strip.jpg",
    note: "Clickable walkthrough of the designs with a made-up patient.",
    study: {
      kind: "Concept · mobile",
      demoNote: "Pick a story and tap through the phone, or use Next step. Lakshmi's story covers a month, and each “What if” shows one edge case.",
      intro: [
        "Most medicine in India comes in foil strips. Tracker apps turn that into a number and a checklist, so the thing in your hand and the thing on screen never match.",
        "Strip scans the real strip, rebuilds it on screen, and lets you pop a tablet to log a dose. What's left is always visible, the way it is on the foil.",
      ],
      facts: [
        { label: "Type", value: "Personal exploration, 2026" },
        { label: "Platform", value: "Mobile, in English, Tamil and Hindi" },
        { label: "Screens", value: "50 across 2 stories and 5 what-ifs" },
        { label: "Main persona", value: "Lakshmi, managing 4 medicines" },
      ],
      problem: {
        title: "Medicine apps don't look like medicine",
        body: [
          "Lakshmi leaves the clinic with a handwritten prescription and a bag of strips. Her busy mornings come down to one question: did I take it or not? A list of names and times doesn't answer it. The strip does.",
          "Setting up also has to take a minute, not a typing session, for someone who might be 60 and not comfortable with apps.",
        ],
      },
      audience: [
        { name: "Lakshmi", body: "On four medicines after a clinic visit, with a son, Arun, who checks in from his own phone." },
        { name: "Raghavan", body: "64, on BP tablets for two years with no recent doctor visit, plus a family medicine box at home." },
      ],
      features: [
        { title: "Scan the prescription", body: "A photo of the doctor's handwritten note becomes a plan, with anything unclear, like which day for a weekly dose, asked as one question." },
        { title: "Scan the back of each strip", body: "One scan of the silver side reads the name and expiry. The strip size comes from a database, so there's no layout to pick." },
        { title: "Pop to log a dose", body: "The strip on screen matches the real one. Tap a pocket and it opens, with an undo if it was a mistake." },
        { title: "Family and the doctor", body: "Arun sees a running-low alert and can send a refill to her chemist. Before a follow-up, the doctor gets a strip report of doses taken, late and missed." },
      ],
      decisions: [
        { title: "One scan instead of two", body: "Scanning both sides and choosing a layout was too much for someone at 60. Now it's a single scan of the back, and the database fills in the strip size." },
        { title: "The strip updates when you take a dose", body: "Early designs logged a dose without changing the strip. Now the pockets visibly open, so the screen always matches what's in her hand." },
        { title: "Every gap in the journey got a screen", body: "A journey map from clinic to follow-up showed missing pieces: no camera step for the prescription, a video call with no screen, a refill with no way to send it. Each one got designed." },
        { title: "Same glance for every form", body: "Syrups, bottles, insulin pens and eye drops get the same treatment: a level line drops by 5 ml, a cartridge shows units left, drops show days until they must be thrown away." },
      ],
      edges: {
        intro: "Five short “What if” stories cover the moments that break a simple tracker:",
        items: [
          "The foil is torn while scanning, so the name can't be read and she types it",
          "Some tablets are already used, so she counts what's left",
          "She isn't sure she took it, so the strip itself answers the question",
          "The dose is half a tablet, so the other half goes back in its pocket and stays visible",
          "A strip in the stack has expired, so it's set aside and a fresh one comes up",
        ],
      },
      images: [
        { src: "/assets/playground/strip/journey.webp", size: [2000, 1000], caption: "The journey from clinic to follow-up, with the gap found at each stage and how it was fixed." },
        { src: "/assets/playground/strip/stripkit.webp", size: [2000, 1400], caption: "One component draws any strip from four facts: name, tablet colour, tablets per strip and how many are left." },
      ],
      next: [
        "Build the strip as a real component from those four facts, so any medicine renders correctly.",
        "Test the one-scan setup with older users, in Tamil and Hindi as well as English.",
      ],
    },
  },
  {
    id: "quanvas",
    title: "Quanvas",
    tagline: "A blank page that explains what you write, the photos you add and the links you paste.",
    description:
      "A note-taking app where any line can become a card. Type “moong dal 1kg” and tap Look up to see what it is, how it looks and how to use it. Recipes turn into steps and shopping lists.",
    status: "live",
    icon: "canvas",
    tags: ["AI", "Mobile", "Working app"],
    src: "/playground/projects/quanvas/index.html",
    preview: "/assets/playground/quanvas.jpg",
    note: "The working app, with live AI look-ups, recipes and photo answers from Gemini.",
    study: {
      kind: "Working prototype · mobile",
      demoNote: "This is the real app running in a phone frame. Type a line, press Enter and tap Look up. Answers come live from Gemini, so they take a few seconds and can be wrong.",
      intro: [
        "People write down things they don't fully understand: an ingredient a relative mentioned, a spice in a photo, a link someone sent. Then they open another app to find out what it is.",
        "Quanvas keeps both on one page. Write anything, and the lines that look searchable get a small Look up pill. One tap turns the line into a card that explains it.",
      ],
      facts: [
        { label: "Type", value: "Working prototype" },
        { label: "Platform", value: "Mobile web app" },
        { label: "Screens designed", value: "28 plus 4 rules and states boards" },
        { label: "AI", value: "Look-ups, summaries, explanations" },
      ],
      problem: {
        title: "Writing and understanding live in different apps",
        body: [
          "A grocery list, a recipe or a list of questions is half notes and half searches. Switching apps for every unfamiliar word breaks the flow, and search results don't come back to where you wrote them.",
          "The hard part wasn't the look-up itself. It was deciding when a line should become a search at all, without the app guessing wrong and searching your personal notes.",
        ],
      },
      audience: [
        { name: "Home cooks", body: "Writing a shopping list or a dish they want to try, often with ingredient names in more than one language." },
        { name: "Curious note-takers", body: "Anyone who saves photos, files and links to understand later." },
      ],
      features: [
        { title: "Look up any line", body: "Type, press Enter, tap the pill. The line becomes a card with what it is, how it looks and how to use it, with sources." },
        { title: "Recipes with steps", body: "A dish opens as a recipe block with visual steps and a cook mode, and its ingredients can become a shopping list." },
        { title: "Shop online or in a store", body: "A to-do list turns into one shopping block. Buy it online, or shop in store with photos, local names and a big-text view to show the shopkeeper." },
        { title: "Photos, files and links", body: "Each one lands on the canvas with its own pills: What is this, Find where it's from, Summarise, Explain." },
      ],
      decisions: [
        { title: "A pill you tap, not automatic search", body: "Three triggers were explored: a smart margin icon, searching every line in some canvas types, and a Look up pill. The pill won because nothing is ever searched without a tap, so there are no wrong searches." },
        { title: "Enter always makes a plain line", body: "Typing stays typing. The pill appears only after Enter, and only on lines that look searchable, so reminders and personal notes never get one." },
        { title: "Ignored pills get out of the way", body: "An unused pill shrinks to a small dot after 4 seconds, and you can swipe it away or say “Stop suggesting this”. Long-pressing any line still offers Look up." },
        { title: "Maths and links get special handling", body: "Sums like 120 + 85 + 240 show their answer inline, worked out on the phone. A pasted link becomes a preview with an Explain pill." },
      ],
      edges: {
        intro: "Every card has a state for when things go wrong, and the rules for the pill are written down:",
        items: [
          "Offline: the card waits and offers to try again",
          "Nothing found: it asks you to check the spelling",
          "A reminder typed by mistake: “Looks like a reminder, not a search”",
          "More than one meaning: the card shows the options",
          "Health questions: answers carry a note to ask a doctor",
          "Edited after a look-up: the card asks “Look up again?” and keeps the old card until you tap",
        ],
      },
      images: [
        { src: "/assets/playground/quanvas/triggers.webp", size: [2000, 1600], caption: "The three trigger options explored, and why the Look up pill was chosen." },
        { src: "/assets/playground/quanvas/edgecases.webp", size: [2000, 1625], caption: "When the pill shows, when it doesn't, and the special cases." },
        { src: "/assets/playground/quanvas/states.webp", size: [2000, 1682], caption: "Every state a card can be in." },
      ],
      next: [
        "Connect live AI for look-ups, summaries and explanations, through a small server so no key lives in the page.",
        "Add real sources and a confidence label to each answer, so people know how much to trust it.",
      ],
    },
  },
  {
    id: "photos-to-3d",
    title: "Photos to 3D",
    tagline: "Turn product photos into a 3D model, right in the browser.",
    description:
      "A merchant dashboard where you add up to four product photos and get a 3D model you can rotate on a phone product page. It cuts the product out of each photo, builds a shape from the outlines, and wraps the photos onto it.",
    status: "live",
    icon: "cube",
    tags: ["3D", "Computer vision", "Ecommerce"],
    src: "/playground/projects/photos-to-3d/index.html",
    // Hidden for now: the 3D result isn't reliable enough to show.
    hidden: true,
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
    src: "/playground/projects/try-on/index.html",
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
    src: "/playground/projects/weave-notebook/index.html",
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
    src: "/playground/projects/sop-assistant/index.html",
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
    src: "/playground/projects/ai-interview/index.html",
    preview: "/assets/playground/ai-interview-practice.jpg",
    note: "Demo version: uses sample questions and scores answers in your browser.",
  },
];

// What the Playground page shows. Hidden items stay in the code.
export const playgroundItems = allPlaygroundItems.filter((item) => !item.hidden);
