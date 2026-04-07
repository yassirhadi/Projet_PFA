// Correspond aux cas d'utilisation : Analyser CV, Voir score, Adapter CV, Consulter recommandations
import { useEffect, useState } from 'react';
import { useCV }          from '../hooks/useCV';
import { useAnalyse }     from '../hooks/useAnalyse';
import { useCVStore, useAnalyseStore } from '../store/useStore';
import AnalyseResult      from '../components/analyse/AnalyseResult';
import RecommandationList from '../components/analyse/RecommandationList';
import LoadingSpinner     from '../components/common/LoadingSpinner';
import { Zap, RefreshCw } from 'lucide-react';

const AnalysePage = () => {
  const { fetchCVs }        = useCV();
  const { lancerAnalyse, loading } = useAnalyse();
  const cvList              = useCVStore((s) => s.cvList);
  const { currentAnalyse, recommandations } = useAnalyseStore();
  const [selectedCvId, setSelectedCvId] = useState('');

  useEffect(() => { fetchCVs(); }, [fetchCVs]);

  // Pré-sélectionner le premier CV disponible
  useEffect(() => {
    if (cvList.length && !selectedCvId) setSelectedCvId(cvList[0].id);
  }, [cvList, selectedCvId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">Analyse IA de mon CV</h1>

      {/* Sélection CV + bouton lancer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <label className="block text-slate-400 text-sm mb-2">
          Sélectionnez un CV à analyser
        </label>
        {cvList.length === 0 ? (
          <p className="text-slate-500 italic text-sm">
            Aucun CV disponible — <a href="/cv" className="text-teal-400 hover:underline">téléchargez-en un</a>
          </p>
        ) : (
          <div className="flex gap-3">
            <select
              value={selectedCvId}
              onChange={(e) => setSelectedCvId(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5
                           focus:outline-none focus:border-teal-500 text-sm"
            >
              {cvList.map((cv) => (
                <option key={cv.id} value={cv.id}>
                  {cv.nomFichier} {cv.scoreGeneral ? `(score: ${cv.scoreGeneral})` : ''}
                </option>
              ))}
            </select>
            <button
              onClick={() => lancerAnalyse(selectedCvId)}
              disabled={loading || !selectedCvId}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500
                           disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {loading
                ? <><RefreshCw size={15} className="animate-spin" /> Analyse...</>
                : <><Zap size={15} /> Lancer l'analyse</>}
            </button>
          </div>
        )}
      </div>

      {/* Loader plein écran pendant l'analyse */}
      {loading && (
        <LoadingSpinner
          fullPage
          message="L'IA analyse votre CV, veuillez patienter..."
          size="lg"
        />
      )}

      {/* Résultat de l'analyse */}
      {currentAnalyse && !loading && (
        <div className="space-y-6">
          <AnalyseResult analyse={currentAnalyse} />
          <RecommandationList recommandations={recommandations} />
        </div>
      )}

      {/* Placeholder si pas encore d'analyse */}
      {!currentAnalyse && !loading && (
        <div className="text-center py-16 text-slate-600">
          <Zap size={48} className="mx-auto mb-4 opacity-30" />
          <p>Sélectionnez un CV et lancez l'analyse pour voir les résultats.</p>
        </div>
      )}
    </div>
  );
};

export default AnalysePage;