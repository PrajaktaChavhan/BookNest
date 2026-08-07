import { useEffect, useRef } from 'react';

// Used for the Reservation flow and other short, focused decisions - kept
// as a modal rather than a full page navigation, per the IA plan.
export function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="relative bg-paper-raised rounded-2xl border border-hairline shadow-xl max-w-md w-full p-6 focus:outline-none"
      >
        <div className="flex items-start justify-between mb-4">
          <h2 id="modal-title" className="font-display text-xl font-semibold text-ink">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink-soft hover:text-ink text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss/40 rounded"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
