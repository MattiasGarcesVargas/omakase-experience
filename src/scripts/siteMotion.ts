import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

let lenis: Lenis | undefined;
let lenisTicker: ((time: number) => void) | undefined;
let animationContext: gsap.Context | undefined;
let cleanupCursor: (() => void) | undefined;
let cleanupCassetteSpin: (() => void) | undefined;
let cleanupAboutKeyboard: (() => void) | undefined;
let responsiveRefreshTimer: number | undefined;

function cleanupAnimationMotion() {
  cleanupCassetteSpin?.();
  cleanupCassetteSpin = undefined;
  cleanupAboutKeyboard?.();
  cleanupAboutKeyboard = undefined;
  animationContext?.revert();
  animationContext = undefined;
  document.querySelectorAll(".track-meaning--city, .inarow-story").forEach((element) => element.classList.remove("is-motion-ready"));
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
      ? event.target.closest<HTMLAnchorElement>(".track-card a.polaroid[href^='/sounds/'], .next-track a[href^='/sounds/']")
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
  lenisTicker = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(lenisTicker);
  gsap.ticker.lagSmoothing(0);
}

function destroyLenis() {
  if (lenisTicker) gsap.ticker.remove(lenisTicker);
  lenisTicker = undefined;
  lenis?.destroy();
  lenis = undefined;
}

function initializeMotionPreferenceListener() {
  const motionWindow = window as Window & { omakaseMotionPreferenceListener?: boolean };
  if (motionWindow.omakaseMotionPreferenceListener) return;
  motionWindow.omakaseMotionPreferenceListener = true;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", ({ matches }) => {
    cleanupPageMotion();
    if (matches) destroyLenis();
    else initializeLenis();
    initializeCursor();
    initializeMotion(false);
  });
}

function initializeResponsiveMotionListener() {
  const motionWindow = window as Window & { omakaseResponsiveMotionListener?: boolean };
  if (motionWindow.omakaseResponsiveMotionListener) return;
  motionWindow.omakaseResponsiveMotionListener = true;
  const refresh = () => {
    window.clearTimeout(responsiveRefreshTimer);
    responsiveRefreshTimer = window.setTimeout(() => {
      initializeCursor();
      initializeMotion(false);
    }, 160);
  };
  window.addEventListener("resize", refresh, { passive: true });
  window.addEventListener("orientationchange", refresh, { passive: true });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

function initializeAboutKeyboardControls() {
  const media = document.querySelector<HTMLElement>("[data-about-media]");
  const cassette = document.querySelector<HTMLElement>("[data-cassette-drag]");
  const disc = document.querySelector<HTMLElement>("[data-disc-spin]");
  if (!media || !cassette || !disc) return;

  const setCassetteExposure = (isExposed: boolean) => {
    const x = isExposed ? -(media.clientWidth * 0.55) : 0;
    cassette.setAttribute("aria-expanded", String(isExposed));
    media.classList.toggle("is-disc-exposed", isExposed);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) gsap.set(cassette, { x });
    else gsap.to(cassette, { x, duration: 0.35, ease: "power3.out" });
  };
  const rotateDisc = (direction: 1 | -1) => {
    const rotation = direction < 0 ? "-=45" : "+=45";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) gsap.set(disc, { rotation });
    else gsap.to(disc, { rotation, duration: 0.3, ease: "power3.out" });
  };
  const onKeydown = (event: KeyboardEvent) => {
    const isCassette = event.target === cassette;
    const isDisc = event.target === disc && media.classList.contains("is-disc-exposed");
    if (isCassette && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      setCassetteExposure(event.key === "ArrowLeft");
    }
    if (isDisc && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      rotateDisc(event.key === "ArrowLeft" ? -1 : 1);
    }
  };
  const onClick = (event: MouseEvent) => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (event.target === cassette || (event.target instanceof Element && event.target.closest("[data-cassette-drag]"))) {
      setCassetteExposure(!media.classList.contains("is-disc-exposed"));
    } else if (event.target === disc && media.classList.contains("is-disc-exposed")) {
      rotateDisc(1);
    }
  };

  document.addEventListener("keydown", onKeydown);
  document.addEventListener("click", onClick);
  cleanupAboutKeyboard = () => {
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("click", onClick);
  };
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

