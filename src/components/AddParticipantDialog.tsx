import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Loader2, UserPlus } from 'lucide-react';

interface AddParticipantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onParticipantAdded: () => void;
  tournamentId: number;
}

export function AddParticipantDialog({ isOpen, onClose, onParticipantAdded, tournamentId }: AddParticipantDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestFormData, setGuestFormData] = useState({
    nomGuest: '',
    prenomGuest: '',
    emailGuest: '',
    telephone: '',
  });

  const handleSubmitParticipant = async () => {
    setIsSubmitting(true);
    try {
      const { useParticipantStore } = await import('../stores/participantStore');
      const { addParticipant } = useParticipantStore.getState();
      
      await addParticipant(tournamentId);
      showSuccess('Inscription au tournoi réussie');
      onParticipantAdded();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      showError('Erreur lors de l\'inscription au tournoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { useParticipantStore } = await import('../stores/participantStore');
      const { addGuest } = useParticipantStore.getState();
      
      await addGuest(tournamentId, guestFormData);
      showSuccess('Invité inscrit au tournoi avec succès');
      setGuestFormData({
        nomGuest: '',
        prenomGuest: '',
        emailGuest: '',
        telephone: '',
      });
      setShowGuestForm(false);
      onParticipantAdded();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'inscription de l\'invité:', error);
      showError('Erreur lors de l\'inscription de l\'invité');
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
              Ajouter un participant
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!showGuestForm ? (
            <div className="space-y-4">
              <button
                onClick={handleSubmitParticipant}
                disabled={isSubmitting}
                className="w-full p-4 border border-border hover:border-primary/60 rounded-lg transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <UserPlus className="text-primary" size={20} />
                <div className="text-left">
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                    M'inscrire au tournoi
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ajouter votre profil en tant que participant
                  </div>
                </div>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">ou</span>
                </div>
              </div>

              <button
                onClick={() => setShowGuestForm(true)}
                disabled={isSubmitting}
                className="w-full p-4 border border-border hover:border-primary/60 rounded-lg transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <UserPlus className="text-primary" size={20} />
                <div className="text-left">
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Ajouter un invité
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Inscrire une personne externe au tournoi
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitGuest} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom *</label>
                  <input
                    type="text"
                    required
                    value={guestFormData.nomGuest}
                    onChange={(e) => setGuestFormData({ ...guestFormData, nomGuest: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={guestFormData.prenomGuest}
                    onChange={(e) => setGuestFormData({ ...guestFormData, prenomGuest: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={guestFormData.emailGuest}
                  onChange={(e) => setGuestFormData({ ...guestFormData, emailGuest: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={guestFormData.telephone}
                  onChange={(e) => setGuestFormData({ ...guestFormData, telephone: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                  placeholder="Optionnel"
                />
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                if (showGuestForm) {
                  setShowGuestForm(false);
                } else {
                  onClose();
                }
              }}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-border hover:border-primary/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showGuestForm ? 'Retour' : 'Annuler'}
            </button>
            {showGuestForm && (
              <button
                onClick={handleSubmitGuest}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ letterSpacing: "0.06em" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Inscription...
                  </>
                ) : (
                  'Inscrire'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}