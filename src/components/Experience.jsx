import { experience } from '../data/portfolio';
import SectionHeading from './SectionHeading';
import Timeline from './Timeline';

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="wrap wrap-narrow">
        <SectionHeading title="Experience and internships" />
        <Timeline items={experience} label="Internship timeline" />
      </div>
    </section>
  );
}
