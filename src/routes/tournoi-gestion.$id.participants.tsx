import { useOutletContext } from 'react-router-dom';
import { Plus, User, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { AddParticipantDialog } from '../components/AddParticipantDialog';
import { useParticipantStore } from '../stores/participantStore';
import { Participant } from '../services/participantService';

export default function TournoiParticipants() {
  const { tournoi } = useOutletContext<any>();
  const { showSuccess, showError } = useToast();
  const { t } = useLanguage();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { participants, hydrateParticipants, removeParticipant, removeGuest } = useParticipantStore();

  useEffect(() => {
    if (tournoi?.idTournoi) {
      loadParticipants();
    }
  }, [tournoi?.idTournoi]);

  const loadParticipants = async () => {
    setIsLoading(true);
    try {
      await hydrateParticipants(tournoi.idTournoi);
    } catch (error) {
      showError(t('tournoiParticipants.loadingError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (participant: Participant) => {
    setParticipantToDelete(participant);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!participantToDelete) return;
    
    setIsLoading(true);
    try {
      if (participantToDelete.guest) {
        await removeGuest(tournoi.idTournoi, participantToDelete.guest.idGuest);
      } else if (participantToDelete.membre) {
        await removeParticipant(tournoi.idTournoi);
      }
      showSuccess(t('tournoiParticipants.removeSuccess'));
      setShowDeleteDialog(false);
      setParticipantToDelete(null);
      await loadParticipants();
    } catch (error) {
      showError(t('tournoiParticipants.removeError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleParticipantAdded = async () => {
    await loadParticipants();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-foreground"
          style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
        >
          {t('tournoiParticipants.title')}
        </h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
        >
          <Plus size={16} />
          <span className="hidden md:inline">{t('tournoiParticipants.addParticipant')}</span>
        </button>
      </div>

      <div className="space-y-3">
        {isLoading && participants.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="mx-auto mb-4 text-muted-foreground animate-spin" size={48} />
            <p className="text-muted-foreground">{t('tournoiParticipants.loading')}</p>
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-12 border border-border border-dashed">
            <User className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">{t('tournoiParticipants.noParticipants')}</p>
          </div>
        ) : (
          participants.map((participant) => {
            const isGuest = !!participant.guest;
            const pseudo = isGuest 
              ? participant.guest!.pseudo
              : participant.membre!.pseudoMembre;
            const photo = isGuest ? null : participant.membre!.photoMembre;
            
             return (
               <div key={participant.idParticipant} className="border border-border bg-card p-4 flex flex-col md:flex-row items-center md:items-center justify-between group gap-3 md:gap-0">
                 <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-border flex items-center justify-center flex-shrink-0">
                     {photo ? (
                       <img
                         src={photo}
                         alt={pseudo}
                         className="w-full h-full object-cover"
                       />
                     ) : (
                       <User className="text-muted-foreground" size={20} />
                     )}
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="text-foreground font-medium text-base md:text-lg truncate">{pseudo}</h3>
                      <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                        <span className={`px-2 py-0.5 rounded text-xs md:text-sm font-medium ${
                          isGuest ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'
                        }`}>
                          {isGuest ? t('tournoiParticipants.guest') : t('tournoiParticipants.member')}
                        </span>
                      </div>
                   </div>
                 </div>
                  <button
                    onClick={() => handleDeleteClick(participant)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-lg transition-all w-full md:w-auto md:opacity-0 md:group-hover:opacity-100 bg-destructive/5 md:bg-transparent"
                    aria-label={t('tournoiParticipants.delete')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                      <span className="md:hidden text-sm text-destructive">{t('tournoiParticipants.delete')}</span>
                    </div>
                  </button>
               </div>
             );
          })
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('tournoiParticipants.removeTitle')}
        message={t('tournoiParticipants.removeMessage')}
        confirmText={t('tournoiParticipants.remove')}
        cancelText={t('common.cancel')}
        onConfirm={handleDeleteConfirm}
        loading={isLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setParticipantToDelete(null);
        }}
      />

      <AddParticipantDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onParticipantAdded={handleParticipantAdded}
        tournamentId={tournoi.idTournoi}
      />
    </div>
  );
}