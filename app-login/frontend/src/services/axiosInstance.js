import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001'
});

// Interceptor de requisição: adiciona token
axiosInstance.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token && (config.url !== '/login' || config.url !== '')) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: detecta 401 e redireciona
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;

    // Se for rota de login, não intercepta
    if (originalRequest.url.includes('/login')) {
      return Promise.reject(error);
    }
    
    if (error.response && error.response.status === 401) {
      alert("Sessão expirada. Faça login novamente.");
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('photo');
      sessionStorage.removeItem('fullName');
      window.location.href = '/login';
      window.location.reload(); 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;