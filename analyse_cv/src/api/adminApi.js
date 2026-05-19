import axiosInstance from './axiosConfig';

export const adminApi = {
  /** GET /offres-privees/admin/stats */
  getStatistiques: async () => {
    const response = await axiosInstance.get('/offres-privees/admin/stats');
    return response.data;
  },

  /** GET /users */
  getUtilisateurs: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  /** GET /users/:id */
  getUtilisateur: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  /** DELETE /users/:id */
  supprimerUtilisateur: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },

  /** GET /cv/etudiant/:id */
  getCVsByEtudiant: async (id) => {
    const response = await axiosInstance.get(`/cv/etudiant/${id}`);
    return response.data;
  },

  /** GET /jobs/etudiant/:id */
  getOffresByEtudiant: async (id) => {
    const response = await axiosInstance.get(`/jobs/etudiant/${id}`);
    return response.data;
  },

  /** GET /offres-privees/admin/destinataire/:id */
  getOffresPriveesForDestinataire: async (etudiantId) => {
    const response = await axiosInstance.get(`/offres-privees/admin/destinataire/${etudiantId}`);
    const data = response.data;
    return Array.isArray(data) ? data : [];
  },

  /** POST /offres-privees?destinataireId= */
  createOffrePrivee: async (destinataireId, body) => {
    const response = await axiosInstance.post(
      `/offres-privees?destinataireId=${encodeURIComponent(destinataireId)}`,
      body
    );
    return response.data;
  },

  /** GET /cv/:id/download → object URL */
  fetchCvObjectUrl: async (cvId) => {
    const parseBlobError = async (blob) => {
      const text = await blob.text();
      try {
        const j = JSON.parse(text);
        return j.message || j.error || j.detail ||
          (Array.isArray(j.errors) ? j.errors.map((e) => e?.defaultMessage || e).join(', ') : null) ||
          text.slice(0, 200);
      } catch {
        return text?.slice(0, 200) || 'Erreur serveur';
      }
    };
    try {
      const response = await axiosInstance.get(`/cv-binaire/${cvId}`, { responseType: 'blob' });
      const raw = response.data;
      const headerCt = response.headers['content-type'];
      const mime = (headerCt && headerCt.split(';')[0].trim()) || (raw && raw.type) || 'application/pdf';
      const looksJson = typeof mime === 'string' && mime.includes('application/json');
      if (looksJson) {
        const msg = await parseBlobError(raw instanceof Blob ? raw : new Blob([raw]));
        throw Object.assign(new Error(msg), { code: 'API_ERROR' });
      }
      const blob = raw instanceof Blob && raw.type === mime ? raw : new Blob([raw], { type: mime });
      return URL.createObjectURL(blob);
    } catch (error) {
      const data = error.response?.data;
      if (data instanceof Blob) { const msg = await parseBlobError(data); throw new Error(msg); }
      if (error.response?.data?.message) throw new Error(error.response.data.message);
      throw error;
    }
  },

  /** GET /offres-privees/admin/all */
  getOffresPriveesAdminAll: async (page = 0, size = 200) => {
    const response = await axiosInstance.get('/offres-privees/admin/all', { params: { page, size } });
    const data = response.data;
    if (data && Array.isArray(data.content)) return data;
    return { content: [], totalElements: 0, page: 0, size, totalPages: 0 };
  },

  /** DELETE /offres-privees/:id — admin uniquement (suppression définitive) */
  deleteOffrePrivee: async (id) => {
    await axiosInstance.delete(`/offres-privees/${id}`);
  },

  /**
   * ✅ CORRIGÉ : Récupère toutes les analyses d'un étudiant
   * Utilise l'endpoint existant GET /analyses/cv/{cvId} pour chaque CV
   * car /analyses/etudiant/:id n'existe pas dans AnalyseController.java
   */
  getAnalysesByEtudiant: async (etudiantId) => {
    try {
      // Étape 1 : récupérer tous les CVs de l'étudiant
      const cvsResponse = await axiosInstance.get(`/cv/etudiant/${etudiantId}`);
      const cvs = Array.isArray(cvsResponse.data)
        ? cvsResponse.data
        : cvsResponse.data?.content || [];

      if (cvs.length === 0) return [];

      // Étape 2 : pour chaque CV, récupérer ses analyses via GET /analyses/cv/{cvId}
      const analysesResults = await Promise.allSettled(
        cvs.map(cv => axiosInstance.get(`/analyses/cv/${cv.id}`))
      );

      // Étape 3 : aplatir toutes les analyses en un seul tableau
      const allAnalyses = [];
      analysesResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const data = result.value.data;
          const analyses = Array.isArray(data) ? data : data?.content || [];
          // Enrichir chaque analyse avec le nom du CV
          analyses.forEach(a => {
            allAnalyses.push({
              ...a,
              cvNom: cvs[index]?.nomFichier || a.cvNom || `CV ${index + 1}`,
            });
          });
        }
      });

      return allAnalyses;
    } catch (error) {
      console.error('Erreur getAnalysesByEtudiant:', error);
      return [];
    }
  },

  /** DELETE /analyses/offre/:id */
  deleteAnalysesByOffre: async (offreId) => {
    try {
      await axiosInstance.delete(`/analyses/offre/${offreId}`);
    } catch (error) {
      console.warn(`Erreur suppression analyses offre ${offreId}:`, error);
    }
  },

  /** DELETE /jobs/:id */
  deleteOffre: async (id) => {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
    } catch (error) {
      console.warn(`Erreur suppression offre ${id}:`, error);
    }
  },

  /** DELETE /cv/:id */
  deleteCv: async (id) => {
    try {
      await axiosInstance.delete(`/cv/${id}`);
    } catch (error) {
      console.warn(`Erreur suppression CV ${id}:`, error);
    }
  },

  getRapportJournalier: async () => null,
};
