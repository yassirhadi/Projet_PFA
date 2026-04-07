import { useState } from 'react';
import { Briefcase, Building2 } from 'lucide-react';
import { offreApi } from '../../api/offreApi';
import { toast } from 'react-toastify';

const inputCls =
  'w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500';

/**
 * Formulaire admin : offre publique (etudiant_id null côté API).
 * Champs alignés sur la table offre_emploi (salaires optionnels).
 */
const AdminOffreForm = ({ onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    titre: '',
    entreprise: '',
    description: '',
    localisation: '',
    typeContrat: '',
    niveauExperience: '',
    competences: '',
    dateExpiration: '',
    salaireMin: '',
    salaireMax: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titre.trim() || !form.entreprise.trim()) {
      toast.error('Titre et entreprise sont requis');
      return;
    }
    setSubmitting(true);
    try {
      const salaireMin = form.salaireMin.trim() === '' ? undefined : Number(form.salaireMin);
      const salaireMax = form.salaireMax.trim() === '' ? undefined : Number(form.salaireMax);
      if (form.salaireMin.trim() !== '' && Number.isNaN(salaireMin)) {
        toast.error('Salaire min invalide');
        setSubmitting(false);
        return;
      }
      if (form.salaireMax.trim() !== '' && Number.isNaN(salaireMax)) {
        toast.error('Salaire max invalide');
        setSubmitting(false);
        return;
      }

      let dateExpiration = undefined;
      if (form.dateExpiration) {
        const d = form.dateExpiration.length === 16 ? `${form.dateExpiration}:00` : form.dateExpiration;
        dateExpiration = new Date(d).toISOString();
      }

      const payload = {
        titre: form.titre.trim(),
        entreprise: form.entreprise.trim(),
        description: form.description.trim() || undefined,
        localisation: form.localisation.trim() || undefined,
        typeContrat: form.typeContrat.trim() || undefined,
        niveauExperience: form.niveauExperience.trim() || undefined,
        competences: form.competences.trim() || undefined,
        dateExpiration,
        salaireMin,
        salaireMax,
      };

      const created = await offreApi.createOffre(payload);
      toast.success('Offre publiée');
      setForm({
        titre: '',
        entreprise: '',
        description: '',
        localisation: '',
        typeContrat: '',
        niveauExperience: '',
        competences: '',
        dateExpiration: '',
        salaireMin: '',
        salaireMax: '',
      });
      onSuccess?.(created);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erreur lors de la publication");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/80 border border-amber-500/30 rounded-xl p-6 space-y-4">
      <h3 className="text-white font-semibold text-lg flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-amber-400" />
        Publier une offre d&apos;emploi
      </h3>
      <p className="text-slate-400 text-sm">
        Visible par tous les étudiants (offre publique). Les salaires sont facultatifs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-slate-400 text-xs mb-1">Titre du poste *</label>
          <input name="titre" value={form.titre} onChange={handleChange} className={inputCls} required />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" /> Entreprise *
          </label>
          <input name="entreprise" value={form.entreprise} onChange={handleChange} className={inputCls} required />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Localisation</label>
          <input name="localisation" value={form.localisation} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Type de contrat</label>
          <input name="typeContrat" value={form.typeContrat} onChange={handleChange} className={inputCls} placeholder="CDI, CDD, Stage..." />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Niveau d&apos;expérience</label>
          <input name="niveauExperience" value={form.niveauExperience} onChange={handleChange} className={inputCls} placeholder="Junior, Confirmé..." />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Salaire min (optionnel)</label>
          <input name="salaireMin" type="number" min="0" step="0.01" value={form.salaireMin} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Salaire max (optionnel)</label>
          <input name="salaireMax" type="number" min="0" step="0.01" value={form.salaireMax} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Date d&apos;expiration</label>
          <input name="dateExpiration" type="datetime-local" value={form.dateExpiration} onChange={handleChange} className={inputCls} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-slate-400 text-xs mb-1">Compétences (texte ou liste séparée par virgules)</label>
          <input name="competences" value={form.competences} onChange={handleChange} className={inputCls} placeholder="Java, Spring, SQL..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-slate-400 text-xs mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={inputCls} />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm"
      >
        {submitting ? 'Publication...' : "Publier l'offre"}
      </button>
    </form>
  );
};

export default AdminOffreForm;
