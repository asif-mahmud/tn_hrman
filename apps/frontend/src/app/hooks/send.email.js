import { useState } from 'react';
import client from './client';

// TODO: these hooks are very similar, could put parts
// of them into a common hook
export function useSendEmail() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = (vars) => {
    if (!vars) {
      return;
    }

    setLoading(true);
    client
      .request({
        url: '/api/send-email',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: vars,
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
