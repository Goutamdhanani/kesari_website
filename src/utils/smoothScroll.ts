import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

let lenisInstance: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;
let anchorClickHandler: ((e: MouseEvent) => void) | null = null;
let resizeHandler: (() => void) | null = null;
let loadHandler: (() => void) | null = null;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize Lenis smooth scrolling driven by GSAP's single rAF ticker,
 * anchor link gliding, debounced resize refresh, and font/load ScrollTrigger sync.
 */
export function initSmoothScroll(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (prefersReducedMotion()) {
    // Respect prefers-reduced-motion: do not init Lenis; show content immediately.
    return () => {};
  }

  if (lenisInstance) {
    return () => {};
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    syncTouch: false,
  });

  lenisInstance = lenis;
  window.lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);

  tickerFn = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  anchorClickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const dest = document.querySelector(href);
    if (!dest) return;
    e.preventDefault();
    lenis.scrollTo(href, { offset: -80, duration: 1.4 });
  };
  document.addEventListener('click', anchorClickHandler);

  let resizeTimer: number | undefined;
  resizeHandler = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  };
  window.addEventListener('resize', resizeHandler, { passive: true });

  loadHandler = () => {
    ScrollTrigger.refresh();
  };
  window.addEventListener('load', loadHandler);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  return () => {
    if (anchorClickHandler) {
      document.removeEventListener('click', anchorClickHandler);
      anchorClickHandler = null;
    }
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }
    if (loadHandler) {
      window.removeEventListener('load', loadHandler);
      loadHandler = null;
    }
    if (tickerFn) {
      gsap.ticker.remove(tickerFn);
      tickerFn = null;
    }
    ScrollTrigger.getAll().forEach((t) => t.kill());
    lenis.destroy();
    lenisInstance = null;
    delete window.lenis;
  };
}

/**
 * Pause or resume Lenis when modals, drawers, or menus are open.
 */
export function setSmoothScrollPaused(paused: boolean): void {
  if (!lenisInstance) return;
  if (paused) {
    lenisInstance.stop();
  } else {
    lenisInstance.start();
  }
}

/**
 * Scroll immediately to top on route/tab swap so new view starts cleanly at y=0.
 */
export function resetScrollPosition(): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  } else if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
}

/**
 * Register GPU-only ScrollTrigger reveals ([data-reveal]) and desktop parallax ([data-parallax])
 * after DOM/tab changes, then refresh ScrollTrigger measurements.
 */
export function refreshScrollAnimations(scope?: HTMLElement | null): void {
  if (typeof window === 'undefined') return;

  ScrollTrigger.getAll().forEach((t) => t.kill());

  if (prefersReducedMotion()) {
    return;
  }

  const root = scope ?? document;

  const revealEls = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  revealEls.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      }
    );
  });

  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isDesktopPointer) {
    const parallaxEls = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || '0.15');
      gsap.to(el, {
        yPercent: -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  ScrollTrigger.refresh();
}
