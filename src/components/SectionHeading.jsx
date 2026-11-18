import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../utils/hooks';

export default function SectionHeading({ title, lede }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      const trigger = { trigger: ref.current, start: 'top 88%', once: true };
      gsap.from('.reveal-line > span', { yPercent: 115, duration: 1.1, ease: 'power4.out', scrollTrigger: trigger });
      gsap.from('.lede', { opacity: 0, duration: 1, delay: 0.25, scrollTrigger: trigger });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <header ref={ref} className="section-head">
      <h2 className="h2">
        <span className="reveal-line">
          <span>{title}</span>
        </span>
      </h2>
      {lede && <p className="lede">{lede}</p>}
    </header>
  );
}
