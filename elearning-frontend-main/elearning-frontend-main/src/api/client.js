import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080/api',
  // NO configurar Content-Type aquí para permitir que FormData lo configure automáticamente
});

// Add a request interceptor to attach the token and configure headers
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Solo configurar Content-Type si no es FormData
    // FormData configurará automáticamente multipart/form-data con el boundary correcto
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optional: Redirect to login page or dispatch a logout action
      // window.location.href = '/login'; // naive redirect
    }
    return Promise.reject(error);
  }
);

export default client;
