import { useOutletContext } from 'react-router-dom';
import { Plus, Mic, Trash2, Loader2, Play, Pause, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { usePerformanceStore } from '../stores/performanceStore';
import { useParticipantStore } from '../stores/participantStore';

type PerformanceState = 'prêt' | 'en_cours' | 'en_pause' | 'terminée';

export default function TournoiPerformances() {
  const { tournoi } = useOutletContext<any>();
  const { showSuccess, showError } = useToast();
  const { participants, hydrateParticipants } = useParticipantStore();
  const { performances, isLoading, hydratePerformances, deletePerformance } = usePerformanceStore();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [performanceToDelete, setPerformanceToDelete] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null);
  const [performanceFormData, setPerformanceFormData] = useState({
    duree: '',
    noteFinale: '',
    etat: 'prêt' as PerformanceState,
  });

  useEffect(() => {
    if (tournoi?.idTournoi) {
      loadPerformances();
      loadParticipants();
    }
  }, [tournoi?.idTournoi]);

  const loadPerformances = async () => {
    try {
      await hydratePerformances(tournoi.idTournoi);
    } catch (error) {
      showError('Erreur lors du chargement des performances');
    }
  };

  const loadParticipants = async () => {
    try {
      await hydrateParticipants(tournoi.idTournoi);
    } catch (error) {
      showError('Erreur lors du chargement des participants');
    }
  };

  const handleDeleteClick = (performance: any) => {
    setPerformanceToDelete(performance);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!performanceToDelete) return;
    
    try {
      await deletePerformance(performanceToDelete.idPerfo);
      showSuccess('Performance supprimée avec succès');
      setShowDeleteDialog(false);
      setPerformanceToDelete(null);
      await loadPerformances();
    } catch (error) {
      showError('Erreur lors de la suppression de la performance');
    }
  };

  const getParticipantName = (performance: any) => {
    if (performance.membre) {
      return performance.membre.pseudoMembre;
    } else if (performance.guest) {
      return performance.guest.pseudo;
    }
    return 'Inconnu';
  };

  const getParticipantPhoto = (performance: any) => {
    if (performance.membre?.photoMembre) {
      return performance.membre.photoMembre;
    }
    return null;
  };

  const isGuest = (performance: any) => !!performance.guest;

  const getParticipantType = (performance: any) => {
    return isGuest(performance) ? 'Invité' : 'Membre';
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Non définie';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEtatColor = (etat: string | null) => {
    switch (etat) {
      case 'prêt': return 'bg-blue-500/20 text-blue-500';
      case 'en_cours': return 'bg-yellow-500/20 text-yellow-500';
      case 'en_pause': return 'bg-orange-500/20 text-orange-500';
      case 'terminée': return 'bg-green-500/20 text-green-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEtatLabel = (etat: string | null) => {
    switch (etat) {
      case 'prêt': return 'Prêt';
      case 'en_cours': return 'En cours';
      case 'en_pause': return 'En pause';
      case 'terminée': return 'Terminée';
      default: return etat || 'Non défini';
    }
  };

  const getEtatIcon = (etat: string | null) => {
    switch (etat) {
      case 'prêt': return <Clock size={14} />;
      case 'en_cours': return <Play size={14} />;
      case 'en_pause': return <Pause size={14} />;
      case 'terminée': return <CheckCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const getEtatClass = (etat: string | null) => {
    switch (etat) {
      case 'prêt': return 'border-blue-500/30 bg-blue-500/5';
      case 'en_cours': return 'border-yellow-500/30 bg-yellow-500/5';
      case 'en_pause': return 'border-orange-500/30 bg-orange-500/5';
      case 'terminée': return 'border-green-500/30 bg-green-500/5';
      default: return '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-foreground"
          style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
        >
          Performances
        </h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter une performance
        </button>
      </div>

      {isLoading && performances.length === 0 ? (
        <div className="text-center py-12">
          <Loader2 className="mx-auto mb-4 text-muted-foreground animate-spin" size={48} />
          <p className="text-muted-foreground">Chargement des performances...</p>
        </div>
      ) : performances.length === 0 ? (
        <div className="text-center py-12 border border-border border-dashed">
          <Mic className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">Aucune performance pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {performances.map((performance, index) => (
            <div 
              key={performance.idPerfo} 
              className={`border bg-card p-4 flex items-center justify-between group ${getEtatClass(performance.etat)}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-border flex items-center justify-center flex-shrink-0">
                  {getParticipantPhoto(performance) ? (
                    <img
                      src={getParticipantPhoto(performance)}
                      alt={getParticipantName(performance)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Mic className="text-muted-foreground" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-foreground font-medium">{getParticipantName(performance)}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      isGuest(performance) ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'
                    }`}>
                      {getParticipantType(performance)}
                    </span>
                    <span>·</span>
                    <span>Durée: {formatDuration(performance.duree)}</span>
                    {performance.noteFinale && (
                      <>
                        <span>·</span>
                        <span>Note: {performance.noteFinale}/10</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {performance.etat && (
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getEtatColor(performance.etat)}`}>
                    {getEtatIcon(performance.etat)}
                    {getEtatLabel(performance.etat)}
                  </span>
                )}
                <span className="text-sm text-muted-foreground font-medium">#{index + 1}</span>
                <button
                  onClick={() => handleDeleteClick(performance)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-lg transition-all"
                >
                  <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Supprimer la performance"
        message="Êtes-vous sûr de vouloir supprimer cette performance ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteConfirm}
        loading={isLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setPerformanceToDelete(null);
        }}
      />
    </div>
  );
}