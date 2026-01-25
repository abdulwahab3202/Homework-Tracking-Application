import axios from 'axios';

const api = axios.create({
  baseURL: 'https://homework-tracking-application.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;