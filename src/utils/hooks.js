import { useEffect, useRef, useState } from 'react';

export function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

/** True while the referenced element is within (or near) the viewport. */
export function useInView(rootMargin = '250px') {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView];
}

/** Phones and portrait-oriented screens: use the lightweight, vertically cropped hero. */
export const useCompactHero = () => useMediaQuery('(max-width: 768px), (max-aspect-ratio: 1/1)');

/** True when the visitor asked to save data or is on a very slow connection. */
export function useSaveData() {
  const c = typeof navigator !== 'undefined' ? navigator.connection : undefined;
  return !!c && (c.saveData === true || /(^|-)2g$/.test(c.effectiveType || ''));
}
