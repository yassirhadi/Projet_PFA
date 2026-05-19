import { useState, useCallback } from 'react';
import { cvApi } from '../api/cvApi';
import { useCVStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const useCV = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { setCVList, addCV, removeCV } = useCVStore();

  // ✅ Validation du fichier avant upload
  const validateFile = useCallback((file) => {
    if (!file) {
      toast.error('Aucun fichier sélectionné');
      return false;
    }

    // Vérifier le type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    const validExtensions = ['.pdf', '.docx', '.doc'];
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    const typeValid = validTypes.includes(fileType) || 
                      validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!typeValid) {
      toast.error('Format non supporté. Utilisez PDF ou Word (.pdf, .docx)');
      return false;
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Fichier trop volumineux. Maximum 5MB.');
      return false;
    }

    return true;
  }, []);

  const fetchCVs = useCallback(async () => {
    const etudiantId = user?.userId;
    if (etudiantId == null) {
      setCVList([]);
      return;
    }
    setLoading(true);
    try {
      const data = await cvApi.getCVsByEtudiant(etudiantId);
      setCVList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur fetchCVs:', err);
      toast.error('Erreur lors du chargement des CVs');
    } finally {
      setLoading(false);
    }
  }, [setCVList, user?.userId]);

  const uploadCV = useCallback(async (file) => {
    // 🔒 Validation côté frontend avant d'envoyer au backend
    if (!validateFile(file)) {
      return null;
    }

    const etudiantId = user?.userId;
    if (etudiantId == null) {
      toast.error('Session invalide. Reconnectez-vous.');
      return null;
    }

    const fd = new FormData();
    fd.append('file', file);
    fd.append('etudiantId', etudiantId); // Spring convertit automatiquement String → Long

    setLoading(true);
    try {
      const created = await cvApi.uploadCV(fd);
      addCV(created);
      toast.success('CV téléchargé avec succès');
      return created;
    } catch (err) {
      console.error('Erreur uploadCV:', err);
      
      // 🎯 Extraction robuste du message d'erreur
      let msg = 'Erreur upload CV';
      if (err?.response) {
        // Erreur HTTP (4xx, 5xx)
        const data = err.response.data;
        msg = data?.message || data?.error || data?.msg || err.response.statusText;
      } else if (err?.request) {
        // Requête partie mais pas de réponse (CORS, serveur down)
        msg = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      } else if (err?.message) {
        // Erreur JavaScript
        msg = err.message;
      }
      
      toast.error(typeof msg === 'string' ? msg : 'Erreur upload CV', {
        toastId: 'cv-upload-error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [addCV, user?.userId, validateFile]);

  const deleteCV = useCallback(async (id) => {
    setLoading(true);
    try {
      await cvApi.deleteCV(id);
      removeCV(id);
      toast.success('CV supprimé');
    } catch (err) {
      console.error('Erreur deleteCV:', err);
      toast.error('Erreur lors de la suppression du CV');
    } finally {
      setLoading(false);
    }
  }, [removeCV]);

  const exportCV = useCallback(async (id, format) => {
    setLoading(true);
    try {
      const { data } = await cvApi.exportCV(id, format);
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url; 
      a.download = `cv_optimise.${format.toLowerCase()}`;
      a.click(); 
      URL.revokeObjectURL(url);
      toast.success('Export réussi');
    } catch (err) {
      console.error('Erreur exportCV:', err);
      toast.error('Erreur lors de l\'export du CV');
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, fetchCVs, uploadCV, deleteCV, exportCV };
};