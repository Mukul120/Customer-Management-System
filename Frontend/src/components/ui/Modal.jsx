import React, { useEffect, useRef } from 'react';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const widthMap = { sm: 400, md: 520, lg: 680, xl: 820 };

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        ref={modalRef}
        style={{
          background: 'var(--clr-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: widthMap[size] || 520,
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          animation: 'fadeInScale 0.18s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--clr-border)',
          flexShrink: 0,
        }}>
          <h2 id="modal-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--clr-text-heading)' }}>
            {title}
          </h2>
          <button
            aria-label="Close modal"
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              padding: '0.25rem', cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
              color: 'var(--clr-text-muted)',
              display: 'flex', alignItems: 'center',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--clr-neutral-100)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--clr-border)',
            display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
            flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
