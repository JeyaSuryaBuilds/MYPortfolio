export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -64, duration: 1.4 });
  } else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
}

// Reference-counted so nested dialogs do not unlock scrolling early.
let locks = 0;
export function lockScroll(locked) {
  locks = Math.max(0, locks + (locked ? 1 : -1));
  if (locks > 0) {
    window.__lenis?.stop();
    document.body.style.overflow = 'hidden';
  } else {
    window.__lenis?.start();
    document.body.style.overflow = '';
  }
}
