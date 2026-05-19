
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import analyseApi from '../api/analyseApi';
import { useAnalyseStore } from '../store/useStore';
import { toast } from 'react-toastify';

export const useAnalyse = () => {
const [loading, setLoading] = useState(false);
const [error, setError]     = useState(null);
const { setAnalyse, setRecommandations } = useAnalyseStore();
const navigate = useNavigate();

/**
Lancer une analyse IA complète (OFFRES PUBLIQUES).
@param {number} cvId            - ID du CV à analyser
@param {number} offreEmploiId   - ID de l'offre d'emploi cible
@returns {Promise<object|null>} - AnalyseResponse ou null en cas d'erreur
*/
const lancerAnalyse = useCallback(async (cvId, offreEmploiId) => {
if (!cvId || !offreEmploiId) {
toast.warning("Veuillez sélectionner un CV et une offre d'emploi.");
return null;
}
setLoading(true);
setError(null);

try {
  const analyseResult = await analyseApi.lancerAnalyse(cvId, offreEmploiId);
  setAnalyse(analyseResult);
  setRecommandations(analyseResult.recommandations || []);
  toast.success('Analyse IA terminée avec succès !');
  return analyseResult;

} catch (err) {
  const message = err?.response?.data?.message
    || err?.response?.data?.detail
    || "Erreur lors de l'analyse IA.";
  setError(message);
  toast.error(message);
  return null;

} finally {
  setLoading(false);
}
}, [setAnalyse, setRecommandations]);

/**
Adapter le CV pour une offre PUBLIQUE donnée.
Identique à lancerAnalyse mais redirige vers /analyse après succès.
@param {number} cvId          - ID du CV sélectionné
@param {number} offreEmploiId - ID de l'offre cible
*/
const adapterPourOffre = useCallback(async (cvId, offreEmploiId) => {
if (!cvId || !offreEmploiId) {
toast.warning("Veuillez sélectionner un CV.");
return null;
}
setLoading(true);
setError(null);

try {
  const analyseResult = await analyseApi.lancerAnalyse(cvId, offreEmploiId);
  setAnalyse(analyseResult);
  setRecommandations(analyseResult.recommandations || []);
  toast.success('Analyse IA terminée ! Consultez vos résultats.');
  // Rediriger vers la page d'analyse pour afficher les résultats
  navigate('/analyse');
  return analyseResult;

} catch (err) {
  const message = err?.response?.data?.message
    || err?.response?.data?.detail
    || "Erreur lors de l'adaptation IA.";
  setError(message);
  toast.error(message);
  return null;

} finally {
  setLoading(false);
}
}, [setAnalyse, setRecommandations, navigate]);

/**
 NOUVELLE FONCTION : Adapter le CV pour une offre PRIVÉE donnée.
@param {number} cvId            - ID du CV sélectionné
@param {number} offrePriveeId   - ID de l'offre privée cible
*/
const adapterPourOffrePrivee = useCallback(async (cvId, offrePriveeId) => {
if (!cvId || !offrePriveeId) {
toast.warning("Veuillez sélectionner un CV.");
return null;
}
setLoading(true);
setError(null);

try {
  //  Appel au BON endpoint pour les offres privées
  const analyseResult = await analyseApi.lancerAnalysePrivee(cvId, offrePriveeId);
  setAnalyse(analyseResult);
  setRecommandations(analyseResult.recommandations || []);
  toast.success('Analyse IA terminée ! Consultez vos résultats.');
  // Rediriger vers la page d'analyse pour afficher les résultats
  navigate('/analyse');
  return analyseResult;

} catch (err) {
  const message = err?.response?.data?.message
    || err?.response?.data?.detail
    || "Erreur lors de l'adaptation IA.";
  setError(message);
  toast.error(message);
  return null;

} finally {
  setLoading(false);
}
}, [setAnalyse, setRecommandations, navigate]);

/**
Charger une analyse existante par ID.
*/
const chargerAnalyse = useCallback(async (analyseId) => {
setLoading(true);
try {
const analyseResult = await analyseApi.getAnalyseById(analyseId);
setAnalyse(analyseResult);
setRecommandations(analyseResult.recommandations || []);
return analyseResult;
} catch {
toast.error("Impossible de charger l'analyse.");
return null;
} finally {
setLoading(false);
}
}, [setAnalyse, setRecommandations]);

/**
Charger toutes les analyses d'un CV.
*/
const chargerAnalysesByCv = useCallback(async (cvId) => {
try {
return await analyseApi.getAnalysesByCV(cvId);
} catch {
return [];
}
}, []);

return {
loading,
error,
lancerAnalyse,
adapterPourOffre,
adapterPourOffrePrivee,  
chargerAnalyse,
chargerAnalysesByCv,
};
};