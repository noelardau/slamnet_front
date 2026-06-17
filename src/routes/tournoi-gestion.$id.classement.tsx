import { useOutletContext } from 'react-router-dom';
import { Trophy, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useParticipantStore } from '../stores/participantStore';
import { usePerformanceStore } from '../stores/performanceStore';

export default function TournoiClassement() {
  const { tournoi } = useOutletContext<any>();
  const { t } = useLanguage();
  const { participants, hydrateParticipants, isLoading: participantsLoading } = useParticipantStore();
  const { performances, hydratePerformances } = usePerformanceStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (tournoi?.idTournoi) {
        setIsLoading(true);
        try {
          await hydrateParticipants(tournoi.idTournoi);
          await hydratePerformances(tournoi.idTournoi);
        } catch (error) {
          console.error(t('tournoiClassement.loadingError'), error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [tournoi?.idTournoi]);

  const getParticipantName = (participant: any) => {
    if (participant.membre) {
      return `${participant.membre.prenomMembre} ${participant.membre.nomMembre}`;
    } else if (participant.guest) {
      return participant.guest.pseudo;
    }
    return 'Inconnu';
  };

  const getParticipantPseudo = (participant: any) => {
    if (participant.membre) {
      return participant.membre.pseudoMembre;
    } else if (participant.guest) {
      return participant.guest.pseudo;
    }
    return 'Inconnu';
  };

  const getParticipantPhoto = (participant: any) => {
    if (participant.membre?.photoMembre) {
      return participant.membre.photoMembre;
    }
    return null;
  };

  const getParticipantPerformances = (participant: any) => {
    return performances.filter(p => p.idParticipant === participant.idParticipant);
  };

  const calculateClassement = () => {
    return participants
      .map(participant => {
        const participantPerformances = getParticipantPerformances(participant);
        const sortedPerformances = participantPerformances
          .filter(p => p.noteFinale !== null)
          .sort((a, b) => (b.noteFinale || 0) - (a.noteFinale || 0))
          .slice(0, 3);

        return {
          ...participant,
          performances: sortedPerformances,
          rounds: sortedPerformances.map(p => p.noteFinale || 0),
        };
      })
      .sort((a, b) => b.totalNote - a.totalNote)
      .map((participant, index) => ({
        ...participant,
        position: index + 1,
      }));
  };

  const classement = calculateClassement();

  const getRankNumber = (position: number) => {
    return <span className="text-foreground font-bold text-xl md:text-2xl">{position}</span>;
  };

  const getScoreColor = (position: number) => {
    return 'text-foreground';
  };

  return (
    <div>
      <h2 
        className="text-foreground mb-6"
        style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
      >
        {t('tournoiClassement.title')}
      </h2>

      {isLoading || participantsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-muted-foreground ml-3">{t('tournoiClassement.loading')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {classement.length === 0 ? (
              <div className="text-center py-12 border border-border border-dashed">
                <Trophy className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground">{t('tournoiClassement.noRanking')}</p>
              </div>
            ) : (
              classement.map((participant) => (
                <div key={participant.idParticipant} className={`border border-border bg-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {getRankNumber(participant.position)}
                    </div>
                    <div className="flex items-center gap-4">
                      {getParticipantPhoto(participant) ? (
                        <img
                          src={getParticipantPhoto(participant)}
                          alt={getParticipantPseudo(participant)}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center">
                          <span className="text-muted-foreground font-bold text-lg">
                            {getParticipantPseudo(participant).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-foreground font-medium text-lg">@{getParticipantPseudo(participant)}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto text-center md:text-right">
                    <div className={`text-3xl md:text-4xl font-bold ${getScoreColor(participant.position)}`} style={{ fontFamily: "Anton, sans-serif" }}>
                      {participant.totalNote}
                    </div>
                    {participant.rounds.length > 0 && (
                      <div className="text-muted-foreground text-xs md:text-sm mt-1">
                        {participant.rounds.map((note: number, index: number) => (
                          <span key={index}>
                            R{index + 1}: {note}
                            {index < participant.rounds.length - 1 && ' · '}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {classement.length > 0 && (
            <div className="mt-8 p-6 bg-card border border-border">
              <h3 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}>
                {t('tournoiClassement.summary')}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-muted-foreground text-sm mb-1">{t('tournoiClassement.participants')}</div>
                  <div className="text-2xl font-bold text-foreground">{classement.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm mb-1">{t('tournoiClassement.average')}</div>
                  <div className="text-2xl font-bold text-foreground">
                    {(classement.reduce((sum: number, p: any) => sum + p.totalNote, 0) / classement.length).toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm mb-1">{t('tournoiClassement.maxRounds')}</div>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.max(...classement.map((p: any) => p.rounds.length))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}