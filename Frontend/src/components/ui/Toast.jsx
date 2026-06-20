import React, { useEffect, useCallback } from 'react';

const ICONS = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

const COLORS = {
  success: { bg: 'var(--clr-success-50)', border: 'var(--clr-success-500)', icon: 'var(--clr-success-700)', text: 'var(--clr-success-700)' },
  error:   { bg: 'var(--clr-danger-50)',   border: 'var(--clr-danger-500)',   icon: 'var(--clr-danger-700)',   text: 'var(--clr-danger-700)' },
  warning: { bg: 'var(--clr-warning-50)',  border: 'var(--clr-warning-500)',  icon: 'var(--clr-warning-700)', text: 'var(--clr-warning-700)' },
};

/**
 * Usage: <Toast toast={{ message, type }} onClose={fn} />
 * toast = null means hidden.
 */
export default function Toast({ toast, onClose }) {
  const dismiss = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismiss, 4000);
    return () => clearTimeout(t);
  }, [toast, dismiss]);

  if (!toast) return null;

  const c = COLORS[toast.type] || COLORS.success;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1.125rem',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: 380,
        animation: 'slideInRight 0.25s ease',
        cursor: 'pointer',
      }}
      onClick={dismiss}
    >
      <span style={{ color: c.icon, flexShrink: 0, marginTop: 1 }}>{ICONS[toast.type]}</span>
      <span style={{ fontSize: 'var(--text-sm)', color: c.text, fontWeight: 500, flex: 1 }}>
        {toast.message}
      </span>
      <button
        aria-label="Dismiss"
        onClick={dismiss}
        style={{ background: 'none', border: 'none', color: c.icon, cursor: 'pointer', padding: 0, marginTop: 1 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

/** Simple hook to manage toast state */
export function useToast() {
  const [toast, setToast] = React.useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  return { toast, showToast, closeToast };
}
