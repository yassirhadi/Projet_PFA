import { useEffect, useMemo, useState, useCallback } from 'react';
import { Briefcase, Trash2, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { offreApi } from '../api/offreApi';
import { adminApi } from '../api/adminApi';
import AdminOffreForm from '../components/admin/AdminOffreForm';

const AdminOffresPage = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offresPrivees, setOffresPrivees] = useState([]);
  const [loadingPrivees, setLoadingPrivees] = useState(true);

  const loadOffres = async () => {
    setLoading(true);
    try {
      const raw = await offreApi.getOffres();
      const list = Array.isArray(raw) ? raw : [];
      // Admin: GET /jobs/active retourne toutes les offres actives (publiques + étudiants)
      setOffres(list.filter((o) => o.active !== false));
    } catch (e) {
      console.error('Erreur chargement offres admin:', e);
      toast.error('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const loadOffresPrivees = useCallback(async () => {
    setLoadingPrivees(true);
    try {
      const page = await adminApi.getOffresPriveesAdminAll(0, 500);
      setOffresPrivees(Array.isArray(page.content) ? page.content : []);
    } catch (e) {
      console.error('Erreur chargement offres privées:', e);
      toast.error('Erreur lors du chargement des offres privées');
      setOffresPrivees([]);
    } finally {
      setLoadingPrivees(false);
    }
  }, []);

  useEffect(() => {
    loadOffres();
  }, []);

  useEffect(() => {
    loadOffresPrivees();
  }, [loadOffresPrivees]);

  const { offresPubliques, offresEtudiants } = useMemo(() => {
    const publiques = offres.filter((o) => o.etudiantId == null || o.etudiantId === undefined);
    const etudiants = offres.filter((o) => o.etudiantId != null && o.etudiantId !== undefined);
    return { offresPubliques: publiques, offresEtudiants: etudiants };
  }, [offres]);

  const destinataireLabel = (o) => {
    const parts = [o.destinatairePrenom, o.destinataireNom].filter(Boolean);
    const name = parts.length ? parts.join(' ') : null;
    if (name && o.destinataireEmail) return `${name} (${o.destinataireEmail})`;
    if (name) return name;
    if (o.destinataireEmail) return o.destinataireEmail;
    if (o.destinataireId != null) return `Étudiant #${o.destinataireId}`;
    return 'Destinataire inconnu';
  };

  const handleDeleteOffrePrivee = async (id) => {
    const idNum = Number(id);
    if (id == null || Number.isNaN(idNum)) return;
    if (!window.confirm('Supprimer définitivement cette offre privée ?')) return;
    try {
      await adminApi.deleteOffrePrivee(idNum);
      setOffresPrivees((prev) => prev.filter((o) => Number(o.id) !== idNum));
      toast.success('Offre privée supprimée');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Suppression impossible');
    }
  };

  const handleDeleteOffre = async (offreId) => {
    const idNum = Number(offreId);
    if (offreId == null || Number.isNaN(idNum)) {
      toast.error('Identifiant de l\'offre invalide. Rechargez la page.');
      return;
    }
    if (!window.confirm('Supprimer définitivement cette offre ?')) return;
    try {
      await offreApi.deleteOffre(idNum);
      setOffres((prev) => prev.filter((o) => Number(o.id) !== idNum));
      toast.success('Offre supprimée');
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        (e?.response?.status === 403 ? 'Accès refusé (rôle administrateur requis)' : null);
      toast.error(msg || "Impossible de supprimer l'offre");
    }
  };

  const renderOffreRow = (o) => (
    <div
      key={o.id}
      className="flex flex-col gap-3 bg-slate-900/50 border border-slate-700 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 flex-1">
        <p className="text-white font-medium">{o.titre}</p>
        <p className="text-slate-400 text-sm">
          {o.entreprise}
          {o.localisation ? ` · ${o.localisation}` : ''}
        </p>
        {o.etudiantNom && (
          <p className="text-slate-500 text-xs mt-1">Étudiant : {o.etudiantNom}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => handleDeleteOffre(o.id)}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        Supprimer
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Gestion des offres</h1>
        <p className="text-slate-400">
          Publiez des offres publiques, consultez les offres saisies par les étudiants et les offres privées
          envoyées depuis le tableau de bord admin.
        </p>
      </div>

      <AdminOffreForm onSuccess={() => loadOffres()} />

      <div className="bg-slate-800 rounded-xl border border-amber-500/25 overflow-x-auto">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-amber-300" />
            Offres privées (envoyées aux étudiants)
            <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-200">
              {offresPrivees.length}
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Table <code className="text-slate-500 text-xs">offre_privee</code> — visibles uniquement par le destinataire
            et les administrateurs.
          </p>
        </div>
        <div className="p-4 space-y-3">
          {loadingPrivees ? (
            <p className="text-slate-400 text-sm text-center py-6">Chargement...</p>
          ) : offresPrivees.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">Aucune offre privée enregistrée.</p>
          ) : (
            offresPrivees.map((o) => (
              <div
                key={o.id}
                className="flex flex-col gap-3 bg-slate-900/50 border border-amber-500/15 rounded-lg p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-white font-medium">{o.titre}</p>
                  <p className="text-slate-400 text-sm">
                    {o.entreprise}
                    {o.localisation ? ` · ${o.localisation}` : ''}
                  </p>
                  <p className="text-amber-200/90 text-sm font-medium">
                    Destinataire : {destinataireLabel(o)}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
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
                      {o.vue ? 'Lue' : 'Non lue'}
                    </span>
                    {o.dateExpiration && (
                      <span className="text-slate-500 text-xs">
                        Expire : {new Date(o.dateExpiration).toLocaleString('fr-FR')}
                      </span>
                    )}
                  </div>
                  {o.description && (
                    <p className="text-slate-500 text-xs line-clamp-2 mt-2">{o.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteOffrePrivee(o.id)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Supprimer
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-400" />
            Offres publiques (administration)
            <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300">
              {offresPubliques.length}
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">Visibles par tous les étudiants sur la page Offres</p>
        </div>
        <div className="p-4 space-y-3">
          {loading ? (
            <p className="text-slate-400 text-sm text-center py-6">Chargement...</p>
          ) : offresPubliques.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">Aucune offre publique pour le moment.</p>
          ) : (
            offresPubliques.map(renderOffreRow)
          )}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-teal-400" />
            Offres saisies par les étudiants
            <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-teal-500/20 text-teal-300">
              {offresEtudiants.length}
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Seul un administrateur peut les supprimer ou les modifier côté API.
          </p>
        </div>
        <div className="p-4 space-y-3">
          {loading ? (
            <p className="text-slate-400 text-sm text-center py-6">Chargement...</p>
          ) : offresEtudiants.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">Aucune offre étudiant pour le moment.</p>
          ) : (
            offresEtudiants.map(renderOffreRow)
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOffresPage;
