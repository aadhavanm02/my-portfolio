import {
  createContext,
  Fragment,
  useCallback,
  useContext,
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
  type VideoHTMLAttributes,
} from "react";
import {
  ArrowRight,
  ArrowUp,
  Desktop,
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
  ArrowsInSimple,
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
  MagnifyingGlass,
  Lightbulb,
  ArrowUpRight,
  Briefcase,
  Books,
  NotePencil,
  Pill,
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
import { logoPath } from "./logoPath";
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

// The A mark, drawn on load like a pen writing it: a stroke along the letter's centre line
// reveals the real shape through a mask, so the finished mark matches the logo exactly.
// The A draws itself only on the Work page, and at most once a day in this browser. Everywhere else,
// and on later visits, it is already drawn. Decided once per page load, so moving between pages never replays it.
const LOGO_KEY = "logo-drawn-at";
const LOGO_REPLAY_MS = 24 * 60 * 60 * 1000;
let logoShouldDraw: boolean | null = null;
let logoDecidedAt = 0;

function shouldDrawLogo() {
  // A header that mounts again a few seconds later (another page) shows the logo already drawn.
  if (logoShouldDraw !== null) return logoShouldDraw && Date.now() - logoDecidedAt < 2500;
  logoDecidedAt = Date.now();
  logoShouldDraw = false;
  try {
    const onWorkPage = currentPath() === "/";
    const last = Number(window.localStorage.getItem(LOGO_KEY) ?? 0);
    if (onWorkPage && Date.now() - last > LOGO_REPLAY_MS) {
      logoShouldDraw = true;
      window.localStorage.setItem(LOGO_KEY, String(Date.now()));
    }
  } catch {
    logoShouldDraw = false;
  }
  return logoShouldDraw;
}

function LogoMark() {
  const [draw] = useState(shouldDrawLogo);
  return (
    <svg className={`logo-image logo-mark${draw ? "" : " logo-mark--drawn"}`} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <clipPath id="logo-disc">
          <circle cx="24.0008" cy="24.0031" r="19.2" />
        </clipPath>
        <mask id="logo-pen" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
          <path
            className="logo-mark__pen"
            d="M30.6 28.6 C27.5 28.2 25.4 28.5 22.6 30.4 C20.4 32 18.3 33.6 16.6 34.6 C15 35.4 13 34.3 13.4 32.4 L23.9 12.9 L35 35.4"
            fill="none"
            pathLength={1}
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4.6}
          />
        </mask>
      </defs>
      <circle cx="24" cy="24" r="24" fill="#101010" />
      <g clipPath="url(#logo-disc)" mask="url(#logo-pen)">
        <circle cx="24.0008" cy="24.0031" r="19.2" fill="#fff" />
        <path d={logoPath} fill="#101010" />
      </g>
    </svg>
  );
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

// The full view opens on the cropped area you clicked, then zooms out to the whole screenshot.
const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function cropTransform(crop: [number, number, number, number]) {
  const [x, y, w, h] = crop;
  const scale = Math.min(1 / w, 1 / h);
  // Centre the crop, but never pull a screenshot edge inside the frame.
  const limit = ((scale - 1) / 2) * 100;
  const clamp = (value: number) => Math.max(-limit, Math.min(limit, value));
  const dx = clamp((0.5 - (x + w / 2)) * 100 * scale);
  const dy = clamp((0.5 - (y + h / 2)) * 100 * scale);
  return `translate(${dx}%, ${dy}%) scale(${scale})`;
}

// On phone-sized screens the full screenshot would be too small to read, so the crop stays.
const FULL_SHOT_MIN_WIDTH = 768;

const LIGHTBOX_ZOOM = 2.5;

function ShotLightbox({ frame, caption, onClose, zoomable = true }: { frame: MediaFrame; caption: string; onClose: () => void; zoomable?: boolean }) {
  const full = typeof window !== "undefined" && window.innerWidth >= FULL_SHOT_MIN_WIDTH ? frame.full : undefined;
  const src = resolveSrc(full?.src ?? frame.src);
  const [w, h] = full?.size ?? frame.size;
  const [loaded, setLoaded] = useState(false);
  const [zoomedOut, setZoomedOut] = useState(!full || reduceMotion());
  // Once open, a click zooms in on that spot; moving the pointer pans, and another click zooms back out.
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const pointAt = (event: { clientX: number; clientY: number; currentTarget: Element }) => {
    const box = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(100, Math.max(0, ((event.clientX - box.left) / box.width) * 100)),
      y: Math.min(100, Math.max(0, ((event.clientY - box.top) / box.height) * 100)),
    };
  };
  const canZoom = zoomable && zoomedOut;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Floating page controls hide while the screenshot fills the screen, as they do for the video.
    document.body.classList.add("is-video-expanded");
    const onKey = (event: globalThis.KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.body.classList.remove("is-video-expanded");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Once the full screenshot is in, hold the crop for a beat so the eye finds it, then zoom out.
  useEffect(() => {
    if (!loaded || zoomedOut) return;
    const timer = window.setTimeout(() => setZoomedOut(true), 120);
    return () => window.clearTimeout(timer);
  }, [loaded, zoomedOut]);

  return (
    <div aria-label={caption} aria-modal="true" className="shot-lightbox" onClick={onClose} role="dialog">
      <button aria-label="Close screenshot" className="shot-lightbox__close" onClick={onClose} type="button">
        <X aria-hidden="true" size={22} weight="bold" />
      </button>
      {canZoom ? (
        <div className="shot-lightbox__zoom" onClick={(event) => event.stopPropagation()}>
          <button aria-label="Zoom in" disabled={Boolean(zoom)} onClick={() => setZoom({ x: 50, y: 50 })} type="button">
            <MagnifyingGlassPlus aria-hidden="true" size={20} weight="bold" />
          </button>
          <button aria-label="Zoom out" disabled={!zoom} onClick={() => setZoom(null)} type="button">
            <MagnifyingGlassMinus aria-hidden="true" size={20} weight="bold" />
          </button>
        </div>
      ) : null}
      <div
        className={`shot-lightbox__frame${loaded ? " is-loaded" : ""}${canZoom ? (zoom ? " is-zoomed" : " can-zoom") : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          if (canZoom) setZoom(zoom ? null : pointAt(event));
        }}
        onMouseMove={(event) => {
          if (zoom) setZoom(pointAt(event));
        }}
        style={{ ["--w" as string]: `${w}px`, ["--a" as string]: w / h }}
      >
        <img
          alt={caption}
          className={zoomedOut ? "is-out" : undefined}
          height={h}
          onLoad={() => setLoaded(true)}
          ref={(node) => {
            if (node?.complete && node.naturalWidth && !loaded) setLoaded(true);
          }}
          src={src}
          style={
            zoom
              ? { transform: `scale(${LIGHTBOX_ZOOM})`, transformOrigin: `${zoom.x}% ${zoom.y}%` }
              : zoomedOut || !full
                ? undefined
                : { transform: cropTransform(full.crop) }
          }
          width={w}
        />
      </div>
    </div>
  );
}

// Full desktop screenshots sit in a browser window. Crops, phone screens and other images do not.
function hasBrowserBar(frame: MediaFrame, item?: MediaItem) {
  if (frame.browser !== undefined) return frame.browser;
  if (item?.browser !== undefined) return item.browser;
  if (item?.phone || frame.full) return false;
  const ratio = frame.size[0] / frame.size[1];
  return ratio >= 1.25 && ratio <= 2;
}

// The address shown in the browser bar, set per case study (for example "dnk-store.com/wp-admin · ModernCart").
const BrowserUrl = createContext<string | undefined>(undefined);

// A dark browser window bar, the same as the one in the walkthrough video previews.
function BrowserBar({ url }: { url?: string }) {
  const contextUrl = useContext(BrowserUrl);
  const address = url ?? contextUrl;
  return (
    <span aria-hidden="true" className="shot-browser">
      <span className="shot-browser__dots">
        <i />
        <i />
        <i />
      </span>
      {address ? <span className="shot-browser__url">{address}</span> : null}
    </span>
  );
}

// Looping screen recordings play only while they are on screen.
function InViewVideo(props: VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduceMotion()) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return <video loop muted playsInline preload="metadata" ref={ref} {...props} />;
}

function ShotImage({ frame, caption, onOpen, browser }: { frame: MediaFrame; caption: string; onOpen: (frame: MediaFrame) => void; browser?: boolean }) {
  const src = resolveSrc(frame.src);
  // Start fetching the full screenshot on hover or focus, so it is ready by the click.
  const preload = () => {
    if (frame.full && window.innerWidth >= FULL_SHOT_MIN_WIDTH) new Image().src = resolveSrc(frame.full.src);
  };
  if (/\.mp4(\?|$)/.test(frame.src)) {
    // A looping, silent screen recording shown in place of a still.
    return (
      <div className={`shot-image shot-image--video${browser ? " shot-image--browser" : ""}`}>
        {browser ? <BrowserBar /> : null}
        <InViewVideo aria-label={frame.label ?? caption} src={src} width={frame.size[0]} height={frame.size[1]} />
      </div>
    );
  }
  return (
    <button
      aria-label={`View full size: ${frame.label ?? caption}`}
      className={`shot-image${browser ? " shot-image--browser" : ""}`}
      onClick={() => onOpen(frame)}
      onFocus={preload}
      onPointerEnter={preload}
      type="button"
    >
      {browser ? <BrowserBar /> : null}
      <img alt={frame.label ?? caption} height={frame.size[1]} loading="lazy" src={src} width={frame.size[0]} />
    </button>
  );
}

// Any other image: a click opens it large, the same way screenshots open.
function ZoomImage({ alt, src, browser, zoomable = true }: { alt: string; src: string; browser?: boolean; zoomable?: boolean }) {
  const [open, setOpen] = useState<MediaFrame | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  return (
    <>
      <button
        aria-label={`View full size: ${alt}`}
        className={`zoom-image${browser ? " shot-image shot-image--browser" : ""}`}
        onClick={() => {
          const img = imgRef.current;
          setOpen({ src, size: [img?.naturalWidth || 1600, img?.naturalHeight || 1000] });
        }}
        type="button"
      >
        {browser ? <BrowserBar /> : null}
        <img alt={alt} ref={imgRef} src={resolveSrc(src)} />
      </button>
      {open ? <ShotLightbox caption={alt} frame={open} onClose={() => setOpen(null)} zoomable={zoomable} /> : null}
    </>
  );
}

function StatusTag({ status }: { status?: MediaItem["status"] }) {
  if (!status) return null;
  return (
    <span className={`shot-status shot-status--${status}`}>
      {status === "dropped" ? <X aria-hidden="true" size={11} weight="bold" /> : <Check aria-hidden="true" size={11} weight="bold" />}
      {status === "dropped" ? "Dropped" : "Shipped"}
    </span>
  );
}

function ShotMedia({ item, thumb }: { item: MediaItem; thumb?: boolean }) {
  const [open, setOpen] = useState<MediaFrame | null>(null);
  const frames: MediaFrame[] = item.row ?? (item.src && item.size ? [{ src: item.src, size: item.size, full: item.full }] : []);

  return (
    <figure className={`shot${item.row ? " shot--row" : ""}${item.stack ? " shot--stack" : ""}${item.phone ? " shot--phone" : ""}${thumb ? " shot--thumb" : ""}`}>
      <div className="shot-stage">
        <div className="shot-stage__frames" style={{ ["--n" as string]: frames.length }}>
          {frames.map((frame, index) => (
            <div className="shot-stage__item" key={`${frame.src}-${index}`} style={{ ["--a" as string]: frame.size[0] / frame.size[1] }}>
              <ShotImage browser={hasBrowserBar(frame, item)} caption={item.alt ?? item.caption} frame={frame} onOpen={setOpen} />
              {frame.label || frame.status ? (
                <span className="shot-stage__label">
                  <StatusTag status={frame.status} />
                  {frame.label}
                </span>
              ) : null}
            </div>
          ))}
        </div>
        {item.caption ? (
          <figcaption className="shot-stage__caption">
            <StatusTag status={item.status} />
            {item.caption}
          </figcaption>
        ) : null}
      </div>
      {open ? <ShotLightbox caption={open.label ?? item.alt ?? item.caption} frame={open} onClose={() => setOpen(null)} /> : null}
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
      <figcaption>
        <StatusTag status={item.status} />
        {item.caption}
      </figcaption>
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
        <ZoomImage alt={item.alt ?? item.caption} src={item.src} />
        <figcaption>{item.caption}</figcaption>
      </figure>
    );
  }

  return <MediaPlaceholder className="case-media--thumb" item={item} />;
}

function MediaGroup({ items }: { items: MediaItem[] }) {
  if (items.some(isShot)) {
    // Several single screenshots side by side share one frame size, so none looks bigger than the rest.
    const uniform = items.filter((item) => isShot(item) && !item.row && !item.wide).length > 1;
    return (
      <div className={`shot-group${uniform ? " shot-group--uniform" : ""}`}>
        {items.map((item, index) => (
          <div className={item.row || item.wide ? "shot-group__wide" : undefined} key={`${item.alt ?? item.caption}-${index}`}>
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
            <ZoomImage alt={item.alt ?? item.caption} src={item.src} />
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
  // Each row reads Challenge, Goal, Constraint.
  const hasConstraints = section.mapping.some((row) => row[2]);
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

      {section.pains?.length ? (
      <div className="case-pains">
        {section.pains.map((pain, index) => (
          <article key={pain.title}>
            <span className="case-index">{pad(index)}</span>
            <h3>{pain.title}</h3>
            <p>{pain.body}</p>
          </article>
        ))}
      </div>
      ) : null}

      {section.media ? <MediaGroup items={[section.media]} /> : null}

      {section.note ? (
        <aside className="case-note case-problem-note">
          <h4>{section.note.title}</h4>
          <p>{section.note.body}</p>
        </aside>
      ) : null}

      <div className={`case-mapping${hasConstraints ? " case-mapping--3" : ""}`}>
        <div className="case-mapping__table">
        <div className="case-mapping__head" aria-hidden="true">
          <span>Challenge</span>
          <span />
          <span>Goal</span>
          {hasConstraints ? <span>Constraint</span> : null}
        </div>
        {section.mapping.map(([challenge, goal, constraint]) => (
          <div className="case-mapping__row" key={challenge}>
            <p>
              {hasConstraints ? <span className="case-mapping__label">Challenge</span> : null}
              {challenge}
            </p>
            <ArrowRight aria-label="becomes" size={22} weight="bold" />
            <p>
              {hasConstraints ? <span className="case-mapping__label">Goal</span> : null}
              {goal}
            </p>
            {hasConstraints ? (
              <p className="case-mapping__constraint">
                <span className="case-mapping__label">Constraint</span>
                {constraint}
              </p>
            ) : null}
          </div>
        ))}
        </div>
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

            <div className={`case-feature__body${item.did ? " case-feature__body--story" : ""}`}>
              <div className="case-feature__text">
                <h3 className="case-feature__title">
                  <span className="case-index">{pad(index)}</span>
                  {item.title}
                </h3>
                {item.did ? (
                  <div className="case-story3">
                    <div className="case-story3__step">
                      <span className="case-story3__label">
                        <MagnifyingGlass aria-hidden="true" size={14} weight="bold" />
                        Noticed
                      </span>
                      <p>
                        <RichText text={item.noticed ?? ""} />
                      </p>
                      {item.before ? (
                        <p className="case-story3__tag case-story3__tag--before">
                          <X aria-hidden="true" size={12} weight="bold" />
                          {item.before}
                        </p>
                      ) : null}
                    </div>
                    <div className="case-story3__step">
                      <span className="case-story3__label">
                        <PencilSimpleLine aria-hidden="true" size={14} weight="bold" />
                        Did
                      </span>
                      <p>
                        <RichText text={item.did} />
                      </p>
                      {item.before ? (
                        <p className="case-story3__tag case-story3__tag--after">
                          <Check aria-hidden="true" size={12} weight="bold" />
                          {item.after}
                        </p>
                      ) : null}
                    </div>
                    {item.why ? (
                      <div className="case-story3__step case-story3__step--why">
                        <span className="case-story3__label">
                          <Lightbulb aria-hidden="true" size={14} weight="bold" />
                          Why it works
                        </span>
                        <p>
                          <RichText text={item.why} />
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {item.detail ? (
                  <p className="case-feature__detail">
                    <RichText text={item.detail} />
                  </p>
                ) : null}
                {item.details?.map((text) => (
                  <p className="case-feature__detail" key={text}>
                    <RichText text={text} />
                  </p>
                ))}
                {item.highlights && !item.did ? (
                  <ul className="case-feature__highlights" aria-label="Key details">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {item.did ? null : (
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
              )}

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
      {/* The hook is the heading: one line that sets up the decision, on a tinted panel. */}
      <header className="case-decision__head">
        <span className="case-index">Decision {pad(index)}</span>
        <h3 title={decision.title}>{decision.hook}</h3>
      </header>

      <ol className="case-flow">
        <DecisionStep icon={<ClockCounterClockwise size={18} weight="bold" />} label="Before the decision" variant="before">
          <Paragraphs items={decision.before} />
        </DecisionStep>

        <DecisionStep icon={<GitFork size={18} weight="bold" />} label="Turning point" variant="turning">
          <p>{decision.turningIntro}</p>
          <div className={`case-options case-options--${Math.min(decision.options.length, 4)}`}>
            {decision.options.map((option, optionIndex) => (
              <div className={`case-option${option.chosen ? " is-chosen" : ""}${option.dropped ? " is-dropped" : ""}`} key={option.title}>
                <div className="case-option__top">
                  <span className="case-option__letter">{String.fromCharCode(65 + optionIndex)}</span>
                  <span className="case-option__badges">
                    {option.badge && !option.chosen ? <span className="case-option__badge">{option.badge}</span> : null}
                    {option.dropped ? (
                      <span className="case-option__badge case-option__badge--dropped">
                        <X aria-hidden="true" size={12} weight="bold" />
                        Dropped
                      </span>
                    ) : null}
                    {option.chosen ? (
                      <span className="case-option__badge">
                        <Check aria-hidden="true" size={12} weight="bold" />
                        {option.badge ?? "Chosen"}
                      </span>
                    ) : null}
                  </span>
                </div>
                <h5>{option.title}</h5>
                <p>{option.body}</p>
                {option.dropped ? (
                  <div className="case-option__dropped">
                    <span>Why it was dropped</span>
                    <p>{option.dropped}</p>
                  </div>
                ) : null}
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

      {section.levelsMedia ? <MediaGroup items={[section.levelsMedia]} /> : null}

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

      {section.gallery ? (
        <div className="case-system__gallery">
          <MediaGroup items={section.gallery} />
        </div>
      ) : null}

      {section.tokens?.length ? (
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
      ) : null}

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
              {step.bullets ? (
                <ul className="case-process__bullets">
                  {step.bullets.map((bullet) => (
                    <li key={bullet}>
                      <RichText text={bullet} />
                    </li>
                  ))}
                </ul>
              ) : null}
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
              {section.beforeStat ? (
                <div className="case-outcome__metric case-outcome__metric--before">
                  <strong>{section.beforeStat.value}</strong>
                  <span>{section.beforeStat.label}</span>
                </div>
              ) : null}
            </div>
            <span className="case-outcome__arrow" aria-hidden="true">
              <ArrowRight size={28} weight="bold" />
            </span>
            <div className="case-outcome__after">
              <span>After</span>
              <p>{section.after}</p>
              <div className="case-outcome__metric">
                <strong>{section.stat.value}</strong>
                <span>{section.stat.label}</span>
              </div>
            </div>
          </div>
          {section.feedback ? (
            <p className="case-feedback">
              <RichText text={section.feedback} />
            </p>
          ) : null}
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
        {section.story ? (
          <div className="case-story">
            {section.story.map((block, index) => (
              <div className="case-story__block" key={block.label ?? index}>
                {block.label ? <h3>{block.label}</h3> : null}
                {(Array.isArray(block.text) ? block.text : [block.text]).map((text) => (
                  <p key={text}>
                    <RichText text={text} />
                  </p>
                ))}
              </div>
            ))}
          </div>
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
        <a className="button button--large" download="Aadhavan-M-Resume.pdf" href={assetPath("/Aadhavan-M-Resume.pdf")}>
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
        <a className="button" download="Aadhavan-M-Resume.pdf" href={assetPath("/Aadhavan-M-Resume.pdf")} onClick={closeMenu}>
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
// The orange (recoverable) curve in the Dashboard screenshot (1945 x 2000), sampled where the card shows it.
const cartCurve: [number, number][] = [
  [180, 704], [220, 676], [260, 660], [300, 656], [340, 660], [380, 660], [420, 656], [460, 656],
  [500, 667], [540, 688], [580, 711], [620, 728], [660, 732], [700, 722], [740, 692], [780, 657],
];
const cartImage = { width: 1945, height: 2000, yellowOffset: 109 };

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

// The 2k gridline sits at y 719 and each 1k step is 79px.
const chartValue = (y: number) => Math.round(((719 - y) / 79) * 1000 + 2000);
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

function CartChartMotion({ playing }: { playing: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [x, setX] = useState(560);
  // Where the loop was when it paused, so it carries on from there.
  const startOffset = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!playing) return;
    let frame = 0;
    const start = performance.now() - startOffset.current;
    const [minX, maxX] = [cartCurve[0][0], cartCurve[cartCurve.length - 1][0]];
    const loop = 9000;

    function tick(now: number) {
      // Ease out to the right, pause, ease back, pause.
      const p = ((now - start) % loop) / loop;
      const phase = p < 0.42 ? p / 0.42 : p < 0.5 ? 1 : p < 0.92 ? 1 - (p - 0.5) / 0.42 : 0;
      const eased = phase < 0.5 ? 2 * phase * phase : 1 - Math.pow(-2 * phase + 2, 2) / 2;
      setX(minX + (maxX - minX) * eased);
      startOffset.current = now - start;
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const orangeY = curveY(x);
  const yellowY = orangeY + cartImage.yellowOffset;
  const day = Math.round(1 + (x - 137) / (1698 / 29));
  const pctX = (x / cartImage.width) * 100;
  const pct = (y: number) => `${(y / cartImage.height) * 100}%`;

  return (
    <div className="shot-motion shot-motion--chart" ref={rootRef}>
      {/* Phones crop the card above the chart, so they hover the stat cards instead. */}
      <span className="shot-stat" />
      <span className="shot-cursor shot-cursor--stat">{cursorIcon}</span>
      <span className="shot-chart__line" style={{ left: `${pctX}%`, top: pct(470), height: pct(410) }} />
      <span className="shot-chart__dot shot-chart__dot--orange" style={{ left: `${pctX}%`, top: pct(orangeY) }} />
      <span className="shot-chart__dot shot-chart__dot--yellow" style={{ left: `${pctX}%`, top: pct(yellowY) }} />
      <span className="shot-chart__tip" style={{ left: `${pctX}%`, top: pct(orangeY - 106) }}>
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

function ShotMotion({ kind, playing }: { kind: string; playing: boolean }) {
  if (kind === "cart-abandonment-recovery") {
    return <CartChartMotion playing={playing} />;
  }

  if (kind === "superfans-social-feed") {
    return (
      // The phone preview swipes through five feed posts like reels, and the tabs switch along with it.
      <div className="shot-motion shot-motion--superfans">
        <img className="sf-tab sf-tab--app" src={resolveSrc("/assets/superfans/card-tab-app.webp?v=2026-11-26")} alt="" />
        <img className="sf-tab sf-tab--ig" src={resolveSrc("/assets/superfans/card-tab-ig.webp?v=2026-11-26")} alt="" />
        <div className="sf-reel">
          <img src={resolveSrc("/assets/superfans/card-reels.webp?v=2026-11-26")} alt="" />
        </div>
        <img className="sf-phone" src={resolveSrc("/assets/superfans/card-phone.webp?v=2026-11-26")} alt="" />
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
  browserUrl?: string;
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
    browserUrl: project.browserUrl,
  })),
];

// Expenzo's work card: full phone screens drifting right to left on a loop.
const expenzoCarousel = ["home", "scanning", "scan-done", "record", "add-category", "repeat-set", "analytics", "export", "exported", "failed-popup"].map(
  (name) => `/assets/expenzo/${name}.webp?v=2026-11-22b`,
);

function PhoneCarousel({ screens }: { screens: string[] }) {
  // The list is drawn twice so the loop has no visible seam.
  return (
    <div className="phone-carousel">
      <div className="phone-carousel__track">
        {[...screens, ...screens].map((src, index) => (
          <img alt="" key={`${src}-${index}`} loading="lazy" src={resolveSrc(src)} />
        ))}
      </div>
    </div>
  );
}

// Only one work card animates at a time: the one most in view, or the one under the pointer.
function usePlayingCard() {
  const [inView, setInView] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const ratios = useRef(new Map<string, number>());
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.current.set((entry.target as HTMLElement).dataset.card ?? "", entry.intersectionRatio));
        let best: string | null = null;
        let bestRatio = 0.35;
        ratios.current.forEach((ratio, key) => {
          if (ratio > bestRatio) {
            best = key;
            bestRatio = ratio;
          }
        });
        setInView(best);
      },
      { threshold: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1] },
    );
    document.querySelectorAll<HTMLElement>("[data-card]").forEach((node) => observer.current?.observe(node));
    return () => observer.current?.disconnect();
  }, []);

  const watch = (node: HTMLElement | null) => {
    if (node && observer.current) observer.current.observe(node);
  };

  return { playing: hovered ?? inView, setHovered, watch };
}

// The ModernCart card video plays and pauses with its card.
function CardVideo({ playing, poster, src }: { playing: boolean; poster: string; src: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (playing && !reduceMotion()) void video.play().catch(() => undefined);
    else video.pause();
  }, [playing]);
  return <video loop muted playsInline poster={poster} preload="metadata" ref={ref} src={src} />;
}

function HomePage() {
  const [showMoreProjects, setShowMoreProjects] = useState(false);
  const visibleProjects = showMoreProjects ? workCards : workCards.slice(0, 4);
  const { playing, setHovered, watch } = usePlayingCard();

  return (
    <>
      <Header />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__intro">
            <div className="hero__id">
              {about.photo ? <img className="hero__photo" src={assetPath(about.photo)} alt="Aadhavan M" /> : null}
              <div className="hero__name">
                <strong>Aadhavan M</strong>
                <span>Product Designer at Superfans</span>
              </div>
            </div>
            <h1 id="hero-title">
              Complex features don’t need crowded screens.{" "}
              <span>I design with generous space and very few elements, so what matters most is the first thing people see.</span>
            </h1>
          </div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <p className="section-eyebrow" id="work-title">
            Featured work
          </p>

          <div className="project-list">
            {visibleProjects.map((project) => (
              <article
                className={`project-card${project.brand ? " brand-scope" : ""}${playing === project.key ? " is-playing" : ""}`}
                data-card={project.key}
                key={project.key}
                onMouseEnter={() => setHovered(project.key)}
                onMouseLeave={() => setHovered(null)}
                ref={watch}
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

                <div className={`project-media${project.browserUrl ? " project-media--browser" : ""}`} aria-hidden="true">
                  {project.browserUrl ? <BrowserBar url={project.browserUrl} /> : null}
                  {project.key === "expenzo" ? (
                    <PhoneCarousel screens={expenzoCarousel} />
                  ) : (
                  <div className={`project-shot ${project.imageClass ?? ""}`}>
                    {project.key === "modern-cart" ? (
                      // The dashboard tabs, clicked and scrolled through on a loop.
                      <CardVideo playing={playing === project.key} poster={resolveSrc("/assets/videos/modern-cart-card.jpg?v=2026-11-21")} src={resolveSrc("/assets/videos/modern-cart-card.mp4?v=2026-11-28")} />
                    ) : (
                      <>
                        <img src={resolveSrc(project.image)} alt="" />
                        <ShotMotion kind={project.key} playing={playing === project.key} />
                      </>
                    )}
                  </div>
                  )}
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
  // Show two neighbours: the case study before and after this one. At either end of the
  // list, show the two closest instead.
  const index = projects.findIndex((item) => item.slug === current.slug);
  const last = projects.length - 1;
  const picks = index <= 0 ? [1, 2] : index >= last ? [last - 2, last - 1] : [index - 1, index + 1];
  const others = picks.filter((i) => i >= 0 && i <= last && i !== index).map((i) => projects[i]);

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
            {/* Desktop screenshots sit in the browser window, zoomed in so they stay readable; phone screens sit centered. */}
            <span className={`more-case__media${item.browserUrl ? "" : " more-case__media--phones"}`} aria-hidden="true">
              {item.previewScreens ? (
                <span className="more-case__screens">
                  {item.previewScreens.map((src) => (
                    <img alt="" key={src} loading="lazy" src={resolveSrc(src)} />
                  ))}
                </span>
              ) : (
              <span className="more-case__window">
                {item.browserUrl ? <BrowserBar url={item.browserUrl} /> : null}
                <span className="more-case__shot">
                  <img alt="" loading="lazy" src={resolveSrc(item.image)} />
                </span>
              </span>
              )}
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
    <BrowserUrl.Provider value={project.browserUrl}>
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
            {project.lead?.map((text) => (
              <p key={text}>
                <RichText text={text} />
              </p>
            ))}
          </div>
          {project.hero.kind === "video" && project.hero.src ? (
            <CaseHeroVideo coverImage={resolveSrc(project.image)} title={project.cardTitle} videoSrc={resolveSrc(project.hero.src)} />
          ) : (
            <figure className="case-hero-media case-hero-image">
              {/\.mp4(\?|$)/.test(heroCover) ? (
                <div className="shot-image shot-image--video shot-image--browser case-hero-browser">
                <BrowserBar />
                <InViewVideo
                  aria-label={project.hero.caption}
                  poster={project.hero.poster ? resolveSrc(project.hero.poster) : undefined}
                  src={heroCover}
                />
                </div>
              ) : (
                <ZoomImage alt={project.hero.caption} browser={project.hero.browser ?? !project.hero.phone} src={project.hero.src ?? project.image} zoomable={false} />
              )}
            </figure>
          )}
          <div className="case-facts">
            <StatStrip stats={project.stats} />
            {project.meta.length ? (
              <dl className="case-meta">
                {project.meta.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
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
    </BrowserUrl.Provider>
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
  pill: <Pill size={40} weight="duotone" />,
  briefcase: <Briefcase size={40} weight="duotone" />,
  books: <Books size={40} weight="duotone" />,
  canvas: <NotePencil size={40} weight="duotone" />,
};

// The app on its own (no walkthrough panel) when there is one, for opening it full page.
function playgroundAppSrc(item: PlaygroundItem) {
  return withBasePath(item.appSrc ?? item.src ?? "");
}

function PlaygroundPlayer({ item, onClose }: { item: PlaygroundItem; onClose: () => void }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const src = withBasePath(item.src ?? "");
  const appSrc = playgroundAppSrc(item);

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
    <div className={`pg-player${isFull ? " pg-player--full" : ""}`} role="presentation">
      <div aria-label={`${item.title}, running in the page`} aria-modal="true" className="pg-player__dialog" role="dialog">
        <header className="pg-player__bar">
          <div className="pg-player__title">
            <span className="pg-live-dot" aria-hidden="true" />
            <strong>{item.title}</strong>
            {item.note ? <span>{item.note}</span> : null}
          </div>
          <div className="pg-player__actions">
            <button
              aria-label={isFull ? "Exit full view" : "Full view"}
              aria-pressed={isFull}
              className="pg-player__expand"
              onClick={() => setIsFull((value) => !value)}
              title={isFull ? "Exit full view" : "Full view"}
              type="button"
            >
              {isFull ? <ArrowsInSimple aria-hidden="true" size={18} weight="bold" /> : <ArrowsOutSimple aria-hidden="true" size={18} weight="bold" />}
            </button>
            <a href={appSrc} rel="noreferrer" target="_blank" title="Open the app on its own page">
              <ArrowSquareOut aria-hidden="true" size={18} weight="bold" />
              <span>Open full page</span>
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
            <div className="pg-card__buttons">
              {item.study ? (
                <a className="button" href={withBasePath(`/playground/${item.id}`)}>
                  Read the case study
                  <ArrowRight aria-hidden="true" size={16} weight="bold" />
                </a>
              ) : null}
              <button className={item.study ? "button button--secondary" : "button"} onClick={() => onPlay(item)} type="button">
                <Play aria-hidden="true" size={16} weight="fill" />
                {item.study ? "Play demo" : "Play in browser"}
              </button>
              <a
                aria-label={`Open ${item.title} full page in a new tab`}
                className="button button--secondary pg-card__fullpage"
                href={playgroundAppSrc(item)}
                rel="noreferrer"
                target="_blank"
              >
                <ArrowSquareOut aria-hidden="true" size={16} weight="bold" />
                Full page
              </a>
            </div>
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
  // On a phone, open the project itself full screen, like opening an app; back returns here.
  // On larger screens it plays in a window on this page.
  function playItem(item: PlaygroundItem) {
    if (item.src && window.matchMedia("(max-width: 640px)").matches) {
      window.location.href = withBasePath(item.src);
      return;
    }
    setActiveItem(item);
  }
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
            <PlaygroundCard item={item} key={item.id} onPlay={playItem} />
          ))}
        </div>

        <ContactPanel id="playground-contact-title" />
      </main>

      <SiteFooter />

      {activeItem ? <PlaygroundPlayer item={activeItem} onClose={closePlayer} /> : null}
    </>
  );
}

function PlaygroundStudyPage({ item }: { item: PlaygroundItem }) {
  const study = item.study!;
  const demoSrc = withBasePath(item.src ?? "");
  const appSrc = playgroundAppSrc(item);
  const demoRef = useRef<HTMLDivElement | null>(null);
  const [isDemoFull, setIsDemoFull] = useState(false);

  useEffect(() => {
    if (!isDemoFull) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setIsDemoFull(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDemoFull]);

  return (
    <>
      <Header />

      <main className="page pg-study">
        <a className="case-back" href={withBasePath("/playground")}>
          ← All playground
        </a>

        <header className="pg-study__head">
          <span className="pg-study__kind">{study.kind}</span>
          <h1>{item.title}</h1>
          <p className="pg-study__tagline">{item.tagline}</p>
          <div className="pg-card__tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {study.intro.map((text) => (
            <p className="pg-study__intro" key={text}>
              {text}
            </p>
          ))}
          <dl className="pg-study__facts">
            {study.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <section className="pg-study__demo" aria-labelledby="pg-demo-title">
          <div className="pg-study__demo-head">
            <div>
              <p className="section-eyebrow" id="pg-demo-title">
                Walkthrough
              </p>
              <p>{study.demoNote}</p>
            </div>
            <div className="pg-study__demo-actions">
              <button className="button button--secondary" onClick={() => setIsDemoFull(true)} type="button">
                <ArrowsOutSimple aria-hidden="true" size={16} weight="bold" />
                Full view
              </button>
              <a className="button button--secondary" href={appSrc} rel="noreferrer" target="_blank">
                Open full page
                <ArrowUpRight aria-hidden="true" size={16} weight="bold" />
              </a>
            </div>
          </div>
          <div className={`pg-study__demo-frame${isDemoFull ? " is-full" : ""}`} ref={demoRef}>
            {isDemoFull ? (
              <button className="pg-study__demo-exit" onClick={() => setIsDemoFull(false)} type="button">
                <ArrowsInSimple aria-hidden="true" size={16} weight="bold" />
                Exit full view
              </button>
            ) : null}
            <iframe loading="lazy" src={demoSrc} style={isDemoFull ? undefined : { height: study.demoHeight ?? 940 }} title={`${item.title} walkthrough`} />
          </div>
        </section>

        <section className="pg-study__section">
          <p className="section-eyebrow">The problem</p>
          <h2>{study.problem.title}</h2>
          {study.problem.body.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <div className="pg-study__cards pg-study__cards--2">
            {study.audience.map((person) => (
              <article key={person.name}>
                <h3>{person.name}</h3>
                <p>{person.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pg-study__section">
          <p className="section-eyebrow">What I designed</p>
          <h2>The parts that make it work</h2>
          <div className="pg-study__cards">
            {study.features.map((feature) => (
              <article key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pg-study__section">
          <p className="section-eyebrow">Key decisions</p>
          <h2>Choices that shaped it</h2>
          <ol className="pg-study__decisions">
            {study.decisions.map((decision, index) => (
              <li key={decision.title}>
                <span className="case-index">{pad(index)}</span>
                <div>
                  <h3>{decision.title}</h3>
                  <p>{decision.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="pg-study__section">
          <p className="section-eyebrow">Edge cases</p>
          <h2>When things go wrong</h2>
          <p>{study.edges.intro}</p>
          <ul className="pg-study__edges">
            {study.edges.items.map((edge) => (
              <li key={edge}>{edge}</li>
            ))}
          </ul>
        </section>

        <section className="pg-study__section">
          <p className="section-eyebrow">A closer look</p>
          <h2>Screens and details</h2>
          <div className="pg-study__images">
            {study.images.map((image) => (
              <ShotMedia item={{ caption: image.caption, alt: image.caption, src: image.src, size: image.size }} key={image.src} />
            ))}
          </div>
        </section>

        <section className="pg-study__section">
          <p className="section-eyebrow">What's next</p>
          <h2>Still in progress</h2>
          <ul className="pg-study__edges">
            {study.next.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>

        <ContactPanel id="pg-study-contact-title" />
      </main>

      <SiteFooter />
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

// On phones, a one-time note that the portfolio reads best on a bigger screen.
// It waits a moment, stays out of the way at the bottom, and once closed stays closed for a week.
const DESKTOP_TIP_KEY = "desktop-popup-closed-at";
const DESKTOP_TIP_QUIET_MS = 7 * 24 * 60 * 60 * 1000;

function shouldShowDesktopTip() {
  if (typeof window === "undefined" || window.innerWidth >= 768 || !isTouchPhone()) return false;
  try {
    return Date.now() - Number(window.localStorage.getItem(DESKTOP_TIP_KEY) ?? 0) > DESKTOP_TIP_QUIET_MS;
  } catch {
    return true;
  }
}

function DesktopTip() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!shouldShowDesktopTip()) return;
    const timer = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(DESKTOP_TIP_KEY, String(Date.now()));
    } catch {
      // Private browsing: the note may show again next visit.
    }
  };

  // While the pop-up is open the page behind it stays put, and Escape closes it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: globalThis.KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="desktop-tip-overlay" onClick={close} role="presentation">
    <aside aria-label="Best viewed on desktop" aria-modal="true" className="desktop-tip" onClick={(event) => event.stopPropagation()} role="dialog">
      <button aria-label="Close" className="desktop-tip__close" onClick={close} type="button">
        <X aria-hidden="true" size={16} weight="bold" />
      </button>
      <span aria-hidden="true" className="desktop-tip__icon">
        <Desktop size={22} weight="duotone" />
      </span>
      <div className="desktop-tip__text">
        <strong>Best on a bigger screen</strong>
        <p>The case studies are full of detailed screenshots and videos, so they read best on a laptop or desktop. You can still continue on your phone.</p>
      </div>
      <div className="desktop-tip__actions">
        <button
          className="desktop-tip__copy"
          onClick={async () => {
            if (await copyText(window.location.href)) setCopied(true);
          }}
          type="button"
        >
          {copied ? "Link copied" : "Copy link for later"}
        </button>
        <button className="desktop-tip__stay" onClick={close} type="button">
          Continue on mobile
        </button>
      </div>
    </aside>
    </div>
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
  } else if (path.startsWith("/playground/") && playgroundItems.some((item) => item.study && path === `/playground/${item.id}`)) {
    page = <PlaygroundStudyPage item={playgroundItems.find((item) => path === `/playground/${item.id}`)!} />;
  } else if (path === "/about") {
    page = <AboutPage />;
  }

  return (
    <div className="site-shell bg-portfolio-canvas text-portfolio-ink font-sans">
      {page}
      <BackToTop />
      <DesktopTip />
    </div>
  );
}

export default App;
