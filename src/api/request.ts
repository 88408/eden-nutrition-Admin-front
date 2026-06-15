import axios from 'axios';
import toast from 'react-hot-toast';

const request = axios.create({
  baseURL: '', // Vite 代理已配置 /api 和 /admin
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
    const res = response.data;
    // 后端约定的成功 Code 为 200
    if (res.code === 200 || !res.code) {
      // 兼容不包裹Result的响应，或剥离Result的包装
      return res.data !== undefined ? res.data : res;
    }

    if (res.code === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('登录已过期，请重新登录');
    } else {
      toast.error(res.message || '请求失败');
    }
    return Promise.reject(new Error(res.message || 'Error'));
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          toast.error('登录已过期，请重新登录');
          break;
        case 403:
          toast.error(error.response.data?.message || '没有访问权限');
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
