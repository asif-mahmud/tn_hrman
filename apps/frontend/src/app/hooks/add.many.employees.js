import { useState } from 'react';

import client from './client';

export function useAddManyEmployees() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = (file) => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    client
      .request({
        url: '/api/employees/add-many',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      })
      .then((res) => {
        const data = res.data;
        if (data.data) {
          setData(data.data);
          setError(null);
        } else if (data.error) {
          setError(data.error);
          setData(null);
        }
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [fetchData, { data, error, loading }];
}
