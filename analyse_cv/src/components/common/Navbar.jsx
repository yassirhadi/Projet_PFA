import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, LogOut, Briefcase, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    const redirectPath = isAdmin ? '/admin/login' : '/login';
    logout();
    window.location.replace(redirectPath);
  };

  return (
    <nav className="bg-slate-900 border-b border-teal-500/30 px-6 py-4 flex items-center justify-between">
      {/* Logo modifié avec icône + texte */}
      <Link to={isAdmin ? "/admin/page" : "/dashboard"} className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)', boxShadow: '0 4px 14px rgba(13,148,136,0.35)' }}>
          <span className="text-white font-bold text-sm">CV</span>
        </div>
        <span className="font-extrabold text-sm tracking-[0.2em]"
          style={{ background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ANALYSER
        </span>
      </Link>

      {user && (
        <div className="flex items-center gap-6">
          {!isAdmin && (
            <Link to="/cv" className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors">
              <FileText size={16} /> Mes CVs
            </Link>
          )}
          <Link to={isAdmin ? "/admin/offres" : "/offres"} className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors">
            <Briefcase size={16} /> Offres
          </Link>
          {/* Analyse IA supprimé */}
          {isAdmin && (
            <Link to="/admin/page" className="flex items-center gap-2 text-amber-400 hover:text-amber-300">
              <Shield size={16} /> Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;