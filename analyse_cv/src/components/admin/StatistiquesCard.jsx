const StatistiquesCard = ({ label, value, icon: Icon, color = 'teal' }) => {
  const colorMap = {
    teal: 'text-teal-400 bg-teal-400/10 border-teal-500/30',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-500/30',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-500/30',
    green: 'text-green-400 bg-green-400/10 border-green-500/30',
  };
  return (
    <div className={`border rounded-xl p-5 ${colorMap[color]}`}>
      {Icon && <Icon size={28} className="mb-3 opacity-80" />}
      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
      <p className="text-slate-400 text-sm mt-1">{label}</p>
    </div>
  );
};

export default StatistiquesCard;