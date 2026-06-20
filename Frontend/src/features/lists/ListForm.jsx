import React, { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { validateListForm } from '../../utils/validators';

export default function ListForm({ initialValues = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ name: '', description: '', ...initialValues });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ name: '', description: '', ...initialValues });
    setErrors({});
  }, [initialValues.name, initialValues.description]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, fieldErrors } = validateListForm(form);
    if (!valid) { setErrors(fieldErrors); return; }
    try {
      await onSubmit({ name: form.name.trim(), description: form.description.trim() || undefined });
    } catch (err) {
      setErrors({ api: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        id="list-name"
        label="List Name"
        required
        placeholder="e.g. VIP Customers"
        value={form.name}
        onChange={handleChange('name')}
        error={errors.name}
        autoFocus
      />
      <Input
        id="list-description"
        label="Description"
        textarea
        placeholder="Optional description…"
        value={form.description}
        onChange={handleChange('description')}
        error={errors.description}
      />
      {errors.api && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-danger-500)', padding: '0.5rem 0.75rem', background: 'var(--clr-danger-50)', borderRadius: 'var(--radius-md)' }}>
          {errors.api}
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>{initialValues._id ? 'Save Changes' : 'Create List'}</Button>
      </div>
    </form>
  );
}
