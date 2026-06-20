import React from 'react';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

function Avatar({ name }) {
  const colors = [
    { bg: '#eef2ff', text: '#4338ca' }, { bg: '#fdf4ff', text: '#7e22ce' },
    { bg: '#ecfdf5', text: '#065f46' }, { bg: '#fff7ed', text: '#9a3412' },
    { bg: '#f0f9ff', text: '#075985' }, { bg: '#fef9c3', text: '#854d0e' },
  ];
  const c = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 'var(--radius-full)',
      background: c.bg, color: c.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 'var(--text-xs)', flexShrink: 0,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function ContactsTable({ contacts, onEdit, onDelete }) {
  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
            <path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
        }
        title="No contacts yet"
        description="Add contacts manually or import them in bulk using JSON."
      />
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontSize: 'var(--text-sm)',
      }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--clr-border)' }}>
            {['Contact', 'Phone', 'Email', 'Actions'].map((h) => (
              <th key={h} style={{
                padding: '0.75rem 1rem', textAlign: 'left',
                fontWeight: 600, fontSize: 'var(--text-xs)',
                color: 'var(--clr-text-muted)', letterSpacing: '0.05em',
                textTransform: 'uppercase', whiteSpace: 'nowrap',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map((c, i) => (
            <tr
              key={c._id}
              style={{
                borderBottom: '1px solid var(--clr-border)',
                transition: 'background var(--transition-fast)',
                animation: `fadeIn 0.2s ease ${i * 0.03}s both`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-neutral-50)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <td style={{ padding: '0.875rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Avatar name={c.name} />
                  <span style={{ fontWeight: 500, color: 'var(--clr-text-heading)' }}>{c.name}</span>
                </div>
              </td>
              <td style={{ padding: '0.875rem 1rem', color: 'var(--clr-text-body)' }}>
                <span style={{
                  background: 'var(--clr-neutral-100)', padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontFamily: 'monospace',
                }}>
                  {c.phone}
                </span>
              </td>
              <td style={{ padding: '0.875rem 1rem', color: 'var(--clr-text-muted)' }}>
                {c.email || <span style={{ color: 'var(--clr-text-subtle)', fontStyle: 'italic' }}>—</span>}
              </td>
              <td style={{ padding: '0.875rem 1rem' }}>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <button
                    aria-label="Edit contact"
                    onClick={() => onEdit(c)}
                    style={{
                      width: 30, height: 30, borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--clr-border)', background: 'var(--clr-surface)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'var(--clr-text-muted)',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-50)'; e.currentTarget.style.color = 'var(--clr-primary-600)'; e.currentTarget.style.borderColor = 'var(--clr-primary-200)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--clr-surface)'; e.currentTarget.style.color = 'var(--clr-text-muted)'; e.currentTarget.style.borderColor = 'var(--clr-border)'; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    aria-label="Delete contact"
                    onClick={() => onDelete(c)}
                    style={{
                      width: 30, height: 30, borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--clr-border)', background: 'var(--clr-surface)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'var(--clr-text-muted)',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-danger-50)'; e.currentTarget.style.color = 'var(--clr-danger-500)'; e.currentTarget.style.borderColor = 'var(--clr-danger-400)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--clr-surface)'; e.currentTarget.style.color = 'var(--clr-text-muted)'; e.currentTarget.style.borderColor = 'var(--clr-border)'; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
