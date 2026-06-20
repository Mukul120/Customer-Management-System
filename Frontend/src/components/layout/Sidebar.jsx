import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function Sidebar({ lists, selectedListId, onCreateList, onClose }) {
  const navigate = useNavigate();

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      background: 'var(--clr-surface)',
      borderRight: '1px solid var(--clr-border)',
      display: 'flex', flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Sidebar header */}
      <div style={{
        padding: '1rem 1rem 0.75rem',
        borderBottom: '1px solid var(--clr-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '0.5rem',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--clr-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Lists
        </span>
        <button
          aria-label="Create new list"
          onClick={onCreateList}
          title="New list"
          style={{
            background: 'var(--clr-primary-50)',
            border: '1px solid var(--clr-primary-200)',
            borderRadius: 'var(--radius-md)',
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--clr-primary-600)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-100)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--clr-primary-50)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      {/* List items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
        {lists.length === 0 ? (
          <div style={{ padding: '1.5rem 0.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-subtle)' }}>
              No lists yet. Create one to get started.
            </p>
          </div>
        ) : (
          lists.map((list) => {
            const isActive = list._id === selectedListId;
            return (
              <button
                key={list._id}
                onClick={() => {
                  navigate(`/list/${list._id}`);
                  onClose?.();
                }}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? 'var(--clr-primary-50)' : 'transparent',
                  color: isActive ? 'var(--clr-primary-700)' : 'var(--clr-text-body)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 'var(--text-sm)',
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  transition: 'all var(--transition-fast)',
                  marginBottom: '0.125rem',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'var(--clr-neutral-100)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActive ? 'var(--clr-primary-50)' : 'transparent';
                }}
              >
                {isActive && (
                  <span style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: '0 3px 3px 0',
                    background: 'var(--clr-primary-600)',
                  }} />
                )}
                <span style={{
                  width: 28, height: 28, borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--clr-primary-100)' : 'var(--clr-neutral-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, color: isActive ? 'var(--clr-primary-600)' : 'var(--clr-text-muted)',
                  fontSize: 'var(--text-xs)', fontWeight: 700,
                }}>
                  {list.name.charAt(0).toUpperCase()}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {list.name}
                </span>
              </button>
            );
          })
        )}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid var(--clr-border)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => { navigate('/'); onClose?.(); }}
          style={{
            width: '100%', textAlign: 'left',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: 'none', background: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--clr-neutral-100)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          All Lists
        </button>
      </div>
    </aside>
  );
}
