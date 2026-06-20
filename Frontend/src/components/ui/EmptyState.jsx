import React from 'react';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '3rem 1.5rem', gap: '1rem',
      animation: 'fadeIn 0.3s ease',
    }}>
      {icon && (
        <div style={{
          width: 64, height: 64,
          background: 'var(--clr-primary-50)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--clr-primary-500)',
          marginBottom: '0.5rem',
        }}>
          {icon}
        </div>
      )}
      <div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--clr-text-heading)', marginBottom: '0.375rem' }}>
          {title}
        </h3>
        {description && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)', maxWidth: 320 }}>
            {description}
          </p>
        )}
      </div>
      {action && <div style={{ marginTop: '0.25rem' }}>{action}</div>}
    </div>
  );
}
