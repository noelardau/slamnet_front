import { useOutletContext } from 'react-router-dom';
import { Clock, Shuffle, Save, Loader2, Users } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useTournoiStore } from '../stores/tournoiStore';

export default function TournoiParametres() {
  const { tournoi } = useOutletContext<any>();
  const { showSuccess, showError } = useToast();
  const { updateTournoi } = useTournoiStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [dureePerfo, setDureePerfo] = useState(tournoi?.dureePerfo || '');
  const [tirageAuSort, setTirageAuSort] = useState(tournoi?.tirageAuSort || false);
  const [nbJury, setNbJury] = useState(tournoi?.nbJury || 3);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateTournoi(tournoi.idTournoi, {
        dureePerfo,
        tirageAuSort,
        nbJury,
      });
      showSuccess('Paramètres mis à jour avec succès');
    } catch (error) {
      showError('Erreur lors de la mise à jour des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 
        className="text-foreground mb-6"
        style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
      >
        Paramètres du tournoi
      </h2>

      <div className="max-w-2xl space-y-6">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-primary" size={20} />
            <h3 className="text-foreground font-medium text-lg">Durée de performance</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Durée maximale par performance (min:sec)
            </label>
            <input
              type="text"
              value={dureePerfo}
              onChange={(e) => setDureePerfo(e.target.value)}
              placeholder="03:00"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Format attendu : min:sec (ex: 03:00 pour 3 minutes)
            </p>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-primary" size={20} />
            <h3 className="text-foreground font-medium text-lg">Jury</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre de membres du jury
            </label>
            <input
              type="number"
              min="1"
              value={nbJury}
              onChange={(e) => setNbJury(Number(e.target.value))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Nombre de jurés qui noteront chaque performance
            </p>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shuffle className="text-primary" size={20} />
            <h3 className="text-foreground font-medium text-lg">Tirage au sort</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Activer le tirage au sort</p>
              <p className="text-sm text-muted-foreground">
                Permet de sélectionner aléatoirement le participant lors de la création d'une performance
              </p>
            </div>
            <button
              onClick={() => setTirageAuSort(!tirageAuSort)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                tirageAuSort ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  tirageAuSort ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={16} />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}