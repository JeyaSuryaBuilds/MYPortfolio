import { ArrowUp } from 'lucide-react';
import { profile } from '../data/portfolio';

export default function Footer() {
  const top = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0 });
  };
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p>&copy; {new Date().getFullYear()} {profile.fullName} All rights reserved.</p>
        <p className="footer-stack">Built with React, Three.js, GSAP and Flask.</p>
        <button className="icon-btn" onClick={top} aria-label="Back to top"><ArrowUp size={18} /></button>
      </div>
    </footer>
  );
}
