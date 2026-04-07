import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileCheck } from 'lucide-react';
import { useCV } from '../../hooks/useCV';

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
};

const CVUploader = ({ onUploadSuccess }) => {
  const { uploadCV, loading } = useCV();

  const onDrop = useCallback(async ([file]) => {
    if (!file) return;
    const result = await uploadCV(file);
    if (result && onUploadSuccess) onUploadSuccess(result);
  }, [uploadCV, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB max sécurité
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
        ${isDragActive ? 'border-teal-400 bg-teal-400/10' : 'border-slate-600 hover:border-teal-500'}`}
    >
      <input {...getInputProps()} />
      {loading ? (
        <div className="animate-spin w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full mx-auto" />
      ) : (
        <>
          <Upload className="mx-auto text-teal-400 mb-4" size={40} />
          <p className="text-slate-300 font-medium">
            {isDragActive ? 'Déposez votre CV ici...' : 'Glissez-déposez votre CV ou cliquez'}
          </p>
          <p className="text-slate-500 text-sm mt-2">PDF, DOCX, TXT — 5MB max</p>
        </>
      )}
    </div>
  );
};

export default CVUploader;