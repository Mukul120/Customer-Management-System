import React from 'react';
import Button from './Button';

export default function ErrorState({ message, onRetry }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '3rem 1.5rem', gap: '1rem',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        width: 56, height: 56,
        background: 'var(--clr-danger-50)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--clr-danger-500)',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--clr-danger-700)', marginBottom: '0.3rem' }}>
          Something went wrong
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)', maxWidth: 320 }}>
          {message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
