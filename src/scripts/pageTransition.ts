import gsap from "gsap";
import { cleanupPageMotion, resumeSmoothScroll, stopSmoothScroll } from "./siteMotion";

type RouteTransitionEvent = Event & {
  from: URL;
  to: URL;
  signal: AbortSignal;
  loader: () => Promise<unknown>;
};

type ActiveTransition = { id: number; signal: AbortSignal };

let activeTransition: ActiveTransition | undefined;
let transitionId = 0;

function getOverlay() {
  return document.querySelector<HTMLElement>(".page-transition");
}

function getCells() {
  return gsap.utils.toArray<HTMLElement>(".page-transition__cell");
}

function shouldAnimate(from: URL, to: URL) {
  const isExperienceRoute = (url: URL) => url.pathname === "/" || url.pathname.startsWith("/sounds/");
  return from.pathname !== to.pathname && isExperienceRoute(from) && isExperienceRoute(to);
}

function setIdle() {
  const overlay = getOverlay();
  if (!overlay) return;
  const cells = getCells();
  gsap.killTweensOf(cells);
  gsap.set(cells, { clearProps: "transform" });
  overlay.classList.remove("is-active");
}

function animateGrid(covered: boolean, id: number) {
  const overlay = getOverlay();
  const cells = getCells();
  if (!overlay || !cells.length) return Promise.resolve();

  overlay.classList.add("is-active");
  gsap.killTweensOf(cells);
  gsap.set(cells, { scale: covered ? 0 : 1 });

  return new Promise<void>((resolve) => {
    const complete = () => {
      if (activeTransition?.id !== id) return;
      if (!covered) setIdle();
      resolve();
    };
    gsap.to(cells, {
      scale: covered ? 1 : 0,
      duration: covered ? 0.23 : 0.22,
      ease: covered ? "power1.in" : "power2.out",
      stagger: { each: covered ? 0.011 : 0.008, from: "random" },
      onComplete: complete,
      onInterrupt: resolve,
    });
  });
}

document.addEventListener("astro:before-preparation", (rawEvent) => {
  const event = rawEvent as RouteTransitionEvent;
  if (!shouldAnimate(event.from, event.to) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const id = ++transitionId;
  activeTransition = { id, signal: event.signal };
  stopSmoothScroll();

  event.signal.addEventListener("abort", () => {
    if (activeTransition?.id !== id) return;
    activeTransition = undefined;
    setIdle();
    resumeSmoothScroll();
  }, { once: true });

  const loadPage = event.loader;
  event.loader = async () => {
    try {
      await Promise.all([loadPage(), animateGrid(true, id)]);
    } catch (error) {
      if (activeTransition?.id === id) {
        activeTransition = undefined;
        setIdle();
        resumeSmoothScroll();
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
    animateGrid(false, transition.id).then(() => {
      if (activeTransition?.id !== transition.id) return;
      activeTransition = undefined;
      resumeSmoothScroll();
    });
  });
});
