import React, { useState } from 'react';
import ListItem from '../features/lists/ListItem';
import ListForm from '../features/lists/ListForm';
import DeleteListDialog from '../features/lists/DeleteListDialog';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Toast, { useToast } from '../components/ui/Toast';

export default function ListsPage({ lists, loading, error, onFetch, onCreate, onUpdate, onDelete }) {
  const { toast, showToast, closeToast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [mutating, setMutating] = useState(false);

  const handleCreate = async (data) => {
    setMutating(true);
    try {
      await onCreate(data);
      setShowCreate(false);
      showToast('List created successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const handleUpdate = async (data) => {
    setMutating(true);
    try {
      await onUpdate(editTarget._id, data);
      setEditTarget(null);
      showToast('List updated!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const handleDelete = async (listId) => {
    setMutating(true);
    try {
      await onDelete(listId);
      setDeleteTarget(null);
      showToast('List deleted.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setMutating(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--clr-text-heading)', marginBottom: '0.375rem' }}>
            Contact Lists
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)' }}>
            Organise your contacts into lists for better management.
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          }
        >
          New List
        </Button>
      </div>

      {/* Stats bar */}
      {!loading && !error && lists.length > 0 && (
        <div style={{
          display: 'flex', gap: '1rem', marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          background: 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xs)',
          alignItems: 'center',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'var(--clr-primary-50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--clr-primary-600)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/>
              <path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>
            </svg>
          </div>
          <div>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--clr-primary-600)' }}>{lists.length}</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)', marginLeft: '0.375rem' }}>
              list{lists.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingState message="Loading your lists…" rows={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={onFetch} />
      ) : lists.length === 0 ? (
        <EmptyState
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          }
          title="No lists yet"
          description="Create your first contact list to start organising your contacts."
          action={<Button onClick={() => setShowCreate(true)}>Create your first list</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {lists.map((list) => (
            <ListItem
              key={list._id}
              list={list}
              onEdit={(l) => setEditTarget(l)}
              onDelete={(l) => setDeleteTarget(l)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New List" size="md">
        <ListForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={mutating}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={Boolean(editTarget)} onClose={() => setEditTarget(null)} title="Edit List" size="md">
        <ListForm
          initialValues={editTarget || {}}
          onSubmit={handleUpdate}
          onCancel={() => setEditTarget(null)}
          loading={mutating}
        />
      </Modal>

      {/* Delete Dialog */}
      <DeleteListDialog
        list={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={mutating}
      />

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