function initializeMotion(playEntrances = true) {
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

    initializeAboutKeyboardControls();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cityState = document.querySelector<HTMLElement>(".track-meaning--city");
    if (prefersReducedMotion && siteNav && cityState) {
      ScrollTrigger.create({
        trigger: cityState,
        start: "top 12%",
        end: "bottom 12%",
        onEnter: () => siteNav.classList.add("is-on-dark"),
        onEnterBack: () => siteNav.classList.add("is-on-dark"),
        onLeave: () => siteNav.classList.remove("is-on-dark"),
        onLeaveBack: () => siteNav.classList.remove("is-on-dark"),
      });
    }
    if (prefersReducedMotion) return;

    const hero = document.querySelector(".hero");
    if (hero && playEntrances) {
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

    if (playEntrances) gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
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
      if (heroCopy && heroPolaroid && playEntrances) {
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
        const isDesktopGallery = window.matchMedia("(min-width: 851px)").matches;
        const offset = isDesktopGallery ? 250 : 40;
        gsap.timeline({
          scrollTrigger: { trigger: gallery, start: "top 78%", end: "bottom 22%", scrub: true },
        })
          .fromTo(galleryItems, { opacity: 0.18 }, { opacity: 1, duration: 0.35, stagger: 0.03, ease: "none" }, 0);
        if (isDesktopGallery) {
          gsap.timeline({ scrollTrigger: { trigger: gallery, start: "top 78%", end: "bottom 22%", scrub: true } })
            .fromTo([galleryItems[0], galleryItems[2]], { y: offset }, { y: 0, duration: 0.5, ease: "none" }, 0)
            .fromTo(galleryItems[1], { y: -offset }, { y: 0, duration: 0.5, ease: "none" }, 0)
            .to([galleryItems[0], galleryItems[2]], { y: -offset, duration: 0.5, ease: "none" })
            .to(galleryItems[1], { y: offset, duration: 0.5, ease: "none" }, "<");
        } else {
          gsap.timeline({ scrollTrigger: { trigger: gallery, start: "top 78%", end: "bottom 22%", scrub: true } })
            .fromTo(galleryItems, { y: offset }, { y: -offset, duration: 1, ease: "none", stagger: 0.04 });
        }
      }
    }

    const cityPage = document.querySelector<HTMLElement>('[data-track-slug="en-la-misma-ciudad"]');
    const cityMeaning = cityPage?.querySelector<HTMLElement>(".track-meaning--city");
    const cityStage = cityPage?.querySelector<HTMLElement>(".city-meaning-stage");
    const cityImage = cityPage?.querySelector<HTMLElement>(".city-meaning-image");
    const cityShade = cityPage?.querySelector<HTMLElement>(".city-meaning-shade");
    const cityLines = cityPage ? gsap.utils.toArray<HTMLElement>(cityPage.querySelectorAll(".city-meaning-lines p")) : [];
    const cityNav = document.querySelector<HTMLElement>(".site-nav");
    if (cityMeaning && cityStage && cityImage && cityShade && cityLines.length) {
      cityMeaning.classList.add("is-motion-ready");
      const isCompactCityScene = window.matchMedia("(max-width: 850px)").matches;
      const cityTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: cityMeaning,
          start: "top top",
          end: isCompactCityScene ? "+=115%" : "+=175%",
          scrub: 0.7,
          pin: cityStage,
          anticipatePin: 1,
          onEnter: () => cityNav?.classList.add("is-on-dark"),
          onEnterBack: () => cityNav?.classList.add("is-on-dark"),
          onLeave: () => cityNav?.classList.remove("is-on-dark"),
          onLeaveBack: () => cityNav?.classList.remove("is-on-dark"),
        },
      });

      cityTimeline
        .to(cityImage, { scale: isCompactCityScene ? 1.08 : 1.16, duration: 0.38, ease: "none" })
        .to(cityShade, { opacity: 0.76, duration: 0.34, ease: "none" }, 0.28);

      cityLines.forEach((line, index) => {
        const position = 0.5 + (index * 0.18);
        cityTimeline.fromTo(line, { autoAlpha: 0, y: 42 }, { autoAlpha: 1, y: 0, duration: 0.16, ease: "none" }, position);
        if (index > 0) cityTimeline.to(cityLines[index - 1], { autoAlpha: 0.14, y: -16, duration: 0.16, ease: "none" }, position);
      });
    }

    const inarowPage = document.querySelector<HTMLElement>('[data-track-slug="inarow62"]');
    const inarowStory = inarowPage?.querySelector<HTMLElement>(".inarow-story");
    const inarowLines = inarowPage ? gsap.utils.toArray<HTMLElement>(inarowPage.querySelectorAll(".inarow-story__lines p")) : [];
    const inarowImages = inarowPage ? gsap.utils.toArray<HTMLElement>(inarowPage.querySelectorAll(".inarow-story__image")) : [];
    const inarowThread = inarowPage?.querySelector<HTMLElement>(".inarow-story__thread");
    const inarowCroc = inarowPage?.querySelector<HTMLElement>(".inarow-hero-croc");
    if (inarowPage && inarowCroc && playEntrances) {
      gsap.from(inarowCroc, { autoAlpha: 0, scale: 0.82, rotate: -18, duration: 1.15, ease: "power4.out" });
    }
    if (inarowStory && inarowThread && inarowLines.length === 5) {
      inarowLines.forEach((line, index) => {
        gsap.to(line, {
          color: "#2a2020",
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: line, start: "top 76%", end: "top 48%", scrub: true },
        });
        const previousLine = inarowLines[index - 1];
        if (previousLine) {
          gsap.to(previousLine, {
            color: "rgba(42,32,32,.28)",
            opacity: 0.28,
            ease: "none",
            scrollTrigger: { trigger: line, start: "top 70%", end: "top 42%", scrub: true },
          });
        }
      });

      if (inarowImages.length) {
        gsap.timeline({
          scrollTrigger: { trigger: inarowStory, start: "top 74%", end: "bottom 30%", scrub: 0.75 },
        })
          .fromTo(inarowThread, { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "none" }, 0)
          .fromTo(inarowImages[2], { xPercent: -24, yPercent: 14, rotation: -5, opacity: 0.32 }, { xPercent: 0, yPercent: 0, rotation: -2, opacity: 1, duration: 0.42, ease: "none" }, 0.12)
          .fromTo(inarowImages[1], { xPercent: 28, yPercent: 12, rotation: 5, opacity: 0.3 }, { xPercent: 0, yPercent: 0, rotation: 3, opacity: 1, duration: 0.42, ease: "none" }, 0.36)
          .fromTo(inarowImages[0], { xPercent: -30, yPercent: 10, rotation: -5, opacity: 0.28 }, { xPercent: 0, yPercent: 0, rotation: -2, opacity: 1, duration: 0.42, ease: "none" }, 0.58);
      }
    }

    const noAmigosPage = document.querySelector<HTMLElement>('[data-track-slug="no-podemos-ser-amigos"]');
    const noAmigosStory = noAmigosPage?.querySelector<HTMLElement>(".no-amigos-story");
    const noAmigosStage = noAmigosPage?.querySelector<HTMLElement>(".no-amigos-story__stage");
    const noAmigosNote = noAmigosPage?.querySelector<HTMLElement>(".no-amigos-note");
    const noAmigosTour = noAmigosPage?.querySelector<HTMLElement>(".no-amigos-tour");
    const noAmigosLines = noAmigosPage ? gsap.utils.toArray<HTMLElement>(noAmigosPage.querySelectorAll(".no-amigos-note__body p")) : [];
    const noAmigosSignature = noAmigosPage?.querySelector<HTMLElement>(".no-amigos-note__signature");
    if (noAmigosStory && noAmigosStage && noAmigosNote && noAmigosTour && noAmigosSignature && noAmigosLines.length === 5) {
      if (window.matchMedia("(min-width: 851px)").matches) {
        gsap.timeline({
          scrollTrigger: {
            trigger: noAmigosStory,
            start: "top top",
            end: "+=145%",
            scrub: 0.65,
            pin: noAmigosStage,
            anticipatePin: 1,
          },
        })
          .from(noAmigosNote, { autoAlpha: 0, y: 90, rotation: -4, duration: 0.22, ease: "none" }, 0)
          .from(noAmigosTour, { autoAlpha: 0, x: 100, rotation: 11, duration: 0.2, ease: "none" }, 0.12)
          .from(noAmigosLines, { autoAlpha: 0, y: 22, duration: 0.1, stagger: 0.08, ease: "none" }, 0.32)
          .from(noAmigosSignature, { autoAlpha: 0, x: -18, duration: 0.12, ease: "none" }, 0.78)
          .to(noAmigosTour, { yPercent: -5, rotation: 1.5, duration: 0.45, ease: "none" }, 0.4);
      } else {
        gsap.from(noAmigosNote, {
          autoAlpha: 0,
          y: 48,
          rotation: -3,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: noAmigosNote, start: "top 82%", once: true },
        });
        gsap.from(noAmigosTour, {
          autoAlpha: 0,
          y: 48,
          rotation: 8,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: noAmigosTour, start: "top 84%", once: true },
        });
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
        cassette.setAttribute("aria-expanded", String(shouldExposeDisc));
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
    if (trackCards.length && playEntrances) {
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
initializeMotionPreferenceListener();
initializeResponsiveMotionListener();

document.addEventListener("astro:page-load", () => {
  initializeLenis();
  resetScrollAfterReload();
  initializeCursor();
  initializeMotion(document.documentElement.dataset.routeTransition !== "true");
});

window.addEventListener("omakase:transition-complete", () => {
  initializeMotion(true);
});
