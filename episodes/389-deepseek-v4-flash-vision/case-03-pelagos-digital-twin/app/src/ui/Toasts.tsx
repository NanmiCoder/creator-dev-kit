import { AnimatePresence, motion } from 'motion/react';
import { Info, WarningCircle, CheckCircle } from '@phosphor-icons/react';
import { useStore } from '../store';

export function Toasts() {
  const toasts = useStore((s) => s.toasts);
  return (
    <div className="toasts">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast glass-soft ${toast.kind === 'error' ? 'is-error' : toast.kind === 'success' ? 'is-success' : ''}`}
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            {toast.kind === 'error' ? <WarningCircle size={15} weight="fill" /> : toast.kind === 'success' ? <CheckCircle size={15} weight="fill" /> : <Info size={15} />}
            <span>{toast.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
