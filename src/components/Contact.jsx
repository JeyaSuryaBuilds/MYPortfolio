import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  BadgeCheck,
  ArrowUpRight,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

import { profile, socialLinks } from '../data/portfolio';
import SectionHeading from './SectionHeading';

const ICONS = {
  email: Mail,
  whatsapp: FaWhatsapp,
  linkedin: Linkedin,
  github: Github,
  claimmyjob: BadgeCheck,
};

export default function Contact() {
  const links = socialLinks();

  return (
    <section id="contact" className="section contact-section">
      <div className="wrap">

        <motion.div
          className="contact-connect"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >

          {/* Heading */}
          <div className="contact-connect-heading">
            <span className="contact-eyebrow">
              GET IN TOUCH
            </span>

            <h2>
              Let's <span>Connect</span>
            </h2>

            <p>
              Have an opportunity, a project idea, or just want to
              connect? I'd love to hear from you.
            </p>
          </div>

          {/* Availability */}
          <div className="contact-availability">
            <span className="availability-dot"></span>
            <span>Open to Opportunities</span>
          </div>

          {/* Social Links */}
          <motion.div
            className="contact-connect-card glass"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="contact-connect-links">

              {links.map((link, index) => {
                const Icon = ICONS[link.id] || Mail;

                return (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    className="contact-connect-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2 + index * 0.08,
                    }}
                    whileHover={{ y: -7, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    aria-label={link.label}
                  >
                    <span className="contact-connect-icon">
                      <Icon size={23} aria-hidden="true" />
                    </span>

                    <span className="contact-connect-label">
                      {link.label}
                    </span>

                    <ArrowUpRight
                      size={15}
                      className="contact-connect-arrow"
                      aria-hidden="true"
                    />
                  </motion.a>
                );
              })}

            </div>
          </motion.div>

          {/* Contact Details */}
          <div className="contact-direct">
            <a href={`mailto:${profile.email}`}>
              <Mail size={16} />
              {profile.email}
            </a>

            <span className="contact-divider">•</span>

            <a href={`tel:+${profile.whatsappNumber}`}>
              <FaWhatsapp size={16} />
              {profile.phoneDisplay}
            </a>
          </div>

          <div className="contact-bottom-text">
            Let's create something meaningful together.
          </div>

        </motion.div>
      </div>
    </section>
  );
}