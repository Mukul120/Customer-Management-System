import axiosClient from './axiosClient';

/** POST /api/bulk-import  — body: { listId, contacts: [] } */
export const createImportJob = (data) =>
  axiosClient.post('/api/bulk-import', data).then((r) => r.data);

/** GET /api/bulk-import/:importJobId */
export const getImportJob = (importJobId) =>
  axiosClient.get(`/api/bulk-import/${importJobId}`).then((r) => r.data);
