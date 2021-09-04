import { useState } from 'react';

import client from './client';

export function useGetEmployees() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = (queryParams) => {
    if (!queryParams) {
      return;
    }

    setLoading(true);
    client
      .request({
        url: '/api/employees',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: queryParams,
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
