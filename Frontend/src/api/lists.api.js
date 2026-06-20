import axiosClient from './axiosClient';

/** GET /api/list */
export const getLists = () => axiosClient.get('/api/list').then((r) => r.data);

/** POST /api/list  — body: { name, description? } */
export const createList = (data) =>
  axiosClient.post('/api/list', data).then((r) => r.data);

/** PUT /api/list/:listId  — body: { name, description? } */
export const updateList = (listId, data) =>
  axiosClient.put(`/api/list/${listId}`, data).then((r) => r.data);

/** DELETE /api/list/:listId */
export const deleteList = (listId) =>
  axiosClient.delete(`/api/list/${listId}`).then((r) => r.data);
