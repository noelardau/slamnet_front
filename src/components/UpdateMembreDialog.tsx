import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { membreService, Membre, UpdateMembreData } from '../services/membreService';
import { Edit2, X, Loader2 } from 'lucide-react';

interface UpdateMembreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  membreId: number | null;
  onMembreUpdated: () => void;
}

export function UpdateMembreDialog({ isOpen, onClose, membreId, onMembreUpdated }: UpdateMembreDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const [membre, setMembre] = useState<Membre | null>(null);
  const [formData, setFormData] = useState<UpdateMembreData>({
    nomMembre: '',
    prenomMembre: '',
    dateNaissance: '',
    adresse: '',
    photoMembre: '',
  });

  useEffect(() => {
    if (isOpen && membreId) {
      loadMembre();
    }
  }, [isOpen, membreId]);

  const loadMembre = async () => {
    if (!membreId) return;
    
    setIsLoading(true);
    try {
      const membreData = await membreService.getMembre(membreId);
      setMembre(membreData);
      setFormData({
        nomMembre: membreData.nomMembre,
        prenomMembre: membreData.prenomMembre,
        dateNaissance: membreData.dateNaissance.split('T')[0],
        adresse: membreData.adresse,
        photoMembre: membreData.photoMembre || '',
      });
    } catch (error) {
      console.error('Erreur lors du chargement du membre:', error);
      showError('Erreur lors du chargement du membre');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!membreId) return;

    setIsSubmitting(true);

    try {
      await membreService.updateMembre(membreId, formData);
      showSuccess('Membre mis à jour avec succès');
      onMembreUpdated();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du membre:', error);
      showError('Erreur lors de la mise à jour du membre');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-md">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 
              className="text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}
            >
              MODIFIER LE MEMBRE
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSubmitting || isLoading}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="animate-spin text-primary mx-auto mb-4" size={32} />
              <p className="text-muted-foreground text-sm">Chargement des informations...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Nom</label>
              <input
                type="text"
                value={formData.nomMembre}
                onChange={(e) => setFormData({ ...formData, nomMembre: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Prénom</label>
              <input
                type="text"
                value={formData.prenomMembre}
                onChange={(e) => setFormData({ ...formData, prenomMembre: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Date de naissance</label>
              <input
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Adresse</label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">URL de la photo (optionnel)</label>
              <input
                type="url"
                value={formData.photoMembre}
                onChange={(e) => setFormData({ ...formData, photoMembre: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                disabled={isSubmitting}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-border hover:border-primary/60 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Edit2 size={16} />
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}