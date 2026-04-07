import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, BarChart2, Upload, ArrowRight } from 'lucide-react';
import { useAuth }    from '../hooks/useAuth';
import { useCV }      from '../hooks/useCV';
import { useCVStore } from '../store/useStore';
import CVScore        from '../components/cv/CVScore';

const ActionCard = ({ to, icon: Icon, title, desc, color }) => (
  <Link to={to}
    className="bg-slate-800 border border-slate-700 hover:border-teal-500/50
               rounded-xl p-5 flex items-start gap-4 group transition-all hover:-translate-y-0.5"
  >
    <div className={`p-2.5 rounded-lg ${color}`}>
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <p className="text-white font-medium">{title}</p>
      <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
    </div>
    <ArrowRight size={16} className="text-slate-600 group-hover:text-teal-400 mt-1 transition-colors" />
  </Link>
);

const DashboardPage = () => {
  const { userName } = useAuth();
  const { fetchCVs } = useCV();
  const cvList = useCVStore((s) => s.cvList);

  useEffect(() => { fetchCVs(); }, [fetchCVs]);

  const bestScore = cvList.length
    ? Math.max(...cvList.map((c) => c.scoreGeneral || 0))
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Salutation */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Bonjour, <span className="text-teal-400">{userName || 'étudiant'}</span> 👋
        </h1>
        <p className="text-slate-400 mt-1">
          Votre tableau de bord — optimisez votre CV avec l'IA
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-teal-400">{cvList.length}</p>
          <p className="text-slate-400 text-sm mt-1">CV chargés</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center">
          <CVScore score={bestScore} size={64} showLabel={false} />
          <p className="text-slate-400 text-sm mt-1">Meilleur score</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-400">
            {cvList.filter((c) => c.contenuAnalyse).length}
          </p>
          <p className="text-slate-400 text-sm mt-1">CVs analysés</p>
        </div>
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-slate-300 font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ActionCard to="/cv"      icon={Upload}    title="Télécharger un CV"
            desc="Ajoutez PDF, DOCX ou TXT"
            color="bg-teal-600/20 text-teal-400" />
          <ActionCard to="/analyse"  icon={BarChart2}  title="Analyser avec l'IA"
            desc="Score, points forts, recommandations"
            color="bg-purple-600/20 text-purple-400" />
          <ActionCard to="/offres"   icon={Briefcase} title="Gérer mes offres cibles"
            desc="Saisissez les offres qui vous intéressent"
            color="bg-blue-600/20 text-blue-400" />
          <ActionCard to="/cv"      icon={FileText}  title="Exporter le CV optimisé"
            desc="PDF, DOCX, TXT ou JSON"
            color="bg-green-600/20 text-green-400" />
        </div>
      </div>

      {/* Derniers CVs */}
      {cvList.length > 0 && (
        <div>
          <h2 className="text-slate-300 font-semibold mb-3">Mes CVs récents</h2>
          <div className="space-y-2">
            {cvList.slice(0, 3).map((cv) => (
              <div key={cv.id}
                className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText size={15} className="text-teal-400" />
                  <span className="text-slate-300 text-sm">{cv.nomFichier}</span>
                </div>
                <CVScore score={cv.scoreGeneral || 0} size={44} showLabel={false} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;