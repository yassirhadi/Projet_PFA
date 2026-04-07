import { useState } from 'react';
import { offreApi } from '../../api/offreApi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const OffreForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    titre: '',
    entreprise: '',
    description: '',
    localisation: '',
    typeContrat: '',
    niveauExperience: '',
    competences: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = {
      titre: form.titre,
      localisation: form.localisation,
      entreprise: form.entreprise,
      competences: form.competences,
      typeContrat: form.typeContrat,
      description: form.description,
    };

    const missing = Object.entries(requiredFields)
      .filter(([_, value]) => !String(value || '').trim())
      .map(([key]) => key);

    if (missing.length > 0) {
      toast.error(
        `Champs requis manquants: ${missing.join(', ')}`
      );
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        titre: form.titre.trim(),
        entreprise: form.entreprise.trim() || undefined,
        description: form.description.trim() || undefined,
        localisation: form.localisation.trim() || undefined,
        typeContrat: form.typeContrat.trim() || undefined,
        niveauExperience: form.niveauExperience.trim() || undefined,
        competences: form.competences.trim() || undefined,
        etudiantId: user?.userId ?? undefined,
      };
      const created = await offreApi.createOffre(payload);
      onSuccess?.(created);
    } catch {
      toast.error('Erreur lors de la création de l\'offre');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4 mb-6"
    >
      <h3 className="text-white font-semibold text-lg">Nouvelle offre cible</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-slate-400 text-xs mb-1">Titre du poste *</label>
          <input name="titre" value={form.titre} onChange={handleChange} className={inputCls} required />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Entreprise *</label>
          <input name="entreprise" value={form.entreprise} onChange={handleChange} className={inputCls} required />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Type de contrat *</label>
          <input
            name="typeContrat"
            value={form.typeContrat}
            onChange={handleChange}
            className={inputCls}
            placeholder="CDI, CDD, Stage..."
            required
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Localisation *</label>
          <input name="localisation" value={form.localisation} onChange={handleChange} className={inputCls} required />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Niveau d&apos;expérience</label>
          <input name="niveauExperience" value={form.niveauExperience} onChange={handleChange} className={inputCls} />
          
        </div>
        <div className="md:col-span-2">
          <label className="block text-slate-400 text-xs mb-1">Compétences * (séparées par des virgules)</label>
          <input
            name="competences"
            value={form.competences}
            onChange={handleChange}
            className={inputCls}
            placeholder="Java, Spring, React..."
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-slate-400 text-xs mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={inputCls}
            required
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm">
          Annuler
        </button>
        <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium">
          {submitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};

export default OffreForm;
