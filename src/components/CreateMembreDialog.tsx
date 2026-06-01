import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { membreService, CreateMembreData } from '../services/membreService';
import { Plus, X } from 'lucide-react';

interface CreateMembreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMembreCreated: () => void;
}

export function CreateMembreDialog({ isOpen, onClose, onMembreCreated }: CreateMembreDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState<CreateMembreData>({
    nomMembre: '',
    prenomMembre: '',
    dateNaissance: '',
    adresse: '',
    photoMembre: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await membreService.createMembre(formData);
      showSuccess('Membre créé avec succès');
      setFormData({
        nomMembre: '',
        prenomMembre: '',
        dateNaissance: '',
        adresse: '',
        photoMembre: '',
      });
      onMembreCreated();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du membre:', error);
      showError('Erreur lors de la création du membre');
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
              AJOUTER UN MEMBRE
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Nom *</label>
            <input
              type="text"
              required
              value={formData.nomMembre}
              onChange={(e) => setFormData({ ...formData, nomMembre: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border focus:border-primary focus:outline-none transition-colors"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Prénom *</label>
            <input
              type="text"
              required
              value={formData.prenomMembre}
              onChange={(e) => setFormData({ ...formData, prenomMembre: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border focus:border-primary focus:outline-none transition-colors"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Date de naissance *</label>
            <input
              type="date"
              required
              value={formData.dateNaissance}
              onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border focus:border-primary focus:outline-none transition-colors"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Adresse *</label>
            <input
              type="text"
              required
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
                  Création...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Créer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}