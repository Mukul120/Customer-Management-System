import axiosClient from './axiosClient';

/** GET /api/contact/list/:listId */
export const getContactsByList = (listId) =>
  axiosClient.get(`/api/contact/list/${listId}`).then((r) => r.data);

/** GET /api/contact/search?query=&listId= */
export const searchContacts = (query, listId) =>
  axiosClient
    .get('/api/contact/search', { params: { query, listId } })
    .then((r) => r.data);

/** POST /api/contact  — body: { listId, name, phone, email? } */
export const createContact = (data) =>
  axiosClient.post('/api/contact', data).then((r) => r.data);

/** GET /api/contact/:contactId */
export const getContact = (contactId) =>
  axiosClient.get(`/api/contact/${contactId}`).then((r) => r.data);

/** PUT /api/contact/:contactId */
export const updateContact = (contactId, data) =>
  axiosClient.put(`/api/contact/${contactId}`, data).then((r) => r.data);

/** DELETE /api/contact/:contactId */
export const deleteContact = (contactId) =>
  axiosClient.delete(`/api/contact/${contactId}`).then((r) => r.data);
