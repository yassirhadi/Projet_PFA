import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, LogOut, BarChart2, Briefcase, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    const redirectPath = isAdmin ? '/admin/login' : '/login';
    logout();
    window.location.replace(redirectPath);
  };

  return (
    <nav className="bg-slate-900 border-b border-teal-500/30 px-6 py-4 flex items-center justify-between">
      <Link to={isAdmin ? "/admin/page" : "/dashboard"} className="text-teal-400 font-bold text-xl tracking-widest">
        CV·ANALYSER
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
          <Link to="/analyse" className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors">
            <BarChart2 size={16} /> Analyse IA
          </Link>
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
