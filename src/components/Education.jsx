import { education } from '../data/portfolio';
import SectionHeading from './SectionHeading';
import Timeline from './Timeline';

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="wrap wrap-narrow">
        <SectionHeading title="Education" />
        <Timeline items={education} label="Education timeline" />
      </div>
    </section>
  );
}
