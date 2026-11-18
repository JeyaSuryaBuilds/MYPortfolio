import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../utils/hooks';

export default function LoadingScreen({ onDone }) {
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const total = reduced ? 400 : 1700;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / total);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, reduced]);

  return (
    <motion.div
      className="loader"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="loader-mark">JS</div>
      <div className="loader-bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
      <p className="loader-pct">{pct}%</p>
    </motion.div>
  );
}
