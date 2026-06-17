import { PerformanceDetailed, NoteObjet } from '../../../services/statisticsService';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';

interface PerformanceChartProps {
  performances: PerformanceDetailed[];
}

export function PerformanceChart({ performances }: PerformanceChartProps) {
  const { t } = useLanguage();

  const chartData = performances.map((perf, index) => ({
    round: index + 1,
    score: perf.noteFinale || 0,
    moyenneJury: perf.notes.length > 0 
      ? perf.notes.reduce((sum, note) => sum + note.valeur, 0) / perf.notes.length 
      : 0,
    penalites: perf.penalites.reduce((sum, p) => sum + p, 0)
  }));

  return (
    <div className="space-y-6">
      {/* Area Chart - Évolution des scores */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          {t('statistics.participantStats.scoreEvolution')}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="round" 
              label={{ value: 'Round', position: 'insideBottom', offset: -5 }}
              className="text-foreground"
            />
            <YAxis 
              label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
              className="text-foreground"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="currentColor" 
              fill="url(#colorScore)"
              className="text-primary"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Score vs Moyenne Jury */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          {t('statistics.participantStats.scoreVsAverage')}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="round" className="text-foreground" />
            <YAxis className="text-foreground" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Bar dataKey="score" name="Score Final" fill="hsl(var(--primary))" />
            <Bar dataKey="moyenneJury" name="Moyenne Jury" fill="hsl(var(--muted))" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Pénalités */}
      {chartData.some(d => d.penalites > 0) && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {t('statistics.participantStats.penaltiesByRound')}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="round" className="text-foreground" />
              <YAxis className="text-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="penalites" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}