import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Coffee, Database, LayoutTemplate, Sparkles, Terminal, Workflow, Wrench } from 'lucide-react';
import { skills } from '../data/portfolio';
import { useReducedMotion } from '../utils/hooks';
import ErrorBoundary from './ErrorBoundary';
import SectionHeading from './SectionHeading';

const TechCluster = lazy(() => import('./TechCluster.jsx'));

const ICONS = { terminal: Terminal, coffee: Coffee, layout: LayoutTemplate, database: Database, brain: BrainCircuit, sparkles: Sparkles, wrench: Wrench, workflow: Workflow };

export default function Skills() {
  const reduced = useReducedMotion();
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <SectionHeading title="Technical skills" lede="Python is where I build most. Java is the second language I am developing as a specialisation." />

        <ErrorBoundary>
          <Suspense fallback={<div className="tech-cluster glass" />}>
            <TechCluster />
          </Suspense>
        </ErrorBoundary>

        <div className="skills-grid">
          {skills.map((s) => {
            const Icon = ICONS[s.icon] ?? Terminal;
            return (
              <motion.article
                key={s.id}
                className={`skill-card glass ${s.tier ? `skill-${s.tier}` : ''}`}
                whileHover={reduced ? undefined : { y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <header>
                  <span className="skill-icon" aria-hidden="true"><Icon size={s.tier === 'primary' ? 26 : 20} /></span>
                  <h3>{s.title}</h3>
                  {s.tier === 'primary' && <span className="badge badge-gold">Primary skill</span>}
                  {s.tier === 'secondary' && <span className="badge badge-blue">Secondary specialisation</span>}
                </header>
                <ul className="chips">
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
