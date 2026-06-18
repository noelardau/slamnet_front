import { MemberGlobalStats } from '../../../services/statisticsService';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';

interface GlobalStatsChartProps {
  stats: MemberGlobalStats;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--muted))'];

export function GlobalStatsChart({ stats }: GlobalStatsChartProps) {
  const { t } = useLanguage();

  const progressionData = stats.tournoisPerformances.map((t, index) => ({
    tournoi: t.nomTournoi.substring(0, 15) + '...',
    moyenne: t.moyennePoints,
    total: t.totalPoints
  }));

  const tournoiComparisonData = stats.tournoisPerformances.map(t => ({
    nom: t.nomTournoi.substring(0, 12) + '...',
    score: t.moyennePoints
  }));

  return (
    <div className="space-y-6">
      {/* Area Chart - Progression des moyennes */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          {t('statistics.globalStats.meanEvolution')}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={progressionData}>
            <defs>
              <linearGradient id="colorMoyenne" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="tournoi" 
              angle={-45}
              textAnchor="end"
              height={60}
              className="text-foreground text-xs"
            />
            <YAxis className="text-foreground" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="moyenne" 
              stroke="currentColor" 
              fill="url(#colorMoyenne)"
              className="text-primary"
              name={t('statistics.globalStats.average')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Comparaison par tournoi */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          {t('statistics.globalStats.tournamentComparison')}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tournoiComparisonData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" className="text-foreground" />
            <YAxis 
              dataKey="nom" 
              type="category" 
              width={80}
              tick={{ fontSize: 11 }}
              className="text-foreground text-xs"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Bar dataKey="score" fill="hsl(var(--primary))" name={t('statistics.globalStats.average')} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}