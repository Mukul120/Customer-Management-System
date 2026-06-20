import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ListsPage from './pages/ListsPage';
import ListDetailsPage from './pages/ListDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import Modal from './components/ui/Modal';
import ListForm from './features/lists/ListForm';
import { useLists } from './hooks/useLists';

/**
 * useLists is owned here (App level) so sidebar and pages share the
 * same list data without double-fetching.
 */
export default function App() {
  const {
    lists, loading: listsLoading, error: listsError,
    fetchLists, createList, updateList, deleteList,
  } = useLists();

  const [showGlobalCreate, setShowGlobalCreate] = useState(false);
  const [mutating, setMutating] = useState(false);

  // Called from the sidebar "+" button
  const handleGlobalCreate = async (data) => {
    setMutating(true);
    try {
      await createList(data);
      setShowGlobalCreate(false);
    } catch (err) {
      throw err;
    } finally {
      setMutating(false);
    }
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout lists={lists} onCreateList={() => setShowGlobalCreate(true)}>
              <ListsPage
                lists={lists}
                loading={listsLoading}
                error={listsError}
                onFetch={fetchLists}
                onCreate={createList}
                onUpdate={updateList}
                onDelete={deleteList}
              />
            </AppLayout>
          }
        />
        <Route
          path="/list/:listId"
          element={
            <AppLayout lists={lists} onCreateList={() => setShowGlobalCreate(true)}>
              <ListDetailsPage lists={lists} />
            </AppLayout>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global "Create List" modal (triggered from sidebar "+" button) */}
      <Modal isOpen={showGlobalCreate} onClose={() => setShowGlobalCreate(false)} title="Create New List" size="md">
        <ListForm
          onSubmit={handleGlobalCreate}
          onCancel={() => setShowGlobalCreate(false)}
          loading={mutating}
        />
      </Modal>
    </>
  );
}
