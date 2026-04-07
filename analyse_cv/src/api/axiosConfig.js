import axios from 'axios';

// ✅ URL de base robuste
const getBaseURL = () => {
  if (import.meta.env.DEV) return '/api'; // Proxy Vite en dev
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
};

// ✅ Clé de token UNIQUE et cohérente partout
const TOKEN_KEY = import.meta.env.VITE_JWT_TOKEN_KEY || 'authToken';
const REFRESH_TOKEN_KEY = 'refresh_token';

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    // 🚫 Content-Type géré dynamiquement
  },
});

// 🔁 Intercepteur Request : injection du token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    // Pour FormData : laisser axios gérer le Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Intercepteur Response : gestion erreurs + refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 🔐 401 : Token expiré → tentative de refresh
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (refreshToken) {
        try {
          // Appel DIRECT avec axios pour éviter boucle infinie
          const { data } = await axios.post(`${getBaseURL()}/auth/refresh`, {
            refreshToken
          }, {
            headers: { 'Content-Type': 'application/json' }
          });
          
          // Sauvegarde nouveau token
          localStorage.setItem(TOKEN_KEY, data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
          }
          
          // Retry requête initiale
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Échec refresh → déconnexion
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }

    // 🚫 403 : Accès refusé
    if (status === 403) {
      console.warn('⚠️ Accès refusé');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
export { TOKEN_KEY, REFRESH_TOKEN_KEY };