import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOffreStore } from '../../store/useStore';
import {
  FileText, LogOut, Briefcase,
  Upload, LayoutDashboard, Sparkles, Mail
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label, description, active, iconColor, badge }) => (
  <Link
    to={to}
    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
      ${active ? 'text-teal-300' : 'text-slate-400 hover:text-slate-200'}`}
    style={active ? { background: 'linear-gradient(90deg, rgba(20,184,166,0.12), rgba(20,184,166,0.03))' } : {}}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
  >
    {active && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
        style={{ background: 'linear-gradient(180deg, #2dd4bf, #06b6d4)' }} />
    )}
    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
      style={active
        ? { background: `${iconColor}22`, boxShadow: `0 0 12px ${iconColor}33`, color: iconColor }
        : { background: `${iconColor}18`, color: iconColor }
      }
    >
      <Icon size={14} />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium leading-tight ${active ? 'text-teal-300' : 'text-slate-300 group-hover:text-white'}`}>
        {label}
      </p>
      {description && (
        <p className="text-[11px] text-slate-600 truncate mt-0.5">{description}</p>
      )}
    </div>
    {badge != null && badge > 0 && (
      <span className="ml-auto shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
        style={{ background: '#f59e0b', color: '#1a1a1a' }}>
        {badge}
      </span>
    )}
  </Link>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { privateOffresCount } = useOffreStore();

  const handleLogout = () => {
    logout();
    window.location.replace('/login');
  };

  const navItems = [
    { to: '/dashboard',      icon: LayoutDashboard, label: 'Tableau de bord',     description: 'Vue générale',            iconColor: '#2dd4bf' },
    { to: '/cv',             icon: Upload,           label: 'Télécharger un CV',   description: 'PDF, DOCX ou TXT',        iconColor: '#60a5fa' },
    { to: '/analyse',        icon: Sparkles,         label: "Analyser avec l'IA",  description: 'Score & recommandations', iconColor: '#a78bfa' },
    { to: '/offres',         icon: Briefcase,        label: 'Offres cibles',       description: 'Offres publiées',         iconColor: '#fb923c' },
    { to: '/offres-privees', icon: Mail,             label: 'Offres personnelles', description: 'Envoyées pour vous',      iconColor: '#fbbf24', badge: privateOffresCount },
    { to: '/cv',             icon: FileText,         label: 'Exporter le CV',      description: 'PDF, DOCX, TXT ou JSON',  iconColor: '#34d399' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40"
      style={{ background: 'linear-gradient(180deg, #0a0f1a 0%, #0d1520 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      
      {/* Logo modifié selon l'image demandée */}
      <div className="px-5 pt-6 pb-5">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)', boxShadow: '0 4px 14px rgba(13,148,136,0.35)' }}>
            <span className="text-white font-bold text-sm">CV</span>
          </div>
          <span className="font-extrabold text-sm tracking-[0.15em]"
            style={{ background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
             ANALYSER
          </span>
        </Link>
      </div>

      <div className="mx-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(45,212,191,0.15), transparent)' }} />

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] px-3 mb-3"
          style={{ color: 'rgba(100,116,139,0.7)' }}>
          Actions rapides
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to &&
            (item.to !== '/cv' || item.label === 'Télécharger un CV');
          return <NavItem key={item.to + item.label} {...item} active={isActive} />;
        })}
      </nav>

      <div className="px-3 pb-4 space-y-1">
        <div className="mx-1 h-px mb-3" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm"
              style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.25), rgba(8,145,178,0.25))', border: '1px solid rgba(45,212,191,0.2)' }}>
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-300 truncate">
                {(() => {
                  const prenom = user.prenom || user.firstName || user.first_name || user.given_name || '';
                  const nom = user.nom || user.lastName || user.last_name || user.family_name || user.name || '';
                  if (prenom && nom) return `${prenom} ${nom}`;
                  if (prenom || nom) return prenom || nom;
                  const skip = ['sub','iat','exp','roles','role','jti','iss','aud'];
                  const found = Object.entries(user).find(([k,v]) => !skip.includes(k) && typeof v === 'string' && v.length > 1);
                  return found ? found[1] : (user.sub || user.email || 'Étudiant');
                })()}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(100,116,139,0.6)' }}>Étudiant</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
          style={{ background: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-slate-500 group-hover:text-red-400"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <LogOut size={14} />
          </div>
          <span className="text-sm font-medium text-slate-500 group-hover:text-red-400 transition-colors">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;