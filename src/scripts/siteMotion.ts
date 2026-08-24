import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

let lenis: Lenis | undefined;
let animationContext: gsap.Context | undefined;
let cleanupCursor: (() => void) | undefined;
let cleanupCassetteSpin: (() => void) | undefined;

function cleanupAnimationMotion() {
  cleanupCassetteSpin?.();
  cleanupCassetteSpin = undefined;
  animationContext?.revert();
  animationContext = undefined;
}

export function cleanupPageMotion() {
  cleanupAnimationMotion();
  cleanupCursor?.();
  cleanupCursor = undefined;
}

export function stopSmoothScroll() {
  lenis?.stop();
}

export function resumeSmoothScroll() {
  lenis?.scrollTo(window.scrollY, { immediate: true });
  lenis?.start();
}

function initializeTrackNavigation() {
  const navigationWindow = window as Window & { omakaseTrackNavigation?: boolean };
  if (navigationWindow.omakaseTrackNavigation) return;
  navigationWindow.omakaseTrackNavigation = true;

  document.addEventListener("click", (event) => {
    const trackLink = event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>(".track-card a.polaroid[href^='/sounds/']")
      : null;
    if (trackLink) sessionStorage.setItem("omakase:reset-track-scroll", "true");
  }, { capture: true });

  document.addEventListener("astro:page-load", () => {
    if (sessionStorage.getItem("omakase:reset-track-scroll") !== "true") return;
    sessionStorage.removeItem("omakase:reset-track-scroll");
    requestAnimationFrame(() => {
      lenis?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    });
  });
}

