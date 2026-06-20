import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', textAlign: 'center', padding: '2rem',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        fontSize: '6rem', fontWeight: 800, lineHeight: 1,
        background: 'linear-gradient(135deg, var(--clr-primary-500), var(--clr-primary-700))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
      }}>
        404
      </div>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--clr-text-heading)', marginBottom: '0.5rem' }}>
        Page not found
      </h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)', maxWidth: 320, marginBottom: '1.5rem' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        }>
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
