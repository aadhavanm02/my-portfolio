import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowSquareOut,
  ChatCircleDots,
  CheckCircle,
  EnvelopeSimple,
  Cube,
  Exam,
  Notebook,
  TShirt,
  Camera,
  Horse,
  PencilLine,
  ArrowsOutSimple,
  CaretLeft,
  CaretRight,
  Check,
  ClockCounterClockwise,
  Flag,
  GearSix,
  GitFork,
  LinkedinLogo,
  List,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Pause,
  PencilSimpleLine,
  Phone,
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
  type MediaFrame,
  type MediaItem,
  type Stat,
} from "./caseStudies";
import { skillGroups, skills, type Skill, type SkillGroup, type SkillVisual } from "./skills";
import { about } from "./about";
import { playgroundItems, type PlaygroundIcon, type PlaygroundItem } from "./playground";

const navLinks = ["Work", "Skills", "Playground", "About"];
const ndaPassword = "0511";
const ndaStoragePrefix = "portfolio-nda-unlocked-until";
const ndaUnlockDurationMs = 60 * 60 * 1000;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const videoSpeeds = [0.75, 1, 1.25, 1.5, 2];
// The site's primary accent (Flamingo). Keep in sync with --brand in styles.css.
const siteBrand = "#F06434";
const contactEmail = "aadhavanm.design@gmail.com";
const linkedInUrl = "https://www.linkedin.com/in/aadhavan-m/";
const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}`;
// Add your number to show the Call button, for example:
// { display: "+91 98765 43210", tel: "+919876543210" }
const contactPhone: { display: string; tel: string } | null = { display: "+91 94861 39376", tel: "+919486139376" };
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

function currentPath() {
  const pathname = window.location.pathname.startsWith(`${basePath}/`)
    ? window.location.pathname.slice(basePath.length)
    : window.location.pathname;

  return pathname.replace(/\/$/, "") || "/";
}

function navHref(link: string) {
  if (link === "Work") {
    return withBasePath("/");
  }

  return withBasePath(`/${link.toLowerCase()}`);
}

function isActiveNavLink(link: string) {
  const path = currentPath();

  if (link === "Work") {
    return path === "/" || path.startsWith("/work/");
  }

  return path === `/${link.toLowerCase()}`;
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
  // While playing, the controls fade out after a few quiet seconds; any movement brings them back.
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef(0);

  const activeVideoRef = activePlayer === "expanded" ? expandedVideoRef : inlineVideoRef;

  const wakeControls = useCallback(() => {
    setIsIdle(false);
    window.clearTimeout(idleTimerRef.current);
    if (isPlaying) {
      idleTimerRef.current = window.setTimeout(() => setIsIdle(true), 2500);
    }
  }, [isPlaying]);

  useEffect(() => {
    wakeControls();
    return () => window.clearTimeout(idleTimerRef.current);
  }, [wakeControls, isExpanded]);

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

    // Floating page controls (back to top, contents) hide while the video fills the screen.
    document.body.classList.add("is-video-expanded");
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.classList.remove("is-video-expanded");
      window.removeEventListener("keydown", handleEscape);
    };
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
      <div
        className={`case-video__player case-video__player--${mode}${hasStarted ? " case-video__player--started" : ""}${
          isIdle && isPlaying ? " case-video__player--idle" : ""
        }`}
        onFocus={wakeControls}
        onKeyDown={wakeControls}
        onPointerDown={wakeControls}
        onPointerMove={wakeControls}
      >
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
        <div className={`case-video-modal${isIdle && isPlaying ? " case-video-modal--idle" : ""}`} role="presentation">
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

// ---------- Screenshots: pre-cropped images on a clean backdrop ----------

function ShotLightbox({ src, caption, onClose }: { src: string; caption: string; onClose: () => void }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: globalThis.KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div aria-label={caption} aria-modal="true" className="shot-lightbox" onClick={onClose} role="dialog">
      <button aria-label="Close screenshot" className="shot-lightbox__close" onClick={onClose} type="button">
        <X aria-hidden="true" size={22} weight="bold" />
      </button>
      <img alt={caption} onClick={(event) => event.stopPropagation()} src={src} />
    </div>
  );
}

function ShotImage({ frame, caption, onOpen }: { frame: MediaFrame; caption: string; onOpen: (src: string) => void }) {
  const src = resolveSrc(frame.src);
  return (
    <button aria-label={`View full size: ${frame.label ?? caption}`} className="shot-image" onClick={() => onOpen(src)} type="button">
      <img alt={frame.label ?? caption} height={frame.size[1]} loading="lazy" src={src} width={frame.size[0]} />
    </button>
  );
}

function ShotMedia({ item, thumb }: { item: MediaItem; thumb?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const frames: MediaFrame[] = item.row ?? (item.src && item.size ? [{ src: item.src, size: item.size }] : []);

  return (
    <figure className={`shot${item.row ? " shot--row" : ""}${thumb ? " shot--thumb" : ""}`}>
      <div className="shot-stage">
        {frames.map((frame, index) => (
          <div className="shot-stage__item" key={`${frame.src}-${index}`} style={{ ["--a" as string]: frame.size[0] / frame.size[1] }}>
            <ShotImage caption={item.alt ?? item.caption} frame={frame} onOpen={setOpen} />
            {frame.label ? <span className="shot-stage__label">{frame.label}</span> : null}
          </div>
        ))}
      </div>
      {item.caption ? <figcaption>{item.caption}</figcaption> : null}
      {open ? <ShotLightbox caption={item.alt ?? item.caption} onClose={() => setOpen(null)} src={open} /> : null}
    </figure>
  );
}

const isShot = (item: MediaItem) => Boolean(item.row || (item.src && item.size));

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
  if (isShot(item)) {
    return <ShotMedia item={item} thumb />;
  }

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
  if (items.some(isShot)) {
    // Several single screenshots side by side share one frame size, so none looks bigger than the rest.
    const uniform = items.filter((item) => isShot(item) && !item.row).length > 1;
    return (
      <div className={`shot-group${uniform ? " shot-group--uniform" : ""}`}>
        {items.map((item, index) => (
          <div className={item.row ? "shot-group__wide" : undefined} key={`${item.alt ?? item.caption}-${index}`}>
            {isShot(item) ? <ShotMedia item={item} /> : <MediaPlaceholder item={item} />}
          </div>
        ))}
      </div>
    );
  }

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
      {section.goals ? (
        <div className="case-goals">
          <span className="case-goals__label">The business goal</span>
          {section.goalsIntro ? <p className="case-goals__intro">{section.goalsIntro}</p> : null}
          <ol>
            {section.goals.map((goal, index) => (
              <li key={goal.title}>
                <span className="case-goals__num">{index + 1}</span>
                <div>
                  <strong>{goal.title}</strong>
                  <p>{goal.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

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

      {section.note ? (
        <aside className="case-note case-problem-note">
          <h4>{section.note.title}</h4>
          <p>{section.note.body}</p>
        </aside>
      ) : null}

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

  const video = section.video;

  return (
    <div className="case-journey">
      {video?.src ? (
        <div className="case-journey__video">
          <CaseHeroVideo
            coverImage={resolveSrc(video.poster ?? video.src)}
            title={video.alt ?? video.caption}
            videoSrc={resolveSrc(video.src)}
          />
          {video.caption ? <p className="case-journey__video-caption">{video.caption}</p> : null}
        </div>
      ) : video ? (
        <MediaGroup items={[video]} />
      ) : null}

      {lane ? (
        <>
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
        </>
      ) : null}
    </div>
  );
}

function SolutionView({ section }: { section: Extract<CaseSection, { kind: "solution" }> }) {
  return (
    <>
      <div className="case-features">
        {section.items.map((item, index) => (
          <article className={`case-feature${index % 2 ? " case-feature--flip" : ""}`} key={item.title}>
            <div className="case-feature__media">
              {item.media ? <MediaGroup items={[item.media]} /> : null}
            </div>

            <div className="case-feature__body">
              <div className="case-feature__meta">
                <span className="case-index">{pad(index)}</span>
                {item.area ? <span className="case-tag">{item.area}</span> : null}
              </div>
              <h3>{item.title}</h3>
              <p className="case-feature__detail">{item.detail}</p>

              <div className={`case-feature__compare${item.before ? "" : " case-feature__compare--single"}`}>
                {item.before ? (
                  <div className="case-feature__before">
                    <span>
                      <X aria-hidden="true" size={12} weight="bold" />
                      Before
                    </span>
                    <p>{item.before}</p>
                  </div>
                ) : null}
                <div className="case-feature__after">
                  <span>
                    <Check aria-hidden="true" size={12} weight="bold" />
                    {item.before ? "After" : "What it does"}
                  </span>
                  <p>{item.after}</p>
                </div>
              </div>

              {item.highlights ? (
                <ul className="case-feature__highlights" aria-label="Key details">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </div>
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

function DecisionStep({
  children,
  icon,
  label,
  variant,
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
  variant: "before" | "turning" | "next" | "result";
}) {
  return (
    <li className={`case-flow__step case-flow__step--${variant}`}>
      <span className="case-flow__marker" aria-hidden="true">
        {icon}
      </span>
      <div className="case-flow__body">
        <h4>{label}</h4>
        {children}
      </div>
    </li>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((text) => (
        <p key={text}>
          <RichText text={text} />
        </p>
      ))}
    </>
  );
}

function DecisionCard({ decision, index }: { decision: DecisionItem; index: number }) {
  return (
    <article className="case-decision">
      <header>
        <span className="case-index">Decision {pad(index)}</span>
        <h3>{decision.title}</h3>
      </header>

      <blockquote className="case-decision__hook">
        <span>Hook</span>
        <p>{decision.hook}</p>
      </blockquote>

      <ol className="case-flow">
        <DecisionStep icon={<ClockCounterClockwise size={18} weight="bold" />} label="Before the decision" variant="before">
          <Paragraphs items={decision.before} />
        </DecisionStep>

        <DecisionStep icon={<GitFork size={18} weight="bold" />} label="Turning point" variant="turning">
          <p>{decision.turningIntro}</p>
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
                <h5>{option.title}</h5>
                <p>{option.body}</p>
              </div>
            ))}
          </div>
          <Paragraphs items={decision.reasoning} />
        </DecisionStep>

        <DecisionStep icon={<PencilSimpleLine size={18} weight="bold" />} label="What I did next" variant="next">
          <Paragraphs items={decision.next} />
          {decision.nextList ? (
            <ul>
              {decision.nextList.map((item) => (
                <li key={item}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          ) : null}
        </DecisionStep>

        <DecisionStep icon={<Flag size={18} weight="bold" />} label="Result" variant="result">
          <div className="case-flow__result">
            <Paragraphs items={decision.result} />
          </div>
        </DecisionStep>
      </ol>

      {decision.media ? (
        <div className="case-decision__media">
          <span className="case-decision__media-label">The designs</span>
          <MediaGroup items={decision.media} />
        </div>
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
  const detailed = section.steps.some((step) => step.title);

  return (
    <>
      {detailed ? (
        <div className="case-process">
          {section.steps.map((step, index) => (
            <article className="case-process__step" key={step.label}>
              <div className="case-process__aside">
                <span className="case-process__num">{pad(index)}</span>
                <span className="case-tag">{step.label}</span>
              </div>
              <div className="case-process__content">
              <h3>{step.title ?? step.label}</h3>
              <p className="case-process__text">
                <RichText text={step.body} />
              </p>
              {step.details?.map((detail) => (
                <p className="case-process__text" key={detail}>
                  <RichText text={detail} />
                </p>
              ))}
              {step.points ? (
                <ul className="case-feature__highlights" aria-label="Key details">
                  {step.points.map((point) => (
                    <li key={point}>
                      <RichText text={point} />
                    </li>
                  ))}
                </ul>
              ) : null}
              {step.media ? (
                <div className="case-process__media">
                  <MediaGroup items={[step.media]} />
                </div>
              ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
      <ol className="case-timeline" style={{ ["--steps" as string]: section.steps.length }}>
        {section.steps.map((step, index) => (
          <li key={step.label}>
            <span className="case-timeline__dot">{index + 1}</span>
            <strong>{step.label}</strong>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
      )}

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
          {section.media ? (
            <div className="case-future__media">
              <MediaGroup items={section.media} />
            </div>
          ) : null}
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
      <a className="footer__social" href={linkedInUrl} rel="noreferrer" target="_blank">
        LinkedIn
      </a>
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

// Small animated layers drawn on top of the home page screenshots, so a cursor, hover
// state or chart tooltip looks like it is moving inside the product. Positions are in
// percent of the screenshot, so they stay in place at every card size.
const cursorIcon = (
  <svg className="shot-cursor__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 2.5 19.5 13l-7 1.3 4 7.2-3 1.6-4-7.3L4 20.2Z" />
  </svg>
);

// Chart curve positions sampled from the Cart Abandonment screenshot (natural pixels).
const cartCurve: [number, number][] = [
  [260, 1040], [300, 1018], [340, 999], [380, 988], [420, 985], [460, 986], [500, 989], [540, 988],
  [580, 985], [620, 983], [660, 986], [700, 995], [740, 1013], [780, 1035], [820, 1056], [860, 1074],
  [900, 1084], [940, 1086], [980, 1076], [1020, 1054], [1060, 1023], [1100, 990],
];
const cartImage = { width: 2756, height: 2872, yellowOffset: 146 };

function curveY(x: number) {
  for (let i = 1; i < cartCurve.length; i++) {
    const [x1, y1] = cartCurve[i];
    if (x <= x1) {
      const [x0, y0] = cartCurve[i - 1];
      const t = (x - x0) / (x1 - x0);
      // Smoothstep between samples keeps the dot gliding instead of zig-zagging.
      return y0 + (y1 - y0) * (t * t * (3 - 2 * t));
    }
  }
  return cartCurve[cartCurve.length - 1][1];
}

const chartValue = (y: number) => Math.round(((1090 - y) / 112.25) * 1000 + 2000);
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

function CartChartMotion() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [x, setX] = useState(560);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let visible = false;
    const start = performance.now();
    const [minX, maxX] = [cartCurve[0][0], cartCurve[cartCurve.length - 1][0]];
    const loop = 9000;

    function tick(now: number) {
      // Ease out to the right, pause, ease back, pause.
      const p = ((now - start) % loop) / loop;
      const phase = p < 0.42 ? p / 0.42 : p < 0.5 ? 1 : p < 0.92 ? 1 - (p - 0.5) / 0.42 : 0;
      const eased = phase < 0.5 ? 2 * phase * phase : 1 - Math.pow(-2 * phase + 2, 2) / 2;
      setX(minX + (maxX - minX) * eased);
      if (visible) frame = requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(tick);
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const orangeY = curveY(x);
  const yellowY = orangeY + cartImage.yellowOffset;
  const day = Math.round(1 + (x - 195) / (2408 / 29));
  const pctX = (x / cartImage.width) * 100;
  const pct = (y: number) => `${(y / cartImage.height) * 100}%`;

  return (
    <div className="shot-motion shot-motion--chart" ref={rootRef}>
      {/* Phones crop the card above the chart, so they hover the stat cards instead. */}
      <span className="shot-stat" />
      <span className="shot-cursor shot-cursor--stat">{cursorIcon}</span>
      <span className="shot-chart__line" style={{ left: `${pctX}%`, top: pct(750), height: pct(560) }} />
      <span className="shot-chart__dot shot-chart__dot--orange" style={{ left: `${pctX}%`, top: pct(orangeY) }} />
      <span className="shot-chart__dot shot-chart__dot--yellow" style={{ left: `${pctX}%`, top: pct(yellowY) }} />
      <span className="shot-chart__tip" style={{ left: `${pctX}%`, top: pct(orangeY - 150) }}>
        <b>Day {day}</b>
        <span>
          <i className="is-orange" /> {money(chartValue(orangeY))}
        </span>
        <span>
          <i className="is-yellow" /> {money(chartValue(yellowY))}
        </span>
      </span>
    </div>
  );
}

function ShotMotion({ kind }: { kind: string }) {
  if (kind === "cart-abandonment-recovery") {
    return <CartChartMotion />;
  }

  if (kind === "superfans-social-feed") {
    return (
      <div className="shot-motion shot-motion--superfans">
        <span className="shot-row" />
        <span className="shot-side" />
        <span className="shot-cursor">
          {cursorIcon}
          <span className="shot-cursor__ripple" />
        </span>
      </div>
    );
  }

  if (kind === "modern-cart") {
    return (
      <div className="shot-motion shot-motion--modern">
        <span className="shot-pill" />
        <span className="shot-press" />
        <span className="shot-cursor">
          {cursorIcon}
          <span className="shot-cursor__ripple" />
        </span>
      </div>
    );
  }

  return null;
}

type WorkCard = {
  key: string;
  title: string;
  summary: string;
  proof: string;
  tone: "violet" | "peach";
  image: string;
  imageClass?: string;
  href?: string;
  brand?: string;
};

// Work shown on the home page before it has a full case study. Add `href` once the case study exists.
const upcomingWork: WorkCard[] = [];

const workCards: WorkCard[] = [
  ...upcomingWork,
  ...projects.map((project) => ({
    key: project.slug,
    title: project.cardTitle,
    summary: project.cardSummary,
    proof: project.proof,
    tone: project.tone,
    image: project.image,
    imageClass: project.imageClass,
    href: `/work/${project.slug}`,
    brand: project.brand,
  })),
];

function HomePage() {
  const [showMoreProjects, setShowMoreProjects] = useState(false);
  const visibleProjects = showMoreProjects ? workCards : workCards.slice(0, 4);

  return (
    <>
      <Header />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">
            I’m Aadhavan M, a Product Designer with 4+ years solving problems{" "}
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
              <article
                className={`project-card${project.brand ? " brand-scope" : ""}`}
                key={project.key}
                style={project.brand ? { ["--brand" as string]: project.brand } : undefined}
              >
                <div className="project-content">
                  <p className={`proof-card proof-card--${project.brand ? "peach" : project.tone}`}>{project.proof}</p>

                  <div className="project-copy">
                    <div>
                      <h2>{project.title}</h2>
                      <p>{project.summary}</p>
                    </div>
                    {project.href ? (
                      <a className="button" href={withBasePath(project.href)}>
                        Read More
                      </a>
                    ) : (
                      <span className="button button--soon">Case study coming soon</span>
                    )}
                  </div>
                </div>

                <div className="project-media" aria-hidden="true">
                  <div className={`project-shot ${project.imageClass ?? ""}`}>
                    <img src={resolveSrc(project.image)} alt="" />
                    <ShotMotion kind={project.key} />
                  </div>
                </div>
              </article>
            ))}
          </div>

{workCards.length > 4 ? (
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

        <ContactPanel id="contact-title" />
      </main>

      <SiteFooter />
    </>
  );
}

let activeScrollFrame = 0;

// Glide to a section: eases in, speeds up, then settles. Longer jumps get a little more time.
function smoothScrollToId(id: string, offset = 24) {
  const target = document.getElementById(id);

  if (!target) {
    return;
  }

  const startY = window.scrollY;
  const endY = Math.max(0, target.getBoundingClientRect().top + startY - offset);
  const distance = endY - startY;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.cancelAnimationFrame(activeScrollFrame);
  window.history.replaceState(null, "", `#${id}`);

  if (prefersReducedMotion || Math.abs(distance) < 2) {
    window.scrollTo({ top: endY, behavior: "instant" });
    return;
  }

  const duration = Math.min(1100, Math.max(500, Math.abs(distance) * 0.35));
  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  let startTime = 0;

  // The page has CSS smooth scrolling on, which would fight each frame, so turn it off while gliding.
  root.style.scrollBehavior = "auto";

  function step(now: number) {
    if (!startTime) {
      startTime = now;
    }

    const progress = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));

    if (progress < 1) {
      activeScrollFrame = window.requestAnimationFrame(step);
    } else {
      root.style.scrollBehavior = previousBehavior;
    }
  }

  activeScrollFrame = window.requestAnimationFrame(step);
}

