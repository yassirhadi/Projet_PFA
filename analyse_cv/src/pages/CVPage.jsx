import { useEffect } from 'react';
import CVUploader from '../components/cv/CVUploader';
import CVCard from '../components/cv/CVCard';
import { useCVStore } from '../store/useStore';
import { useCV } from '../hooks/useCV';

const CVPage = () => {
  const { fetchCVs } = useCV();
  const cvList = useCVStore((s) => s.cvList);

  useEffect(() => { fetchCVs(); }, [fetchCVs]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">Gestion de mes CVs</h1>
      <CVUploader onUploadSuccess={fetchCVs} />
      <div className="space-y-4">
        {cvList.length === 0 && (
          <p className="text-slate-500 italic text-center py-10">
            Aucun CV chargé. Téléchargez votre premier CV ci-dessus.
          </p>
        )}
        {cvList.map((cv) => <CVCard key={cv.id} cv={cv} />)}
      </div>
    </div>
  );
};

export default CVPage;