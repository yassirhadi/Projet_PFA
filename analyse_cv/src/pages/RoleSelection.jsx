import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Logo et Titre */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25">
              <span className="text-white font-bold text-xl">CV</span>
            </div>
            <span className="text-3xl font-bold text-white">
              <span className="text-teal-400">CV</span>
              <span className="text-slate-500 mx-1">·</span>
              <span className="text-cyan-400">ANALYSER</span>
            </span>
          </div>
          
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Optimisez votre CV grâce à l'intelligence artificielle
          </p>
        </div>

        {/* Inscription directe */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center md:text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-amber-600/5 rounded-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-3 flex items-center justify-center md:justify-start gap-2">
                    <UserPlus className="h-6 w-6 text-teal-400 shrink-0" />
                    S'inscrire
                  </h2>
                  <div className="space-y-3 text-slate-400 leading-relaxed text-sm md:text-base">
                    <p>
                      <span className="font-medium text-teal-400/90">Étudiant :</span>{' '}
                      créez un compte pour accéder à votre espace personnel, analyser et optimiser votre CV avec l'IA.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 justify-center md:justify-start">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition-colors hover:border-teal-400/60 hover:bg-teal-500/20 hover:text-teal-300"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Inscription étudiant
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de sélection */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Card Étudiant */}
          <button
            onClick={() => navigate('/login')}
            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/10 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">
                Étudiant
              </h2>
              
              <p className="text-slate-400 mb-6 leading-relaxed">
                Accédez à votre espace personnel pour analyser et optimiser votre CV avec l'IA.
              </p>
              
              <div className="flex items-center gap-2 text-teal-400 font-semibold group-hover:gap-3 transition-all">
                <span>Se connecter</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* Card Admin */}
          <button
           onClick={() => navigate('/admin/login')}
            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                Administrateur
              </h2>
              
              <p className="text-slate-400 mb-6 leading-relaxed">
                Espace réservé aux administrateurs pour gérer les utilisateurs et les analyses.
              </p>
              
              <div className="flex items-center gap-2 text-amber-400 font-semibold group-hover:gap-3 transition-all">
                <span>Accès sécurisé</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p className="mt-4">© 2026 CV-Analyser. Tous droits réservés.</p>
          <p className="mt-1">Propulsé par l'intelligence artificielle</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;