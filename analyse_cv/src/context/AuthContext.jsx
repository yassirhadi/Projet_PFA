// Principe SOLID : Open/Closed — extensible sans modifier le contexte
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

/** Même clé que axios (VITE_JWT_TOKEN_KEY) pour que Authorization soit envoyé */
const accessTokenKey = () => import.meta.env.VITE_JWT_TOKEN_KEY || 'authToken';
const refreshTokenKey = () => 'refresh_token';

/** JWT Spring: claims role = "ADMIN" | "ETUDIANT" — le front attend souvent roles[] style Spring Security */
const normalizeDecodedUser = (decoded) => {
  if (!decoded) return null;
  const role = decoded.role;
  return {
    ...decoded,
    roles: role ? [`ROLE_${role}`] : [],
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifie le token au montage
  useEffect(() => {
    const key = accessTokenKey();
    const token = localStorage.getItem(key);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(normalizeDecodedUser(decoded));
        } else {
          localStorage.removeItem(key);
          localStorage.removeItem(refreshTokenKey());
        }
      } catch {
        localStorage.removeItem(key);
        localStorage.removeItem(refreshTokenKey());
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    const token = data?.accessToken ?? data?.token;
    if (!token) {
      throw new Error('Réponse de connexion sans access token');
    }
    const key = accessTokenKey();
    localStorage.setItem(key, token);
    if (data?.refreshToken) {
      localStorage.setItem(refreshTokenKey(), data.refreshToken);
    }
    const decoded = normalizeDecodedUser(jwtDecode(token));
    setUser(decoded);
    return decoded;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(accessTokenKey());
    localStorage.removeItem(refreshTokenKey());
    setUser(null);
  }, []);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être dans AuthProvider');
  return ctx;
};
