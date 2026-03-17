import axios from 'axios';
import toast from 'react-hot-toast';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
        case 403:
          localStorage.removeItem('token');
          window.location.href = '/login';
          toast.error('登录已过期，请重新登录');
          break;
        default:
          toast.error(error.response.data?.message || '请求失败');
      }
    } else {
      toast.error('网络错误，请稍后重试');
    }
    return Promise.reject(error);
  }
);

export default request;
