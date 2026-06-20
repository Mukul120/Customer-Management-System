import { useState, useEffect, useCallback } from 'react';
import * as listsApi from '../api/lists.api';

export function useLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listsApi.getLists();
      setLists(data.lists || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const createList = async (formData) => {
    const data = await listsApi.createList(formData);
    // Backend returns the list object directly on create
    const newList = data.list || data;
    setLists((prev) => [newList, ...prev]);
    return newList;
  };

  const updateList = async (listId, formData) => {
    const data = await listsApi.updateList(listId, formData);
    const updated = data.list || data;
    setLists((prev) => prev.map((l) => (l._id === listId ? updated : l)));
    return updated;
  };

  const deleteList = async (listId) => {
    await listsApi.deleteList(listId);
    setLists((prev) => prev.filter((l) => l._id !== listId));
  };

  return { lists, loading, error, fetchLists, createList, updateList, deleteList };
}
