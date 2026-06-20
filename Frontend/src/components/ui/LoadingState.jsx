import React from 'react';

export default function LoadingState({ message = 'Loading…', rows = 4 }) {
  return (
    <div style={{ padding: '1.5rem', animation: 'fadeIn 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          border: '2.5px solid var(--clr-primary-200)',
          borderTopColor: 'var(--clr-primary-600)',
          animation: 'spin 0.7s linear infinite',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)' }}>{message}</span>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          height: 48,
          borderRadius: 'var(--radius-md)',
          marginBottom: '0.75rem',
          background: 'linear-gradient(90deg, var(--clr-neutral-100) 25%, var(--clr-neutral-50) 50%, var(--clr-neutral-100) 75%)',
          backgroundSize: '200% 100%',
          animation: `shimmer 1.4s ease-in-out infinite`,
          animationDelay: `${i * 0.1}s`,
        }} />
      ))}
    </div>
  );
}

/** Inline spinner for small spaces */
export function Spinner({ size = 18, color = 'var(--clr-primary-600)' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2px solid ${color}22`,
      borderTopColor: color,
      animation: 'spin 0.6s linear infinite',
      flexShrink: 0,
    }} />
  );
}
