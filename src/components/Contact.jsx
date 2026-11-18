import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, BadgeCheck, CheckCircle2, Github, Linkedin, Loader2, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { profile, socialLinks } from '../data/portfolio';
import { sendContact } from '../services/api';
import Magnetic from './Magnetic';
import SectionHeading from './SectionHeading';

const ICONS = { email: Mail, whatsapp: FaWhatsapp, linkedin: Linkedin, github: Github, claimmyjob: BadgeCheck };
const EMPTY = { name: '', email: '', subject: '', message: '', website: '' }; // "website" is a honeypot

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email address.';
  if (v.subject.trim().length < 3) e.subject = 'Enter a subject (at least 3 characters).';
  if (v.message.trim().length < 10) e.message = 'Write a message of at least 10 characters.';
  if (v.message.length > 2000) e.message = 'Keep the message under 2000 characters.';
  return e;
}

function Field({ id, label, error, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="field-error" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const openedAt = useRef(Date.now());
  const toastTimer = useRef();

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const notify = (type, text) => {
    setToast({ type, text });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 7000);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (Date.now() < cooldownUntil) {
      notify('error', 'Message already sent. Please wait a moment before sending another.');
      return;
    }
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      notify('error', 'Please fix the highlighted fields.');
      return;
    }
    if (values.website) {
      // Honeypot filled: act as if sent, send nothing.
      setValues(EMPTY);
      notify('success', 'Thanks, your message has been sent.');
      return;
    }
    setLoading(true);
    try {
      await sendContact({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        website: values.website,
        elapsedMs: Date.now() - openedAt.current,
      });
      setValues(EMPTY);
      setCooldownUntil(Date.now() + 30000);
      notify('success', 'Message sent. Surya will reply to your email address.');
    } catch (err) {
      notify('error', err.message || 'Message could not be sent. Email jeyasuryab4@gmail.com directly instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="wrap">
        <SectionHeading title="Let's work together" lede="Open to entry-level Java, Python and Junior Full Stack roles. The quickest way to reach me is WhatsApp or email." />
        <div className="contact-grid">
          <div className="contact-info glass">
            <ul className="contact-lines">
              <li><Mail size={18} aria-hidden="true" /><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
              <li><Phone size={18} aria-hidden="true" /><a href={`tel:+${profile.whatsappNumber}`}>{profile.phoneDisplay}</a></li>
            </ul>
            <ul className="contact-social" aria-label="Contact and social links">
              {socialLinks().map((l) => {
                const Icon = ICONS[l.id];
                return (
                  <li key={l.id}>
                    <Magnetic strength={0.4}>
                      <a className="social-pill" href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        <Icon size={18} aria-hidden="true" /> {l.label}
                      </a>
                    </Magnetic>
                  </li>
                );
              })}
            </ul>
          </div>

          <form className="contact-form glass" onSubmit={onSubmit} noValidate>
            <Field id="name" label="Full name" error={errors.name}>
              <input id="name" name="name" type="text" autoComplete="name" value={values.name} onChange={onChange} maxLength={80} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
            </Field>
            <Field id="email" label="Email address" error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={onChange} maxLength={120} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
            </Field>
            <Field id="subject" label="Subject" error={errors.subject}>
              <input id="subject" name="subject" type="text" value={values.subject} onChange={onChange} maxLength={120} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'subject-err' : undefined} />
            </Field>
            <Field id="message" label="Message" error={errors.message}>
              <textarea id="message" name="message" rows={5} value={values.message} onChange={onChange} maxLength={2000} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-err' : undefined} />
            </Field>

            {/* Honeypot: hidden from people, visible to bots */}
            <div className="hp" aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
            </div>

            <button className="btn btn-gold btn-block" type="submit" disabled={loading}>
              {loading ? <><Loader2 className="spin" size={18} /> Sending</> : <><Send size={18} /> Send message</>}
            </button>
          </form>
        </div>
      </div>

      <div className="toast-region" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.text}
              className={`toast toast-${toast.type}`}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              role={toast.type === 'error' ? 'alert' : 'status'}
            >
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span>{toast.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
