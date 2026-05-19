import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Min 6 caractères'),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      navigate(user?.roles?.includes('ROLE_ADMIN') ? '/admin/page' : '/dashboard');
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        status === 401
          ? 'Email ou mot de passe incorrect'
          : status === 400
            ? 'Données invalides (vérifiez email et mot de passe)'
            : 'Impossible de se connecter. Réessayez.';
      toast.error(msg, { toastId: 'login-error' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-teal-400 tracking-widest">CV·ANALYSER</h1>
          <p className="text-slate-500 mt-2">Plateforme d'optimisation de CV par IA</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Connexion</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Email</label>
              <input
                {...register('email')}
                type="email" autoComplete="email"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500"
                placeholder="etudiant@email.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Mot de passe</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-teal-500"
                  placeholder="*************"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-md text-slate-400 hover:text-teal-400 hover:bg-slate-700/50 transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" aria-hidden /> : <Eye className="w-5 h-5" aria-hidden />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit" disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors mt-2"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-slate-400 hover:text-teal-400 hover:underline transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <Link
                to="/admin/login"
                className="mt-4 w-full text-sm text-teal-400 hover:text-teal-300 font-medium inline-flex items-center justify-center gap-1 hover:underline transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour connexion administrateur
          </Link>
          <p className="text-slate-500 text-sm text-center mt-4">
            Pas de compte ? <Link to="/register" className="text-teal-400 hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
