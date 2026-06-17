import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { CreateTournoiData } from '../services/tournoiService';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';

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
    dureePerfo: '',
    tirageAuSort: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showError } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nomTournoi || !formData.LieuTournoi || !formData.dateTournoi || !formData.heureTournoi || !formData.nbJury) {
      setError(t('createTournoi.allFieldsRequired'));
      return;
    }

    if (formData.nbJury < 1) {
      setError(t('createTournoi.minJuryError'));
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('createTournoi.createError');
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    let convertedValue: string | number | boolean = value;
    
    if (name === 'nbJury') {
      convertedValue = Number(value);
    } else if (type === 'number') {
      convertedValue = value === '' ? 0 : Number(value);
    } else if (type === 'checkbox') {
      convertedValue = checked;
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
      dureePerfo: '',
      tirageAuSort: false,
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
              {t('createTournoi.title')}
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
              <label className="block text-sm font-medium mb-2">{t('createTournoi.name')}</label>
              <input
                type="text"
                name="nomTournoi"
                value={formData.nomTournoi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('createTournoi.namePlaceholder')}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('createTournoi.location')}</label>
              <input
                type="text"
                name="LieuTournoi"
                value={formData.LieuTournoi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('createTournoi.locationPlaceholder')}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('createTournoi.date')}</label>
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
              <label className="block text-sm font-medium mb-2">{t('createTournoi.time')}</label>
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
              <label className="block text-sm font-medium mb-2">{t('createTournoi.juryCount')}</label>
              <select
                name="nbJury"
                value={formData.nbJury}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              >
                {[3,5,7,9].map(num => (
                  <option key={num} value={num}>{num} {num > 1 ? t('tournois.jurors') : t('tournois.juror')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('createTournoi.duration')}</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    name="dureePerfoMinutes"
                    value={formData.dureePerfo?.split(':')[0] || ''}
                    onChange={(e) => {
                      const minutes = e.target.value;
                      const seconds = formData.dureePerfo?.split(':')[1] || '00';
                      setFormData(prev => ({
                        ...prev,
                        dureePerfo: minutes ? `${minutes}:${seconds}` : '',
                      }));
                    }}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('createTournoi.min')}
                    disabled={loading}
                    min="0"
                    max="60"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    name="dureePerfoSeconds"
                    value={formData.dureePerfo?.split(':')[1] || ''}
                    onChange={(e) => {
                      const minutes = formData.dureePerfo?.split(':')[0] || '00';
                      const seconds = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        dureePerfo: seconds ? `${minutes}:${seconds}` : '',
                      }));
                    }}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('createTournoi.sec')}
                    disabled={loading}
                    min="0"
                    max="59"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t('createTournoi.durationFormat')}</p>
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
              <label htmlFor="tirageAuSort" className="text-sm font-medium">{t('createTournoi.enableDraw')}</label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('createTournoi.posterUrl')}</label>
              <input
                type="url"
                name="afficheTournoi"
                value={formData.afficheTournoi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('createTournoi.posterPlaceholder')}
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
              {t('common.cancel')}
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
                  {t('common.creating')}
                </>
              ) : (
                t('common.create')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}