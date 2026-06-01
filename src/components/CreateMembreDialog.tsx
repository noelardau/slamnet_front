import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useMembreStore } from '../stores/membreStore';
import { CreateMembreData } from '../services/membreService';
import { X, Loader2 } from 'lucide-react';

interface CreateMembreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMembreCreated: () => void;
}

export function CreateMembreDialog({ isOpen, onClose, onMembreCreated }: CreateMembreDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();
  const { createMembre } = useMembreStore();
  const [formData, setFormData] = useState<CreateMembreData>({
    nomMembre: '',
    prenomMembre: '',
    pseudoMembre: '',
    emailMembre: '',
    dateNaissance: '',
    adresse: '',
    photoMembre: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createMembre(formData);
      showSuccess('Membre créé avec succès');
      setFormData({
        nomMembre: '',
        prenomMembre: '',
        pseudoMembre: '',
        emailMembre: '',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={isSubmitting ? undefined : onClose} />
      <div className="relative bg-card border border-border w-full max-w-md max-h-[90vh] flex flex-col shadow-xl">
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 
              className="text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
            >
              Nouveau membre
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <input
                  type="text"
                  required
                  value={formData.nomMembre}
                  onChange={(e) => setFormData({ ...formData, nomMembre: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prénom *</label>
                <input
                  type="text"
                  required
                  value={formData.prenomMembre}
                  onChange={(e) => setFormData({ ...formData, prenomMembre: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pseudo *</label>
              <input
                type="text"
                required
                value={formData.pseudoMembre}
                onChange={(e) => setFormData({ ...formData, pseudoMembre: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
                placeholder="Nom de scène"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.emailMembre}
                onChange={(e) => setFormData({ ...formData, emailMembre: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date de naissance *</label>
              <input
                type="date"
                required
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Adresse *</label>
              <input
                type="text"
                required
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL de la photo (optionnel)</label>
              <input
                type="url"
                value={formData.photoMembre}
                onChange={(e) => setFormData({ ...formData, photoMembre: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
                placeholder="https://..."
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-border hover:border-primary/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ letterSpacing: "0.06em" }}
            >
              {isSubmitting ? (
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