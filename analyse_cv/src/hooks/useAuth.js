import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const ctx      = useAuthContext();
  const navigate = useNavigate();

  /** Connexion avec redirection automatique selon le rôle */
  const loginAndRedirect = useCallback(async (credentials) => {
    try {
      const user = await ctx.login(credentials);
      toast.success(`Bienvenue, ${user?.sub || 'utilisateur'} !`);
      navigate(
        user?.roles?.includes('ROLE_ADMIN') ? '/admin/page' : '/dashboard',
        { replace: true }
      );
    } catch (err) {
      const msg =
        err?.response?.status === 401
          ? 'Email ou mot de passe incorrect'
          : 'Erreur de connexion. Réessayez.';
      toast.error(msg, { toastId: 'login-error' });
      throw err;
    }
  }, [ctx, navigate]);

  /** Déconnexion avec redirection */
  const logoutAndRedirect = useCallback(() => {
    ctx.logout();
    navigate('/login', { replace: true });
    toast.info('Vous êtes déconnecté');
  }, [ctx, navigate]);

  /** Mise à jour du profil */
  const updateProfil = useCallback(async (data) => {
    try {
      const { data: updated } = await authApi.updateProfil(data);
      toast.success('Profil mis à jour');
      return updated;
    } catch {
      toast.error('Erreur lors de la mise à jour du profil');
    }
  }, []);

  /** Helpers dérivés */
  const isEtudiant = !ctx.isAdmin && !!ctx.user;
  const userName   = ctx.user?.sub || ctx.user?.email || '';

  return {
    ...ctx,
    loginAndRedirect,
    logoutAndRedirect,
    updateProfil,
    isEtudiant,
    userName,
  };
};
