import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ onMenuToggle, sidebarOpen }) {
  return (
    <header style={{
      height: 'var(--header-h)',
      background: 'var(--clr-surface)',
      borderBottom: '1px solid var(--clr-border)',
      display: 'flex', alignItems: 'center',
      padding: '0 1.25rem',
      gap: '1rem',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: 'var(--shadow-xs)',
    }}>
      {/* Mobile menu button */}
      <button
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        onClick={onMenuToggle}
        style={{
          display: 'none',
          background: 'none', border: 'none',
          padding: '0.35rem', borderRadius: 'var(--radius-md)',
          color: 'var(--clr-text-muted)', cursor: 'pointer',
          flexShrink: 0,
        }}
        className="mobile-menu-btn"
      >
        {sidebarOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        )}
      </button>

      {/* Logo / Brand */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, var(--clr-primary-500), var(--clr-primary-700))',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
            <path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--clr-text-heading)', letterSpacing: '-0.01em' }}>
          ContactHub
        </span>
      </Link>

      <div style={{ flex: 1 }} />

      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--clr-text-muted)',
        background: 'var(--clr-neutral-100)',
        padding: '0.25rem 0.625rem',
        borderRadius: 'var(--radius-full)',
        fontWeight: 500,
      }}>
        CMS
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
