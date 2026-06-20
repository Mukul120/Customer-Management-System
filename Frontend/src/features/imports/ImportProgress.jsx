import React from 'react';

function StatBadge({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0.75rem 1rem',
      background: `${color}11`,
      border: `1px solid ${color}44`,
      borderRadius: 'var(--radius-md)',
      flex: 1, minWidth: 80,
    }}>
      <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-muted)', marginTop: '0.125rem' }}>{label}</span>
    </div>
  );
}

export default function ImportProgress({ importJob }) {
  if (!importJob) return null;

  const { status, totalRecords, processedRecords } = importJob;
  const isRunning = status === 'Pending' || status === 'Processing';
  const pct = totalRecords > 0 ? Math.round((processedRecords / totalRecords) * 100) : 0;

  const statusConfig = {
    Pending:    { label: 'Queued…',     color: 'var(--clr-warning-500)' },
    Processing: { label: 'Importing…',  color: 'var(--clr-primary-500)' },
    Completed:  { label: 'Completed',   color: 'var(--clr-success-500)' },
    Failed:     { label: 'Failed',      color: 'var(--clr-danger-500)' },
  };
  const sc = statusConfig[status] || statusConfig.Processing;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Status badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isRunning && (
          <div style={{
            width: 14, height: 14, borderRadius: '50%',
            border: `2px solid ${sc.color}44`,
            borderTopColor: sc.color,
            animation: 'spin 0.8s linear infinite',
            flexShrink: 0,
          }} />
        )}
        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: sc.color }}>
          {sc.label}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-muted)', marginLeft: 'auto' }}>
          {processedRecords} / {totalRecords} records
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 10, borderRadius: 'var(--radius-full)',
        background: 'var(--clr-neutral-200)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: sc.color,
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.5s ease',
          backgroundImage: isRunning
            ? `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)`
            : 'none',
          backgroundSize: '40px 40px',
          animation: isRunning ? 'progress-stripe 1s linear infinite' : 'none',
        }} />
      </div>

      <div style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--clr-text-muted)', marginTop: '-0.5rem' }}>
        {pct}% complete
      </div>
    </div>
  );
}
