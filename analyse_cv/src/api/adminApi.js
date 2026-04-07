import axiosInstance from './axiosConfig'; // ✅ Utilise axiosInstance (comme cvApi.js)

export const adminApi = {
  /** GET /offres-privees/admin/stats (fallback-friendly) */
  getStatistiques: async () => {
    const response = await axiosInstance.get('/offres-privees/admin/stats');
    return response.data;
  },

  /** GET /users */
  getUtilisateurs: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  /** GET /users/:id — profil détaillé (admin / JWT) */
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

  /** GET /jobs/etudiant/:id (ADMIN uniquement) */
  getOffresByEtudiant: async (id) => {
    const response = await axiosInstance.get(`/jobs/etudiant/${id}`);
    return response.data;
  },

  /** GET /offres-privees/admin/destinataire/:id — toutes les offres privées envoyées à cet étudiant */
  getOffresPriveesForDestinataire: async (etudiantId) => {
    const response = await axiosInstance.get(`/offres-privees/admin/destinataire/${etudiantId}`);
    const data = response.data;
    return Array.isArray(data) ? data : [];
  },

  /** POST /offres-privees?destinataireId= — création par admin */
  createOffrePrivee: async (destinataireId, body) => {
    const response = await axiosInstance.post(
      `/offres-privees?destinataireId=${encodeURIComponent(destinataireId)}`,
      body
    );
    return response.data;
  },

  /**
   * GET /cv/:id/download — retourne une object URL pour affichage dans un onglet.
   * (Ne pas utiliser window.open(url, …, 'noopener') : souvent null → échec silencieux.)
   */
  fetchCvObjectUrl: async (cvId) => {
    const parseBlobError = async (blob) => {
      const text = await blob.text();
      try {
        const j = JSON.parse(text);
        return (
          j.message ||
          j.error ||
          j.detail ||
          (Array.isArray(j.errors) ? j.errors.map((e) => e?.defaultMessage || e).join(', ') : null) ||
          text.slice(0, 200)
        );
      } catch {
        return text?.slice(0, 200) || 'Erreur serveur';
      }
    };

    try {
      const response = await axiosInstance.get(`/cv-binaire/${cvId}`, {
        responseType: 'blob',
      });
      const raw = response.data;
      const headerCt = response.headers['content-type'];
      const mime =
        (headerCt && headerCt.split(';')[0].trim()) || (raw && raw.type) || 'application/pdf';

      const looksJson = typeof mime === 'string' && mime.includes('application/json');
      if (looksJson) {
        const msg = await parseBlobError(raw instanceof Blob ? raw : new Blob([raw]));
        throw Object.assign(new Error(msg), { code: 'API_ERROR' });
      }

      const blob =
        raw instanceof Blob && raw.type === mime ? raw : new Blob([raw], { type: mime });
      return URL.createObjectURL(blob);
    } catch (error) {
      const data = error.response?.data;
      if (data instanceof Blob) {
        const msg = await parseBlobError(data);
        throw new Error(msg);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  /** GET /offres-privees/admin/all — toutes les offres privées (paginé) */
  getOffresPriveesAdminAll: async (page = 0, size = 200) => {
    const response = await axiosInstance.get('/offres-privees/admin/all', {
      params: { page, size },
    });
    const data = response.data;
    if (data && Array.isArray(data.content)) return data;
    return { content: [], totalElements: 0, page: 0, size, totalPages: 0 };
  },

  /** DELETE /offres-privees/:id — admin */
  deleteOffrePrivee: async (id) => {
    await axiosInstance.delete(`/offres-privees/${id}`);
  },

  /** Endpoint non implémenté côté backend actuel */
  getRapportJournalier: async () => {
    return null;
  },
};