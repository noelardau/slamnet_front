import { useOutletContext } from 'react-router-dom';
import { Plus, Mic } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function TournoiPerformances() {
  const { tournoi } = useOutletContext<any>();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [performances, setPerformances] = useState<any[]>([
    { id: 1, participant: 'Koumba Diop', round: 1, ordre: 1, statut: 'terminé' },
    { id: 2, participant: 'Lucas Martin', round: 1, ordre: 2, statut: 'en_cours' },
    { id: 3, participant: 'Amélie Rousseau', round: 1, ordre: 3, statut: 'à_venir' },
  ]);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'terminé': return 'bg-green-500/20 text-green-500';
      case 'en_cours': return 'bg-primary/20 text-primary';
      case 'à_venir': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'terminé': return 'Terminé';
      case 'en_cours': return 'En cours';
      case 'à_venir': return 'À venir';
      default: return statut;
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

      <div className="space-y-4">
        {performances.length === 0 ? (
          <div className="text-center py-12 border border-border border-dashed">
            <Mic className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">Aucune performance pour le moment</p>
          </div>
        ) : (
          performances.map((performance) => (
            <div key={performance.id} className="border border-border bg-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center">
                  <Mic className="text-muted-foreground" size={20} />
                </div>
                <div>
                  <h3 className="text-foreground font-medium">{performance.participant}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>Round {performance.round}</span>
                    <span>·</span>
                    <span>Ordre {performance.ordre}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(performance.statut)}`}>
                {getStatusLabel(performance.statut)}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 p-6 bg-card border border-border">
        <h3 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}>
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="border border-border p-4 hover:border-primary/60 transition-colors text-left">
            <div className="text-foreground font-medium mb-1">Tirage au sort</div>
            <div className="text-muted-foreground text-sm">Générer l'ordre de passage</div>
          </button>
          <button className="border border-border p-4 hover:border-primary/60 transition-colors text-left">
            <div className="text-foreground font-medium mb-1">Exporter liste</div>
            <div className="text-muted-foreground text-sm">Télécharger en PDF</div>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showAddDialog}
        title="Ajouter une performance"
        message="Fonctionnalité à venir"
        confirmText="OK"
        cancelText="Annuler"
        onConfirm={() => setShowAddDialog(false)}
        onCancel={() => setShowAddDialog(false)}
      />
    </div>
  );
}