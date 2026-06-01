import { useOutletContext } from 'react-router-dom';
import { Trophy, Medal, Award } from 'lucide-react';
import { useState } from 'react';

export default function TournoiClassement() {
  const { tournoi } = useOutletContext<any>();
  const [classement, setClassement] = useState<any[]>([
    { id: 1, nom: 'Koumba Diop', pseudo: 'K. D.', total: 27.6, round1: 9.2, round2: 9.4, round3: 9.0 },
    { id: 2, nom: 'Lucas Martin', pseudo: 'L. M.', total: 25.8, round1: 8.8, round2: 8.5, round3: 8.5 },
    { id: 3, nom: 'Amélie Rousseau', pseudo: 'A. R.', total: 24.3, round1: 8.1, round2: 8.2, round3: 8.0 },
  ]);

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy size={24} className="text-yellow-500" />;
      case 2: return <Medal size={24} className="text-gray-400" />;
      case 3: return <Award size={24} className="text-amber-600" />;
      default: return <span className="text-muted-foreground font-bold text-xl">{position}</span>;
    }
  };

  const getScoreColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-foreground';
    }
  };

  return (
    <div>
      <h2 
        className="text-foreground mb-6"
        style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
      >
        Classement
      </h2>

      <div className="space-y-3">
        {classement.length === 0 ? (
          <div className="text-center py-12 border border-border border-dashed">
            <Trophy className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">Aucun classement pour le moment</p>
          </div>
        ) : (
          classement.map((participant) => (
            <div key={participant.id} className={`border border-border bg-card p-6 flex items-center justify-between ${participant.id <= 3 ? 'border-primary/30' : ''}`}>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  {getMedalIcon(participant.id)}
                </div>
                <div>
                  <h3 className="text-foreground font-medium text-lg">{participant.nom}</h3>
                  <div className="text-muted-foreground text-sm">@{participant.pseudo}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getScoreColor(participant.id)}`} style={{ fontFamily: "Anton, sans-serif" }}>
                  {participant.total}
                </div>
                <div className="text-muted-foreground text-xs">
                  R1: {participant.round1} · R2: {participant.round2} · R3: {participant.round3}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 p-6 bg-card border border-border">
        <h3 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}>
          Résumé
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-muted-foreground text-sm mb-1">Participants</div>
            <div className="text-2xl font-bold text-foreground">{classement.length}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm mb-1">Moyenne</div>
            <div className="text-2xl font-bold text-foreground">
              {(classement.reduce((sum, p) => sum + p.total, 0) / classement.length).toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm mb-1">Rounds</div>
            <div className="text-2xl font-bold text-foreground">3</div>
          </div>
        </div>
      </div>
    </div>
  );
}