import { Brain, Code2, Coffee, Layers, Sparkles } from 'lucide-react';
import { about } from '../data/portfolio';
import SectionHeading from './SectionHeading';

const INTEREST_ICONS = [Code2, Brain, Layers, Coffee, Sparkles];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <SectionHeading title="About me" />
        <div className="about-grid">
          <div>
            <p className="about-statement">{about.statement}</p>
            <ul className="interest-list" aria-label="Areas of interest">
              {about.interests.map((label, i) => {
                const Icon = INTEREST_ICONS[i % INTEREST_ICONS.length];
                return (
                  <li key={label}>
                    <Icon size={16} aria-hidden="true" /> {label}
                  </li>
                );
              })}
            </ul>
          </div>
          <dl className="facts glass">
            {about.facts.map((f) => (
              <div key={f.label} className="fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
