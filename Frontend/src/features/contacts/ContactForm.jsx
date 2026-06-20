import React, { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { validateContactForm } from '../../utils/validators';

export default function ContactForm({ initialValues = {}, lists = [], currentListId, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    listId: currentListId || '',
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ name: '', phone: '', email: '', listId: currentListId || '', ...initialValues });
    setErrors({});
  }, [initialValues._id, currentListId]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, fieldErrors } = validateContactForm(form);
    if (!valid) { setErrors(fieldErrors); return; }
    try {
      await onSubmit({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        listId: form.listId,
      });
    } catch (err) {
      if (err.message?.toLowerCase().includes('phone')) {
        setErrors({ phone: 'A contact with this phone already exists in this list.' });
      } else {
        setErrors({ api: err.message });
      }
    }
  };

  const isEdit = Boolean(initialValues._id);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        id="contact-name"
        label="Full Name"
        required
        placeholder="e.g. Jane Doe"
        value={form.name}
        onChange={handleChange('name')}
        error={errors.name}
        autoFocus
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        }
      />
      <Input
        id="contact-phone"
        label="Phone Number"
        required
        placeholder="e.g. +919876543210"
        value={form.phone}
        onChange={handleChange('phone')}
        error={errors.phone}
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.68 12 19.79 19.79 0 011.62 3.5 2 2 0 013.6 1.32h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 9a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
        }
      />
      <Input
        id="contact-email"
        label="Email"
        type="email"
        placeholder="e.g. jane@example.com"
        value={form.email}
        onChange={handleChange('email')}
        error={errors.email}
        hint="Optional"
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        }
      />

      {isEdit && lists.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--clr-text-body)' }}>
            Move to List
          </label>
          <select
            value={form.listId}
            onChange={handleChange('listId')}
            style={{
              padding: '0.5rem 0.75rem', fontSize: 'var(--text-sm)',
              border: '1px solid var(--clr-border-strong)', borderRadius: 'var(--radius-md)',
              background: 'var(--clr-surface)', color: 'var(--clr-text-body)',
              fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
            }}
          >
            {lists.map((l) => (
              <option key={l._id} value={l._id}>{l.name}</option>
            ))}
          </select>
        </div>
      )}

      {errors.api && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-danger-500)', padding: '0.5rem 0.75rem', background: 'var(--clr-danger-50)', borderRadius: 'var(--radius-md)' }}>
          {errors.api}
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>{isEdit ? 'Save Changes' : 'Add Contact'}</Button>
      </div>
    </form>
  );
}
