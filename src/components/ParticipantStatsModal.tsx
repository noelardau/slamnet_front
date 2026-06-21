import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../app/components/ui/dialog';
import { BarChart3, AlertCircle, Loader2, TrendingUp, Award } from 'lucide-react';
import { useStatisticsStore } from '../stores/statisticsStore';
import { useLanguage } from '../contexts/LanguageContext';
import { PerformanceChart } from '../app/components/charts/PerformanceChart';

interface ParticipantStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantId: number;
  tournamentId: number;
}

export function ParticipantStatsModal({ 
  isOpen, 
  onClose, 
  participantId,
  tournamentId 
}: ParticipantStatsModalProps) {
  const { t } = useLanguage();
  const { 
    allParticipantsStats, 
    isLoading: statsLoading,
    hydrateAllParticipantsStats 
  } = useStatisticsStore();

  const participantStats = allParticipantsStats?.participantsStats.find(
    p => p.participantId === participantId
  );

  useEffect(() => {
    if (isOpen && tournamentId) {
      hydrateAllParticipantsStats(tournamentId);
    }
  }, [isOpen, tournamentId]);

  return (
    <Dialog open={isOpen && !!participantId} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            <div className="flex items-center gap-2">
              <BarChart3 size={24} />
              {statsLoading ? (
                <span className="text-muted-foreground">Chargement des statistiques...</span>
              ) : (
                participantStats?.participantName
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {statsLoading ? (
          <div className="space-y-6 animate-pulse">
            {/* Skeleton header stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-card border border-border rounded-lg">
                  <div className="h-3 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-7 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>

            {/* Skeleton chart */}
            <div>
              <div className="h-5 bg-muted rounded w-1/4 mb-4" />
              <div className="h-48 bg-card border border-border rounded-lg flex items-center justify-center">
                <Loader2 className="animate-spin text-muted-foreground" size={28} />
              </div>
            </div>

            {/* Skeleton rounds */}
            <div>
              <div className="h-5 bg-muted rounded w-1/4 mb-4" />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex justify-between items-center mb-3">
                      <div className="h-4 bg-muted rounded w-20" />
                      <div className="h-5 bg-muted rounded w-10" />
                    </div>
                    <div className="h-3 bg-muted rounded w-1/3 mb-2" />
                    <div className="flex gap-2">
                      <div className="h-6 w-10 bg-muted rounded" />
                      <div className="h-6 w-10 bg-muted rounded" />
                      <div className="h-6 w-10 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : participantStats && (
          <>
               {/* Header stats */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 <div className="p-4 bg-card border border-border rounded-lg">
                   <div className="text-sm text-muted-foreground mb-1">{t('statistics.participantStats.rounds')}</div>
                   <div className="text-2xl font-bold text-foreground">
                     {participantStats.nombrePerformances}
                   </div>
                 </div>
                 <div className="p-4 bg-card border border-border rounded-lg">
                   <div className="text-sm text-muted-foreground mb-1">{t('statistics.participantStats.totalPoints')}</div>
                   <div className="text-2xl font-bold text-primary">
                     {participantStats.totalPoints}
                   </div>
                 </div>
                 <div className="p-4 bg-card border border-border rounded-lg">
                   <div className="text-sm text-muted-foreground mb-1">{t('statistics.participantStats.average')}</div>
                   <div className="text-2xl font-bold text-foreground">
                     {participantStats.moyennePoints}
                   </div>
                 </div>
                 <div className="p-4 bg-card border border-border rounded-lg">
                   <div className="text-sm text-muted-foreground mb-1">{t('statistics.participantStats.best')}</div>
                   <div className="text-2xl font-bold text-green-500">
                     {participantStats.meilleurePerformance || '-'}
                   </div>
                 </div>
               </div>

             {/* Graphiques */}
             {participantStats.performances.length > 0 && (
               <div className="mb-6">
                 <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                   <TrendingUp size={20} />
                   {t('statistics.participantStats.analysis')}
                 </h3>
                 <PerformanceChart performances={participantStats.performances} />
               </div>
             )}

             {/* Détails par round */}
             <div>
               <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                 <Award size={20} />
                 {t('statistics.participantStats.details')}
               </h3>
               <div className="space-y-4">
                 {participantStats.performances.map((perf, index) => (
                   <div 
                     key={perf.idPerfo} 
                     className="border border-border rounded-lg p-4 bg-card"
                   >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">
                            Round {index + 1}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {perf.duree}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-primary">
                          {perf.noteFinale}
                        </span>
                      </div>
                     
                      <div className="mb-2">
                        <div className="text-sm text-muted-foreground mb-2">
                          Notes ({perf.nombreNotesRetenues}/{perf.nombreNotesTotal} {t('statistics.participantStats.notes')})
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {perf.notes.sort((a, b) => a.valeur - b.valeur).map((note, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 bg-background border border-border rounded-md text-sm font-medium ${
                                !note.retenu
                                  ? 'line-through text-destructive border-destructive/30 bg-destructive/5'
                                  : 'text-foreground'
                              }`}
                            >
                              {note.valeur}
                            </span>
                          ))}
                        </div>
                      </div>
                     
                     {perf.penalites.length > 0 && (
                       <div>
                         <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                           <AlertCircle size={14} />
                           {t('statistics.participantStats.penalties')}
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {perf.penalites.map((penalite, idx) => (
                             <span
                               key={idx}
                               className="px-3 py-1 bg-destructive/10 border border-destructive/30 rounded-md text-sm font-medium text-destructive"
                             >
                               -{penalite}
                             </span>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>
           </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="text-muted-foreground mb-3" size={32} />
            <p className="text-muted-foreground text-sm">
              {t('statistics.participantStats.noData') || 'Aucune statistique disponible pour ce participant.'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}