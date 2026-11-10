import {
  Fragment,
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
import {
  ArrowRight,
  ArrowsOutSimple,
  CaretLeft,
  CaretRight,
  Check,
  GearSix,
  List,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Pause,
  Play,
  SpeakerHigh,
  ShoppingCart,
  SpeakerX,
  Storefront,
  X,
} from "@phosphor-icons/react";
import {
  caseStudies,
  type CaseSection,
  type CaseStudy,
  type DecisionItem,
  type JourneyLane,
  type MediaItem,
  type Stat,
} from "./caseStudies";

const navLinks = ["Work", "Skills", "About"];
const ndaPassword = "0511";
const ndaStoragePrefix = "portfolio-nda-unlocked-until";
const ndaUnlockDurationMs = 60 * 60 * 1000;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const videoSpeeds = [0.75, 1, 1.25, 1.5, 2];
const gmailComposeUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=aadhavanm.design@gmail.com";
const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aadhavan-m/" },
  { label: "X (Twitter)", href: withBasePath("/#work") },
  { label: "Instagram", href: withBasePath("/#work") },
];

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
  if (link === "Work") {
    return withBasePath("/");
  }

  return withBasePath(`/#${link.toLowerCase()}`);
}

function isActiveNavLink(link: string) {
  return link === "Work";
}

const projects = caseStudies;

function LogoMark() {
  return <img className="logo-image" src={assetPath("/assets/a-logo.svg")} alt="" />;
}