function handleSectionLink(event: MouseEvent<HTMLAnchorElement>, id: string) {
  // Keep normal behaviour for new-tab clicks.
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
    return;
  }

  event.preventDefault();
  smoothScrollToId(id);
}

function MoreCaseStudies({ current }: { current: CaseStudy }) {
  const others = projects.filter((item) => item.slug !== current.slug);

  if (others.length === 0) {
    return null;
  }

  return (
    <section className="case-section more-cases" aria-labelledby="more-cases-title">
      <div className="case-section-heading">
        <p>Keep exploring</p>
        <h2 id="more-cases-title">More case studies</h2>
      </div>

      <div className="more-cases__grid">
        {others.map((item) => (
          <a
            className="more-case brand-scope"
            href={withBasePath(`/work/${item.slug}`)}
            key={item.slug}
            // Each card uses its own case study's brand, not the page it sits on.
            style={{ ["--brand" as string]: item.brand ?? siteBrand }}
          >
            <span className="more-case__media" aria-hidden="true">
              <img alt="" loading="lazy" src={resolveSrc(item.image)} />
            </span>
            <span className="more-case__body">
              <span className="more-case__proof">{item.proof}</span>
              <strong>{item.cardTitle}</strong>
              <span className="more-case__summary">{item.cardSummary}</span>
              <span className="more-case__link">
                Read case study <ArrowRight aria-hidden="true" size={16} weight="bold" />
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function CaseStudyPage({ project }: { project: CaseStudy }) {
  const [activeTopic, setActiveTopic] = useState("overview");
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [showTocButton, setShowTocButton] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
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
      // Hide the floating contents button at the very bottom so it never covers the footer links.
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 220;
      setShowTocButton(window.scrollY > 320 && !nearBottom);
    }

    function handleScroll() {
      updateActiveTopic();
    }

    updateActiveTopic();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveTopic);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveTopic);
    };
  }, [isNdaUnlocked, project.slug]);

  // The rail shows a section's name when you arrive in it, then hides it again after a moment,
  // even if you keep scrolling within that section. The first section on load stays quiet.
  const shownTopicRef = useRef(activeTopic);

  useEffect(() => {
    if (shownTopicRef.current === activeTopic) {
      return;
    }

    shownTopicRef.current = activeTopic;
    setIsScrolling(true);
    const hideTimer = window.setTimeout(() => setIsScrolling(false), 1800);

    return () => window.clearTimeout(hideTimer);
  }, [activeTopic]);

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

  useEffect(() => {
    // The page renders after load, so the browser can't jump to a #section on its own.
    const target = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;

    if (target) {
      window.setTimeout(() => target.scrollIntoView({ block: "start", behavior: "instant" }), 50);
    }
  }, [project.slug]);

  const activeTopicLabel = topics.find((topic) => topic.target === activeTopic)?.label ?? "Overview";
  const activeTopicIndex = topics.findIndex((topic) => topic.target === activeTopic);

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

      <main
        className={`case-study${project.brand ? " brand-scope" : ""}`}
        style={project.brand ? { ["--brand" as string]: project.brand } : undefined}
      >
        <nav
          aria-label="Case study topics"
          className={`case-topic-nav${isScrolling ? " is-scrolling" : ""}`}
          style={{ ["--toc-progress" as string]: `${(Math.max(0, activeTopicIndex) / Math.max(1, topics.length - 1)) * 100}%` }}
        >
          <span className="case-topic-nav__rail" aria-hidden="true">
            <i />
          </span>
          {topics.map((topic, index) => {
            const isFirstForTarget = topics.findIndex((item) => item.target === topic.target) === index;
            const isActive = activeTopic === topic.target && isFirstForTarget;
            const state = isActive ? " is-active" : index < activeTopicIndex ? " is-past" : "";

            return (
              <a
                aria-current={isActive ? "true" : undefined}
                className={`case-topic-nav__item${state}`}
                href={`#${topic.target}`}
                key={`${topic.label}-${topic.target}`}
                onClick={(event) => handleSectionLink(event, topic.target)}
              >
                <span className="case-topic-nav__num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="case-topic-nav__label">{topic.label}</span>
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
                      <a aria-current={isActive ? "true" : undefined} href={`#${topic.target}`}
                        onClick={(event) => {
                          setIsTocOpen(false);
                          handleSectionLink(event, topic.target);
                        }}
                      >
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
            <p className="case-lead__hook">{project.hook}</p>
            <p>{project.summary}</p>
          </div>
          {project.hero.kind === "video" && project.hero.src ? (
            <CaseHeroVideo coverImage={resolveSrc(project.image)} title={project.cardTitle} videoSrc={resolveSrc(project.hero.src)} />
          ) : (
            <figure className="case-hero-media case-hero-image">
              <img alt={project.hero.caption} src={heroCover} />
            </figure>
          )}
          <div className="case-facts">
            <StatStrip stats={project.stats} />
            <dl className="case-meta">
              {project.meta.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
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

        <MoreCaseStudies current={project} />

        <ContactPanel id="case-contact-title" />
      </main>

      <SiteFooter />
    </>
  );
}

function studyName(slug: string) {
  return projects.find((item) => item.slug === slug)?.cardTitle.replace(/ for WooCommerce$/, "") ?? slug;
}

function isTouchPhone() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers, or a page without clipboard permission.
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  }
}

function ContactPanel({ id }: { id: string }) {
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(""), 2600);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function handleEmail(event: MouseEvent<HTMLAnchorElement>) {
    // Phones open their mail app from the mailto: link. On desktop, open Gmail's compose
    // window instead, since many computers have no mail app set up for mailto: links.
    if (!isTouchPhone()) {
      event.preventDefault();
      window.open(gmailComposeUrl, "_blank", "noopener,noreferrer");
    }
  }

  async function handlePhone(event: MouseEvent<HTMLAnchorElement>) {
    // Phones follow the tel: link into the dialer. Desktops copy the number instead.
    if (isTouchPhone() || !contactPhone) {
      return;
    }

    event.preventDefault();
    const copied = await copyText(contactPhone.display);
    setToast(copied ? "Mobile number copied" : `Couldn't copy. The number is ${contactPhone.display}`);
  }

  return (
    <section aria-labelledby={id} className="contact-panel contact-panel--split">
      <div className="contact-panel__intro">
        <p className="contact-panel__eyebrow">Contact</p>
        <h2 id={id}>
          Want to create something awesome? <span>Let's talk.</span>
        </h2>
      </div>

      <ul className="contact-rows">
        <li>
          <a className="contact-row" href={`mailto:${contactEmail}`} onClick={handleEmail}>
            <span className="contact-row__icon" aria-hidden="true">
              <EnvelopeSimple size={22} weight="bold" />
            </span>
            <span className="contact-row__text">
              <small>Email</small>
              <strong>
                {contactEmail.split("@")[0]}@<wbr />
                {contactEmail.split("@")[1]}
              </strong>
            </span>
            <span className="contact-row__arrow" aria-hidden="true">
              <ArrowRight size={18} weight="bold" />
            </span>
          </a>
        </li>
        {contactPhone ? (
          <li>
            <a className="contact-row" href={`tel:${contactPhone.tel}`} onClick={handlePhone}>
              <span className="contact-row__icon" aria-hidden="true">
                <Phone size={22} weight="bold" />
              </span>
              <span className="contact-row__text">
                <small>Phone</small>
                <strong>{contactPhone.display}</strong>
              </span>
              <span className="contact-row__arrow" aria-hidden="true">
                <ArrowRight size={18} weight="bold" />
              </span>
            </a>
          </li>
        ) : null}
        <li>
          <a className="contact-row" href={linkedInUrl} rel="noreferrer" target="_blank">
            <span className="contact-row__icon" aria-hidden="true">
              <LinkedinLogo size={22} weight="bold" />
            </span>
            <span className="contact-row__text">
              <small>LinkedIn</small>
              <strong>in/aadhavan-m</strong>
            </span>
            <span className="contact-row__arrow" aria-hidden="true">
              <ArrowRight size={18} weight="bold" />
            </span>
          </a>
        </li>
      </ul>

      <div aria-live="polite" className={`site-toast${toast ? " is-visible" : ""}`} role="status">
        {toast ? (
          <>
            <CheckCircle aria-hidden="true" size={20} weight="fill" />
            {toast}
          </>
        ) : null}
      </div>
    </section>
  );
}

