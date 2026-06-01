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
    pseudoMembre: '',
    emailMembre: '',
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
        pseudoMembre: membreData.pseudoMembre,
        emailMembre: membreData.emailMembre,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={isSubmitting || isLoading ? undefined : onClose} />
      <div className="relative bg-card border border-border w-full max-w-md max-h-[90vh] flex flex-col shadow-xl">
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 
              className="text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
            >
              Modifier le membre
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting || isLoading}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 flex items-center justify-center flex-1">
            <div className="text-center">
              <Loader2 className="animate-spin text-primary mx-auto mb-4" size={32} />
              <p className="text-muted-foreground text-sm">Chargement des informations...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.nomMembre}
                      onChange={(e) => setFormData({ ...formData, nomMembre: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Prénom</label>
                    <input
                      type="text"
                      value={formData.prenomMembre}
                      onChange={(e) => setFormData({ ...formData, prenomMembre: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pseudo</label>
                  <input
                    type="text"
                    value={formData.pseudoMembre}
                    onChange={(e) => setFormData({ ...formData, pseudoMembre: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                    placeholder="Nom de scène"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.emailMembre}
                    onChange={(e) => setFormData({ ...formData, emailMembre: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date de naissance</label>
                  <input
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Adresse</label>
                  <input
                    type="text"
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
                      Mise à jour...
                    </>
                  ) : (
                    'Mettre à jour'
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}