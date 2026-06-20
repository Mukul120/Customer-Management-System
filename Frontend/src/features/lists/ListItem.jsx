import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function ListItem({ list, onEdit, onDelete }) {
  const navigate = useNavigate();
  const initials = list.name.charAt(0).toUpperCase();

  const colors = [
    { bg: '#eef2ff', text: '#4338ca', dot: '#6366f1' },
    { bg: '#fdf4ff', text: '#7e22ce', dot: '#a855f7' },
    { bg: '#ecfdf5', text: '#065f46', dot: '#10b981' },
    { bg: '#fff7ed', text: '#9a3412', dot: '#f97316' },
    { bg: '#f0f9ff', text: '#075985', dot: '#0ea5e9' },
  ];
  const color = colors[list.name.charCodeAt(0) % colors.length];

  return (
    <div
      style={{
        background: 'var(--clr-surface)',
        border: '1px solid var(--clr-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        boxShadow: 'var(--shadow-xs)',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={() => navigate(`/list/${list._id}`)}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--clr-primary-200)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.borderColor = 'var(--clr-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Avatar */}
      <div style={{
        width: 46, height: 46, borderRadius: 'var(--radius-md)',
        background: color.bg, color: color.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 'var(--text-lg)', fontWeight: 700, flexShrink: 0,
      }}>
        {initials}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--clr-text-heading)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {list.name}
        </div>
        {list.description ? (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {list.description}
          </div>
        ) : (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-subtle)', fontStyle: 'italic' }}>No description</div>
        )}
      </div>

      {/* Action buttons */}
      <div
        style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Edit list"
          onClick={() => onEdit(list)}
          style={{
            width: 32, height: 32, borderRadius: 'var(--radius-md)',
            border: '1px solid var(--clr-border)', background: 'var(--clr-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--clr-text-muted)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-50)'; e.currentTarget.style.color = 'var(--clr-primary-600)'; e.currentTarget.style.borderColor = 'var(--clr-primary-200)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--clr-surface)'; e.currentTarget.style.color = 'var(--clr-text-muted)'; e.currentTarget.style.borderColor = 'var(--clr-border)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          aria-label="Delete list"
          onClick={() => onDelete(list)}
          style={{
            width: 32, height: 32, borderRadius: 'var(--radius-md)',
            border: '1px solid var(--clr-border)', background: 'var(--clr-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--clr-text-muted)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-danger-50)'; e.currentTarget.style.color = 'var(--clr-danger-500)'; e.currentTarget.style.borderColor = 'var(--clr-danger-400)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--clr-surface)'; e.currentTarget.style.color = 'var(--clr-text-muted)'; e.currentTarget.style.borderColor = 'var(--clr-border)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
