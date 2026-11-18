import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Eye, FileX2 } from 'lucide-react';
import { certifications } from '../data/portfolio';
import { useReducedMotion } from '../utils/hooks';
import Modal from './Modal';
import SectionHeading from './SectionHeading';

function Thumb({ cert }) {
  if (cert.file && cert.type === 'image') {
    return <img src={cert.file} alt={`${cert.name} certificate`} loading="lazy" decoding="async" />;
  }
  return (
    <div className="cert-thumb-empty">
      {cert.file ? <Award size={30} aria-hidden="true" /> : <FileX2 size={30} aria-hidden="true" />}
      <span>{cert.file ? 'PDF certificate' : 'Certificate not uploaded yet'}</span>
    </div>
  );
}

export default function Certifications() {
  const [active, setActive] = useState(null);
  const reduced = useReducedMotion();

  return (
    <section id="certifications" className="section">
      <div className="wrap">
        <SectionHeading title="Certifications" lede="Open a card to view the certificate in full screen." />
        <div className="cert-grid">
          {certifications.map((c) => (
            <motion.article key={c.id} className="cert-card glass" whileHover={reduced ? undefined : { y: -6, rotateX: 2 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              <div className="cert-thumb"><Thumb cert={c} /></div>
              <div className="cert-body">
                <h3>{c.name}</h3>
                <p className="cert-issuer">{c.issuer}</p>
                <button
                  className={`btn btn-sm ${c.file ? 'btn-ghost' : 'btn-disabled'}`}
                  disabled={!c.file}
                  onClick={() => setActive(c)}
                  title={c.file ? 'View certificate' : 'Certificate file not added yet'}
                >
                  <Eye size={15} /> View Certificate
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} label={active ? `${active.name} certificate` : 'Certificate'} size="xl">
        {active && (
          <div className="cert-view">
            {active.type === 'pdf' ? (
              <iframe title={active.name} src={`${active.file}#view=FitH`} />
            ) : (
              <img src={active.file} alt={`${active.name} certificate`} />
            )}
            <p>{active.name}, {active.issuer}</p>
          </div>
        )}
      </Modal>
    </section>
  );
}
