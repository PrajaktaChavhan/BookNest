import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

const TONE_STYLES = {
  success: 'border-moss/30 text-moss-deep',
  error: 'border-danger/30 text-danger',
  info: 'border-hairline text-ink',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, tone = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              'bg-paper-raised border rounded-sm px-4 py-2 text-sm font-medium shadow-md ' +
              (TONE_STYLES[t.tone] || TONE_STYLES.info)
            }
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
