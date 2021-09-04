import axios from 'axios';
import np from 'nprogress';

const axiosClient = axios.create({
  onUploadProgress: (progressEvent) => {
    const loaded = progressEvent.loaded;
    const total = progressEvent.total;
    let progress = (loaded / total) * 50.0;
    progress /= 100.0;
    np.set(progress);
  },
  onDownloadProgress: (progressEvent) => {
    const loaded = progressEvent.loaded;
    const total = progressEvent.total;
    let progress = 50.0 + (loaded / total) * 50.0;
    progress /= 100.0;
    np.set(progress);
  },
});

export default axiosClient;
