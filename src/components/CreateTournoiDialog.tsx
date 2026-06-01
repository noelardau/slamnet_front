import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { CreateTournoiData } from '../services/tournoiService';
import { useToast } from '../contexts/ToastContext';

interface CreateTournoiDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTournoiData) => Promise<void>;
}

export function CreateTournoiDialog({ isOpen, onClose, onSubmit }: CreateTournoiDialogProps) {
  const [formData, setFormData] = useState<CreateTournoiData>({
    nomTournoi: '',
    LieuTournoi: '',
    dateTournoi: '',
    heureTournoi: '',
    nbJury: 3,
    afficheTournoi: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nomTournoi || !formData.LieuTournoi || !formData.dateTournoi || !formData.heureTournoi || !formData.nbJury) {
      setError('Tous les champs requis doivent être remplis');
      return;
    }

    if (formData.nbJury < 1) {
      setError('Le nombre de jurés doit être au moins 1');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du tournoi';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let convertedValue: string | number = value;
    
    if (name === 'nbJury') {
      convertedValue = Number(value);
    } else if (type === 'number') {
      convertedValue = value === '' ? 0 : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: convertedValue,
    }));
    if (error) setError('');
  };

  const handleClose = () => {
    setFormData({
      nomTournoi: '',
      LieuTournoi: '',
      dateTournoi: '',
      heureTournoi: '',
      nbJury: 3,
      afficheTournoi: '',
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={loading ? undefined : handleClose} />
      <div className="relative bg-background border border-border w-full max-w-md max-h-[90vh] flex flex-col shadow-xl">
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 
              className="text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
            >
              Nouveau tournoi
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Nom du tournoi *</label>
              <input
                type="text"
                name="nomTournoi"
                value={formData.nomTournoi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Grand Slam de Paris"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lieu *</label>
              <input
                type="text"
                name="LieuTournoi"
                value={formData.LieuTournoi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Café de la Gare"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <input
                type="date"
                name="dateTournoi"
                value={formData.dateTournoi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Heure *</label>
              <input
                type="time"
                name="heureTournoi"
                value={formData.heureTournoi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nombre de jurés *</label>
              <select
                name="nbJury"
                value={formData.nbJury}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              >
                {[3,5,7,9].map(num => (
                  <option key={num} value={num}>{num} juré{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL de l'affiche (optionnel)</label>
              <input
                type="url"
                name="afficheTournoi"
                value={formData.afficheTournoi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://exemple.com/affiche.jpg"
                disabled={loading}
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-border hover:border-primary/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ letterSpacing: "0.06em" }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Création...
                </>
              ) : (
                'Créer'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}