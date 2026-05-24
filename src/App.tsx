import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { CaretLeft, CaretRight, List, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from "@phosphor-icons/react";

type ProjectTone = "violet" | "peach";

type Project = {
  slug: string;
  title: string;
  summary: string;
  proof: string;
  image: string;
  tone: ProjectTone;
  imageClass?: string;
};

type DetailSection = {
  eyebrow: string;
  title: string;
  body: string;
  protected?: boolean;
};

const navLinks = ["Work", "Skills", "About"];
const socialLinks = ["LinkedIn", "X (Twitter)", "Instagram"];
const ndaPassword = "0511";
const ndaStoragePrefix = "portfolio-nda-unlocked-until";
const ndaUnlockDurationMs = 60 * 60 * 1000;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function withBasePath(path: string) {
  return `${basePath}${path}`;
}

function assetPath(path: string) {
  return withBasePath(path);
}

function getNdaStorageKey(projectSlug: string) {
  return `${ndaStoragePrefix}-${projectSlug}`;
}

function getStoredNdaUnlock(projectSlug: string) {
  try {
    const ndaStorageKey = getNdaStorageKey(projectSlug);
    const unlockedUntil = Number(window.localStorage.getItem(ndaStorageKey));

    if (!Number.isFinite(unlockedUntil) || Date.now() >= unlockedUntil) {
      window.localStorage.removeItem(ndaStorageKey);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function storeNdaUnlock(projectSlug: string) {
  try {
    window.localStorage.setItem(getNdaStorageKey(projectSlug), String(Date.now() + ndaUnlockDurationMs));
  } catch {
    return;
  }
}

function navHref(link: string) {
  return link === "Work" ? withBasePath("/") : withBasePath(`/#${link.toLowerCase()}`);
}

const projects: Project[] = [
  {
    slug: "superfans-dashboard",
    title: "Redesign the Superfans Dashboard from 0 to 1",
    summary: "Fast, elegant, and conversion-focused, it’s built to boost bookings & build trust.",
    proof: "Built for Small Businesses to Reduce 30% of Manual Entry Errors.",
    image: assetPath("/assets/superfans-dashboard.png"),
    tone: "violet",
    imageClass: "project-image--superfans",
  },
  {
    slug: "cart-abandonment-recovery",
    title: "Cart Abandonment Recovery WooCommerce",
    summary: "Fast, elegant, and conversion-focused, it’s built to boost bookings & build trust.",
    proof: "Built for Small Businesses to Reduce 30% of Manual Entry Errors.",
    image: assetPath("/assets/cart-abandonment.png"),
    tone: "peach",
    imageClass: "project-image--cart",
  },
  {
    slug: "modern-cart",
    title: "Modern Cart for WooCommerce",
    summary: "Fast, elegant, and conversion-focused, it’s built to boost bookings & build trust.",
    proof: "Built for Small Businesses to Reduce 30% of Manual Entry Errors.",
    image: assetPath("/assets/modern-cart.png"),
    tone: "peach",
    imageClass: "project-image--modern",
  },
  {
    slug: "funnel-analytics",
    title: "Improve CartFlows Funnel Analytics",
    summary: "Fast, elegant, and conversion-focused, it’s built to boost bookings & build trust.",
    proof: "Built for Small Businesses to Reduce 30% of Manual Entry Errors.",
    image: assetPath("/assets/funnel-analytics.png"),
    tone: "peach",
    imageClass: "project-image--funnel",
  },
  {
    slug: "checkout-analytics",
    title: "Checkout Analytics Experience",
    summary: "Fast, elegant, and conversion-focused, it’s built to boost bookings & build trust.",
    proof: "Designed clearer reporting for teams to catch revenue leaks faster.",
    image: assetPath("/assets/funnel-analytics.png"),
    tone: "peach",
    imageClass: "project-image--funnel",
  },
  {
    slug: "customer-portal",
    title: "Customer Portal Redesign",
    summary: "Fast, elegant, and conversion-focused, it’s built to boost bookings & build trust.",
    proof: "Simplified account management flows for faster customer support.",
    image: assetPath("/assets/superfans-dashboard.png"),
    tone: "violet",
    imageClass: "project-image--superfans",
  },
  {
    slug: "onboarding-flow",
    title: "Product Onboarding Flow",
    summary: "Fast, elegant, and conversion-focused, it’s built to boost bookings & build trust.",
    proof: "Reduced setup friction with a guided first-run product experience.",
    image: assetPath("/assets/cart-abandonment.png"),
    tone: "peach",
    imageClass: "project-image--cart",
  },
  {
    slug: "reports-dashboard",
    title: "Reports Dashboard Refresh",
    summary: "Fast, elegant, and conversion-focused, it’s built to boost bookings & build trust.",
    proof: "Improved scanability for business metrics and recurring decisions.",
    image: assetPath("/assets/modern-cart.png"),
    tone: "peach",
    imageClass: "project-image--modern",
  },
];

const detailSections: DetailSection[] = [
  {
    eyebrow: "The Problem",
    title: "Manual workflows slow teams down and make reporting harder to trust.",
    body: "Teams spend too much time repeating the same checks, copying information between screens, and validating work by hand. The result is slower decisions, missed signals, and avoidable mistakes in moments where clarity matters most.",
  },
  {
    eyebrow: "Solution Direction",
    title: "Create a focused experience that reduces effort and makes the next action obvious.",
    body: "The redesigned flow prioritizes the most frequent tasks, keeps supporting details close to the action, and uses a cleaner information hierarchy so users can scan, decide, and move forward with confidence.",
    protected: true,
  },
  {
    eyebrow: "Critical Decisions",
    title: "Balance simplicity and control without hiding important product context.",
    body: "I kept the interface calm while preserving the operational details users need. Each screen is organized around the primary decision first, then supporting information, actions, and status feedback.",
    protected: true,
  },
];

const futureScopes = [
  {
    title: "Smarter automation for repeated work",
    body: "Add automation for common checks, recurring setup, and repetitive updates so users spend less time maintaining the system and more time acting on useful information.",
  },
  {
    title: "Deeper reporting for confident decisions",
    body: "Improve reporting views with clearer comparisons, better filters, and faster access to the metrics that explain what changed and why it matters.",
  },
  {
    title: "Collaboration-ready workflows",
    body: "Support handoffs, shared context, and lightweight review states so teams can work together without losing track of ownership or next steps.",
  },
];

const learnings = [
  "Focus on the few workflows that create the most user value.",
  "Use real product constraints to keep visual decisions practical.",
  "Make dense information easier to scan before adding more features.",
  "Iterate quickly when feedback exposes confusion in the flow.",
];

const caseTopics = [
  { label: "Overview", target: "overview" },
  { label: "The Problem", target: "the-problem" },
  { label: "Solution", target: "solution-direction" },
  { label: "Decisions", target: "critical-decisions" },
  { label: "Future Scope", target: "future-scope" },
  { label: "Learnings", target: "learnings" },
];

function LogoMark() {
  return <img className="logo-image" src={assetPath("/assets/a-logo.svg")} alt="" />;
}

function getCarouselImages(projectIndex: number, offset: number) {
  return Array.from({ length: Math.min(projects.length, 4) }, (_, index) => {
    const project = projects[(projectIndex + offset + index) % projects.length];

    return {
      alt: project.title,
      src: project.image,
    };
  });
}

function ImageCarousel({ images }: { images: Array<{ alt: string; src: string }> }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const activeImage = images[activeIndex];
  const lightboxImage = lightboxIndex === null ? null : images[lightboxIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) {
      return;
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [lightboxIndex]);

  function moveCarousel(direction: number) {
    setActiveIndex((index) => (index + direction + images.length) % images.length);
  }

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setZoom(1);
  }

  function moveLightbox(direction: number) {
    setLightboxIndex((index) => {
      if (index === null) {
        return index;
      }

      return (index + direction + images.length) % images.length;
    });
    setZoom(1);
  }

  return (
    <>
      <figure className="case-wide-media image-carousel">
        <button className="image-carousel__stage" onClick={() => openLightbox(activeIndex)} type="button">
          <div className="image-carousel__track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {images.map((image) => (
              <img alt={image.alt} key={image.src} src={image.src} />
            ))}
          </div>
        </button>

        <button
          aria-label="Previous image"
          className="image-carousel__arrow image-carousel__arrow--prev"
          onClick={() => moveCarousel(-1)}
          type="button"
        >
          <CaretLeft aria-hidden="true" size={24} weight="bold" />
        </button>
        <button
          aria-label="Next image"
          className="image-carousel__arrow image-carousel__arrow--next"
          onClick={() => moveCarousel(1)}
          type="button"
        >
          <CaretRight aria-hidden="true" size={24} weight="bold" />
        </button>

        <div className="image-carousel__dots" aria-label="Carousel image selection">
          {images.map((image, index) => (
            <button
              aria-label={`Show ${image.alt}`}
              aria-current={index === activeIndex ? "true" : undefined}
              key={image.src}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      </figure>

      {lightboxImage ? (
        <div className="image-lightbox" role="presentation">
          <div aria-label={`${lightboxImage.alt} closer view`} aria-modal="true" className="image-lightbox__dialog" role="dialog">
            <div className="image-lightbox__toolbar">
              <button aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(1, value - 0.25))} type="button">
                <MagnifyingGlassMinus aria-hidden="true" size={22} weight="bold" />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(3, value + 0.25))} type="button">
                <MagnifyingGlassPlus aria-hidden="true" size={22} weight="bold" />
              </button>
              <button aria-label="Close image preview" onClick={() => setLightboxIndex(null)} type="button">
                <X aria-hidden="true" size={22} weight="bold" />
              </button>
            </div>

            <button
              aria-label="Previous image"
              className="image-lightbox__arrow image-lightbox__arrow--prev"
              onClick={() => moveLightbox(-1)}
              type="button"
            >
              <CaretLeft aria-hidden="true" size={28} weight="bold" />
            </button>
            <div className="image-lightbox__viewport">
              <img alt={lightboxImage.alt} src={lightboxImage.src} style={{ transform: `scale(${zoom})` }} />
            </div>
            <button
              aria-label="Next image"
              className="image-lightbox__arrow image-lightbox__arrow--next"
              onClick={() => moveLightbox(1)}
              type="button"
            >
              <CaretRight aria-hidden="true" size={28} weight="bold" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function DetailSectionContent({ index, projectIndex, section }: { index: number; projectIndex: number; section: DetailSection }) {
  return (
    <>
      <div className="case-section-heading">
        <p>{section.eyebrow}</p>
        <h2>{section.title}</h2>
        <span>{section.body}</span>
      </div>

      <ImageCarousel images={getCarouselImages(projectIndex, index)} />

      <div className="case-points">
        <div>
          <h3>The Main Challenges:</h3>
          <ul>
            <li>Repetitive work slows down daily decisions.</li>
            <li>Important information is scattered across screens.</li>
            <li>Users need clearer feedback after each action.</li>
            <li>Dense interfaces make comparison harder.</li>
          </ul>
        </div>
        <div>
          <h3>The Main Goals:</h3>
          <ul>
            <li>Reduce time spent on repeated tasks.</li>
            <li>Make critical metrics faster to understand.</li>
            <li>Create a calmer, more predictable flow.</li>
            <li>Support confident next-step decisions.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

function FutureScopeContent({ project, projectIndex }: { project: Project; projectIndex: number }) {
  return (
    <>
      <div className="case-section-heading">
        <p>Future Scope</p>
        <h2>{project.title} can grow with automation, reporting depth, and stronger team workflows.</h2>
        <span>
          The next iteration can extend the same product direction: remove manual effort, make insight easier to trust,
          and support teams as their workflows become more complex.
        </span>
      </div>

      <div className="future-list">
        {futureScopes.map((item, index) => (
          <article className="future-item" key={item.title}>
            <img src={projects[(projectIndex + index + 1) % projects.length].image} alt="" />
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="navbar" aria-label="Primary navigation">
      <a className="logo" href={withBasePath("/")} aria-label="Aadhavan M home">
        <LogoMark />
      </a>

      <nav className="nav-menu" aria-label="Portfolio sections">
        <div className="nav-links">
          {navLinks.map((link) => (
            <a href={navHref(link)} key={link}>
              {link}
            </a>
          ))}
        </div>
        <a className="button button--large" href={assetPath("/Aadhavan-M-Resume.pdf")}>
          Download Resume
        </a>
      </nav>

      <button
        aria-controls="mobile-menu"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="menu-toggle"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        type="button"
      >
        <List aria-hidden="true" size={32} weight="bold" />
      </button>

      <nav className={`mobile-menu${isMenuOpen ? " is-open" : ""}`} id="mobile-menu" aria-label="Mobile navigation">
        {navLinks.map((link) => (
          <a href={navHref(link)} key={link} onClick={closeMenu}>
            {link}
          </a>
        ))}
        <a className="button" href={assetPath("/Aadhavan-M-Resume.pdf")} onClick={closeMenu}>
          Download Resume
        </a>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="footer">
      <nav aria-label="Footer sections">
        {navLinks.map((link) => (
          <a href={navHref(link)} key={link}>
            {link}
          </a>
        ))}
      </nav>
      <nav aria-label="Social links">
        {socialLinks.map((link) => (
          <a href={withBasePath("/#work")} key={link}>
            {link}
          </a>
        ))}
      </nav>
    </footer>
  );
}

function PasswordProtectedContent({
  children,
  isUnlocked,
  onUnlock,
  projectSlug,
}: {
  children: ReactNode;
  isUnlocked: boolean;
  onUnlock: () => void;
  projectSlug: string;
}) {
  const titleId = useId();
  const errorId = useId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const digitRefs = useRef<Array<HTMLInputElement | null>>([]);
  const password = digits.join("");

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => digitRefs.current[0]?.focus(), 0);

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password) {
      setError("Enter the 4-digit password.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be 4 digits.");
      return;
    }

    if (password !== ndaPassword) {
      setDigits(["", "", "", ""]);
      setError("Incorrect password. Please try again.");
      digitRefs.current[0]?.focus();
      return;
    }

    storeNdaUnlock(projectSlug);
    onUnlock();
    setError("");
    setIsModalOpen(false);
  }

  function handleDigitChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const nextDigit = event.target.value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = nextDigit;
    setDigits(nextDigits);
    setError("");

    if (nextDigit && index < digitRefs.current.length - 1) {
      digitRefs.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      digitRefs.current[index - 1]?.focus();
      return;
    }

    if (event.key === "ArrowRight" && index < digitRefs.current.length - 1) {
      event.preventDefault();
      digitRefs.current[index + 1]?.focus();
    }
  }

  function handleDigitPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4).split("");
    const nextDigits = ["", "", "", ""];

    pastedDigits.forEach((digit, index) => {
      nextDigits[index] = digit;
    });

    setDigits(nextDigits);
    setError("");
    digitRefs.current[Math.min(pastedDigits.length, 3)]?.focus();
  }

  function openPasswordModal() {
    setIsModalOpen(true);
    setError("");
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="protected-section">
      <div aria-hidden="true" className="protected-section__content">
        {children}
      </div>

      <div className="protected-section__overlay">
        <button className="protected-section__button" onClick={openPasswordModal} type="button">
          Password protected because of NDA
        </button>
      </div>

      {isModalOpen ? (
        <div className="password-modal-backdrop" role="presentation">
          <div aria-labelledby={titleId} aria-modal="true" className="password-modal" role="dialog">
            <button
              aria-label="Close password dialog"
              className="password-modal__close"
              onClick={() => setIsModalOpen(false)}
              type="button"
            >
              ×
            </button>

            <div className="password-modal__header">
              <p>Protected section</p>
              <h3 id={titleId}>To view this section, enter the password.</h3>
              <span>This content is protected because of NDA.</span>
            </div>

            <form className="password-form" onSubmit={handleSubmit}>
              <fieldset>
                <legend>4-digit password</legend>
                <div className="otp-inputs">
                  {digits.map((digit, index) => (
                    <input
                      aria-describedby={error ? errorId : undefined}
                      aria-invalid={error ? "true" : "false"}
                      aria-label={`Password digit ${index + 1}`}
                      autoComplete="off"
                      inputMode="numeric"
                      key={`password-digit-${index}`}
                      maxLength={1}
                      onChange={(event) => handleDigitChange(index, event)}
                      onKeyDown={(event) => handleDigitKeyDown(index, event)}
                      onPaste={handleDigitPaste}
                      pattern="[0-9]"
                      ref={(node) => {
                        digitRefs.current[index] = node;
                      }}
                      type="password"
                      value={digit}
                    />
                  ))}
                </div>
              </fieldset>

              <p className="password-error" id={errorId} role="alert">
                {error}
              </p>

              <button className="button" type="submit">
                Unlock section
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function HomePage() {
  const [showMoreProjects, setShowMoreProjects] = useState(false);
  const visibleProjects = showMoreProjects ? projects : projects.slice(0, 4);

  return (
    <>
      <Header />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">
            I’m Aadhavan M, A Product Designer{" "}
            <span>that cares a great deal about positive impact projects</span>
          </h1>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <p className="section-eyebrow" id="work-title">
            Featured work
          </p>

          <div className="project-list">
            {visibleProjects.map((project) => (
              <article className="project-card" key={project.title}>
                <div className="project-content">
                  <p className={`proof-card proof-card--${project.tone}`}>{project.proof}</p>

                  <div className="project-copy">
                    <div>
                      <h2>{project.title}</h2>
                      <p>{project.summary}</p>
                    </div>
                    <a className="button" href={withBasePath(`/work/${project.slug}`)}>
                      Read More
                    </a>
                  </div>
                </div>

                <div className="project-media" aria-hidden="true">
                  <img className={project.imageClass} src={project.image} alt="" />
                </div>
              </article>
            ))}
          </div>

          <button
            aria-expanded={showMoreProjects}
            className="view-more-button"
            onClick={() => setShowMoreProjects((isOpen) => !isOpen)}
            type="button"
          >
            {showMoreProjects ? "View less" : "View more"}
            <svg aria-hidden="true" className={showMoreProjects ? "is-open" : ""} viewBox="0 0 20 20">
              <path d="M5 7.5L10 12.5L15 7.5" />
            </svg>
          </button>
        </section>

        <section className="contact-panel" aria-labelledby="contact-title">
          <h2 id="contact-title">
            Want to create <br />
            something awesome?
            <br />
            Drop me an email.
          </h2>
          <a href="mailto:aadhavanm.design@email.com">→ aadhavanm.design@email.com</a>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function CaseStudyPage({ project }: { project: Project }) {
  const [activeTopic, setActiveTopic] = useState("overview");
  const [isNdaUnlocked, setIsNdaUnlocked] = useState(() => getStoredNdaUnlock(project.slug));
  const [topicHelper, setTopicHelper] = useState("");
  const projectIndex = projects.indexOf(project);
  const publicDetailSections = detailSections.filter((section) => !section.protected);
  const protectedDetailSections = detailSections.filter((section) => section.protected);
  const meta = [
    ["Role:", "Product Designer"],
    ["Duration:", "Oct - Nov 2023"],
    ["Industry:", project.title.includes("WooCommerce") ? "Ecommerce" : "SaaS"],
    ["Platform:", "Web App"],
  ];

  useEffect(() => {
    const sections = caseTopics
      .map((topic) => document.getElementById(topic.target))
      .filter((section, index, list): section is HTMLElement => Boolean(section) && list.indexOf(section) === index);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveTopic(visible.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.1, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isNdaUnlocked) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setIsNdaUnlocked(getStoredNdaUnlock(project.slug));
    }, 30 * 1000);

    return () => window.clearInterval(intervalId);
  }, [isNdaUnlocked, project.slug]);

  useEffect(() => {
    if (!topicHelper) {
      return;
    }

    const timeoutId = window.setTimeout(() => setTopicHelper(""), 3000);

    return () => window.clearTimeout(timeoutId);
  }, [topicHelper]);

  return (
    <>
      <Header />

      <main className="case-study">
        <nav className="case-topic-nav" aria-label="Case study topics">
          {caseTopics.map((topic) => {
            const isProtectedTopic = ["solution-direction", "critical-decisions", "future-scope"].includes(topic.target);
            const isLockedTopic = isProtectedTopic && !isNdaUnlocked;

            if (isLockedTopic) {
              return (
                <button
                  aria-disabled="true"
                  className="case-topic-nav__disabled"
                  key={`${topic.label}-${topic.target}`}
                  onClick={() => setTopicHelper("This section is password protected due to NDA.")}
                  type="button"
                >
                  {topic.label}
                </button>
              );
            }

            return (
              <a
                aria-current={activeTopic === topic.target && topic.label !== "Back to Top" ? "true" : undefined}
                href={`#${topic.target}`}
                key={`${topic.label}-${topic.target}`}
              >
                {topic.label}
              </a>
            );
          })}
          <p className="case-topic-nav__helper" role="status">
            {topicHelper}
          </p>
        </nav>

        <section className="case-hero" id="overview">
          <a className="case-back" href={withBasePath("/#work")}>
            ← All case studies
          </a>
          <h1>{project.proof}</h1>
          <figure className="case-hero-media">
            <img src={project.image} alt="" />
          </figure>
          <dl className="case-meta">
            {meta.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {publicDetailSections.map((section) => {
          const detailIndex = detailSections.indexOf(section);

          return (
            <section
              className="case-section"
              id={section.eyebrow.toLowerCase().replaceAll(" ", "-")}
              key={section.eyebrow}
            >
              <DetailSectionContent index={detailIndex} projectIndex={projectIndex} section={section} />
            </section>
          );
        })}

        <section className="case-section protected-case-section">
          <PasswordProtectedContent
            isUnlocked={isNdaUnlocked}
            onUnlock={() => setIsNdaUnlocked(true)}
            projectSlug={project.slug}
          >
            {protectedDetailSections.map((section) => (
              <section
                className="case-section protected-case-section__item"
                id={section.eyebrow.toLowerCase().replaceAll(" ", "-")}
                key={section.eyebrow}
              >
                <DetailSectionContent
                  index={detailSections.indexOf(section)}
                  projectIndex={projectIndex}
                  section={section}
                />
              </section>
            ))}

            <section className="case-section protected-case-section__item" id="future-scope">
              <FutureScopeContent project={project} projectIndex={projectIndex} />
            </section>
          </PasswordProtectedContent>
        </section>

        <section className="case-section" id="learnings">
          <div className="case-section-heading">
            <p>Learnings & Feedback</p>
            <h2>Key learnings from this project, and feedback is welcome to help refine the work.</h2>
            <span>
              Each project sharpened the same lesson: better product design comes from narrowing the problem, testing
              real workflows, and improving clarity before adding more complexity.
            </span>
          </div>

          <div className="learning-layout">
            <h3>Mistakes & Learnings:</h3>
            <div className="learning-grid">
              {learnings.map((learning) => (
                <article key={learning}>
                  <span>✦</span>
                  <p>{learning}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-panel" id="contact" aria-labelledby="case-contact-title">
          <h2 id="case-contact-title">
            Want to create <br />
            something awesome?
            <br />
            Drop me an email.
          </h2>
          <a href="mailto:aadhavanm.design@email.com">→ aadhavanm.design@email.com</a>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function App() {
  const pathname = window.location.pathname.startsWith(`${basePath}/`)
    ? window.location.pathname.slice(basePath.length)
    : window.location.pathname;
  const slug = pathname.replace(/^\/work\//, "").replace(/\/$/, "");
  const project = projects.find((item) => item.slug === slug);

  return <div className="site-shell">{project ? <CaseStudyPage project={project} /> : <HomePage />}</div>;
}

export default App;
