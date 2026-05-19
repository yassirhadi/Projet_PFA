/**
 * AnalysePage.jsx
 *
 * Page d'analyse IA — flux complet :
 *   1. L'utilisateur sélectionne un CV et une offre d'emploi
 *   2. Clic "Lancer l'analyse" → POST /api/analyses { cvId, offreEmploiId }
 *   3. Spring Boot appelle Python FastAPI et retourne les résultats
 *   4. Affichage du score, compétences, recommandations
 */

import { useEffect, useState } from 'react';
import { useCV }       from '../hooks/useCV';
import { useAnalyse }  from '../hooks/useAnalyse';
import { useCVStore, useAnalyseStore } from '../store/useStore';
import AnalyseResult      from '../components/analyse/AnalyseResult';
import RecommandationList from '../components/analyse/RecommandationList';
import LoadingSpinner     from '../components/common/LoadingSpinner';
import { offreApi }    from '../api/offreApi';
import { Zap, RefreshCw, AlertCircle } from 'lucide-react';

const AnalysePage = () => {
  const { fetchCVs }   = useCV();
  const { lancerAnalyse, loading, error } = useAnalyse();

  const cvList = useCVStore((s) => s.cvList);
  const { currentAnalyse, recommandations } = useAnalyseStore();

  const [selectedCvId,    setSelectedCvId]    = useState('');
  const [selectedOffreId, setSelectedOffreId] = useState('');
  const [offres,          setOffres]          = useState([]);
  const [loadingOffres,   setLoadingOffres]   = useState(false);

  // ── Chargement initial ───────────────────────────────────────────────────
  useEffect(() => { fetchCVs(); }, [fetchCVs]);

  useEffect(() => {
    const loadOffres = async () => {
      setLoadingOffres(true);
      try {
        const data = await offreApi.getAllOffres();
        setOffres(Array.isArray(data) ? data : data.content || []);
      } catch {
        setOffres([]);
      } finally {
        setLoadingOffres(false);
      }
    };
    loadOffres();
  }, []);

  // Pré-sélection automatique
  useEffect(() => {
    if (cvList.length && !selectedCvId)    setSelectedCvId(cvList[0].id);
  }, [cvList, selectedCvId]);

  useEffect(() => {
    if (offres.length && !selectedOffreId) setSelectedOffreId(offres[0].id);
  }, [offres, selectedOffreId]);

  // ── Handler ──────────────────────────────────────────────────────────────
  const handleLancer = () => lancerAnalyse(selectedCvId, selectedOffreId);

  const canLancer = selectedCvId && selectedOffreId && !loading;

  // ── Rendu ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">Analyse IA de mon CV</h1>

      {/* ── Sélection CV + Offre ─────────────────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">

        {/* CV */}
        <div>
          <label className="block text-slate-400 text-sm mb-1">
            CV à analyser
          </label>
          {cvList.length === 0 ? (
            <p className="text-slate-500 italic text-sm">
              Aucun CV disponible —{' '}
              <a href="/cv" className="text-teal-400 hover:underline">
                téléchargez-en un
              </a>
            </p>
          ) : (
            <select
              value={selectedCvId}
              onChange={(e) => setSelectedCvId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg
                         px-4 py-2.5 focus:outline-none focus:border-teal-500 text-sm"
            >
              {cvList.map((cv) => (
                <option key={cv.id} value={cv.id}>
                  {cv.nomFichier}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Offre d'emploi */}
        <div>
          <label className="block text-slate-400 text-sm mb-1">
            Offre d'emploi cible
          </label>
          {loadingOffres ? (
            <p className="text-slate-500 italic text-sm">Chargement des offres…</p>
          ) : offres.length === 0 ? (
            <p className="text-slate-500 italic text-sm">
              Aucune offre disponible —{' '}
              <a href="/offres" className="text-teal-400 hover:underline">
                consultez les offres
              </a>
            </p>
          ) : (
            <select
              value={selectedOffreId}
              onChange={(e) => setSelectedOffreId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg
                         px-4 py-2.5 focus:outline-none focus:border-teal-500 text-sm"
            >
              {offres.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.titre} — {o.entreprise}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Bouton */}
        <button
          onClick={handleLancer}
          disabled={!canLancer}
          className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-500
                     disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg
                     transition-colors font-medium text-sm"
        >
          {loading
            ? <><RefreshCw size={15} className="animate-spin" /> Analyse en cours…</>
            : <><Zap size={15} /> Lancer l'analyse</>}
        </button>

        {/* Erreur */}
        {error && (
          <div className="flex items-start gap-2 text-red-400 bg-red-900/20 rounded-lg p-3 text-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* ── Loader ───────────────────────────────────────────────────────── */}
      {loading && (
        <LoadingSpinner
          fullPage
          message="L'IA analyse votre CV, veuillez patienter…"
          size="lg"
        />
      )}

      {/* ── Résultats ────────────────────────────────────────────────────── */}
      {currentAnalyse && !loading && (
        <div className="space-y-6">
          <AnalyseResult analyse={currentAnalyse} />
          <RecommandationList recommandations={recommandations} />
        </div>
      )}

      {/* ── Placeholder vide ─────────────────────────────────────────────── */}
      {!currentAnalyse && !loading && (
        <div className="text-center py-20 text-slate-600">
          <Zap size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">
            Sélectionnez un CV et une offre, puis lancez l'analyse.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysePage;
