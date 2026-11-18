import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, Download, Github, Linkedin, Mail, MessageCircle, BadgeCheck } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { profile, resume, socialLinks } from '../data/portfolio';
import { useCompactHero, useFinePointer, useReducedMotion, useSaveData } from '../utils/hooks';
import { scrollToId } from '../utils/scroll';
import ErrorBoundary from './ErrorBoundary';
import Magnetic from './Magnetic';

const HeroScene = lazy(() => import('./HeroScene.jsx'));

const ICONS = { email: Mail, whatsapp: FaWhatsapp, linkedin: Linkedin, github: Github, claimmyjob: BadgeCheck };

// Layered hero images (public/assets/images). The subject is the original portrait with an alpha mask only.
const IMG = {
  back: '/assets/images/hero-bg-back.webp',
  backSm: '/assets/images/hero-bg-back-sm.webp',
  subject: '/assets/images/hero-subject.webp',
  subjectSm: '/assets/images/hero-subject-sm.webp',
};

export default function Hero({ ready }) {
  const root = useRef(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const compact = useCompactHero();
  const lite = useSaveData();
  const motionOn = fine && !reduced;

  // Pointer depth: each layer moves a different amount, the subject also tilts slightly in 3D.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const backX = useTransform(sx, (v) => v * -16);
  const backY = useTransform(sy, (v) => v * -10);
  const lightX = useTransform(sx, (v) => v * -36);
  const lightY = useTransform(sy, (v) => v * -22);
  const subjX = useTransform(sx, (v) => v * 26);
  const subjY = useTransform(sy, (v) => v * 14);
  const subjRY = useTransform(sx, (v) => v * 5);
  const subjRX = useTransform(sy, (v) => v * -4);

  const onMove = (e) => {
    if (!motionOn) return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  // Pause every CSS loop while the hero is off screen
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => { el.dataset.offscreen = e.isIntersecting ? 'false' : 'true'; }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!ready) return undefined;
    const ctx = gsap.context(() => {
      if (reduced) return;
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      // The scene resolves from black, the subject settles forward, then the type rises over it.
      tl.fromTo('.hero-bg', { opacity: 0 }, { opacity: 1, duration: 1.8, ease: 'power2.out' }, 0)
        .fromTo('.bg-subject-enter', { opacity: 0, y: 44, scale: 1.06 }, { opacity: 1, y: 0, scale: 1, duration: 2.2, ease: 'power3.out' }, 0.2)
        .from('.hero-char', { yPercent: 118, duration: 1.15, stagger: 0.05 }, 0.6)
        .from('.hero-fade', { opacity: 0, y: 16, duration: 0.8, stagger: 0.09 }, 1.2);

      // Scroll depth: layers drift at different speeds as the hero leaves
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.bg-scroll-back', { yPercent: 9, ease: 'none', scrollTrigger: st });
      gsap.to('.bg-scroll-lights', { yPercent: 16, ease: 'none', scrollTrigger: st });
      gsap.to('.bg-scroll-subject', { yPercent: 4, scale: 1.05, transformOrigin: '50% 100%', ease: 'none', scrollTrigger: st });
      gsap.to('.hero-copy', {
        opacity: 0.15,
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: '55% top', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [ready, reduced]);

  const links = socialLinks();
  const letters = profile.name.split('');

  return (
    <section
      id="top"
      ref={root}
      className={`hero ${compact ? 'is-compact' : ''} ${ready ? '' : 'is-pending'}`}
      data-lite={lite ? 'true' : undefined}
      onMouseMove={onMove}
    >
      {/* Layer 0: photographic background in three depth layers (backdrop, lights, subject) */}
      <div className="hero-bg" aria-hidden="true">
        <div className="bg-layer bg-scroll-back">
          <motion.div className="bg-fill" style={motionOn ? { x: backX, y: backY } : undefined}>
            <div className="bg-fill bg-zoom-back">
              <img
                className="bg-back-img"
                src={IMG.back}
                srcSet={`${IMG.backSm} 1000w, ${IMG.back} 2000w`}
                sizes="100vw"
                width="2000"
                height="1125"
                alt=""
                fetchpriority="high"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>

        <div className="bg-layer bg-scroll-lights">
          <motion.div className="bg-fill" style={motionOn ? { x: lightX, y: lightY } : undefined}>
            <span className="bg-light bg-light-purple" />
            <span className="bg-light bg-light-blue" />
            <span className="bg-light bg-light-gold" />
            <span className="bg-sweep" />
          </motion.div>
        </div>

        <div className="bg-layer bg-scroll-subject">
          <div className="bg-fill bg-subject-enter">
            <motion.div
              className="bg-subject-pos"
              style={motionOn ? { x: subjX, y: subjY, rotateY: subjRY, rotateX: subjRX } : undefined}
            >
              <div className="bg-zoom-subject">
                <img
                  className="bg-subject-img"
                  src={IMG.subject}
                  srcSet={`${IMG.subjectSm} 640w, ${IMG.subject} 1122w`}
                  sizes="(max-width: 768px) 100vw, 46vw"
                  width="1122"
                  height="1402"
                  alt=""
                  fetchpriority="high"
                  decoding="async"
                />
                <span className="bg-rim bg-rim-gold" />
                <span className="bg-rim bg-rim-blue" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Layer 1: readability grade */}
      <div className="hero-grade" aria-hidden="true" />

      {/* Layer 2: existing 3D depth, softened and masked away from the face */}
      {!reduced && !compact && !lite && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </ErrorBoundary>
      )}

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="hero-name" aria-label={profile.name}>
            <span className="hero-name-line" aria-hidden="true">
              {letters.map((ch, i) => (
                <span className="hero-char-mask" key={i}>
                  <span className="hero-char">{ch === ' ' ? '\u00A0' : ch}</span>
                </span>
              ))}
            </span>
          </h1>
          <p className="hero-title hero-fade">{profile.title.join('  |  ')}</p>
          <p className="hero-intro hero-fade">{profile.intro}</p>

          <div className="hero-cta hero-fade">
            <Magnetic><button className="btn btn-gold" onClick={() => scrollToId('projects')}>Explore My Work</button></Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href={resume.file} download={resume.downloadName}>
                <Download size={17} /> Download Resume
              </a>
            </Magnetic>
            <Magnetic><button className="btn btn-ghost" onClick={() => scrollToId('contact')}>Contact Me</button></Magnetic>
          </div>

          <div className="hero-id-side hero-fade">
            <ul className="hero-social" aria-label="Social links">
              {links.map((l) => {
                const Icon = ICONS[l.id];
                return (
                  <li key={l.id}>
                    <Magnetic strength={0.5}>
                      <a className="icon-btn" href={l.href} aria-label={l.label} title={l.label} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        <Icon size={19} />
                      </a>
                    </Magnetic>
                  </li>
                );
              })}
            </ul>
            <p className="hero-caption">Computer Science and Engineering graduate, 2026</p>
          </div>
        </div>
      </div>

      <button className="scroll-cue hero-fade" onClick={() => scrollToId('about')} aria-label="Scroll to About section">
        <span>Scroll</span>
        <ArrowDown size={16} />
      </button>
    </section>
  );
}