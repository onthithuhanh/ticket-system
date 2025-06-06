import axios from 'axios';

const API_BASE_URL =   'https://stellaway.runasp.net/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) {
    //   // Handle unauthorized access
    //   localStorage.removeItem('token');
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default api; 