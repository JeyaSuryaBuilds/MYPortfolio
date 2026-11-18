import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { nav } from '../data/portfolio';
import { scrollToId } from '../utils/scroll';
import Magnetic from './Magnetic';

export default function Navbar({ onViewResume }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 250 : 0);
  };

  return (
    <header className={`nav ${scrolled ? 'nav-solid' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); window.__lenis?.scrollTo(0); }} aria-label="Jeya Surya B., back to top">
          <span className="brand-mark">JS</span>
          <span className="brand-name">Jeya Surya B.</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'is-active' : ''} onClick={(e) => { e.preventDefault(); go(n.id); }}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <Magnetic>
            <button className="btn btn-ghost btn-sm" onClick={onViewResume}>Resume</button>
          </Magnetic>
          <button className="burger" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <motion.div className="nav-progress" style={{ scaleX: progress }} />

      <AnimatePresence>
        {open && (
          <motion.nav
            className="drawer"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {nav.map((n, i) => (
              <motion.a
                key={n.id}
                href={`#${n.id}`}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                onClick={(e) => { e.preventDefault(); go(n.id); }}
              >
                {n.label}
              </motion.a>
            ))}
            <button className="btn btn-gold" onClick={() => { setOpen(false); onViewResume(); }}>View resume</button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
