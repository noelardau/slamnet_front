import { useState, useEffect, useRef } from 'react';
import { Loader2, X, Camera } from 'lucide-react';
import { UpdateTournoiData } from '../services/tournoiService';
import { Tournoi } from '../services/tournoiService';
import { useToast } from '../contexts/ToastContext';
import { useTournoiStore } from '../stores/tournoiStore';

interface UpdateTournoiDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdateTournoiData) => Promise<void>;
  tournoi: Tournoi | null;
}

export function UpdateTournoiDialog({ isOpen, onClose, onSubmit, tournoi }: UpdateTournoiDialogProps) {
  const [formData, setFormData] = useState<UpdateTournoiData>({
    nomTournoi: '',
    LieuTournoi: '',
    dateTournoi: '',
    heureTournoi: '',
    nbJury: 3,
    afficheTournoi: '',
    dureePerfo: '',
    tirageAuSort: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { showError, showSuccess } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateTournoi } = useTournoiStore();

  useEffect(() => {
    if (tournoi && isOpen) {
      setFormData({
        nomTournoi: tournoi.nomTournoi,
        LieuTournoi: tournoi.LieuTournoi,
        dateTournoi: tournoi.dateTournoi,
        heureTournoi: tournoi.heureTournoi,
        nbJury: tournoi.nbJury,
        afficheTournoi: tournoi.afficheTournoi || '',
        dureePerfo: tournoi.dureePerfo || '',
        tirageAuSort: tournoi.tirageAuSort || false,
      });
      setPreviewUrl(tournoi.afficheTournoi || null);
    }
  }, [tournoi, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('affiche', file);

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/collectif/tournoi/${tournoi.idTournoi}/affiche`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      
      setFormData(prev => ({ ...prev, afficheTournoi: data.url }));
      setPreviewUrl(data.url);
      
      if (data.tournoi) {
        const updatedTournoi = data.tournoi;
        
        const store = useTournoiStore.getState();
        store.updateTournoi(tournoi.idTournoi, {
          afficheTournoi: data.url,
        });
      }
      
      showSuccess('Affiche uploadée avec succès');
    } catch (error) {
      console.error('Erreur upload:', error);
      showError('Erreur lors de l\'upload de l\'affiche');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAfficheClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!tournoi) return;

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
      await onSubmit(tournoi.idTournoi, formData);
      handleClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification du tournoi';
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
    if (tournoi) {
      setFormData({
        nomTournoi: tournoi.nomTournoi,
        LieuTournoi: tournoi.LieuTournoi,
        dateTournoi: tournoi.dateTournoi,
        heureTournoi: tournoi.heureTournoi,
        nbJury: tournoi.nbJury,
        afficheTournoi: tournoi.afficheTournoi || '',
      });
    }
    setError('');
    onClose();
  };

  if (!isOpen || !tournoi) return null;

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
              Modifier le tournoi
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
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-48 rounded-lg overflow-hidden bg-border flex items-center justify-center cursor-pointer hover:border-primary/60 transition-all duration-300 border-2 border-dashed" onClick={handleAfficheClick}>
                {isUploading ? (
                  <Loader2 className="animate-spin text-primary" size={32} />
                ) : previewUrl ? (
                  <img src={previewUrl} alt="Affiche du tournoi" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="text-muted-foreground" size={32} />
                    <span className="absolute bottom-0 text-xs text-muted-foreground">Ajouter</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

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
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <option key={num} value={num}>{num} juré{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Durée par performance (optionnel)</label>
              <input
                type="text"
                name="dureePerfo"
                value={formData.dureePerfo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: 3 min, 5 min, etc."
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="tirageAuSort"
                id="tirageAuSort"
                checked={formData.tirageAuSort}
                onChange={handleChange}
                className="w-5 h-5 rounded border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
              <label htmlFor="tirageAuSort" className="text-sm font-medium">Activer le tirage au sort des participants</label>
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
                  Modification...
                </>
              ) : (
                'Enregistrer'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}