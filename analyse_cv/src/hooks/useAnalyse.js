import { useState, useCallback } from 'react';
import { analyseApi } from '../api/analyseApi';
import { cvApi } from '../api/cvApi';
import { useAnalyseStore } from '../store/useStore';
import { toast } from 'react-toastify';

export const useAnalyse = () => {
  const [loading, setLoading] = useState(false);
  const { setAnalyse, setRecommandations } = useAnalyseStore();

  const lancerAnalyse = useCallback(async (cvId) => {
    setLoading(true);
    try {
      const { data } = await cvApi.analyserCV(cvId);
      setAnalyse(data);
      const recs = await analyseApi.getRecommandations(data.id);
      setRecommandations(recs.data);
      toast.success('Analyse IA terminée !');
      return data;
    } catch {
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setLoading(false);
    }
  }, [setAnalyse, setRecommandations]);

  const adapterPourOffre = useCallback(async (cvId, offreId) => {
    setLoading(true);
    try {
      const { data } = await analyseApi.adapterCV(cvId, offreId);
      setAnalyse(data);
      toast.success('CV adapté selon l\'offre !');
      return data;
    } catch {
      toast.error('Erreur adaptation');
    } finally {
      setLoading(false);
    }
  }, [setAnalyse]);

  return { loading, lancerAnalyse, adapterPourOffre };
};