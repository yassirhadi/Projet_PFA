const SIZES = {
  sm:  'w-5 h-5 border-2',
  md:  'w-8 h-8 border-2',
  lg:  'w-14 h-14 border-4',
};

const LoadingSpinner = ({
  size    = 'md',
  message = '',
  fullPage = false,
}) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`rounded-full border-teal-400 border-t-transparent animate-spin ${SIZES[size] || SIZES.md}`}
        role="status"
        aria-label="Chargement"
      />
      {message && (
        <p className="text-slate-400 text-sm animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;