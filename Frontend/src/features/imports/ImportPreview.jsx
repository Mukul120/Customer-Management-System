import React from 'react';
import Button from '../../components/ui/Button';

export default function ImportPreview({ contacts, onConfirm, onBack, loading }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        background: 'var(--clr-success-50)',
        border: '1px solid var(--clr-success-500)',
        borderRadius: 'var(--radius-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-success-700)" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--clr-success-700)' }}>
            {contacts.length} valid contact{contacts.length !== 1 ? 's' : ''} ready to import
          </span>
        </div>
      </div>

      {/* Preview table */}
      <div style={{ maxHeight: 280, overflowY: 'auto', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--clr-neutral-50)' }}>
            <tr style={{ borderBottom: '1px solid var(--clr-border)' }}>
              {['#', 'Name', 'Phone', 'Email'].map((h) => (
                <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--clr-border)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--clr-neutral-50)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '0.6rem 0.75rem', color: 'var(--clr-text-subtle)' }}>{i + 1}</td>
                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 500, color: 'var(--clr-text-heading)' }}>{c.name}</td>
                <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace', color: 'var(--clr-text-body)' }}>{c.phone}</td>
                <td style={{ padding: '0.6rem 0.75rem', color: 'var(--clr-text-muted)' }}>{c.email || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Button type="button" variant="secondary" onClick={onBack} disabled={loading}>← Back</Button>
        <Button type="button" onClick={onConfirm} loading={loading}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          }
        >
          Start Import
        </Button>
      </div>
    </div>
  );
}