function initializeLenis() {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    lerp: 0.085,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function resetScrollAfterReload() {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (navigation?.type !== "reload") return;

  requestAnimationFrame(() => {
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  });
}

function initializeCursor() {
  cleanupCursor?.();
  const cursor = document.querySelector<HTMLElement>(".custom-cursor");
  const cursorMedia = window.matchMedia("(min-width: 900px) and (hover: hover) and (pointer: fine)");
  document.body.classList.remove("has-custom-cursor");
  cursor?.classList.remove("is-visible", "is-magnifying", "is-viewing-track", "is-dragging-cassette", "is-spinning-disc", "is-sounds-art");
  if (!cursor || !cursorMedia.matches) return;

  let activeSoundsArt: HTMLElement | undefined;
  let soundsArtBounds: DOMRect | undefined;
  const clearSoundsArtCursor = () => {
    activeSoundsArt = undefined;
    soundsArtBounds = undefined;
    cursor.classList.remove("is-sounds-art");
    cursor.style.removeProperty("background-size");
    cursor.style.removeProperty("background-position");
  };
  const refreshSoundsArtBounds = () => {
    if (activeSoundsArt) soundsArtBounds = activeSoundsArt.getBoundingClientRect();
  };

  const moveCursor = (event: PointerEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    const isTrackLink = Boolean(target?.closest(".track-card a.polaroid[href^='/sounds/']"));
    const isCassette = Boolean(target?.closest("[data-cassette-drag]"));
    const isExposedDisc = Boolean(target?.closest("[data-disc-spin]")?.closest(".is-disc-exposed"));
    const soundsArt = target?.closest<HTMLElement>(".sounds-art");
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.add("is-visible");
    cursor.classList.toggle(
      "is-magnifying",
      isCassette || isExposedDisc || Boolean(target?.closest("h1, h2, h3, p, figcaption, a, .eyebrow, .section-label")),
    );
    cursor.classList.toggle("is-viewing-track", isTrackLink);
    cursor.classList.toggle("is-dragging-cassette", isCassette);
    cursor.classList.toggle("is-spinning-disc", isExposedDisc);
    if (soundsArt) {
      if (soundsArt !== activeSoundsArt) {
        activeSoundsArt = soundsArt;
        refreshSoundsArtBounds();
      }
      if (soundsArtBounds) {
        cursor.classList.add("is-sounds-art");
        cursor.style.backgroundSize = `${soundsArtBounds.width}px ${soundsArtBounds.height}px`;
        cursor.style.backgroundPosition = `${20 - (event.clientX - soundsArtBounds.left)}px ${20 - (event.clientY - soundsArtBounds.top)}px`;
      }
    } else {
      clearSoundsArtCursor();
    }
  };

  const hideCursor = () => {
    cursor.classList.remove("is-visible", "is-magnifying", "is-viewing-track", "is-dragging-cassette", "is-spinning-disc");
    clearSoundsArtCursor();
  };

  document.body.classList.add("has-custom-cursor");
  window.addEventListener("pointermove", moveCursor, { passive: true });
  window.addEventListener("resize", refreshSoundsArtBounds, { passive: true });
  document.documentElement.addEventListener("pointerleave", hideCursor);
  window.addEventListener("blur", hideCursor);

  cleanupCursor = () => {
    window.removeEventListener("pointermove", moveCursor);
    window.removeEventListener("resize", refreshSoundsArtBounds);
    document.documentElement.removeEventListener("pointerleave", hideCursor);
    window.removeEventListener("blur", hideCursor);
    document.body.classList.remove("has-custom-cursor");
    cursor.classList.remove("is-visible", "is-magnifying", "is-viewing-track", "is-dragging-cassette", "is-spinning-disc");
    clearSoundsArtCursor();
  };
}

function initializeMotion() {
  cleanupAnimationMotion();
  animationContext = gsap.context(() => {
    const siteNav = document.querySelector<HTMLElement>(".site-nav");
    const soundtracks = document.querySelector<HTMLElement>(".soundtracks");
    siteNav?.classList.remove("is-on-dark");
    if (siteNav && soundtracks) {
      ScrollTrigger.create({
        trigger: soundtracks,
        start: "top top",
        end: "bottom top",
        onEnter: () => siteNav.classList.add("is-on-dark"),
        onEnterBack: () => siteNav.classList.add("is-on-dark"),
        onLeave: () => siteNav.classList.remove("is-on-dark"),
        onLeaveBack: () => siteNav.classList.remove("is-on-dark"),
      });
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const hero = document.querySelector(".hero");
    if (hero) {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });
      timeline
        .from("[data-nav]", { opacity: 0, y: -16, duration: 0.7 })
        .from(".intro-card", { y: 130, opacity: 0, scale: 0.86, rotate: 14, duration: 1.2, stagger: 0.1 }, 0.1)
        .from(".hero-title", { yPercent: 115, duration: 1.15 }, 0.45)
        .from(".hero-kicker, .hero-intro", { opacity: 0, y: 22, duration: 0.7, stagger: 0.08 }, 0.95)
        .from(".scroll-indicator", { opacity: 0, y: 12, duration: 0.6 }, 1.35);
    }

    const story = document.querySelector<HTMLElement>(".intro-story");
    const about = document.querySelector<HTMLElement>(".about");
    const heroTitle = document.querySelector<HTMLElement>(".hero-title");
    const heroTitleWrap = heroTitle?.parentElement;
    if (story && heroTitle && heroTitleWrap && window.matchMedia("(min-width: 851px)").matches) {
      const titleOrigin = heroTitleWrap.getBoundingClientRect();
      const titleTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: story,
          endTrigger: about ?? story,
          start: "top top",
          end: about ? "top top" : "bottom bottom",
          scrub: 0.5,
          pin: heroTitleWrap,
          pinSpacing: false,
          onEnter: () => heroTitleWrap.classList.add("is-pinned"),
          onEnterBack: () => heroTitleWrap.classList.add("is-pinned"),
          onLeaveBack: () => heroTitleWrap.classList.remove("is-pinned"),
        },
      });

      titleTimeline
        .to(heroTitle, {
          scale: 0.18,
          x: 24 - titleOrigin.left,
          y: 50 - titleOrigin.top,
          transformOrigin: "top left",
          ease: "none",
          duration: 0.35,
        })
        .to({}, { duration: 0.65 });
    }

    gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
      gsap.from(element, {
        y: 55,
        opacity: 0,
        duration: 0.95,
        ease: "power4.out",
        scrollTrigger: { trigger: element, start: "top 84%", once: true },
      });
    });

    const piensoPage = document.querySelector<HTMLElement>('[data-track-slug="pienso-en-ti"]');
    if (piensoPage) {
      const heroCopy = piensoPage.querySelector<HTMLElement>(".track-hero-copy");
      const heroPolaroid = piensoPage.querySelector<HTMLElement>(".track-hero-polaroid");
      if (heroCopy && heroPolaroid) {
        gsap.timeline({ defaults: { ease: "power4.out" } })
          .from(heroCopy.children, { y: 38, opacity: 0, duration: 0.9, stagger: 0.08 })
          .from(heroPolaroid, { y: 80, rotate: 12, opacity: 0, scale: 0.92, duration: 1.15 }, 0.18);
      }

      const lyricLines = gsap.utils.toArray<HTMLElement>(piensoPage.querySelectorAll(".lyric-focus__line"));
      const meaning = piensoPage.querySelector<HTMLElement>(".track-meaning--lyrics");
      if (meaning && lyricLines.length) {
        const lyricTimeline = gsap.timeline({
          scrollTrigger: { trigger: meaning, start: "top 48%", end: "bottom 58%", scrub: true },
        });
        lyricTimeline.set(lyricLines, { opacity: 0.16 });
        lyricLines.forEach((line, index) => {
          const position = index * 0.2;
          lyricTimeline.to(line, { opacity: 1, duration: 0.2, ease: "none" }, position);
          if (index > 0) lyricTimeline.to(lyricLines[index - 1], { opacity: 0.16, duration: 0.2, ease: "none" }, position);
        });
      }

      const gallery = piensoPage.querySelector<HTMLElement>(".track-gallery--pienso");
      const galleryItems = gsap.utils.toArray<HTMLElement>(piensoPage.querySelectorAll(".gallery-item--motion"));
      if (gallery && galleryItems.length === 3) {
        const offset = window.matchMedia("(min-width: 851px)").matches ? 250 : 90;
        gsap.timeline({
          scrollTrigger: { trigger: gallery, start: "top 78%", end: "bottom 22%", scrub: true },
        })
          .fromTo(galleryItems, { opacity: 0.18 }, { opacity: 1, duration: 0.35, stagger: 0.03, ease: "none" }, 0)
          .fromTo([galleryItems[0], galleryItems[2]], { y: offset }, { y: 0, duration: 0.5, ease: "none" }, 0)
          .fromTo(galleryItems[1], { y: -offset }, { y: 0, duration: 0.5, ease: "none" }, 0)
          .to([galleryItems[0], galleryItems[2]], { y: -offset, duration: 0.5, ease: "none" })
          .to(galleryItems[1], { y: offset, duration: 0.5, ease: "none" }, "<");
      }
    }

    const aboutStatements = gsap.utils.toArray<HTMLElement>(".about-statement");
    aboutStatements.forEach((statement, index) => {
      gsap.fromTo(statement, { y: 90, opacity: 0.12 }, {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: statement, start: "top 100%", end: "top 62%", scrub: true },
      });

      const previousStatement = aboutStatements[index - 1];
      if (previousStatement) {
        gsap.to(previousStatement, {
          opacity: 0.16,
          ease: "none",
          scrollTrigger: { trigger: statement, start: "top 76%", end: "top 42%", scrub: true },
        });
      }
    });

    const media = document.querySelector<HTMLElement>("[data-about-media]");
    const cassette = document.querySelector<HTMLElement>("[data-cassette-drag]");
    const disc = document.querySelector<HTMLElement>("[data-disc-spin]");
    const dragHint = document.querySelector<HTMLElement>(".about-drag-hint");
    if (media && cassette && disc && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const [discDraggable] = Draggable.create(disc, {
        type: "rotation",
        inertia: true,
        dragResistance: 0.08,
      });
      discDraggable.disable();

      const maximumSlide = media.clientWidth * 0.55;
      const exposurePoint = maximumSlide * 0.72;
      let isDiscExposed = false;
      const updateDragHint = (x: number) => {
        if (!dragHint) return;
        gsap.set(dragHint, { autoAlpha: Math.max(0, 1 + x / maximumSlide) });
      };
      const updateDiscAccess = (x: number) => {
        const shouldExposeDisc = x <= -exposurePoint;
        if (shouldExposeDisc === isDiscExposed) return;
        isDiscExposed = shouldExposeDisc;
        media.classList.toggle("is-disc-exposed", shouldExposeDisc);
        if (shouldExposeDisc) discDraggable.enable();
        else discDraggable.disable();
      };
      updateDragHint(0);

      const [cassetteDraggable] = Draggable.create(cassette, {
        type: "x",
        bounds: { minX: -maximumSlide, maxX: 0 },
        dragResistance: 0.08,
        onDrag() {
          updateDragHint(this.x);
          updateDiscAccess(this.x);
        },
        onRelease() {
          updateDragHint(this.x);
          updateDiscAccess(this.x);
        },
      });
      cleanupCassetteSpin = () => {
        cassetteDraggable.kill();
        discDraggable.kill();
      };
    }

    const heroCards = gsap.utils.toArray<HTMLElement>(".intro-card");
    if (heroCards.length) {
      gsap.to(heroCards, {
        yPercent: -8,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
      });
    }

    const scrollIndicator = document.querySelector<HTMLElement>(".scroll-indicator");
    if (hero && scrollIndicator) {
      gsap.fromTo(scrollIndicator, { autoAlpha: 1, y: 0 }, {
        autoAlpha: 0,
        y: -14,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top -8%",
          end: "45% top",
          scrub: 0.45,
        },
      });
    }

    const trackCards = gsap.utils.toArray<HTMLElement>(".track-card");
    if (trackCards.length) {
      gsap.from(trackCards, {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: { trigger: ".track-grid", start: "top 80%", once: true },
      });
    }
  });

  ScrollTrigger.refresh();
}

initializeTrackNavigation();

document.addEventListener("astro:page-load", () => {
  initializeLenis();
  resetScrollAfterReload();
  initializeCursor();
  initializeMotion();
});
