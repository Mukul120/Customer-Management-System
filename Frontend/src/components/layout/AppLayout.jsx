import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout({ lists, onCreateList, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { listId } = useParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        sidebarOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Desktop sidebar */}
        <div className="desktop-sidebar" style={{ flexShrink: 0 }}>
          <Sidebar
            lists={lists}
            selectedListId={listId}
            onCreateList={onCreateList}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="mobile-overlay"
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(15,23,42,0.4)',
                backdropFilter: 'blur(2px)',
                zIndex: 200,
              }}
            />
            <div className="mobile-sidebar" style={{
              position: 'fixed', left: 0, top: 'var(--header-h)',
              bottom: 0, width: 'var(--sidebar-w)',
              zIndex: 201,
              animation: 'slideInRight 0.22s ease',
            }}>
              <Sidebar
                lists={lists}
                selectedListId={listId}
                onCreateList={() => { onCreateList(); setSidebarOpen(false); }}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </>
        )}

        {/* Main content */}
        <main style={{
          flex: 1, overflowY: 'auto',
          background: 'var(--clr-bg)',
        }}>
          {children}
        </main>
      </div>

      <style>{`
        .desktop-sidebar {
          display: flex;
        }
        .mobile-sidebar, .mobile-overlay {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none; }
          .mobile-sidebar, .mobile-overlay { display: block; }
        }
      `}</style>
    </div>
  );
}
