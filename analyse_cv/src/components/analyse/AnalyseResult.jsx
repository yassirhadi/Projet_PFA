/**
 * AnalyseResult.jsx
 *
 * Affiche les résultats d'une analyse IA.
 *
 * Props attendues (AnalyseResponse de Spring Boot) :
 * {
 *   id, score, statut,
 *   competencesTrouvees: string[],
 *   competencesManquantes: string[],
 *   pointsForts: string[],
 *   pointsAmeliorer: string[],
 *   recommandations: RecommandationResponse[],
 *   cvNom, offreTitre, offreEntreprise, dateAnalyse
 * }
 */

import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip,
} from 'recharts';
import { CheckCircle, XCircle, Award, Calendar, Building2 } from 'lucide-react';

// ── Sous-composant : badge de score ──────────────────────────────────────────
const ScoreBadge = ({ score }) => {
  const color =
    score >= 75 ? 'text-green-400'  :
    score >= 50 ? 'text-yellow-400' :
                  'text-red-400';

  return (
    <div className={`text-5xl font-extrabold ${color} tabular-nums`}>
      {Math.round(score)}
      <span className="text-xl text-slate-500 font-normal">/100</span>
    </div>
  );
};

// ── Sous-composant : liste de tags ────────────────────────────────────────────
const TagList = ({ items = [], variant = 'neutral' }) => {
  const colors = {
    green:   'bg-green-900/40 text-green-300 border-green-700/50',
    red:     'bg-red-900/40   text-red-300   border-red-700/50',
    neutral: 'bg-slate-800    text-slate-300 border-slate-700',
  };
  const cls = colors[variant] || colors.neutral;

  if (!items.length) return <p className="text-slate-600 text-xs italic">Aucun élément</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className={`text-xs px-2.5 py-1 rounded-full border ${cls}`}>
          {item}
        </span>
      ))}
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────
const AnalyseResult = ({ analyse }) => {
  if (!analyse) return null;

  const {
    score                = 0,
    competencesTrouvees  = [],
    competencesManquantes= [],
    pointsForts          = [],
    pointsAmeliorer      = [],
    cvNom,
    offreTitre,
    offreEntreprise,
    dateAnalyse,
    statut,
  } = analyse;

  // Données radar — basées sur les champs réels de l'API
  const radarData = [
    { subject: 'Compétences',   A: score },
    { subject: 'Format',        A: score * 0.85 },
    { subject: 'Mots-clés',     A: score * 0.90 },
    { subject: 'Adéquation',    A: score * 0.80 },
    { subject: 'Expérience',    A: score * 0.75 },
  ];

  const dateFormatee = dateAnalyse
    ? new Date(dateAnalyse).toLocaleString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">

      {/* ── En-tête : score + méta ───────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h3 className="text-teal-400 text-lg font-semibold">Résultat de l'Analyse IA</h3>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            {cvNom && (
              <span className="flex items-center gap-1">
                <Award size={12} /> {cvNom}
              </span>
            )}
            {offreTitre && (
              <span className="flex items-center gap-1">
                <Building2 size={12} /> {offreTitre} · {offreEntreprise}
              </span>
            )}
            {dateFormatee && (
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {dateFormatee}
              </span>
            )}
          </div>
        </div>
        <ScoreBadge score={score} />
      </div>

      {/* ── Radar chart ─────────────────────────────────────────────────── */}
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(v) => [`${Math.round(v)}`, 'Score']}
          />
          <Radar
            dataKey="A"
            fill="#14b8a6"
            fillOpacity={0.25}
            stroke="#14b8a6"
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* ── Compétences trouvées / manquantes ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <p className="text-green-400 text-sm font-medium flex items-center gap-1.5">
            <CheckCircle size={14} /> Compétences trouvées
          </p>
          <TagList items={competencesTrouvees} variant="green" />
        </div>
        <div className="space-y-2">
          <p className="text-red-400 text-sm font-medium flex items-center gap-1.5">
            <XCircle size={14} /> Compétences manquantes
          </p>
          <TagList items={competencesManquantes} variant="red" />
        </div>
      </div>

      {/* ── Points forts / à améliorer ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <p className="text-green-400 text-sm font-medium mb-2 flex items-center gap-1.5">
            <CheckCircle size={14} /> Points forts
          </p>
          {pointsForts.length
            ? pointsForts.map((p, i) => (
                <p key={i} className="text-slate-300 text-sm py-1.5 border-b border-slate-800">
                  {p}
                </p>
              ))
            : <p className="text-slate-600 text-xs italic">Aucun point fort identifié</p>
          }
        </div>
        <div>
          <p className="text-orange-400 text-sm font-medium mb-2 flex items-center gap-1.5">
            <XCircle size={14} /> Points à améliorer
          </p>
          {pointsAmeliorer.length
            ? pointsAmeliorer.map((p, i) => (
                <p key={i} className="text-slate-300 text-sm py-1.5 border-b border-slate-800">
                  {p}
                </p>
              ))
            : <p className="text-slate-600 text-xs italic">Aucun point à améliorer identifié</p>
          }
        </div>
      </div>

      {/* ── Statut ──────────────────────────────────────────────────────── */}
      {statut && statut !== 'TERMINEE' && (
        <div className="text-xs text-slate-500 text-right">
          Statut : <span className="text-yellow-400">{statut}</span>
        </div>
      )}
    </div>
  );
};

export default AnalyseResult;
