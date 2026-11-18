import { useEffect } from 'react';
import { Download, Eye, ExternalLink } from 'lucide-react';
import { resume } from '../data/portfolio';
import Modal from './Modal';
import SectionHeading from './SectionHeading';

export default function Resume({ open, setOpen }) {
  // Allow the navbar and other sections to open the viewer
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-resume', handler);
    return () => window.removeEventListener('open-resume', handler);
  }, [setOpen]);

  return (
    <section id="resume" className="section section-tight">
      <div className="wrap">
        <div className="resume-panel glass">
          <SectionHeading title="Resume" lede="A one-page summary of my skills, projects, internships and education." />
          <div className="resume-actions">
            <button className="btn btn-gold" onClick={() => setOpen(true)}>
              <Eye size={17} /> View Resume
            </button>
            <a className="btn btn-ghost" href={resume.file} download={resume.downloadName}>
              <Download size={17} /> Download Resume
            </a>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} label="Resume preview" size="xl">
        <div className="resume-viewer">
          <iframe title="Resume preview" src={`${resume.file}#toolbar=0&navpanes=0&view=FitH`} />
          <div className="resume-viewer-bar">
            <a className="btn btn-sm btn-ghost" href={resume.file} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={15} /> Open in new tab
            </a>
            <a className="btn btn-sm btn-gold" href={resume.file} download={resume.downloadName}>
              <Download size={15} /> Download
            </a>
          </div>
        </div>
      </Modal>
    </section>
  );
}
