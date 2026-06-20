import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import { useImportJob } from '../hooks/useImportJob';
import { useDebounce } from '../hooks/useDebounce';
import ContactsTable from '../features/contacts/ContactsTable';
import ContactSearch from '../features/contacts/ContactSearch';
import ContactForm from '../features/contacts/ContactForm';
import DeleteContactDialog from '../features/contacts/DeleteContactDialog';
import JsonImportForm from '../features/imports/JsonImportForm';
import ImportPreview from '../features/imports/ImportPreview';
import ImportProgress from '../features/imports/ImportProgress';
import ImportResults from '../features/imports/ImportResults';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import Toast, { useToast } from '../components/ui/Toast';

const IMPORT_STEP = { FORM: 'form', PREVIEW: 'preview', RUNNING: 'running', DONE: 'done' };

export default function ListDetailsPage({ lists }) {
  const { listId } = useParams();
  const navigate = useNavigate();
  const list = lists?.find((l) => l._id === listId);

  const {
    contacts, loading, error, fetchContacts,
    searchContacts, createContact, updateContact, deleteContact,
  } = useContacts(listId);

  const { importJob, loading: importLoading, error: importError, startImport, resetImport } = useImportJob();
  const { toast, showToast, closeToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 400);

  const [showAddContact, setShowAddContact] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [deleteContact_target, setDeleteContactTarget] = useState(null);
  const [mutating, setMutating] = useState(false);

  const [showImport, setShowImport] = useState(false);
  const [importStep, setImportStep] = useState(IMPORT_STEP.FORM);
  const [parsedContacts, setParsedContacts] = useState([]);

  // Debounced search
  useEffect(() => {
    if (!listId) return;
    if (debouncedQuery.trim()) {
      searchContacts(debouncedQuery.trim());
    } else {
      fetchContacts();
    }
  }, [debouncedQuery, listId]);

  // When import completes, refresh contacts
  useEffect(() => {
    if (importJob?.status === 'Completed' || importJob?.status === 'Failed') {
      if (importStep === IMPORT_STEP.RUNNING) {
        setImportStep(IMPORT_STEP.DONE);
        if (importJob.status === 'Completed') {
          fetchContacts();
          showToast(`Import completed: ${importJob.successfulRecords} contacts added.`, 'success');
        } else {
          showToast('Import failed. See details.', 'error');
        }
      }
    }
  }, [importJob?.status]);

  const handleCreateContact = async (data) => {
    setMutating(true);
    try {
      await createContact(data);
      setShowAddContact(false);
      showToast('Contact added!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const handleUpdateContact = async (data) => {
    setMutating(true);
    try {
      await updateContact(editContact._id, data);
      setEditContact(null);
      fetchContacts();
      showToast('Contact updated!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    setMutating(true);
    try {
      await deleteContact(contactId);
      setDeleteContactTarget(null);
      showToast('Contact deleted.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setMutating(false);
    }
  };

  const handleStartImport = async () => {
    setImportStep(IMPORT_STEP.RUNNING);
    try {
      await startImport(listId, parsedContacts);
    } catch (err) {
      showToast(err.message, 'error');
      setImportStep(IMPORT_STEP.PREVIEW);
    }
  };

  const handleCloseImport = () => {
    setShowImport(false);
    setImportStep(IMPORT_STEP.FORM);
    setParsedContacts([]);
    resetImport();
  };

  const importModalTitle = {
    [IMPORT_STEP.FORM]: 'Import Contacts via JSON',
    [IMPORT_STEP.PREVIEW]: `Preview — ${parsedContacts.length} contacts`,
    [IMPORT_STEP.RUNNING]: 'Import in Progress',
    [IMPORT_STEP.DONE]: 'Import Results',
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Back + header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)',
            background: 'none', border: 'none', cursor: 'pointer',
            marginBottom: '0.875rem', padding: '0.25rem 0',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--clr-primary-600)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--clr-text-muted)'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          All Lists
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--clr-text-heading)', marginBottom: '0.25rem' }}>
              {list?.name || 'Contacts'}
            </h1>
            {list?.description && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)' }}>{list.description}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setShowImport(true); setImportStep(IMPORT_STEP.FORM); }}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              }
            >
              Import JSON
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddContact(true)}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              }
            >
              Add Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Search + stats bar */}
      <div style={{
        background: 'var(--clr-surface)',
        border: '1px solid var(--clr-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
        overflow: 'hidden',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          padding: '0.875rem 1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--clr-border)',
          gap: '1rem', flexWrap: 'wrap',
        }}>
          <ContactSearch value={searchQuery} onChange={setSearchQuery} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <span style={{
              background: 'var(--clr-primary-50)', color: 'var(--clr-primary-700)',
              padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)', fontWeight: 600,
              border: '1px solid var(--clr-primary-200)',
            }}>
              {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingState message="Loading contacts…" rows={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchContacts} />
        ) : (
          <ContactsTable
            contacts={contacts}
            onEdit={(c) => setEditContact(c)}
            onDelete={(c) => setDeleteContactTarget(c)}
          />
        )}
      </div>

      {/* Add Contact Modal */}
      <Modal isOpen={showAddContact} onClose={() => setShowAddContact(false)} title="Add Contact">
        <ContactForm
          currentListId={listId}
          onSubmit={handleCreateContact}
          onCancel={() => setShowAddContact(false)}
          loading={mutating}
        />
      </Modal>

      {/* Edit Contact Modal */}
      <Modal isOpen={Boolean(editContact)} onClose={() => setEditContact(null)} title="Edit Contact">
        <ContactForm
          initialValues={editContact || {}}
          lists={lists || []}
          currentListId={listId}
          onSubmit={handleUpdateContact}
          onCancel={() => setEditContact(null)}
          loading={mutating}
        />
      </Modal>

      {/* Delete Contact Dialog */}
      <DeleteContactDialog
        contact={deleteContact_target}
        onConfirm={handleDeleteContact}
        onCancel={() => setDeleteContactTarget(null)}
        loading={mutating}
      />

      {/* Import Modal */}
      <Modal
        isOpen={showImport}
        onClose={importStep === IMPORT_STEP.RUNNING ? undefined : handleCloseImport}
        title={importModalTitle[importStep]}
        size="lg"
      >
        {importStep === IMPORT_STEP.FORM && (
          <JsonImportForm
            onParsed={(contacts) => { setParsedContacts(contacts); setImportStep(IMPORT_STEP.PREVIEW); }}
            onCancel={handleCloseImport}
          />
        )}
        {importStep === IMPORT_STEP.PREVIEW && (
          <ImportPreview
            contacts={parsedContacts}
            onConfirm={handleStartImport}
            onBack={() => setImportStep(IMPORT_STEP.FORM)}
            loading={importLoading}
          />
        )}
        {importStep === IMPORT_STEP.RUNNING && (
          <div style={{ padding: '1rem 0' }}>
            <ImportProgress importJob={importJob} />
            {importError && (
              <p style={{ marginTop: '1rem', fontSize: 'var(--text-sm)', color: 'var(--clr-danger-500)' }}>{importError}</p>
            )}
          </div>
        )}
        {importStep === IMPORT_STEP.DONE && (
          <ImportResults
            importJob={importJob}
            onClose={handleCloseImport}
            onImportAnother={() => { resetImport(); setImportStep(IMPORT_STEP.FORM); setParsedContacts([]); }}
          />
        )}
      </Modal>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
