import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, required, icon, textarea = false, style = {}, wrapperStyle = {}, ...props },
  ref
) {
  const hasError = Boolean(error);
  const inputStyle = {
    width: '100%',
    padding: icon ? '0.5rem 0.75rem 0.5rem 2.5rem' : '0.5rem 0.75rem',
    fontSize: 'var(--text-sm)',
    fontFamily: 'inherit',
    color: 'var(--clr-text-body)',
    background: 'var(--clr-surface)',
    border: `1px solid ${hasError ? 'var(--clr-danger-500)' : 'var(--clr-border-strong)'}`,
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    resize: textarea ? 'vertical' : undefined,
    minHeight: textarea ? '80px' : undefined,
    lineHeight: 1.5,
    ...style,
  };

  const Tag = textarea ? 'textarea' : 'input';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', ...wrapperStyle }}>
      {label && (
        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--clr-text-body)' }}>
          {label}
          {required && <span style={{ color: 'var(--clr-danger-500)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--clr-text-muted)', display: 'flex', alignItems: 'center',
          }}>
            {icon}
          </span>
        )}
        <Tag
          ref={ref}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = hasError ? 'var(--clr-danger-500)' : 'var(--clr-primary-500)';
            e.target.style.boxShadow = hasError
              ? '0 0 0 3px rgba(239,68,68,0.12)'
              : '0 0 0 3px rgba(99,102,241,0.12)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = hasError ? 'var(--clr-danger-500)' : 'var(--clr-border-strong)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-danger-500)', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {error}
        </span>
      )}
      {hint && !error && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-muted)' }}>{hint}</span>
      )}
    </div>
  );
});

export default Input;
