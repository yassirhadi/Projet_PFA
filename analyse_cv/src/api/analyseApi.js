/**
 * analyseApi.js
 *
 * Couche API React ↔ Spring Boot pour les analyses IA.
 *
 * Flux complet :
 *   1. L'utilisateur sélectionne un CV + une offre sur AnalysePage
 *   2. lancerAnalyse(cvId, offreId)  → POST /api/analyses
 *   3. Spring Boot appelle Python FastAPI (port 8000)
 *   4. Spring Boot retourne { id, score, skillsFound, ... }
 *   5. React affiche les résultats dans AnalyseResult.jsx
 */

import axiosInstance from './axiosConfig';

const analyseApi = {

  /**
   * Lancer une nouvelle analyse IA.
   *
   * POST /api/analyses
   * Body : { cvId, offreEmploiId }
   *
   * @param {number} cvId
   * @param {number} offreEmploiId
   * @returns {Promise<AnalyseResponse>}
   */
  lancerAnalyse: async (cvId, offreEmploiId) => {
    const response = await axiosInstance.post('/analyses', {
      cvId,
      offreEmploiId,
    });
    return response.data;
  },

  /**
   * Récupérer toutes les analyses d'un CV.
   *
   * GET /api/analyses/cv/{cvId}
   *
   * @param {number} cvId
   * @returns {Promise<AnalyseResponse[]>}
   */
  getAnalysesByCV: async (cvId) => {
    const response = await axiosInstance.get(`/analyses/cv/${cvId}`);
    return response.data;
  },

  /**
   * Récupérer une analyse par ID.
   *
   * GET /api/analyses/{id}
   *
   * @param {number} analyseId
   * @returns {Promise<AnalyseResponse>}
   */
  getAnalyseById: async (analyseId) => {
    const response = await axiosInstance.get(`/analyses/${analyseId}`);
    console.log("Données reçues pour le Dashboard:", response.data); // <--- Ligne ajoutée pour le débogage
    return response.data;
  },

  /**
   * Récupérer les recommandations d'une analyse.
   * (Incluses dans AnalyseResponse.recommandations, mais endpoint dédié possible)
   *
   * GET /api/analyses/{analyseId}/recommandations
   *
   * @param {number} analyseId
   * @returns {Promise<RecommandationResponse[]>}
   */
  getRecommandations: async (analyseId) => {
    const response = await axiosInstance.get(`/analyses/${analyseId}/recommandations`);
    return response.data;
  },


  lancerAnalysePrivee: async (cvId, offrePriveeId) => {
  const response = await axiosInstance.post('/analyses/privee', {
    cvId,
    offrePriveeId,
  });
  return response.data;
},

};

export default analyseApi;