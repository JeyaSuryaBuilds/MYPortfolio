import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../utils/hooks';

export default function Timeline({ items, label }) {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.tl-line-fill', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 65%', scrub: true },
      });
      gsap.utils.toArray('.tl-card').forEach((card) => {
        gsap.from(card, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%', once: true },
        });
      });
      gsap.utils.toArray('.tl-dot').forEach((dot) => {
        gsap.from(dot, { scale: 0, duration: 0.5, ease: 'back.out(3)', scrollTrigger: { trigger: dot, start: 'top 80%', once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <ol className="timeline" ref={root} aria-label={label}>
      <span className="tl-line" aria-hidden="true"><span className="tl-line-fill" /></span>
      {items.map((it) => (
        <li className="tl-item" key={it.id}>
          <p className="tl-period">{it.period}</p>
          <span className="tl-dot" aria-hidden="true" />
          <div className="tl-card glass">
            {it.period && <p className="tl-period-inline">{it.period}</p>}
            <h3>{it.title}</h3>
            <p className="tl-org">{it.org}</p>
            {it.body && <p className="tl-body">{it.body}</p>}
            {it.meta && <p className="tl-meta">{it.meta}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
