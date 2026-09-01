import gsap from "gsap";
import { tracks } from "../data/tracks";
import { cleanupPageMotion, resumeSmoothScroll, stopSmoothScroll } from "./siteMotion";

type RouteTransitionEvent = Event & {
  from: URL;
  to: URL;
  signal: AbortSignal;
  loader: () => Promise<unknown>;
};

type TransitionKind = "grid" | "jukebox";
type JukeboxRoute = { fromIndex: number; toIndex: number; direction: "forward" | "backward" };
type ActiveTransition = { id: number; signal: AbortSignal; kind: TransitionKind; jukeboxRoute?: JukeboxRoute };

let activeTransition: ActiveTransition | undefined;
let transitionId = 0;

function completeRouteTransition() {
  delete document.documentElement.dataset.routeTransition;
  window.dispatchEvent(new Event("omakase:transition-complete"));
}

function getOverlay() {
  return document.querySelector<HTMLElement>(".page-transition");
}

function getCells() {
  return gsap.utils.toArray<HTMLElement>(".page-transition__cell");
}

function getJukebox() {
  return document.querySelector<HTMLElement>(".jukebox-transition");
}

function getQueueItems(overlay: HTMLElement) {
  return gsap.utils.toArray<HTMLElement>(overlay.querySelectorAll(".jukebox-transition__track"));
}

function setQueueFocus(items: HTMLElement[], index: number) {
  items.forEach((item, itemIndex) => item.classList.toggle("is-focused", itemIndex === index));
}

function shouldAnimate(from: URL, to: URL) {
  const isExperienceRoute = (url: URL) => url.pathname === "/" || url.pathname.startsWith("/sounds/");
  return from.pathname !== to.pathname && isExperienceRoute(from) && isExperienceRoute(to);
}

function getJukeboxRoute(from: URL, to: URL): JukeboxRoute | undefined {
  const fromIndex = tracks.findIndex((track) => from.pathname === `/sounds/${track.slug}`);
  const toIndex = tracks.findIndex((track) => to.pathname === `/sounds/${track.slug}`);
  // Opening a track from the Sounds shelf starts with that selection already playing.
  if (from.pathname === "/" && toIndex >= 0) return { fromIndex: toIndex, toIndex, direction: "forward" };
  if (fromIndex < 0 || toIndex < 0) return;
  if (toIndex === (fromIndex + 1) % tracks.length) return { fromIndex, toIndex, direction: "forward" };
  if (toIndex === (fromIndex - 1 + tracks.length) % tracks.length) return { fromIndex, toIndex, direction: "backward" };
}

function setIdle() {
  const overlay = getOverlay();
  if (!overlay) return;
  const cells = getCells();
  gsap.killTweensOf(cells);
  gsap.set(cells, { clearProps: "transform" });
  overlay.classList.remove("is-active");
}

function setJukeboxIdle() {
  const overlay = getJukebox();
  if (!overlay) return;
  const panel = overlay.querySelector<HTMLElement>(".jukebox-transition__panel");
  const tracks = getQueueItems(overlay);
  gsap.killTweensOf([overlay, panel, ...tracks]);
  gsap.set([overlay, panel, ...tracks], { clearProps: "all" });
  overlay.classList.remove("is-active");
}

function animateGrid(covered: boolean, id: number) {
  const overlay = getOverlay();
  const cells = getCells();
  if (!overlay || !cells.length) return Promise.resolve();

  overlay.classList.add("is-active");
  gsap.killTweensOf(cells);
  gsap.set(cells, { scale: covered ? 0 : 1.02 });

  return new Promise<void>((resolve) => {
    const complete = () => {
      if (activeTransition?.id !== id) return;
      if (!covered) setIdle();
      resolve();
    };
    gsap.to(cells, {
      scale: covered ? 1.02 : 0,
      duration: covered ? 0.24 : 0.22,
      ease: covered ? "power1.in" : "power2.out",
      stagger: { amount: covered ? 0.42 : 0.36, from: "random" },
      onComplete: complete,
      onInterrupt: resolve,
    });
  });
}

function animateJukebox(covered: boolean, id: number, route: JukeboxRoute | undefined) {
  const overlay = getJukebox();
  const panel = overlay?.querySelector<HTMLElement>(".jukebox-transition__panel");
  const queueItems = overlay ? getQueueItems(overlay) : [];
  if (!overlay || !panel || queueItems.length < 2 || !route) return Promise.resolve();

  overlay.classList.add("is-active");
  gsap.killTweensOf([overlay, panel, ...queueItems]);

  return new Promise<void>((resolve) => {
    const complete = () => {
      if (activeTransition?.id !== id) return;
      if (!covered) setJukeboxIdle();
      resolve();
    };
    const timeline = gsap.timeline({ onComplete: complete, onInterrupt: resolve });

    if (covered) {
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set(panel, { xPercent: route.direction === "forward" ? -108 : 108, rotationY: route.direction === "forward" ? -3 : 3 });
      gsap.set(queueItems, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
      setQueueFocus(queueItems, route.fromIndex);
      timeline
        .to(panel, { xPercent: 0, rotationY: 0, duration: 0.48, ease: "power4.inOut" })
        .add(() => setQueueFocus(queueItems, route.toIndex), 0.72)
        .to({}, { duration: 0.7 }, 0.72);
    } else {
      timeline.to(panel, { xPercent: route.direction === "forward" ? 108 : -108, rotationY: route.direction === "forward" ? 3 : -3, duration: 0.66, ease: "power4.inOut" });
    }
  });
}

document.addEventListener("astro:before-preparation", (rawEvent) => {
  const event = rawEvent as RouteTransitionEvent;
  const jukeboxRoute = getJukeboxRoute(event.from, event.to);
  if ((!jukeboxRoute && !shouldAnimate(event.from, event.to)) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const id = ++transitionId;
  const kind: TransitionKind = jukeboxRoute ? "jukebox" : "grid";
  activeTransition = { id, signal: event.signal, kind, jukeboxRoute };
  document.documentElement.dataset.routeTransition = "true";
  stopSmoothScroll();

  event.signal.addEventListener("abort", () => {
    if (activeTransition?.id !== id) return;
    activeTransition = undefined;
    if (kind === "jukebox") setJukeboxIdle();
    else setIdle();
    resumeSmoothScroll();
    completeRouteTransition();
  }, { once: true });

  const loadPage = event.loader;
  event.loader = async () => {
    try {
      await Promise.all([loadPage(), kind === "jukebox" ? animateJukebox(true, id, jukeboxRoute) : animateGrid(true, id)]);
    } catch (error) {
      if (activeTransition?.id === id) {
        activeTransition = undefined;
        if (kind === "jukebox") setJukeboxIdle();
        else setIdle();
        resumeSmoothScroll();
        completeRouteTransition();
      }
      throw error;
    }
  };
});

document.addEventListener("astro:before-swap", () => {
  if (activeTransition) cleanupPageMotion();
});

document.addEventListener("astro:page-load", () => {
  const transition = activeTransition;
  if (!transition) return;

  requestAnimationFrame(() => {
    if (activeTransition?.id !== transition.id || transition.signal.aborted) return;
    const animation = transition.kind === "jukebox" ? animateJukebox(false, transition.id, transition.jukeboxRoute) : animateGrid(false, transition.id);
    animation.then(() => {
      if (activeTransition?.id !== transition.id) return;
      activeTransition = undefined;
      resumeSmoothScroll();
      completeRouteTransition();
    });
  });
});
