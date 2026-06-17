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
              {participantStats?.participantName}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {statsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
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
        )}
      </DialogContent>
    </Dialog>
  );
}