import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTournoiStore } from '../stores/tournoiStore';
import { useCollectifStore } from '../stores/collectifStore';
import { Tournoi, CreateTournoiData, UpdateTournoiData } from '../services/tournoiService';
import { Loader2, Plus, Calendar, MapPin, Clock, Users, Trophy, Trash2, Edit } from 'lucide-react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CreateTournoiDialog } from '../components/CreateTournoiDialog';
import { UpdateTournoiDialog } from '../components/UpdateTournoiDialog';

function TournoisContent() {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const { tournois, isLoading, createTournoi, updateTournoi, deleteTournoi } = useTournoiStore();
  const { profile, isLoading: isProfileLoading } = useCollectifStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tournoiToDelete, setTournoiToDelete] = useState<Tournoi | null>(null);
  const [tournoiToUpdate, setTournoiToUpdate] = useState<Tournoi | null>(null);
  const navigate = useNavigate();

  const handleCreateTournoi = async (data: CreateTournoiData) => {
    try {
      await createTournoi(data);
      showSuccess('Tournoi créé avec succès');
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Erreur lors de la création du tournoi:', error);
      throw error;
    }
  };

  const handleUpdateClick = (tournoi: Tournoi) => {
    setTournoiToUpdate(tournoi);
    setShowUpdateDialog(true);
  };

  const handleUpdateTournoi = async (id: number, data: UpdateTournoiData) => {
    try {
      await updateTournoi(id, data);
      showSuccess('Tournoi modifié avec succès');
      setShowUpdateDialog(false);
      setTournoiToUpdate(null);
    } catch (error) {
      console.error('Erreur lors de la modification du tournoi:', error);
      throw error;
    }
  };

  const handleDeleteClick = (tournoi: Tournoi) => {
    setTournoiToDelete(tournoi);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (tournoiToDelete) {
      setIsDeleting(true);
      try {
        await deleteTournoi(tournoiToDelete.idTournoi);
        showSuccess(`Tournoi "${tournoiToDelete.nomTournoi}" supprimé avec succès`);
      } catch (error) {
        console.error('Erreur lors de la suppression du tournoi:', error);
        showError('Erreur lors de la suppression du tournoi');
      } finally {
        setIsDeleting(false);
      }
    }
    setShowDeleteDialog(false);
    setTournoiToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setTournoiToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (!isAuthenticated || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Chargement des tournois...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-primary" />
            <span
              className="text-primary"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
            >
              TOURNOIS
            </span>
          </div>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            <span className="hidden md:inline">Ajouter un tournoi</span>
          </button>
        </div>
        <h1
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 0.95,
            color: "#f2ede6",
          }}
        >
          <span style={{ color: "#ff4d00" }}>NOS TOURNOIS.</span>
        </h1>
        <p className="mt-4 text-muted-foreground" style={{ fontSize: "1rem" }}>
          Gérez les tournois de votre collectif
        </p>
      </div>

      {tournois.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <Trophy className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h2 className="text-foreground mb-2" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            Aucun tournoi
          </h2>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas encore créé de tournoi. Commencez par organiser votre premier événement !
          </p>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider md:px-6 md:py-3 sm:px-4 sm:py-2"
            style={{ letterSpacing: "0.06em" }}
          >
            <Plus size={20} className="sm:size-16" />
            <span className="hidden md:inline">Créer un tournoi</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournois.map((tournoi) => (
            <div key={tournoi.idTournoi} className="border border-border bg-card hover:border-primary/60 transition-all duration-300 group">
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 h-48 md:h-full">
                  {tournoi.afficheTournoi ? (
                    <img
                      src={tournoi.afficheTournoi}
                      alt={tournoi.nomTournoi}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-border">
                      <Trophy className="text-muted-foreground" size={48} />
                    </div>
                  )}
                </div>

                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                  <div className="flex items-start justify-between mb-4">
                    <h3 
                      className="text-foreground group-hover:text-primary transition-colors"
                      style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem", letterSpacing: "0.02em" }}
                    >
                      {tournoi.nomTournoi}
                    </h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleUpdateClick(tournoi)}
                        className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                        aria-label="Modifier"
                      >
                        <Edit size={16} className="text-muted-foreground hover:text-primary" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(tournoi)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={16} className="text-muted-foreground hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 hidden md:block">
                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                      <Calendar size={16} />
                      <span>{formatDate(tournoi.dateTournoi)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                      <Clock size={16} />
                      <span>{tournoi.heureTournoi}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                      <MapPin size={16} />
                      <span>{tournoi.LieuTournoi}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                      <Users size={16} />
                      <span>{tournoi.nbJury} juré{tournoi.nbJury > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/tournoi-gestion/${tournoi.idTournoi}`)}
                    className="w-full px-4 py-3 border border-border hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 font-medium text-sm"
                  >
                    <span className="hidden md:inline">Gérer le tournoi</span>
                    <span className="md:hidden">Gérer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateTournoiDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateTournoi}
      />

      <UpdateTournoiDialog
        isOpen={showUpdateDialog}
        onClose={() => {
          setShowUpdateDialog(false);
          setTournoiToUpdate(null);
        }}
        onSubmit={handleUpdateTournoi}
        tournoi={tournoiToUpdate}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Supprimer le tournoi"
        message={`Êtes-vous sûr de vouloir supprimer le tournoi "${tournoiToDelete?.nomTournoi}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={isDeleting}
      />
    </div>
  );
}

export default function TournoisPage() {
  return (
    <ProtectedRoute>
      <TournoisContent />
    </ProtectedRoute>
  );
}