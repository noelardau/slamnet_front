import { useState, useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { membreService, Membre, UpdateMembreData } from '../services/membreService';
import { useMembreStore } from '../stores/membreStore';
import { Edit2, X, Loader2, Camera } from 'lucide-react';

interface UpdateMembreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  membreId: number | null;
  onMembreUpdated: () => void;
}

export function UpdateMembreDialog({ isOpen, onClose, membreId, onMembreUpdated }: UpdateMembreDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();
  const { t } = useLanguage();
  const { updateMembre } = useMembreStore();
  const [membre, setMembre] = useState<Membre | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      setPreviewUrl(membreData.photoMembre || null);
    } catch (error) {
      console.error('Erreur lors du chargement du membre:', error);
      showError(t('updateMember.updateError'));
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/collectif/membre/${membreId}/photo`, {
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
      
      setFormData(prev => ({ ...prev, photoMembre: data.url }));
      setPreviewUrl(data.url);
      
      if (data.membre) {
        const updatedMembre = data.membre;
        setMembre(updatedMembre);
        
        const store = useMembreStore.getState();
        store.updateMembre(membreId, {
          photoMembre: data.url,
        });
      }
      
      showSuccess(t('updateMember.photoUploadSuccess'));
    } catch (error) {
      console.error('Erreur upload:', error);
      showError(t('updateMember.photoUploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!membreId) return;

    setIsSubmitting(true);

    try {
      await updateMembre(membreId, formData);
      showSuccess(t('updateMember.updatedSuccess'));
      onMembreUpdated();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du membre:', error);
      showError(t('updateMember.updateError'));
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
              {t('updateMember.title')}
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
              <p className="text-muted-foreground text-sm">{t('updateMember.loadingInfo')}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex justify-center mb-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-border flex items-center justify-center cursor-pointer hover:border-primary/60 transition-all duration-300 border-2 border-dashed" onClick={handleAvatarClick}>
                    {isUploading ? (
                      <Loader2 className="animate-spin text-primary" size={32} />
                    ) : previewUrl ? (
                      <img src={previewUrl} alt={t('updateMember.preview')} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera className="text-muted-foreground" size={32} />
                        <span className="absolute bottom-0 text-xs text-muted-foreground">{t('common.addPhoto')}</span>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('updateMember.lastName')}</label>
                    <input
                      type="text"
                      value={formData.nomMembre}
                      onChange={(e) => setFormData({ ...formData, nomMembre: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('updateMember.firstName')}</label>
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
                  <label className="block text-sm font-medium mb-2">{t('updateMember.pseudo')}</label>
                  <input
                    type="text"
                    value={formData.pseudoMembre}
                    onChange={(e) => setFormData({ ...formData, pseudoMembre: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                    placeholder={t('common.stageName')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('updateMember.email')}</label>
                  <input
                    type="email"
                    value={formData.emailMembre}
                    onChange={(e) => setFormData({ ...formData, emailMembre: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('updateMember.dateOfBirth')}</label>
                  <input
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('updateMember.address')}</label>
                  <input
                    type="text"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
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
                  {t('common.cancel')}
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
                      {t('common.updating')}
                    </>
                  ) : (
                    t('common.save')
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