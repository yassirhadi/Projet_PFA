import axiosInstance from './axiosConfig';

export const authApi = {
  /** 🔐 Login - Spring Boot attend "motDePasse" */
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', {
      email: credentials.email,
      motDePasse: credentials.password, // ✅ Nom exact attendu par Spring
    });
    return response.data;
  },

  /** 📝 Register */
  register: async (userData) => {
    const { confirmPassword, ...registerData } = userData;
    const response = await axiosInstance.post('/auth/register', {
      ...registerData,
      role: registerData.role || 'ETUDIANT',
    });
    return response.data;
  },

  /** 🔄 Refresh Token */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('Aucun refresh token disponible');
    }
    const response = await axiosInstance.post('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  /** 🚪 Logout */
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  /** 👤 Get Me */
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  /** Mot de passe oublié (étudiant) — étape 1 */
  verifyForgotPasswordEmail: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password/verify-email', { email });
    return response.data;
  },

  /** Mot de passe oublié (étudiant) — étape 2 */
  resetForgotPassword: async ({ email, nouveauMotDePasse, confirmationMotDePasse }) => {
    const response = await axiosInstance.post('/auth/forgot-password/reset', {
      email,
      nouveauMotDePasse,
      confirmationMotDePasse,
    });
    return response.data;
  },
};