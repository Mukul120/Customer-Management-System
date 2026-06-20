import React from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function DeleteContactDialog({ contact, onConfirm, onCancel, loading }) {
  if (!contact) return null;
  return (
    <Modal isOpen={Boolean(contact)} onClose={onCancel} title="Delete Contact" size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-body)' }}>
          Are you sure you want to delete <strong>"{contact.name}"</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={() => onConfirm(contact._id)} loading={loading}>Delete Contact</Button>
        </div>
      </div>
    </Modal>
  );
}
