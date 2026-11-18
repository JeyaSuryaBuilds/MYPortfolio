import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Eye, Github, ImageOff } from 'lucide-react';
import { projects } from '../data/portfolio';
import { useReducedMotion } from '../utils/hooks';
import Modal from './Modal';
import SectionHeading from './SectionHeading';

function ProjectImage({ project, className = '' }) {
  if (project.image) {
    return <img className={className} src={project.image} alt={`${project.name} screenshot`} loading="lazy" decoding="async" />;
  }
  return (
    <div className={`img-placeholder ${className}`} role="img" aria-label={`${project.name} screenshot placeholder`}>
      <ImageOff size={26} aria-hidden="true" />
      <strong>Screenshot placeholder</strong>
      <span>Add public/assets/projects/{project.id}.webp and set it in src/data/portfolio.js</span>
    </div>
  );
}

function LinkButton({ href, icon: Icon, children, variant = 'ghost', onClick }) {
  if (!href) {
    return (
      <button className="btn btn-sm btn-disabled" disabled title="Link not added yet">
        <Icon size={15} /> {children}
      </button>
    );
  }
  return (
    <a className={`btn btn-sm btn-${variant}`} href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      <Icon size={15} /> {children}
    </a>
  );
}

function Card({ project, onOpen, onPreview }) {
  const reduced = useReducedMotion();
  return (
    <motion.article className="project-card glass" whileHover={reduced ? undefined : { y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <button className="project-media" onClick={() => onOpen(project)} aria-label={`Open details for ${project.name}`}>
        <ProjectImage project={project} />
        <span className="project-sheen" aria-hidden="true" />
      </button>
      <div className="project-body">
        <p className="project-cat">{project.category}</p>
        <h3>{project.name}</h3>
        <p className="project-desc">{project.description || 'Description to be added.'}</p>
        {project.tech.length > 0 ? (
          <ul className="chips chips-sm">
            {project.tech.slice(0, 5).map((t) => <li key={t}>{t}</li>)}
            {project.tech.length > 5 && <li>+{project.tech.length - 5}</li>}
          </ul>
        ) : (
          <p className="muted-note">Technology stack to be added.</p>
        )}
        <div className="project-actions">
          <LinkButton href={project.liveUrl} icon={ExternalLink} variant="gold">Live Demo</LinkButton>
          <LinkButton href={project.githubUrl} icon={Github}>GitHub</LinkButton>
          <button className="btn btn-sm btn-ghost" onClick={() => onPreview(project)}>
            <Eye size={15} /> Preview
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [detail, setDetail] = useState(null);
  const [preview, setPreview] = useState(null);

  return (
    <section id="projects" className="section">
      <div className="wrap">
        <SectionHeading title="Featured projects" lede="Five projects across AI, business websites and full stack applications. Open any card for the full view." />
        <div className="projects-grid">
          {projects.map((p) => (
            <Card key={p.id} project={p} onOpen={setDetail} onPreview={setPreview} />
          ))}
        </div>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} label={detail ? `${detail.name} details` : 'Project details'} size="lg">
        {detail && (
          <div className="detail">
            <motion.button
              className="detail-media"
              onClick={() => setPreview(detail)}
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              aria-label="Open full-size image preview"
            >
              <ProjectImage project={detail} />
            </motion.button>
            <div className="detail-body">
              <p className="project-cat">{detail.category}</p>
              <h3 className="detail-title">{detail.name}</h3>
              <p>{detail.description || 'Description to be added.'}</p>
              {detail.highlights.length > 0 && (
                <ul className="detail-list">
                  {detail.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              )}
              <h4>Technology stack</h4>
              {detail.tech.length ? (
                <ul className="chips">{detail.tech.map((t) => <li key={t}>{t}</li>)}</ul>
              ) : (
                <p className="muted-note">Technology stack to be added.</p>
              )}
              <div className="project-actions">
                <LinkButton href={detail.liveUrl} icon={ExternalLink} variant="gold">Live Demo</LinkButton>
                <LinkButton href={detail.githubUrl} icon={Github}>GitHub</LinkButton>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!preview} onClose={() => setPreview(null)} label={preview ? `${preview.name} image preview` : 'Image preview'} size="xl">
        {preview && (
          <motion.div className="lightbox" initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
            <ProjectImage project={preview} />
            <p>{preview.name}</p>
          </motion.div>
        )}
      </Modal>
    </section>
  );
}
