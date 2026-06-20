import { useState, useEffect, useCallback } from 'react';
import * as contactsApi from '../api/contacts.api';

export function useContacts(listId) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = useCallback(async () => {
    if (!listId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await contactsApi.getContactsByList(listId);
      setContacts(data.contacts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const searchContacts = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactsApi.searchContacts(query, listId);
      setContacts(data.contacts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (formData) => {
    const data = await contactsApi.createContact({ ...formData, listId });
    const newContact = data.contact;
    setContacts((prev) => [newContact, ...prev]);
    return newContact;
  };

  const updateContact = async (contactId, formData) => {
    const data = await contactsApi.updateContact(contactId, formData);
    const updated = data.contact;
    setContacts((prev) =>
      prev.map((c) => (c._id === contactId ? updated : c))
    );
    return updated;
  };

  const deleteContact = async (contactId) => {
    await contactsApi.deleteContact(contactId);
    setContacts((prev) => prev.filter((c) => c._id !== contactId));
  };

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    searchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
}
