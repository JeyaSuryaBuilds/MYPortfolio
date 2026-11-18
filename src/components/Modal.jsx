import { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { lockScroll } from '../utils/scroll';

const stack = []; // open dialogs, so Escape only closes the top one

export default function Modal({ open, onClose, label, size = 'md', children }) {
  const id = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return undefined;
    stack.push(id);
    const onKey = (e) => e.key === 'Escape' && stack[stack.length - 1] === id && closeRef.current();
    window.addEventListener('keydown', onKey);
    lockScroll(true);
    return () => {
      const i = stack.indexOf(id);
      if (i > -1) stack.splice(i, 1);
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [open, id]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className={`modal modal-${size}`}
            data-lenis-prevent
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label="Close dialog" autoFocus>
              <X size={20} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
