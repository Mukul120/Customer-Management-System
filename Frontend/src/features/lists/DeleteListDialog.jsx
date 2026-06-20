import React from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function DeleteListDialog({ list, onConfirm, onCancel, loading }) {
  if (!list) return null;
  return (
    <Modal isOpen={Boolean(list)} onClose={onCancel} title="Delete List" size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          background: 'var(--clr-warning-50)',
          border: '1px solid var(--clr-warning-500)',
          borderRadius: 'var(--radius-md)',
          padding: '0.875rem 1rem',
          display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-warning-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-warning-700)', lineHeight: 1.5 }}>
            <strong>Heads up:</strong> Deleting this list will <em>not</em> delete its contacts. Those contacts will remain in the database but become orphaned.
          </p>
        </div>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-body)' }}>
          Are you sure you want to delete <strong>"{list.name}"</strong>? This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={() => onConfirm(list._id)} loading={loading}>Delete List</Button>
        </div>
      </div>
    </Modal>
  );
}
