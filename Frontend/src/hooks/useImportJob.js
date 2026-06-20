import { useState, useRef, useCallback } from 'react';
import * as importsApi from '../api/imports.api';

const POLL_INTERVAL_MS = 1500;
const TERMINAL_STATUSES = ['Completed', 'Failed'];

export function useImportJob() {
  const [importJob, setImportJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const pollJob = useCallback(
    (importJobId) => {
      pollRef.current = setInterval(async () => {
        try {
          const data = await importsApi.getImportJob(importJobId);
          const job = data.importJob;
          setImportJob(job);
          if (TERMINAL_STATUSES.includes(job.status)) {
            stopPolling();
          }
        } catch (err) {
          setError(err.message);
          stopPolling();
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  const startImport = async (listId, contacts) => {
    stopPolling();
    setImportJob(null);
    setError(null);
    setLoading(true);
    try {
      const data = await importsApi.createImportJob({ listId, contacts });
      const job = data.importJob;
      setImportJob(job);
      if (!TERMINAL_STATUSES.includes(job.status)) {
        pollJob(job._id);
      }
      return job;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetImport = useCallback(() => {
    stopPolling();
    setImportJob(null);
    setError(null);
    setLoading(false);
  }, [stopPolling]);

  return { importJob, loading, error, startImport, resetImport };
}
