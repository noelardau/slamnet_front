import { useOutletContext } from 'react-router-dom';
import { Plus, User, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { AddParticipantDialog } from '../components/AddParticipantDialog';
import { useParticipantStore } from '../stores/participantStore';
import { Participant } from '../services/participantService';

export default function TournoiParticipants() {
  const { tournoi } = useOutletContext<any>();
  const { showSuccess, showError } = useToast();
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
      showError('Erreur lors du chargement des participants');
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
      showSuccess('Participant retiré avec succès');
      setShowDeleteDialog(false);
      setParticipantToDelete(null);
      await loadParticipants();
    } catch (error) {
      showError('Erreur lors du retrait du participant');
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
          Participants
        </h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter un participant
        </button>
      </div>

      <div className="space-y-3">
        {isLoading && participants.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="mx-auto mb-4 text-muted-foreground animate-spin" size={48} />
            <p className="text-muted-foreground">Chargement des participants...</p>
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-12 border border-border border-dashed">
            <User className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">Aucun participant pour le moment</p>
          </div>
        ) : (
          participants.map((participant) => {
            const isGuest = !!participant.guest;
            const pseudo = isGuest 
              ? participant.guest!.pseudo
              : participant.membre!.pseudoMembre;
            const photo = isGuest ? null : participant.membre!.photoMembre;
            
            return (
              <div key={participant.idParticipant} className="border border-border bg-card p-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-border flex items-center justify-center flex-shrink-0">
                    {photo ? (
                      <img
                        src={photo}
                        alt={pseudo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-muted-foreground" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium text-lg">{pseudo}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        isGuest ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'
                      }`}>
                        {isGuest ? 'Invité' : 'Membre'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteClick(participant)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-lg transition-all"
                >
                  <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Retirer le participant"
        message="Êtes-vous sûr de vouloir retirer ce participant du tournoi ?"
        confirmText="Retirer"
        cancelText="Annuler"
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