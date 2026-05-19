import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, Lock, Mail, Key, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(formData);

      // Vérification critique du rôle ROLE_ADMIN
      if (!user.roles?.includes('ROLE_ADMIN')) {
        toast.error("Accès refusé : Compte administrateur requis.");
        localStorage.removeItem('authToken'); 
        localStorage.removeItem('refresh_token');
        return; 
      }

      toast.success("Bienvenue dans l'espace administrateur");
      navigate('/admin/page');
    } catch (error) {
      console.error('Erreur login admin:', error);
      toast.error(error.message || "Échec de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Badge de sécurité */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 rounded-full px-4 py-2 shadow-lg">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <span className="text-amber-800 font-semibold text-sm">
              Zone sécurisée — Administrateurs uniquement
            </span>
          </div>
        </div>

        {/* Carte de connexion */}
        <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden">
          {/* Header Ambre */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                <p className="text-amber-100 text-sm">Espace d'administration</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email administrateur
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-amber-600" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="admin@cv-analyser.com"
                  />
                </div>
              </div>

              {/* Mot de passe avec Eye Toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-amber-600" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-lg"
              >
                {isLoading ? 'Connexion sécurisée...' : 'Se connecter'}
              </button>
            </form>

            {/* Liens */}
            <div className="mt-6 space-y-3 text-center">
              <Link
                to="/login"
                className="text-sm text-amber-700 hover:text-amber-900 font-medium inline-flex items-center gap-1 hover:underline transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour connexion utilisateur
              </Link>
              
              <p className="text-sm text-gray-600">
                Pas de compte ?{' '}
                <Link
                  to="/admin/register"
                  className="text-amber-700 hover:text-amber-900 font-semibold hover:underline transition-colors"
                >
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Avertissement */}
        <div className="mt-6 p-4 bg-amber-900/10 border border-amber-300/50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <p className="font-semibold mb-1">Avertissement de sécurité</p>
              <p>
                Cet espace est réservé aux administrateurs. Toute tentative d'accès non autorisé est enregistrée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