function SkillArt({ type }: { type: SkillVisual }) {
  switch (type) {
    case "nav":
      return (
        <div className="art art--nav">
          <div className="art-nav__bar">
            <span>Dashboard</span>
            <span>Emails</span>
            <span className="is-active">Reports ▾</span>
            <span>Settings</span>
          </div>
          <div className="art-nav__menu">
            <span>Email Report</span>
            <span>Product Report</span>
          </div>
        </div>
      );
    case "interaction":
      return (
        <div className="art art--interaction">
          <span className="art-pill art-pill--before">Got a Discount Code? ▾</span>
          <ArrowRight aria-hidden="true" size={18} weight="bold" />
          <span className="art-pill art-pill--after">
            SAVE10 <X aria-hidden="true" size={12} weight="bold" />
          </span>
        </div>
      );
    case "chart":
      return (
        <div className="art art--chart">
          <svg viewBox="0 0 240 110" aria-hidden="true" preserveAspectRatio="none">
            <path className="art-chart__gap" d="M0 30 C40 22 60 40 100 28 S170 12 240 18 L240 70 C200 74 170 60 120 66 S40 78 0 80 Z" />
            <path className="art-chart__top" d="M0 30 C40 22 60 40 100 28 S170 12 240 18" />
            <path className="art-chart__bottom" d="M0 80 C40 78 70 72 120 66 S200 74 240 70" />
          </svg>
          <div className="art-chart__legend">
            <span><i className="dot-top" />Recoverable</span>
            <span><i className="dot-bottom" />Recovered</span>
          </div>
        </div>
      );
    case "layers":
      return (
        <div className="art art--layers">
          {["Atoms", "Molecules", "Patterns", "Templates"].map((level, index) => (
            <span key={level} style={{ width: `${40 + index * 20}%` }}>
              {level}
            </span>
          ))}
        </div>
      );
    case "research":
      return (
        <div className="art art--research">
          {["S", "F", "M", "C", "Y"].map((letter, index) => (
            <span className={index === 1 ? "is-focus" : ""} key={letter}>
              {letter}
            </span>
          ))}
          <small>5 competitors reviewed</small>
        </div>
      );
    case "cart":
      return (
        <div className="art art--cart">
          <div className="art-cart__panel">
            <strong>Your cart is empty, let's fix that</strong>
            <div className="art-cart__item">
              <i />
              <span>
                <b>Canvas sneaker</b>
                <small>₹2,499</small>
              </span>
              <em>+</em>
            </div>
          </div>
        </div>
      );
    case "options":
      return (
        <div className="art art--options">
          <div>
            <b>A</b>
            <span>Hide</span>
          </div>
          <div className="is-chosen">
            <b>B</b>
            <span>Show locked</span>
            <Check aria-hidden="true" size={14} weight="bold" />
          </div>
        </div>
      );
    case "timeline":
      return (
        <div className="art art--timeline">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <span className={index < 6 ? "is-done" : "is-launch"} key={`${day}-${index}`}>
              {index < 6 ? day : "🚀"}
            </span>
          ))}
          <small>Launch in one week</small>
        </div>
      );
    case "devices":
      return (
        <div className="art art--devices">
          <span className="art-device art-device--desktop" />
          <span className="art-device art-device--tablet" />
          <span className="art-device art-device--phone" />
        </div>
      );
    case "feed":
      return (
        <div className="art art--feed">
          <div className="art-feed__phone">
            <div className="art-feed__video">
              <span className="art-feed__actions">
                <i>♥</i>
                <i>💬</i>
              </span>
              <span className="art-feed__tag">Shop ›</span>
            </div>
          </div>
          <div className="art-feed__comment">
            <b>Karan</b>
            <span>Does it run true to size?</span>
          </div>
        </div>
      );
    case "moderation":
      return (
        <div className="art art--moderation">
          <div className="art-mod__row">
            <span className="art-mod__reason">Reported · Spam</span>
            <span className="art-mod__status">Hidden ▾</span>
          </div>
          <div className="art-mod__menu">
            <span>Visible</span>
            <span className="is-active">Hidden</span>
          </div>
        </div>
      );
    case "onboarding":
      return (
        <div className="art art--onboarding">
          <div className="art-onb__sheet">
            <strong>Introducing Social Feed</strong>
            <div>
              <span>Explore</span>
              <span>Engage</span>
              <span>Shop</span>
              <span>Share</span>
            </div>
          </div>
        </div>
      );
    case "qa":
      return (
        <div className="art art--qa">
          {["Spacing", "Alignment", "States"].map((item) => (
            <div className="art-qa__row" key={item}>
              <span>{item}</span>
              <b>
                <Check aria-hidden="true" size={12} weight="bold" /> Fixed
              </b>
            </div>
          ))}
        </div>
      );
    case "writing":
      return (
        <div className="art art--writing">
          <span className="art-field art-field--before">Review Your Cart</span>
          <span className="art-field art-field--after">
            Your bag at DNK<i />
          </span>
        </div>
      );
  }
}

