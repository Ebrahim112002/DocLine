import axios from 'axios';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosSecure.interceptors.request.use(
  (config) => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      config.headers.email = userEmail;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosSecure;