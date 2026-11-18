import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useReducedMotion } from './utils/hooks';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Education from './components/Education';
import Resume from './components/Resume';
import Contact from './components/Contact';
import SuryaAI from './components/SuryaAI';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const done = useCallback(() => setLoaded(true), []);

  // Smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (reduced) return undefined;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reduced]);

  // Hold scrolling during the intro
  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden';
    if (loaded) window.__lenis?.start();
    else window.__lenis?.stop();
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return undefined;
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 400);
    window.addEventListener('load', refresh);
    return () => { clearTimeout(t); window.removeEventListener('load', refresh); };
  }, [loaded]);

  return (
    <>
      <AnimatePresence>{!loaded && <LoadingScreen onDone={done} />}</AnimatePresence>
      <div className="aurora" aria-hidden="true" />
      <Navbar onViewResume={() => setResumeOpen(true)} />
      <main>
        <Hero ready={loaded} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Education />
        <Resume open={resumeOpen} setOpen={setResumeOpen} />
        <Contact />
      </main>
      <Footer />
      <SuryaAI />
    </>
  );
}
