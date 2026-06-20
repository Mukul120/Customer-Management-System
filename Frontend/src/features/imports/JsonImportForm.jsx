import React, { useState, useRef } from 'react';
import Button from '../../components/ui/Button';
import { parseJsonInput } from '../../utils/jsonImport';

const SAMPLE_JSON = `[
  {
    "name": "Jane Doe",
    "phone": "+919876543210",
    "email": "jane@example.com"
  },
  {
    "name": "Amit Shah",
    "phone": "+919876543211"
  }
]`;

export default function JsonImportForm({ onParsed, onCancel }) {
  const [raw, setRaw] = useState('');
  const [errors, setErrors] = useState([]);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setRaw(evt.target.result);
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleParse = () => {
    setErrors([]);
    const { contacts, errors: errs } = parseJsonInput(raw);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    onParsed(contacts);
  };

  const handleSample = () => {
    setRaw(SAMPLE_JSON);
    setErrors([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: '2px dashed var(--clr-border-strong)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          background: 'var(--clr-neutral-50)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--clr-primary-400)'; e.currentTarget.style.background = 'var(--clr-primary-50)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--clr-border-strong)'; e.currentTarget.style.background = 'var(--clr-neutral-50)'; }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => setRaw(evt.target.result);
          reader.readAsText(file);
        }}
      >
        <input ref={fileRef} type="file" accept=".json,application/json" onChange={handleFile} style={{ display: 'none' }} />
        <div style={{ color: 'var(--clr-primary-500)', marginBottom: '0.5rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--clr-text-body)' }}>
          Drop a <code style={{ background: 'var(--clr-neutral-100)', padding: '0.1rem 0.35rem', borderRadius: 4 }}>.json</code> file here or click to browse
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-muted)', marginTop: '0.25rem' }}>JSON files only</p>
      </div>

      {/* Paste area */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--clr-text-body)' }}>
            Or paste JSON directly
          </label>
          <button
            type="button"
            onClick={handleSample}
            style={{
              fontSize: 'var(--text-xs)', color: 'var(--clr-primary-600)',
              background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500,
              padding: '0.2rem 0.4rem', borderRadius: 'var(--radius-sm)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--clr-primary-50)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            Load sample ↗
          </button>
        </div>
        <textarea
          value={raw}
          onChange={(e) => { setRaw(e.target.value); setErrors([]); }}
          placeholder={`[\n  { "name": "Jane Doe", "phone": "+91..." },\n  ...\n]`}
          style={{
            width: '100%', minHeight: 160,
            padding: '0.75rem', fontFamily: 'monospace', fontSize: 'var(--text-xs)',
            border: `1px solid ${errors.length ? 'var(--clr-danger-500)' : 'var(--clr-border-strong)'}`,
            borderRadius: 'var(--radius-md)',
            resize: 'vertical', outline: 'none',
            background: 'var(--clr-neutral-50)',
            color: 'var(--clr-text-body)',
            lineHeight: 1.6,
          }}
        />
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div style={{
          background: 'var(--clr-danger-50)',
          border: '1px solid var(--clr-danger-400)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          maxHeight: 160, overflowY: 'auto',
        }}>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--clr-danger-700)', marginBottom: '0.5rem' }}>
            {errors.length} validation error{errors.length > 1 ? 's' : ''} found:
          </p>
          <ul style={{ paddingLeft: '1rem' }}>
            {errors.map((err, i) => (
              <li key={i} style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-danger-700)', marginBottom: '0.25rem' }}>
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button
          type="button"
          onClick={handleParse}
          disabled={!raw.trim()}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          }
        >
          Validate & Preview
        </Button>
      </div>
    </div>
  );
}
