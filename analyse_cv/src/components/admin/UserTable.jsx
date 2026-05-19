import { Trash2, ShieldCheck, User } from 'lucide-react';

const ROLE_STYLE = {
  ROLE_ADMIN:    'text-amber-400 bg-amber-400/10 border-amber-400/30',
  ROLE_ETUDIANT: 'text-teal-400 bg-teal-400/10 border-teal-400/30',
};

const UserTable = ({ users = [], onDelete, loading = false }) => {
  if (loading) {
    return (
      <div className="text-center py-10 text-slate-500 animate-pulse">
        Chargement des utilisateurs...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500 italic">
        Aucun utilisateur trouvé.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-5 py-3 text-left">#</th>
            <th className="px-5 py-3 text-left">Nom</th>
            <th className="px-5 py-3 text-left">Email</th>
            <th className="px-5 py-3 text-left">Rôle</th>
            <th className="px-5 py-3 text-left">Inscrit le</th>
            <th className="px-5 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr
              key={u.id}
              className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors"
            >
              <td className="px-5 py-3 text-slate-600">{idx + 1}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                    {u.role === 'ROLE_ADMIN'
                      ? <ShieldCheck size={14} />
                      : <User size={14} />}
                  </div>
                  <span className="text-white">{u.nom}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-slate-400">{u.email}</td>
              <td className="px-5 py-3">
                <span className={`text-xs border rounded-full px-2.5 py-0.5 ${ROLE_STYLE[u.role] || 'text-slate-400'}`}>
                  {u.role?.replace('ROLE_', '')}
                </span>
              </td>
              <td className="px-5 py-3 text-slate-500 text-xs">
                {u.dateinscription
                  ? new Date(u.dateinscription).toLocaleDateString('fr-FR')
                  : '—'}
              </td>
              <td className="px-5 py-3 text-center">
                <button
                  onClick={() => onDelete?.(u.id)}
                  disabled={u.role === 'ROLE_ADMIN'}
                  className="text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Supprimer l'utilisateur"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;