import { useEffect, useRef, useState } from 'react';
import { adminApi } from '../api/adminApi';
import { Users, FileText, BarChart2, TrendingUp, Trash2, Search, Briefcase, X, User, ExternalLink, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

const CONTRACT_TYPES = ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'];

function defaultPriveeForm() {
  const exp = new Date();
  exp.setDate(exp.getDate() + 30);
  const pad = (n) => String(n).padStart(2, '0');
  const local = `${exp.getFullYear()}-${pad(exp.getMonth() + 1)}-${pad(exp.getDate())}T${pad(exp.getHours())}:${pad(exp.getMinutes())}`;
  return {
    titre: '',
    entreprise: '',
    description: '',
    localisation: '',
    typeContrat: 'CDI',
    niveauExperience: '',
    salaireMin: '',
    salaireMax: '',
    competences: '',
    dateExpiration: local,
  };
}

const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalCvs, setTotalCvs] = useState(0);
  const hasShownLoadErrorRef = useRef(false);

  const [detailLoading, setDetailLoading] = useState(false);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailProfile, setDetailProfile] = useState(null);
  const [detailOffres, setDetailOffres] = useState([]);
  const [detailOffresPrivees, setDetailOffresPrivees] = useState([]);
  const [detailCvs, setDetailCvs] = useState([]);
  const [detailTab, setDetailTab] = useState('profil');
  const [showPriveeForm, setShowPriveeForm] = useState(false);
  const [priveeSubmitting, setPriveeSubmitting] = useState(false);
  const [priveeForm, setPriveeForm] = useState(() => defaultPriveeForm());

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        (user.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.prenom?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const loadData = async () => {
    setLoading(true);
    const [statsResult, usersResult] = await Promise.allSettled([
      adminApi.getStatistiques(),
      adminApi.getUtilisateurs()
    ]);

    let hasUsersError = false;

    if (statsResult.status === 'fulfilled') {
      setStats(statsResult.value || null);
    } else {
      console.error('Erreur chargement statistiques:', statsResult.reason);
      setStats(null);
    }

    if (usersResult.status === 'fulfilled') {
      const usersPayload = usersResult.value;
      const resolvedUsers = Array.isArray(usersPayload)
        ? usersPayload
        : Array.isArray(usersPayload?.data)
          ? usersPayload.data
          : Array.isArray(usersPayload?.utilisateurs)
            ? usersPayload.utilisateurs
            : Array.isArray(usersPayload?.content)
              ? usersPayload.content
              : [];

      const { users: usersWithCvCount, total } = await enrichUsersWithCvCount(resolvedUsers);
      setUsers(usersWithCvCount);
      setFilteredUsers(usersWithCvCount);
      setTotalCvs(total);
    } else {
      hasUsersError = true;
      console.error('Erreur chargement utilisateurs:', usersResult.reason);
      setUsers([]);
      setFilteredUsers([]);
      setTotalCvs(0);
    }

    if (hasUsersError && !hasShownLoadErrorRef.current) {
      toast.error('Erreur lors du chargement des données');
      hasShownLoadErrorRef.current = true;
    }

    setLoading(false);
  };

  const enrichUsersWithCvCount = async (usersList) => {
    const enriched = await Promise.all(
      usersList.map(async (user) => {
        try {
          const cvsPayload = await adminApi.getCVsByEtudiant(user.id);
          const cvs = Array.isArray(cvsPayload)
            ? cvsPayload
            : Array.isArray(cvsPayload?.data)
              ? cvsPayload.data
              : Array.isArray(cvsPayload?.content)
                ? cvsPayload.content
                : [];

          return { ...user, nbCVs: cvs.length };
        } catch (error) {
          console.error(`Erreur chargement CVs utilisateur ${user.id}:`, error);
          return { ...user, nbCVs: user.nbCVs || 0 };
        }
      })
    );

    const total = enriched.reduce((acc, u) => acc + (Number(u.nbCVs) || 0), 0);
    return { users: enriched, total };
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Supprimer ${userEmail} ?`)) return;

    try {
      await adminApi.supprimerUtilisateur(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success('Utilisateur supprimé');
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const normalizeList = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.content)) return raw.content;
    return [];
  };

  const handleOpenUserDetail = async (user) => {
    setSelectedUser(user);
    setShowUserDetailModal(true);
    setDetailTab('profil');
    setDetailLoading(true);
    setDetailProfile(null);
    setDetailOffres([]);
    setDetailOffresPrivees([]);
    setDetailCvs([]);
    setShowPriveeForm(false);
    setPriveeForm(defaultPriveeForm());

    try {
      const isEtudiant = (user.role || '').toUpperCase() === 'ETUDIANT';
      const settled = await Promise.allSettled([
        adminApi.getUtilisateur(user.id),
        adminApi.getOffresByEtudiant(user.id),
        adminApi.getCVsByEtudiant(user.id),
        isEtudiant ? adminApi.getOffresPriveesForDestinataire(user.id) : Promise.resolve([]),
      ]);

      const [profileRes, offresRes, cvsRes, priveesRes] = settled;

      if (profileRes.status === 'fulfilled') {
        setDetailProfile(profileRes.value);
      } else {
        console.error('Erreur profil utilisateur:', profileRes.reason);
        toast.error('Impossible de charger le profil');
      }

      if (offresRes.status === 'fulfilled') {
        setDetailOffres(normalizeList(offresRes.value));
      } else {
        console.error('Erreur offres:', offresRes.reason);
        toast.error(errorMessage(offresRes.reason, 'Erreur lors du chargement des offres'));
      }

      if (cvsRes.status === 'fulfilled') {
        setDetailCvs(normalizeList(cvsRes.value));
      } else {
        console.error('Erreur CVs:', cvsRes.reason);
        toast.error(errorMessage(cvsRes.reason, 'Erreur lors du chargement des CVs'));
      }

      if (priveesRes.status === 'fulfilled') {
        setDetailOffresPrivees(normalizeList(priveesRes.value));
      } else if (isEtudiant) {
        console.error('Erreur offres privées:', priveesRes.reason);
        toast.error(errorMessage(priveesRes.reason, 'Erreur lors du chargement des offres privées'));
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const reloadOffresPrivees = async (etudiantId) => {
    try {
      const list = await adminApi.getOffresPriveesForDestinataire(etudiantId);
      setDetailOffresPrivees(normalizeList(list));
    } catch (e) {
      console.error(e);
      toast.error(errorMessage(e, 'Impossible de rafraîchir les offres privées'));
    }
  };

  const handleSubmitPrivee = async (e) => {
    e.preventDefault();
    if (!selectedUser || (selectedUser.role || '').toUpperCase() !== 'ETUDIANT') return;
    if (priveeForm.titre.trim().length < 5) {
      toast.error('Le titre doit contenir au moins 5 caractères');
      return;
    }
    if (priveeForm.description.trim().length < 20) {
      toast.error('La description doit contenir au moins 20 caractères');
      return;
    }
    setPriveeSubmitting(true);
    try {
      const payload = {
        titre: priveeForm.titre.trim(),
        entreprise: priveeForm.entreprise.trim(),
        description: priveeForm.description.trim(),
        localisation: priveeForm.localisation.trim(),
        typeContrat: priveeForm.typeContrat,
        dateExpiration: priveeForm.dateExpiration,
      };
      const ne = priveeForm.niveauExperience.trim();
      if (ne) payload.niveauExperience = ne;
      const smin = priveeForm.salaireMin === '' ? null : Number(priveeForm.salaireMin);
      const smax = priveeForm.salaireMax === '' ? null : Number(priveeForm.salaireMax);
      if (smin != null && !Number.isNaN(smin)) payload.salaireMin = smin;
      if (smax != null && !Number.isNaN(smax)) payload.salaireMax = smax;
      const comp = priveeForm.competences.trim();
      if (comp) payload.competences = comp;

      await adminApi.createOffrePrivee(selectedUser.id, payload);
      toast.success('Offre privée envoyée');
      setPriveeForm(defaultPriveeForm());
      setShowPriveeForm(false);
      await reloadOffresPrivees(selectedUser.id);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.defaultMessage;
      toast.error(msg || 'Erreur lors de l’envoi');
    } finally {
      setPriveeSubmitting(false);
    }
  };

  const errorMessage = (reason, fallback) =>
    reason?.response?.data?.message || reason?.message || fallback;

  const handleOpenCv = async (cv) => {
    const tab = window.open('about:blank', '_blank');
    if (!tab) {
      toast.error('Autorisez les pop-ups pour ouvrir le CV dans un nouvel onglet.');
      return;
    }
    try {
      tab.document.write(
        '<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV</title></head>' +
          '<body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;' +
          'font-family:system-ui;background:#0f172a;color:#94a3b8">Chargement du CV…</body></html>'
      );
      tab.document.close();
      const objectUrl = await adminApi.fetchCvObjectUrl(cv.id);
      tab.location.href = objectUrl;
      setTimeout(() => URL.revokeObjectURL(objectUrl), 120000);
    } catch (error) {
      try {
        tab.close();
      } catch {
        /* ignore */
      }
      console.error('Erreur ouverture CV:', error);
      const msg =
        error?.message ||
        error?.response?.data?.message ||
        'Impossible d’ouvrir le CV';
      toast.error(msg);
    }
  };

  const formatInscriptionDate = (u) => {
    const raw = u?.dateCreation || u?.dateInscription;
    if (!raw) return 'N/A';
    try {
      return new Date(raw).toLocaleDateString('fr-FR');
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Utilisateurs', value: stats?.nbUtilisateurs || users.length || 0, icon: Users, color: 'blue' },
    { label: 'CVs Uploadés', value: stats?.nbCVs || totalCvs || 0, icon: FileText, color: 'teal' },
    { label: 'Analyses IA', value: stats?.nbAnalyses || 0, icon: BarChart2, color: 'purple' },
    { label: 'Score Moyen', value: stats?.moyenneScores?.toFixed(1) || '0', icon: TrendingUp, color: 'amber' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord Administrateur</h1>
        <p className="text-slate-400">Gérez les utilisateurs et consultez les statistiques</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-400" />
            Gestion des Utilisateurs
            <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-teal-500/20 text-teal-300">
              {users.length} total
            </span>
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="text-left p-4 text-slate-400 font-medium">Nom</th>
                <th className="text-left p-4 text-slate-400 font-medium">Email</th>
                <th className="text-left p-4 text-slate-400 font-medium">Rôle</th>
                <th className="text-left p-4 text-slate-400 font-medium">Inscription</th>
                <th className="text-left p-4 text-slate-400 font-medium">CVs</th>
                <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() => handleOpenUserDetail(user)}
                  >
                    <td className="p-4 text-white">{user.prenom} {user.nom}</td>
                    <td className="p-4 text-slate-300">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-teal-500/20 text-teal-400'
                      }`}>
                        {user.role || 'ETUDIANT'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">
                      {formatInscriptionDate(user)}
                    </td>
                    <td className="p-4 text-slate-300">{user.nbCVs || 0}</td>
                    <td className="p-4">
                      {user.id !== currentUser?.userId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user.id, user.email);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-900/30 text-sm text-slate-400">
          {filteredUsers.length} utilisateur(s) affiché(s) sur {users.length} total
        </div>
      </div>

      {/* Modal: fiche utilisateur (profil + CVs + offres) — accès admin */}
      {showUserDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4 shrink-0">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {selectedUser.prenom} {selectedUser.nom}
                </h3>
                <p className="text-slate-400 text-sm mt-0.5">{selectedUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUserDetailModal(false);
                  setShowPriveeForm(false);
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex gap-2 mb-4 border-b border-slate-700 pb-2 shrink-0 flex-wrap">
              {[
                { id: 'profil', label: 'Profil', Icon: User },
                { id: 'cvs', label: 'CVs', Icon: FileText },
                { id: 'offres', label: 'Offres publiques', Icon: Briefcase },
                { id: 'privees', label: 'Offres privées', Icon: Mail },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDetailTab(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    detailTab === id
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 min-h-0 pr-1">
              {detailLoading ? (
                <p className="text-slate-400 text-sm text-center py-10">Chargement...</p>
              ) : detailTab === 'profil' ? (
                <div className="space-y-4 text-sm">
                  {detailProfile ? (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                        <dt className="text-slate-500 text-xs uppercase tracking-wide">Nom</dt>
                        <dd className="text-white mt-1">
                          {detailProfile.prenom} {detailProfile.nom}
                        </dd>
                      </div>
                      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                        <dt className="text-slate-500 text-xs uppercase tracking-wide">Email</dt>
                        <dd className="text-slate-200 mt-1 break-all">{detailProfile.email}</dd>
                      </div>
                      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                        <dt className="text-slate-500 text-xs uppercase tracking-wide">Rôle</dt>
                        <dd className="text-slate-200 mt-1">{detailProfile.role || '—'}</dd>
                      </div>
                      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                        <dt className="text-slate-500 text-xs uppercase tracking-wide">Inscription</dt>
                        <dd className="text-slate-200 mt-1">{formatInscriptionDate(detailProfile)}</dd>
                      </div>
                      {(detailProfile.role === 'ETUDIANT' || detailProfile.niveauEtude || detailProfile.universite) && (
                        <>
                          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:col-span-2">
                            <dt className="text-slate-500 text-xs uppercase tracking-wide">Parcours</dt>
                            <dd className="text-slate-200 mt-1 space-y-1">
                              {detailProfile.niveauEtude && (
                                <p>
                                  <span className="text-slate-500">Niveau : </span>
                                  {detailProfile.niveauEtude}
                                </p>
                              )}
                              {detailProfile.domaineEtude && (
                                <p>
                                  <span className="text-slate-500">Domaine : </span>
                                  {detailProfile.domaineEtude}
                                </p>
                              )}
                              {detailProfile.universite && (
                                <p>
                                  <span className="text-slate-500">Université : </span>
                                  {detailProfile.universite}
                                </p>
                              )}
                              {!detailProfile.niveauEtude &&
                                !detailProfile.domaineEtude &&
                                !detailProfile.universite && (
                                  <p className="text-slate-500 italic">Aucune information étudiant renseignée.</p>
                                )}
                            </dd>
                          </div>
                        </>
                      )}
                      {detailProfile.role === 'ADMIN' && detailProfile.permissions && (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:col-span-2">
                          <dt className="text-slate-500 text-xs uppercase tracking-wide">Permissions</dt>
                          <dd className="text-slate-200 mt-1 font-mono text-xs break-all">
                            {detailProfile.permissions}
                          </dd>
                        </div>
                      )}
                    </dl>
                  ) : (
                    <p className="text-slate-500 text-center py-6">Profil indisponible.</p>
                  )}
                </div>
              ) : detailTab === 'cvs' ? (
                <div className="space-y-3">
                  {detailCvs.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">Aucun CV enregistré.</p>
                  ) : (
                    detailCvs.map((cv) => (
                      <div
                        key={cv.id}
                        className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{cv.nomFichier}</p>
                          <p className="text-slate-500 text-xs mt-1">
                            {cv.dateUpload
                              ? new Date(cv.dateUpload).toLocaleString('fr-FR')
                              : ''}
                            {cv.tailleFichier != null
                              ? ` · ${(Number(cv.tailleFichier) / 1024).toFixed(1)} Ko`
                              : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenCv(cv)}
                          className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm rounded-lg shrink-0"
                        >
                          <ExternalLink size={16} />
                          Ouvrir
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : detailTab === 'offres' ? (
                <div className="space-y-3">
                  {detailOffres.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">Aucune offre publique saisie par cet utilisateur.</p>
                  ) : (
                    detailOffres.map((o) => (
                      <div
                        key={o.id}
                        className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex items-start justify-between gap-4"
                      >
                        <div>
                          <p className="text-white font-medium">{o.titre}</p>
                          <p className="text-slate-400 text-sm">
                            {o.entreprise}
                            {o.localisation ? ` · ${o.localisation}` : ''}
                          </p>
                          <p className="text-slate-500 text-xs mt-1">
                            {o.typeContrat ? `Type: ${o.typeContrat}` : 'Type: N/A'}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                            o.active
                              ? 'bg-teal-500/20 text-teal-300'
                              : 'bg-slate-500/20 text-slate-300'
                          }`}
                        >
                          {o.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {(selectedUser.role || '').toUpperCase() !== 'ETUDIANT' ? (
                    <p className="text-slate-500 text-sm text-center py-8">
                      Les offres privées sont réservées aux comptes étudiants.
                    </p>
                  ) : (
                    <>
                      <p className="text-slate-400 text-sm">
                        Offres visibles uniquement par cet étudiant et les administrateurs. Données enregistrées en base (
                        <code className="text-slate-500">offre_privee</code>).
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPriveeForm((v) => !v)}
                          className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm rounded-lg font-medium"
                        >
                          {showPriveeForm ? 'Masquer le formulaire' : 'Nouvelle offre privée'}
                        </button>
                      </div>
                      {showPriveeForm && (
                        <form
                          onSubmit={handleSubmitPrivee}
                          className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3 text-sm"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-slate-400 text-xs">Titre *</span>
                              <input
                                required
                                minLength={5}
                                value={priveeForm.titre}
                                onChange={(e) => setPriveeForm((f) => ({ ...f, titre: e.target.value }))}
                                className="mt-1 w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                              />
                            </label>
                            <label className="block">
                              <span className="text-slate-400 text-xs">Entreprise *</span>
                              <input
                                required
                                value={priveeForm.entreprise}
                                onChange={(e) => setPriveeForm((f) => ({ ...f, entreprise: e.target.value }))}
                                className="mt-1 w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                              />
                            </label>
                          </div>
                          <label className="block">
                            <span className="text-slate-400 text-xs">Description * (min. 20 caractères)</span>
                            <textarea
                              required
                              minLength={20}
                              rows={4}
                              value={priveeForm.description}
                              onChange={(e) => setPriveeForm((f) => ({ ...f, description: e.target.value }))}
                              className="mt-1 w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            />
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-slate-400 text-xs">Localisation *</span>
                              <input
                                required
                                value={priveeForm.localisation}
                                onChange={(e) => setPriveeForm((f) => ({ ...f, localisation: e.target.value }))}
                                className="mt-1 w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                              />
                            </label>
                            <label className="block">
                              <span className="text-slate-400 text-xs">Type de contrat *</span>
                              <select
                                value={priveeForm.typeContrat}
                                onChange={(e) => setPriveeForm((f) => ({ ...f, typeContrat: e.target.value }))}
                                className="mt-1 w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                              >
                                {CONTRACT_TYPES.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-slate-400 text-xs">Niveau d&apos;expérience</span>
                              <input
                                value={priveeForm.niveauExperience}
                                onChange={(e) => setPriveeForm((f) => ({ ...f, niveauExperience: e.target.value }))}
                                className="mt-1 w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                                placeholder="ex. Junior"
                              />
                            </label>
                            <label className="block">
                              <span className="text-slate-400 text-xs">Date d&apos;expiration *</span>
                              <input
                                type="datetime-local"
                                required
                                value={priveeForm.dateExpiration}
                                onChange={(e) => setPriveeForm((f) => ({ ...f, dateExpiration: e.target.value }))}
                                className="mt-1 w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                              />
                            </label>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-slate-400 text-xs">Salaire min (MAD)</span>
                              <input
                                type="number"
                                min={0}
                                step={100}
                                value={priveeForm.salaireMin}
                                onChange={(e) => setPriveeForm((f) => ({ ...f, salaireMin: e.target.value }))}
                                className="mt-1 w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                              />
                            </label>
                            <label className="block">
                              <span className="text-slate-400 text-xs">Salaire max (MAD)</span>
                              <input
                                type="number"
                                min={0}
                                step={100}
                                value={priveeForm.salaireMax}
                                onChange={(e) => setPriveeForm((f) => ({ ...f, salaireMax: e.target.value }))}
                                className="mt-1 w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                              />
                            </label>
                          </div>
                          <label className="block">
                            <span className="text-slate-400 text-xs">Compétences</span>
                            <textarea
                              rows={2}
                              value={priveeForm.competences}
                              onChange={(e) => setPriveeForm((f) => ({ ...f, competences: e.target.value }))}
                              className="mt-1 w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                              placeholder="Java, Spring…"
                            />
                          </label>
                          <button
                            type="submit"
                            disabled={priveeSubmitting}
                            className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg font-medium"
                          >
                            {priveeSubmitting ? 'Envoi…' : 'Envoyer l’offre privée'}
                          </button>
                        </form>
                      )}
                      <div className="space-y-3">
                        {detailOffresPrivees.length === 0 ? (
                          <p className="text-slate-500 text-sm text-center py-6">Aucune offre privée pour cet étudiant.</p>
                        ) : (
                          detailOffresPrivees.map((o) => (
                            <div
                              key={o.id}
                              className="bg-slate-800/60 border border-amber-500/20 rounded-lg p-4 space-y-2"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <p className="text-white font-medium">{o.titre}</p>
                                  <p className="text-slate-400 text-sm">
                                    {o.entreprise}
                                    {o.localisation ? ` · ${o.localisation}` : ''}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${
                                      o.active ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-600 text-slate-300'
                                    }`}
                                  >
                                    {o.active ? 'Active' : 'Inactive'}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${
                                      o.vue ? 'bg-slate-600 text-slate-300' : 'bg-amber-500/20 text-amber-200'
                                    }`}
                                  >
                                    {o.vue ? 'Vue' : 'Non lue'}
                                  </span>
                                </div>
                              </div>
                              {o.dateExpiration && (
                                <p className="text-slate-500 text-xs">
                                  Expire le {new Date(o.dateExpiration).toLocaleString('fr-FR')}
                                </p>
                              )}
                              {o.description && (
                                <p className="text-slate-400 text-sm line-clamp-4 whitespace-pre-wrap">{o.description}</p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;