// A skill takes a case study's brand color only when every proof comes from that one branded
// case study. Mixed proofs, or proofs from unbranded case studies, keep the site's Flamingo orange.
function skillBrand(skill: Skill) {
  const brands = skill.proofs.map((proof) => projects.find((item) => item.slug === proof.study)?.brand);

  return brands.length > 0 && brands.every((brand) => brand && brand === brands[0]) ? brands[0] : undefined;
}

function SkillCard({ skill }: { skill: Skill }) {
  const brand = skillBrand(skill);

  return (
    <article
      className={`skill-card${brand ? " brand-scope" : ""}`}
      id={skill.id}
      style={brand ? { ["--brand" as string]: brand } : undefined}
    >
      <div className="skill-card__visual">
        <SkillArt type={skill.visual} />
      </div>
      <div className="skill-card__body">
        <span className="case-tag">{skill.group}</span>
        <h2>{skill.name}</h2>
        <p className="skill-card__definition">{skill.definition}</p>
        <ul className="skill-proofs">
          {skill.proofs.map((proof) => (
            <li key={proof.text}>
              <a href={withBasePath(`/work/${proof.study}#${proof.section}`)}>
                <span className="skill-proof__source">
                  {studyName(proof.study)} · {proof.sectionLabel}
                </span>
                <span className="skill-proof__text">{proof.text}</span>
                <ArrowRight aria-hidden="true" className="skill-proof__arrow" size={16} weight="bold" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function SkillsPage() {
  const [group, setGroup] = useState<"All" | SkillGroup>("All");
  const visible = group === "All" ? skills : skills.filter((skill) => skill.group === group);
  const proofCount = skills.reduce((total, skill) => total + skill.proofs.length, 0);

  return (
    <>
      <Header />

      <main className="page">
        <section className="page-hero">
          <p className="section-eyebrow">Skills</p>
          <h1>
            Skills, with <span>receipts.</span>
          </h1>
          <p>Every skill here links back to the moment in a case study where I used it.</p>
          <div className="page-hero__stats">
            <span>
              <strong>{skills.length}</strong> skills
            </span>
            <span>
              <strong>{projects.length}</strong> case studies
            </span>
            <span>
              <strong>{proofCount}</strong> proofs
            </span>
          </div>
        </section>

        <div className="skill-filters" role="group" aria-label="Filter skills">
          {(["All", ...skillGroups] as const).map((item) => (
            <button aria-pressed={group === item} key={item} onClick={() => setGroup(item)} type="button">
              {item}
            </button>
          ))}
        </div>

        <div className="skill-grid">
          {visible.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>

        <ContactPanel id="skills-contact-title" />
      </main>

      <SiteFooter />
    </>
  );
}

function Placeholder({ label = "To be added" }: { label?: string }) {
  return <span className="placeholder-chip">{label}</span>;
}

function AboutPage() {
  const hobbyIcons = {
    sketch: <PencilLine size={26} weight="bold" />,
    chess: <Horse size={26} weight="bold" />,
    camera: <Camera size={26} weight="bold" />,
  };

  return (
    <>
      <Header />

      <main className="page about-page">
        <section className="about-hero">
          <div className="about-hero__text">
            <p className="section-eyebrow">About</p>
            <h1>{about.headline}</h1>
            <p>{about.intro}</p>
          </div>
          <figure className="about-photo">
            {about.photo ? (
              <img alt="Aadhavan M" src={resolveSrc(about.photo)} />
            ) : (
              <div className="about-photo__placeholder">
                <span className="about-photo__initials">AM</span>
                <Placeholder label="Photo coming soon" />
              </div>
            )}
          </figure>
        </section>

        <dl className="about-facts">
          {about.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value ?? <Placeholder />}</dd>
            </div>
          ))}
        </dl>

        <section className="about-section">
          <div className="case-section-heading">
            <p>Journey</p>
            <h2>Where I've been</h2>
          </div>
          <ol className="about-journey">
            {about.journey.map((item) => (
              <li className={item.placeholder ? "is-placeholder" : ""} key={item.title}>
                <span className="about-journey__dot" aria-hidden="true" />
                <div>
                  <span className="about-journey__period">{item.period ?? <Placeholder label="Dates to be added" />}</span>
                  <h3>
                    {item.title}
                    {item.place ? <span> · {item.place}</span> : null}
                  </h3>
                  <p>{item.body}</p>
                  {item.tags ? (
                    <div className="about-tags">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-section">
          <div className="case-section-heading">
            <p>How I work</p>
            <h2>A few things I believe</h2>
          </div>
          <ol className="case-learnings">
            {about.principles.map((item, index) => (
              <li key={item.title}>
                <span className="case-index">{pad(index)}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-section">
          <div className="case-section-heading">
            <p>Focus</p>
            <h2>What I spend my time on</h2>
          </div>
          <div className="about-focus">
            {about.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="case-section-heading">
            <p>Off the clock</p>
            <h2>When I'm not designing</h2>
          </div>
          <div className="about-hobbies">
            {about.hobbies.map((hobby) => (
              <article key={hobby.title}>
                <span aria-hidden="true">{hobbyIcons[hobby.icon]}</span>
                <h3>{hobby.title}</h3>
                <p>{hobby.body}</p>
              </article>
            ))}
          </div>
        </section>

        <ContactPanel id="about-contact-title" />
      </main>

      <SiteFooter />
    </>
  );
}

const playgroundIcons: Record<PlaygroundIcon, ReactNode> = {
  cube: <Cube size={40} weight="duotone" />,
  shirt: <TShirt size={40} weight="duotone" />,
  notebook: <Notebook size={40} weight="duotone" />,
  chat: <ChatCircleDots size={40} weight="duotone" />,
  exam: <Exam size={40} weight="duotone" />,
};

function PlaygroundPlayer({ item, onClose }: { item: PlaygroundItem; onClose: () => void }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const src = withBasePath(item.src ?? "");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="pg-player" role="presentation">
      <div aria-label={`${item.title}, running in the page`} aria-modal="true" className="pg-player__dialog" role="dialog">
        <header className="pg-player__bar">
          <div className="pg-player__title">
            <span className="pg-live-dot" aria-hidden="true" />
            <strong>{item.title}</strong>
            {item.note ? <span>{item.note}</span> : null}
          </div>
          <div className="pg-player__actions">
            <a href={src} rel="noreferrer" target="_blank">
              <ArrowSquareOut aria-hidden="true" size={18} weight="bold" />
              <span>New tab</span>
            </a>
            <button aria-label={`Close ${item.title}`} onClick={onClose} ref={closeRef} type="button">
              <X aria-hidden="true" size={20} weight="bold" />
            </button>
          </div>
        </header>
        <div className="pg-player__frame">
          {!isLoaded ? (
            <div className="pg-player__loading" aria-live="polite">
              <span className="pg-spinner" aria-hidden="true" />
              Loading {item.title}…
            </div>
          ) : null}
          <iframe
            allow="fullscreen; xr-spatial-tracking; microphone"
            onLoad={() => setIsLoaded(true)}
            src={src}
            title={item.title}
          />
        </div>
      </div>
    </div>
  );
}

function PlaygroundMock({ type }: { type: "chat" | "quiz" }) {
  if (type === "chat") {
    return (
      <div className="pg-mock pg-mock--chat" aria-hidden="true">
        <div className="pg-mock__bubble pg-mock__bubble--user">Subtitle out of sync?</div>
        <div className="pg-mock__typing">
          <i />
          <i />
          <i />
        </div>
        <div className="pg-mock__answer">
          <strong>Summary</strong>
          <span className="pg-mock__line" />
          <span className="pg-mock__line pg-mock__line--short" />
          <div className="pg-mock__chips">
            <span>CTI · Subtitles</span>
            <span>3 sources</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pg-mock pg-mock--quiz" aria-hidden="true">
      <div className="pg-mock__quiz-top">
        <span>Q3 of 25 · Intermediate</span>
        <span className="pg-mock__progress">
          <i />
        </span>
      </div>
      <strong>Which pattern suits a detailed report?</strong>
      <div className="pg-mock__options">
        <span>A side drawer</span>
        <span className="is-correct">
          A full page <Check size={12} weight="bold" />
        </span>
        <span>A tooltip</span>
      </div>
    </div>
  );
}

function PlaygroundPreview({ item, onPlay }: { item: PlaygroundItem; onPlay: (item: PlaygroundItem) => void }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const isLive = item.status === "live";

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    // A small tilt that follows the pointer, so the preview feels like an object you can pick up.
    if (event.pointerType !== "mouse" || !frameRef.current) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    frameRef.current.style.setProperty("--tilt-x", `${(-y * 6).toFixed(2)}deg`);
    frameRef.current.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
  }

  function resetTilt() {
    frameRef.current?.style.setProperty("--tilt-x", "0deg");
    frameRef.current?.style.setProperty("--tilt-y", "0deg");
  }

  const frame = (
    <div className="pg-preview__frame" ref={frameRef}>
      <div className="pg-preview__chrome" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{item.title}</span>
      </div>
      <div className="pg-preview__screen">
        {item.preview ? (
          <img alt="" loading="lazy" src={resolveSrc(item.preview)} />
        ) : item.mock ? (
          <PlaygroundMock type={item.mock} />
        ) : (
          <span className="pg-card__icon" aria-hidden="true">
            {playgroundIcons[item.icon]}
          </span>
        )}
      </div>
    </div>
  );

  if (!isLive) {
    return (
      <div className="pg-preview pg-preview--template" onPointerLeave={resetTilt} onPointerMove={handlePointerMove}>
        {frame}
        <span className="pg-card__soon">Preview of the idea · Coming soon</span>
      </div>
    );
  }

  return (
    <button
      className="pg-preview"
      onBlur={resetTilt}
      onClick={() => onPlay(item)}
      onPointerLeave={resetTilt}
      onPointerMove={handlePointerMove}
      type="button"
    >
      {frame}
      <span className="pg-preview__play" aria-hidden="true">
        <Play size={26} weight="fill" />
      </span>
      <span className="sr-only">Play {item.title}</span>
    </button>
  );
}

function PlaygroundCard({ item, onPlay }: { item: PlaygroundItem; onPlay: (item: PlaygroundItem) => void }) {
  const isLive = item.status === "live";

  return (
    <article className={`pg-card pg-card--${item.status}`} id={item.id}>
      <div className="pg-card__cover">
        <PlaygroundPreview item={item} onPlay={onPlay} />
      </div>

      <div className="pg-card__body">
        <span className={`pg-status pg-status--${item.status}`}>
          {isLive ? (
            <>
              <span className="pg-live-dot" aria-hidden="true" />
              Playable here
            </>
          ) : (
            "Coming soon"
          )}
        </span>
        <h2>{item.title}</h2>
        <p className="pg-card__tagline">{item.tagline}</p>
        <p className="pg-card__description">{item.description}</p>
        <div className="pg-card__tags">
          {item.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {isLive ? (
          <div className="pg-card__footer">
            <button className="button" onClick={() => onPlay(item)} type="button">
              <Play aria-hidden="true" size={16} weight="fill" />
              Play in browser
            </button>
            {item.note ? <small>{item.note}</small> : null}
          </div>
        ) : (
          <p className="pg-card__pending">{item.pending}</p>
        )}
      </div>
    </article>
  );
}

function PlaygroundPage() {
  const [activeItem, setActiveItem] = useState<PlaygroundItem | null>(null);
  const liveCount = playgroundItems.filter((item) => item.status === "live").length;
  const closePlayer = useCallback(() => setActiveItem(null), []);

  return (
    <>
      <Header />

      <main className="page">
        <section className="page-hero">
          <p className="section-eyebrow">Playground</p>
          <h1>
            Things I've built to <span>think with.</span>
          </h1>
          <p>Small tools and experiments, built with AI-assisted coding. Press play to use them right here.</p>
          <div className="page-hero__stats">
            <span>
              <strong>{liveCount}</strong> playable now
            </span>
            {playgroundItems.length > liveCount ? (
              <span>
                <strong>{playgroundItems.length - liveCount}</strong> on the way
              </span>
            ) : null}
          </div>
        </section>

        <div className="pg-grid">
          {playgroundItems.map((item) => (
            <PlaygroundCard item={item} key={item.id} onPlay={setActiveItem} />
          ))}
        </div>

        <ContactPanel id="playground-contact-title" />
      </main>

      <SiteFooter />

      {activeItem ? <PlaygroundPlayer item={activeItem} onClose={closePlayer} /> : null}
    </>
  );
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function update() {
      setIsVisible(window.scrollY > 500);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      aria-hidden={!isVisible}
      aria-label="Back to top"
      className={`back-to-top-fab${isVisible ? " is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      tabIndex={isVisible ? 0 : -1}
      type="button"
    >
      <ArrowUp aria-hidden="true" size={22} weight="bold" />
    </button>
  );
}

function App() {
  const path = currentPath();
  const slug = path.replace(/^\/work\//, "");
  const project = path.startsWith("/work/") ? projects.find((item) => item.slug === slug) : undefined;

  let page = <HomePage />;

  if (project) {
    page = <CaseStudyPage project={project} />;
  } else if (path === "/skills") {
    page = <SkillsPage />;
  } else if (path === "/playground") {
    page = <PlaygroundPage />;
  } else if (path === "/about") {
    page = <AboutPage />;
  }

  return (
    <div className="site-shell bg-portfolio-canvas text-portfolio-ink font-sans">
      {page}
      <BackToTop />
    </div>
  );
}

export default App;
