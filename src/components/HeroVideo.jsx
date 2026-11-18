import { useEffect, useRef, useState } from 'react';
import { heroMedia } from '../data/portfolio';
import { useCompactHero, useReducedMotion, useSaveData } from '../utils/hooks';

/**
 * Cinematic background video.
 * - Poster is always painted first, so there is no layout shift and no empty frame.
 * - The <video> is only mounted after `ready`, and only the file for the current screen is requested.
 * - Reduced motion / data saver: static still only, no video download.
 * - Pauses when the hero leaves the viewport or the tab is hidden.
 * - Object-position is computed so the subject sits at `targetX` instead of being centre-cropped.
 */
export default function HeroVideo({ ready, observe }) {
  const compact = useCompactHero();
  const reduced = useReducedMotion();
  const saveData = useSaveData();
  const set = compact ? heroMedia.compact : heroMedia.desktop;
  const staticOnly = reduced || saveData;

  const box = useRef(null);
  const video = useRef(null);
  const visible = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posX, setPosX] = useState(50);

  // Place the subject: compute object-position-x from the box shape.
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const f = width / height / (compact ? 464 / 576 : heroMedia.aspect); // fraction of the footage that is visible
      if (f >= 1) { setPosX(50); return; }
      const target = compact ? 0.5 : heroMedia.targetX;
      const left = heroMedia.subjectX - target * f; // visible window's left edge, as a fraction of footage
      setPosX(Math.min(100, Math.max(0, (left / (1 - f)) * 100)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [compact]);

  // Play only while the hero is on screen and the tab is visible.
  useEffect(() => {
    const el = video.current;
    if (!el || staticOnly) return undefined;
    el.muted = true; // React does not reflect the muted attribute reliably; autoplay needs it
    const sync = () => {
      if (visible.current && !document.hidden) el.play().catch(() => {});
      else el.pause();
    };
    const target = observe?.current;
    let io;
    if (target) {
      io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; sync(); }, { threshold: 0.05 });
      io.observe(target);
    }
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { io?.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, [ready, staticOnly, compact, observe]);

  useEffect(() => { setPlaying(false); setFailed(false); }, [compact]);

  const showVideo = ready && !staticOnly && !failed;
  const posterSrc = staticOnly ? set.still : set.poster;
  const style = { objectPosition: `${posX}% ${compact ? 22 : 50}%` };

  return (
    <div className="hero-media" ref={box} aria-hidden="true">
      <img className="hero-media-el hero-media-poster" src={posterSrc} alt="" width={compact ? 464 : 1280} height={576} style={style} fetchpriority="high" decoding="async" />
      {showVideo && (
        <video
          key={compact ? 'compact' : 'desktop'}
          ref={video}
          className={`hero-media-el hero-media-video ${playing ? 'is-playing' : ''}`}
          style={style}
          poster={set.poster}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onError={() => setFailed(true)}
        >
          {!compact && heroMedia.desktop.webm && <source src={heroMedia.desktop.webm} type="video/webm" />}
          <source src={set.mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
