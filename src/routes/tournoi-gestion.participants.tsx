import { useOutletContext } from 'react-router-dom';
import { Plus, User, X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function TournoiParticipants() {
  const { tournoi } = useOutletContext<any>();
  const { showSuccess, showError } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([
    { id: 1, nom: 'Koumba Diop', pseudo: 'K. D.', collectif: 'Parole Libre', statut: 'inscrit' },
    { id: 2, nom: 'Lucas Martin', pseudo: 'L. M.', collectif: 'Le Verbe Urbain', statut: 'inscrit' },
    { id: 3, nom: 'Amélie Rousseau', pseudo: 'A. R.', collectif: 'Invité', statut: 'invité' },
  ]);

  const handleDeleteClick = (participant: any) => {
    setParticipantToDelete(participant);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setParticipants(participants.filter(p => p.id !== participantToDelete.id));
    showSuccess('Participant retiré avec succès');
    setShowDeleteDialog(false);
    setParticipantToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
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
        {participants.length === 0 ? (
          <div className="text-center py-12 border border-border border-dashed">
            <User className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">Aucun participant pour le moment</p>
          </div>
        ) : (
          participants.map((participant) => (
            <div key={participant.id} className="border border-border bg-card p-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center">
                  <User className="text-muted-foreground" size={20} />
                </div>
                <div>
                  <h3 className="text-foreground font-medium">{participant.nom}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>@{participant.pseudo}</span>
                    <span>·</span>
                    <span>{participant.collectif}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      participant.statut === 'inscrit' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {participant.statut}
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
          ))
        )}
      </div>

      <div className="mt-8 p-6 bg-card border border-border">
        <h3 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}>
          Informations du tournoi
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-muted-foreground text-sm mb-1">Date</div>
            <div className="text-foreground font-medium">{formatDate(tournoi.dateTournoi)}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm mb-1">Heure</div>
            <div className="text-foreground font-medium">{tournoi.heureTournoi}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm mb-1">Lieu</div>
            <div className="text-foreground font-medium">{tournoi.LieuTournoi}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm mb-1">Jurés</div>
            <div className="text-foreground font-medium">{tournoi.nbJury} juré{tournoi.nbJury > 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Retirer le participant"
        message="Êtes-vous sûr de vouloir retirer ce participant du tournoi ?"
        confirmText="Retirer"
        cancelText="Annuler"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setParticipantToDelete(null);
        }}
      />
    </div>
  );
}