function resolveSrc(src: string) {
  return src.startsWith("/") ? assetPath(src) : src;
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

function CaseHeroVideo({ coverImage, title, videoSrc }: { coverImage: string; title: string; videoSrc: string }) {
  const inlineVideoRef = useRef<HTMLVideoElement | null>(null);
  const expandedVideoRef = useRef<HTMLVideoElement | null>(null);
  const [activePlayer, setActivePlayer] = useState<"inline" | "expanded">("inline");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [playbackRate, setPlaybackRate] = useState(1);

  const activeVideoRef = activePlayer === "expanded" ? expandedVideoRef : inlineVideoRef;

  useEffect(() => {
    const video = activeVideoRef.current;

    if (!video) {
      return;
    }

    video.volume = volume;
    video.playbackRate = playbackRate;
  }, [activePlayer, playbackRate, volume]);

  useEffect(() => {
    const nextVideo = isExpanded ? expandedVideoRef.current : inlineVideoRef.current;
    const previousVideo = isExpanded ? inlineVideoRef.current : expandedVideoRef.current;

    if (!nextVideo) {
      return;
    }

    const shouldResume = isPlaying;
    previousVideo?.pause();
    nextVideo.currentTime = currentTime;
    nextVideo.volume = volume;
    nextVideo.playbackRate = playbackRate;
    setActivePlayer(isExpanded ? "expanded" : "inline");

    if (shouldResume) {
      void nextVideo.play().catch(() => setIsPlaying(false));
    }
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  function formatVideoTime(time: number) {
    if (!Number.isFinite(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }

  function getVideo() {
    return activeVideoRef.current;
  }

  function playVideo(video = getVideo()) {
    if (!video) {
      return;
    }

    setHasStarted(true);
    void video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }

  function togglePlayback() {
    const video = getVideo();

    if (!video) {
      return;
    }

    if (video.paused) {
      playVideo(video);
      return;
    }

    video.pause();
    setIsPlaying(false);
  }

  function handleSeek(event: ChangeEvent<HTMLInputElement>) {
    const nextTime = Number(event.target.value);
    const video = getVideo();

    setCurrentTime(nextTime);

    if (video) {
      video.currentTime = nextTime;
    }
  }

  function handleVolumeChange(event: ChangeEvent<HTMLInputElement>) {
    const nextVolume = Number(event.target.value);
    const video = getVideo();

    setVolume(nextVolume);

    if (video) {
      video.volume = nextVolume;
    }
  }

  function handleSpeedChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextRate = Number(event.target.value);
    const video = getVideo();

    setPlaybackRate(nextRate);

    if (video) {
      video.playbackRate = nextRate;
    }
  }

  function handleLoadedMetadata(video: HTMLVideoElement) {
    setDuration(video.duration);
    video.volume = volume;
    video.playbackRate = playbackRate;
  }

  function renderVideoPlayer(mode: "inline" | "expanded") {
    const isActive = activePlayer === mode;
    const videoRef = mode === "expanded" ? expandedVideoRef : inlineVideoRef;
    const showCover = mode === "inline" && !hasStarted;

    return (
      <div className={`case-video__player case-video__player--${mode}${hasStarted ? " case-video__player--started" : ""}`}>
        <video
          aria-label={`${title} video walkthrough`}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(event) => handleLoadedMetadata(event.currentTarget)}
          onPause={() => isActive && setIsPlaying(false)}
          onPlay={() => {
            setHasStarted(true);
            isActive && setIsPlaying(true);
          }}
          onTimeUpdate={(event) => isActive && setCurrentTime(event.currentTarget.currentTime)}
          playsInline
          poster={coverImage}
          preload="metadata"
          ref={videoRef}
          src={videoSrc}
        />

        {showCover ? (
          <button className="case-video__cover" onClick={() => playVideo(videoRef.current)} type="button">
            <img src={coverImage} alt="" />
            <span aria-hidden="true" className="case-video__play">
              <Play size={34} weight="fill" />
            </span>
            <span className="sr-only">Play video walkthrough</span>
          </button>
        ) : null}

        <div className="case-video__controls">
          <button aria-label={isPlaying ? "Pause video" : "Play video"} onClick={togglePlayback} type="button">
            {isPlaying ? <Pause aria-hidden="true" size={22} weight="fill" /> : <Play aria-hidden="true" size={22} weight="fill" />}
          </button>

          <span className="case-video__time">
            {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
          </span>

          <label className="case-video__seek">
            <span className="sr-only">Seek video</span>
            <input max={duration || 0} min="0" onChange={handleSeek} step="0.1" type="range" value={currentTime} />
          </label>

          <label className="case-video__volume">
            {volume > 0 ? <SpeakerHigh aria-hidden="true" size={20} /> : <SpeakerX aria-hidden="true" size={20} />}
            <span className="sr-only">Volume</span>
            <input max="1" min="0" onChange={handleVolumeChange} step="0.05" type="range" value={volume} />
          </label>

          <label className="case-video__speed">
            <span className="sr-only">Playback speed</span>
            <select aria-label="Playback speed" onChange={handleSpeedChange} value={playbackRate}>
              {videoSpeeds.map((speed) => (
                <option key={speed} value={speed}>
                  {speed}x
                </option>
              ))}
            </select>
          </label>

          {mode === "inline" ? (
            <button aria-label="Open video in expanded view" onClick={() => setIsExpanded(true)} type="button">
              <ArrowsOutSimple aria-hidden="true" size={22} />
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <figure className="case-hero-media case-video">
      {renderVideoPlayer("inline")}

      {isExpanded ? (
        <div className="case-video-modal" role="presentation">
          <div aria-label={`${title} expanded video player`} className="case-video-modal__dialog" role="dialog">
            <button
              aria-label="Close expanded video"
              className="case-video-modal__close"
              onClick={() => setIsExpanded(false)}
              type="button"
            >
              <X aria-hidden="true" size={24} weight="bold" />
            </button>
            {renderVideoPlayer("expanded")}
          </div>
        </div>
      ) : null}
    </figure>
  );
}

const inlinePattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function RichText({ text }: { text: string }) {
  const parts = text.split(inlinePattern).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }

        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

        if (link) {
          const isExternal = link[2].startsWith("http");

          return (
            <a
              href={link[2]}
              key={index}
              rel={isExternal ? "noreferrer" : undefined}
              target={isExternal ? "_blank" : undefined}
            >
              {link[1]}
            </a>
          );
        }

        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

function MediaPlaceholder({ className = "", item }: { className?: string; item: MediaItem }) {
  return (
    <figure className={`case-media-placeholder ${className}`.trim()}>
      <div className="case-media-placeholder__frame">
        <span className="case-media-placeholder__badge">
          {item.kind === "video" ? <Play aria-hidden="true" size={16} weight="fill" /> : null}
          {item.kind === "video" ? "Video placeholder" : "Image placeholder"}
        </span>
      </div>
      <figcaption>{item.caption}</figcaption>
    </figure>
  );
}

function MediaThumb({ item }: { item: MediaItem }) {
  if (item.src) {
    return (
      <figure className="case-media-image case-media--thumb">
        <img alt={item.caption} src={resolveSrc(item.src)} />
        <figcaption>{item.caption}</figcaption>
      </figure>
    );
  }

  return <MediaPlaceholder className="case-media--thumb" item={item} />;
}

function MediaGroup({ items }: { items: MediaItem[] }) {
  const withImages = items.filter((item): item is MediaItem & { src: string } => Boolean(item.src));

  if (withImages.length === items.length && items.length > 1) {
    return <ImageCarousel images={withImages.map((item) => ({ alt: item.caption, src: resolveSrc(item.src) }))} />;
  }

  return (
    <div className={`case-media-group case-media-group--${Math.min(items.length, 3)}`}>
      {items.map((item) =>
        item.src ? (
          <figure className="case-media-image" key={item.caption}>
            <img alt={item.caption} src={resolveSrc(item.src)} />
            <figcaption>{item.caption}</figcaption>
          </figure>
        ) : (
          <MediaPlaceholder item={item} key={item.caption} />
        ),
      )}
    </div>
  );
}

function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="case-stats">
      {stats.map((stat) => (
        <div key={stat.value}>
          <strong>{stat.value}</strong>
          <span>
            <RichText text={stat.label} />
          </span>
        </div>
      ))}
    </div>
  );
}

function ProblemView({ section }: { section: Extract<CaseSection, { kind: "problem" }> }) {
  return (
    <>
      <div className="case-pains">
        {section.pains.map((pain, index) => (
          <article key={pain.title}>
            <span className="case-index">{pad(index)}</span>
            <h3>{pain.title}</h3>
            <p>{pain.body}</p>
          </article>
        ))}
      </div>

      {section.media ? <MediaGroup items={[section.media]} /> : null}

      <div className="case-mapping">
        <div className="case-mapping__head" aria-hidden="true">
          <span>Challenge</span>
          <span />
          <span>Goal</span>
        </div>
        {section.mapping.map(([challenge, goal]) => (
          <div className="case-mapping__row" key={challenge}>
            <p>{challenge}</p>
            <ArrowRight aria-label="becomes" size={22} weight="bold" />
            <p>{goal}</p>
          </div>
        ))}
      </div>

      <div className="case-chips">
        <span className="case-chips__label">Constraints</span>
        {section.constraints.map((constraint) => (
          <span className="case-chip" key={constraint}>
            {constraint}
          </span>
        ))}
      </div>
    </>
  );
}

function JourneyLaneView({ lane }: { lane: JourneyLane }) {
  return (
    <ol className="case-steps">
      {lane.steps.map((step, index) => (
        <li className={step.media ? "" : "case-steps__item--text"} key={step.title}>
          <span className="case-steps__num">{index + 1}</span>
          <div className="case-steps__text">
            <h4>{step.title}</h4>
            <p>{step.body}</p>
          </div>
          {step.media ? <MediaThumb item={step.media} /> : null}
        </li>
      ))}
    </ol>
  );
}

function JourneyView({ section }: { section: Extract<CaseSection, { kind: "journey" }> }) {
  const [activeLane, setActiveLane] = useState(0);
  const tabsId = useId();
  const lane = section.lanes[activeLane];

  return (
    <div className="case-journey">
      {section.video ? <MediaGroup items={[section.video]} /> : null}

      <div className="case-personas" role="tablist" aria-label="Choose a perspective">
        {section.lanes.map((item, index) => (
          <button
            aria-controls={`${tabsId}-panel`}
            aria-selected={index === activeLane}
            className="case-persona"
            id={`${tabsId}-tab-${index}`}
            key={item.name}
            onClick={() => setActiveLane(index)}
            role="tab"
            type="button"
          >
            <span className="case-persona__avatar" aria-hidden="true">
              {item.role === "Shopper" ? <ShoppingCart size={22} weight="bold" /> : <Storefront size={22} weight="bold" />}
            </span>
            <span className="case-persona__text">
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </span>
          </button>
        ))}
      </div>

      <div aria-labelledby={`${tabsId}-tab-${activeLane}`} className="case-journey__panel" id={`${tabsId}-panel`} role="tabpanel">
        <p className="case-journey__about">{lane.about}</p>
        <JourneyLaneView lane={lane} />
        {activeLane < section.lanes.length - 1 ? (
          <button className="case-journey__next" onClick={() => setActiveLane(activeLane + 1)} type="button">
            Now see {section.lanes[activeLane + 1].name}'s side <ArrowRight aria-hidden="true" size={18} weight="bold" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function SolutionView({ section }: { section: Extract<CaseSection, { kind: "solution" }> }) {
  return (
    <>
      <div className="case-changes">
        {section.items.map((item) => (
          <article className="case-change" key={item.title}>
            {item.media ? <MediaThumb item={item.media} /> : null}
            <span className="case-tag">{item.area}</span>
            <h3>{item.title}</h3>
            <dl>
              {item.before ? (
                <div className="case-change__before">
                  <dt>
                    <X aria-hidden="true" size={14} weight="bold" />
                    <span className="sr-only">Before</span>
                  </dt>
                  <dd>{item.before}</dd>
                </div>
              ) : null}
              <div className="case-change__after">
                <dt>
                  <Check aria-hidden="true" size={14} weight="bold" />
                  <span className="sr-only">After</span>
                </dt>
                <dd>{item.after}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      {section.variants ? (
        <div className="case-variants">
          <h3>{section.variants.title}</h3>
          <p>{section.variants.intro}</p>
          <div className="case-variants__grid">
            {section.variants.items.map((variant) => (
              <article key={variant.name}>
                <strong>{variant.count}</strong>
                <h4>{variant.name}</h4>
                <p>{variant.body}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

function DecisionCard({ decision, index }: { decision: DecisionItem; index: number }) {
  return (
    <article className="case-decision">
      <header>
        <span className="case-index">Decision {pad(index)}</span>
        <h3>{decision.title}</h3>
        <p className="case-decision__question">{decision.question}</p>
      </header>

      <div className={`case-options case-options--${Math.min(decision.options.length, 4)}`}>
        {decision.options.map((option, optionIndex) => (
          <div className={`case-option${option.chosen ? " is-chosen" : ""}`} key={option.title}>
            <div className="case-option__top">
              <span className="case-option__letter">{String.fromCharCode(65 + optionIndex)}</span>
              {option.badge || option.chosen ? (
                <span className="case-option__badge">
                  {option.chosen ? <Check aria-hidden="true" size={12} weight="bold" /> : null}
                  {option.badge ?? "Chosen"}
                </span>
              ) : null}
            </div>
            <h4>{option.title}</h4>
            <p>{option.body}</p>
          </div>
        ))}
      </div>

      <div className="case-decision__why">
        <span>Why</span>
        <p>
          <RichText text={decision.why} />
        </p>
      </div>

      <p className="case-outcome-pill">
        <Check aria-hidden="true" size={16} weight="bold" />
        {decision.outcome}
      </p>

      {decision.media ? (
        <details className="case-decision__media">
          <summary>
            See the designs <span>({decision.media.length})</span>
          </summary>
          <MediaGroup items={decision.media} />
        </details>
      ) : null}
    </article>
  );
}

function SystemView({ section }: { section: Extract<CaseSection, { kind: "system" }> }) {
  return (
    <>
      {section.levels ? (
        <div className="case-levels">
          {section.levels.map((level, index) => (
            <div key={level.title} style={{ width: `${46 + index * 18}%` }}>
              <strong>{level.title}</strong>
              <span>{level.body}</span>
            </div>
          ))}
        </div>
      ) : null}

      {section.patterns ? (
        <div className="case-patterns">
          {section.patterns.map((pattern) => (
            <article key={pattern.title}>
              <h4>{pattern.title}</h4>
              <p>{pattern.body}</p>
            </article>
          ))}
        </div>
      ) : null}

      <div className="case-tokens">
        {section.tokens.map((token) => (
          <article key={token.label}>
            <div className={`case-token__sample case-token__sample--${token.sample}`} aria-hidden="true">
              {token.sample === "type" ? <span>Aa</span> : null}
              {token.sample === "color" ? (
                <>
                  <i />
                  <i />
                  <i />
                  <i />
                </>
              ) : null}
              {token.sample === "icons" ? (
                <>
                  <ShoppingCart size={26} />
                  <Storefront size={26} />
                  <GearSix size={26} />
                </>
              ) : null}
            </div>
            <span>{token.label}</span>
            <strong>{token.value}</strong>
          </article>
        ))}
      </div>

      {section.note ? (
        <aside className="case-note">
          <h4>{section.note.title}</h4>
          <p>{section.note.body}</p>
        </aside>
      ) : null}
    </>
  );
}

function ProcessView({ section }: { section: Extract<CaseSection, { kind: "process" }> }) {
  return (
    <>
      <ol className="case-timeline" style={{ ["--steps" as string]: section.steps.length }}>
        {section.steps.map((step, index) => (
          <li key={step.label}>
            <span className="case-timeline__dot">{index + 1}</span>
            <strong>{step.label}</strong>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>

      {section.notes ? (
        <div className="case-notes">
          {section.notes.map((note) => (
            <aside className="case-note" key={note.title}>
              <h4>{note.title}</h4>
              <p>{note.body}</p>
            </aside>
          ))}
        </div>
      ) : null}

      {section.media ? <MediaGroup items={[section.media]} /> : null}
    </>
  );
}

function SectionBody({ section }: { section: CaseSection }) {
  switch (section.kind) {
    case "problem":
      return <ProblemView section={section} />;
    case "journey":
      return <JourneyView section={section} />;
    case "solution":
      return <SolutionView section={section} />;
    case "decisions":
      return (
        <div className="case-decisions">
          {section.items.map((decision, index) => (
            <DecisionCard decision={decision} index={index} key={decision.title} />
          ))}
        </div>
      );
    case "system":
      return <SystemView section={section} />;
    case "process":
      return <ProcessView section={section} />;
    case "future":
      return (
        <div className="case-future">
          {section.items.map((item, index) => (
            <article key={item.title}>
              <div className="case-future__top">
                <span className="case-index">{pad(index)}</span>
                <span className="case-tag">{section.tag}</span>
              </div>
              <h3>{item.title}</h3>
              <p>
                <RichText text={item.body} />
              </p>
            </article>
          ))}
        </div>
      );
    case "learnings":
      return (
        <ol className="case-learnings">
          {section.items.map((item, index) => (
            <li key={item.title}>
              <span className="case-index">{pad(index)}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "outcome":
      return (
        <>
          <div className="case-outcome">
            <div className="case-outcome__before">
              <span>Before</span>
              <p>{section.before}</p>
            </div>
            <span className="case-outcome__arrow" aria-hidden="true">
              <ArrowRight size={28} weight="bold" />
            </span>
            <div className="case-outcome__after">
              <span>After</span>
              <p>{section.after}</p>
            </div>
          </div>
          <div className="case-outcome__stat">
            <strong>{section.stat.value}</strong>
            <span>{section.stat.label}</span>
          </div>
          <p className="case-feedback">
            <RichText text={section.feedback} />
          </p>
        </>
      );
  }
}

function CaseSectionContent({ section }: { section: CaseSection }) {
  return (
    <>
      <div className="case-section-heading">
        <p>{section.eyebrow}</p>
        <h2>{section.title}</h2>
        {section.intro ? (
          <span>
            <RichText text={section.intro} />
          </span>
        ) : null}
      </div>

      <SectionBody section={section} />
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
            <a aria-current={isActiveNavLink(link) ? "page" : undefined} href={navHref(link)} key={link}>
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
          <a aria-current={isActiveNavLink(link) ? "page" : undefined} href={navHref(link)} key={link} onClick={closeMenu}>
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
          <a aria-current={isActiveNavLink(link) ? "page" : undefined} href={navHref(link)} key={link}>
            {link}
          </a>
        ))}
      </nav>
      <nav aria-label="Social links">
        {socialLinks.map((link) => (
          <a href={link.href} key={link.label} rel={link.href.startsWith("http") ? "noreferrer" : undefined} target={link.href.startsWith("http") ? "_blank" : undefined}>
            {link.label}
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
  const errorId = useId();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const digitRefs = useRef<Array<HTMLInputElement | null>>([]);
  const password = digits.join("");

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

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="protected-section">
      <div aria-hidden="true" className="protected-section__content">
        <div className="protected-section__preview-heading">
          <span />
          <strong />
          <strong />
          <span />
        </div>
        <div className="protected-section__preview-media" />
        <div className="protected-section__preview-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={`protected-preview-${index}`} />
          ))}
        </div>
      </div>

      <div className="protected-section__overlay">
        <div className="protected-section__card">
          <span className="protected-section__badge">NDA</span>
          <h3>Protected case study details</h3>
          <p>
            This section includes private product context covered by NDA. Enter the 4-digit access code to continue.
          </p>

          <form className="password-form protected-section__form" onSubmit={handleSubmit}>
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

            <button className="protected-section__button" type="submit">
              Unlock section
            </button>
          </form>
        </div>
      </div>
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
            I’m Aadhavan M, a Product Designer with 3+ years solving problems{" "}
            <span>
              through systems, structure, and AI-assisted workflows for scalable
              digital products.
            </span>
          </h1>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <p className="section-eyebrow" id="work-title">
            Featured work
          </p>

          <div className="project-list">
            {visibleProjects.map((project) => (
              <article className="project-card" key={project.slug}>
                <div className="project-content">
                  <p className={`proof-card proof-card--${project.tone}`}>{project.proof}</p>

                  <div className="project-copy">
                    <div>
                      <h2>{project.cardTitle}</h2>
                      <p>{project.cardSummary}</p>
                    </div>
                    <a className="button" href={withBasePath(`/work/${project.slug}`)}>
                      Read More
                    </a>
                  </div>
                </div>

                <div className="project-media" aria-hidden="true">
                  <img className={project.imageClass} src={resolveSrc(project.image)} alt="" />
                </div>
              </article>
            ))}
          </div>

{projects.length > 4 ? (
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
          ) : null}
        </section>

        <section className="contact-panel" aria-labelledby="contact-title">
          <h2 id="contact-title">
            Want to create <br />
            something awesome?
            <br />
            Drop me an email.
          </h2>
          <a href={gmailComposeUrl} rel="noreferrer" target="_blank">
            → aadhavanm.design@gmail.com
          </a>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function CaseStudyPage({ project }: { project: CaseStudy }) {
  const [activeTopic, setActiveTopic] = useState("overview");
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [showTocButton, setShowTocButton] = useState(false);
  const [isNdaUnlocked, setIsNdaUnlocked] = useState(() => getStoredNdaUnlock(project.slug));
  const firstProtectedIndex = project.sections.findIndex((section) => section.protected);
  const protectedEnd =
    firstProtectedIndex === -1
      ? -1
      : project.sections.findIndex((section, index) => index > firstProtectedIndex && !section.protected);
  const beforeSections = firstProtectedIndex === -1 ? project.sections : project.sections.slice(0, firstProtectedIndex);
  const protectedSections =
    firstProtectedIndex === -1
      ? []
      : project.sections.slice(firstProtectedIndex, protectedEnd === -1 ? undefined : protectedEnd);
  const afterSections =
    firstProtectedIndex === -1 || protectedEnd === -1 ? [] : project.sections.slice(protectedEnd);
  const protectedIds = new Set(protectedSections.map((section) => section.id));
  const topics = [
    { label: "Overview", target: "overview" },
    ...project.sections.map((section) => ({
      label: section.nav,
      target: !isNdaUnlocked && protectedIds.has(section.id) ? "protected-content" : section.id,
    })),
  ];
  const heroCover = resolveSrc(project.hero.src ?? project.image);

  useEffect(() => {
    // Highlight the last section whose top has passed a line 30% down the viewport.
    // A scroll check works for sections of any height, unlike intersection ratios.
    const targets = [...new Set(topics.map((topic) => topic.target))];

    function updateActiveTopic() {
      const line = window.innerHeight * 0.3;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = targets[0];

      for (const target of targets) {
        const section = document.getElementById(target);

        if (section && section.getBoundingClientRect().top - line <= 0) {
          current = target;
        }
      }

      if (atBottom) {
        current = targets[targets.length - 1];
      }

      setActiveTopic(current);
      setShowTocButton(window.scrollY > 320);
    }

    updateActiveTopic();
    window.addEventListener("scroll", updateActiveTopic, { passive: true });
    window.addEventListener("resize", updateActiveTopic);

    return () => {
      window.removeEventListener("scroll", updateActiveTopic);
      window.removeEventListener("resize", updateActiveTopic);
    };
  }, [isNdaUnlocked, project.slug]);

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
    if (!isTocOpen) {
      return;
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsTocOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isTocOpen]);

  const activeTopicLabel = topics.find((topic) => topic.target === activeTopic)?.label ?? "Overview";

  function renderSection(section: CaseSection, className = "case-section") {
    return (
      <section className={className} id={section.id} key={section.id}>
        <CaseSectionContent section={section} />
      </section>
    );
  }

  return (
    <>
      <Header />

      <main className="case-study">
        <nav className="case-topic-nav" aria-label="Case study topics">
          {topics.map((topic, index) => {
            const isFirstForTarget = topics.findIndex((item) => item.target === topic.target) === index;

            return (
              <a
                aria-current={activeTopic === topic.target && isFirstForTarget ? "true" : undefined}
                href={`#${topic.target}`}
                key={`${topic.label}-${topic.target}`}
              >
                {topic.label}
              </a>
            );
          })}
        </nav>

        <button
          aria-controls="mobile-toc"
          aria-expanded={isTocOpen}
          className={`mobile-toc-button${showTocButton || isTocOpen ? " is-visible" : ""}`}
          onClick={() => setIsTocOpen((open) => !open)}
          type="button"
        >
          <List aria-hidden="true" size={18} weight="bold" />
          <span className="mobile-toc-button__label">
            <span className="sr-only">Contents, current section: </span>
            {activeTopicLabel}
          </span>
          <span className="mobile-toc-button__count" aria-hidden="true">
            {Math.max(1, topics.findIndex((topic) => topic.target === activeTopic) + 1)}/{topics.length}
          </span>
        </button>

        {isTocOpen ? (
          <div className="mobile-toc" role="presentation">
            <button aria-label="Close contents" className="mobile-toc__backdrop" onClick={() => setIsTocOpen(false)} type="button" />
            <nav aria-label="Case study contents" className="mobile-toc__sheet" id="mobile-toc">
              <div className="mobile-toc__header">
                <strong>Contents</strong>
                <button aria-label="Close contents" onClick={() => setIsTocOpen(false)} type="button">
                  <X aria-hidden="true" size={18} weight="bold" />
                </button>
              </div>
              <ol>
                {topics.map((topic, index) => {
                  const isFirstForTarget = topics.findIndex((item) => item.target === topic.target) === index;
                  const isActive = activeTopic === topic.target && isFirstForTarget;

                  return (
                    <li key={`mobile-${topic.label}-${topic.target}`}>
                      <a aria-current={isActive ? "true" : undefined} href={`#${topic.target}`} onClick={() => setIsTocOpen(false)}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {topic.label}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        ) : null}

        <section className="case-hero" id="overview">
          <a className="case-back" href={withBasePath("/#work")}>
            ← All case studies
          </a>
          <h1>{project.headline}</h1>
          <div className="case-lead">
            <p>{project.hook}</p>
            <p>{project.summary}</p>
          </div>
          {project.hero.kind === "video" && project.hero.src ? (
            <CaseHeroVideo coverImage={resolveSrc(project.image)} title={project.cardTitle} videoSrc={resolveSrc(project.hero.src)} />
          ) : (
            <figure className="case-hero-media case-hero-image">
              <img alt={project.hero.caption} src={heroCover} />
            </figure>
          )}
          <StatStrip stats={project.stats} />
          <dl className="case-meta">
            {project.meta.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {beforeSections.map((section) => renderSection(section))}

        {protectedSections.length > 0 ? (
          <section className="case-section protected-case-section" id={isNdaUnlocked ? undefined : "protected-content"}>
            <PasswordProtectedContent
              isUnlocked={isNdaUnlocked}
              onUnlock={() => setIsNdaUnlocked(true)}
              projectSlug={project.slug}
            >
              {protectedSections.map((section) => renderSection(section, "case-section protected-case-section__item"))}
            </PasswordProtectedContent>
          </section>
        ) : null}

        {afterSections.map((section) => renderSection(section))}

        <section className="contact-panel" id="contact" aria-labelledby="case-contact-title">
          <h2 id="case-contact-title">
            Want to create <br />
            something awesome?
            <br />
            Drop me an email.
          </h2>
          <a href={gmailComposeUrl} rel="noreferrer" target="_blank">
            → aadhavanm.design@gmail.com
          </a>
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

  return (
    <div className="site-shell bg-portfolio-canvas text-portfolio-ink font-sans">
      {project ? <CaseStudyPage project={project} /> : <HomePage />}
    </div>
  );
}

export default App;
