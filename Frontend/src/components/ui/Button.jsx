import React from 'react';

const variants = {
  primary: {
    background: 'var(--clr-primary-600)',
    color: '#fff',
    border: 'none',
    hoverBg: 'var(--clr-primary-700)',
  },
  secondary: {
    background: 'var(--clr-surface)',
    color: 'var(--clr-text-body)',
    border: '1px solid var(--clr-border-strong)',
    hoverBg: 'var(--clr-neutral-50)',
  },
  danger: {
    background: 'var(--clr-danger-500)',
    color: '#fff',
    border: 'none',
    hoverBg: 'var(--clr-danger-700)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--clr-text-muted)',
    border: 'none',
    hoverBg: 'var(--clr-neutral-100)',
  },
};

const sizes = {
  sm: { padding: '0.375rem 0.75rem', fontSize: 'var(--text-sm)', height: '32px' },
  md: { padding: '0.5rem 1rem',     fontSize: 'var(--text-sm)', height: '38px' },
  lg: { padding: '0.625rem 1.25rem', fontSize: 'var(--text-base)', height: '44px' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    fontFamily: 'inherit',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'background var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast)',
    whiteSpace: 'nowrap',
    outline: 'none',
    width: fullWidth ? '100%' : undefined,
    background: v.background,
    color: v.color,
    border: v.border || 'none',
    ...s,
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={(e) => { if (!disabled && !loading) e.currentTarget.style.background = v.hoverBg; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = v.background; }}
      onMouseDown={(e) => { if (!disabled && !loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      {...rest}
    >
      {loading ? (
        <span style={{
          width: 14, height: 14, borderRadius: '50%',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          animation: 'spin 0.6s linear infinite',
          flexShrink: 0,
        }} />
      ) : icon ? (
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
