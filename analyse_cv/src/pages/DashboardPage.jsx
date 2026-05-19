import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Award, Upload, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCV } from '../hooks/useCV';
import { useCVStore, useAnalyseStore } from '../store/useStore';
import CVScore from '../components/cv/CVScore';

const StatCard = ({ value, label, color, icon: Icon, glowColor }) => (
  <div className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden transition-transform hover:-translate-y-0.5 duration-200"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}
  >
    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 70%)` }} />
    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
      style={{ background: `rgba(${color}, 0.12)` }}>
      <Icon size={16} style={{ color: `rgb(${color})` }} />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.7)' }}>{label}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { userName } = useAuth();
  const { fetchCVs } = useCV();
  const cvList = useCVStore((s) => s.cvList);
  const { analyseHistory } = useAnalyseStore();

  useEffect(() => { fetchCVs(); }, [fetchCVs]);

  // ── Stats corrigées — basées sur l'historique des analyses ──────────────
  const bestScore = analyseHistory.length
    ? Math.max(...analyseHistory.map((a) => Math.round(a.score || 0)))
    : 0;

  const analysedCount = analyseHistory.length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden p-7"
        style={{
          background: 'linear-gradient(135deg, rgba(13,148,136,0.12) 0%, rgba(8,145,178,0.06) 50%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(45,212,191,0.12)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-6 right-32 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)' }} />

        <div className="relative">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={13} style={{ color: '#2dd4bf' }} />
            <span className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: 'rgba(45,212,191,0.7)' }}>
              Tableau de bord
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {greeting()},{' '}
            <span style={{ background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {userName || 'étudiant'}
            </span>{' '}
            👋
          </h1>
          <p className="text-sm mt-1.5 max-w-sm" style={{ color: 'rgba(148,163,184,0.65)' }}>
            Optimisez votre CV avec l'IA et décrochez le poste de vos rêves.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          value={cvList.length}
          label="CV chargés"
          color="45,212,191"
          glowColor="rgba(45,212,191,0.06)"
          icon={Upload}
        />
        <div className="relative rounded-2xl p-5 flex flex-col gap-2 overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />
          <CVScore score={bestScore} size={56} showLabel={false} />
          <p className="text-xs" style={{ color: 'rgba(148,163,184,0.7)' }}>Meilleur score</p>
        </div>
        <StatCard
          value={analysedCount}
          label="CVs analysés"
          color="167,139,250"
          glowColor="rgba(167,139,250,0.06)"
          icon={Award}
        />
      </div>

      {/* CTA si aucun CV */}
      {cvList.length === 0 && (
        <div className="rounded-2xl p-8 text-center"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(45,212,191,0.2)',
          }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'rgba(45,212,191,0.1)',
              border: '1px solid rgba(45,212,191,0.2)',
              boxShadow: '0 0 20px rgba(45,212,191,0.08)'
            }}>
            <Upload size={20} style={{ color: '#2dd4bf' }} />
          </div>
          <h3 className="text-white font-semibold">Commencez par ajouter un CV</h3>
          <p className="text-sm mt-1.5 mb-5 max-w-xs mx-auto" style={{ color: 'rgba(100,116,139,0.8)' }}>
            Téléchargez votre CV au format PDF, DOCX ou TXT pour démarrer l'analyse IA.
          </p>
          <Link
            to="/cv"
            className="inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:scale-105 duration-200"
            style={{
              background: 'linear-gradient(135deg, #0d9488, #0891b2)',
              color: 'white',
              boxShadow: '0 4px 14px rgba(13,148,136,0.3)'
            }}
          >
            Télécharger mon CV <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Derniers CVs */}
      {cvList.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Clock size={13} style={{ color: '#2dd4bf' }} />
              Mes CVs récents
            </h2>
            <Link to="/cv"
              className="text-xs flex items-center gap-1 transition-colors hover:gap-1.5 duration-150"
              style={{ color: 'rgba(45,212,191,0.7)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#2dd4bf'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(45,212,191,0.7)'}
            >
              Voir tout <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {cvList.slice(0, 5).map((cv) => {
              // Trouver le meilleur score pour ce CV dans l'historique
              const cvAnalyses = analyseHistory.filter((a) => a.cvId === cv.id);
              const cvBestScore = cvAnalyses.length
                ? Math.max(...cvAnalyses.map((a) => Math.round(a.score || 0)))
                : 0;
              return (
                <div
                  key={cv.id}
                  className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 group cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(45,212,191,0.18)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(45,212,191,0.08)' }}>
                      <FileText size={13} style={{ color: '#2dd4bf' }} />
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{cv.nomFichier}</span>
                  </div>
                  <CVScore score={cvBestScore} size={40} showLabel={false} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
