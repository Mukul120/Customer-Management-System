import React from 'react';
import Button from '../../components/ui/Button';

function StatCard({ label, value, color, bg }) {
  return (
    <div style={{
      flex: 1, minWidth: 80, textAlign: 'center',
      padding: '0.875rem 0.75rem',
      background: bg, border: `1px solid ${color}33`,
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color, lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-muted)', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}

export default function ImportResults({ importJob, onClose, onImportAnother }) {
  if (!importJob) return null;

  const {
    status, totalRecords, processedRecords,
    successfulRecords, failedRecords, duplicateRecords,
    errorMessage, errors: rowErrors = [],
  } = importJob;

  const isFailed = status === 'Failed';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.3s ease' }}>
      {/* Result header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '1rem',
        background: isFailed ? 'var(--clr-danger-50)' : 'var(--clr-success-50)',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${isFailed ? 'var(--clr-danger-400)' : 'var(--clr-success-500)'}`,
      }}>
        {isFailed ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-danger-700)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-success-700)" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: isFailed ? 'var(--clr-danger-700)' : 'var(--clr-success-700)' }}>
          {isFailed ? 'Import failed' : 'Import completed'}
        </span>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
        <StatCard label="Total" value={totalRecords} color="var(--clr-text-body)" bg="var(--clr-neutral-50)" />
        <StatCard label="Processed" value={processedRecords} color="var(--clr-primary-600)" bg="var(--clr-primary-50)" />
        <StatCard label="Successful" value={successfulRecords} color="var(--clr-success-700)" bg="var(--clr-success-50)" />
        <StatCard label="Failed" value={failedRecords} color="var(--clr-danger-700)" bg="var(--clr-danger-50)" />
        <StatCard label="Duplicates" value={duplicateRecords} color="var(--clr-warning-700)" bg="var(--clr-warning-50)" />
      </div>

      {/* Global error message */}
      {errorMessage && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'var(--clr-danger-50)',
          border: '1px solid var(--clr-danger-400)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)', color: 'var(--clr-danger-700)',
        }}>
          <strong>Error: </strong>{errorMessage}
        </div>
      )}

      {/* Row-level errors */}
      {rowErrors.length > 0 && (
        <div>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--clr-text-body)', marginBottom: '0.5rem' }}>
            Row Errors ({rowErrors.length})
          </p>
          <div style={{
            maxHeight: 200, overflowY: 'auto',
            border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--clr-neutral-50)' }}>
                <tr style={{ borderBottom: '1px solid var(--clr-border)' }}>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--clr-text-muted)', fontWeight: 600 }}>Row</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--clr-text-muted)', fontWeight: 600 }}>Phone</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--clr-text-muted)', fontWeight: 600 }}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {rowErrors.map((err, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--clr-border)' }}>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--clr-danger-700)', fontWeight: 600 }}>{(err.index ?? i) + 1}</td>
                    <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', color: 'var(--clr-text-body)' }}>{err.phone || '—'}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--clr-text-muted)' }}>{err.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onImportAnother}>Import Another</Button>
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  );
}
