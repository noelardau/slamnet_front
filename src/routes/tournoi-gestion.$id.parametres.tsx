import { useOutletContext } from 'react-router-dom';
import { Clock, Shuffle, Save, Loader2, Users } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTournoiStore } from '../stores/tournoiStore';

export default function TournoiParametres() {
  const { tournoi } = useOutletContext<any>();
  const { showSuccess, showError } = useToast();
  const { t } = useLanguage();
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
      showSuccess(t('tournoiParametres.updateSuccess'));
    } catch (error) {
      showError(t('tournoiParametres.updateError'));
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
        {t('tournoiParametres.title')}
      </h2>

      <div className="max-w-2xl space-y-6">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-primary" size={20} />
            <h3 className="text-foreground font-medium text-lg">{t('tournoiParametres.durationSection')}</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('tournoiParametres.maxDurationLabel')}
            </label>
            <input
              type="text"
              value={dureePerfo}
              onChange={(e) => setDureePerfo(e.target.value)}
              placeholder={t('tournoiParametres.durationPlaceholder')}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('tournoiParametres.durationFormat')}
            </p>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-primary" size={20} />
            <h3 className="text-foreground font-medium text-lg">{t('tournoiParametres.jurySection')}</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('tournoiParametres.juryCountLabel')}
            </label>
            <input
              type="number"
              min="1"
              value={nbJury}
              onChange={(e) => setNbJury(Number(e.target.value))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('tournoiParametres.juryCountDescription')}
            </p>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shuffle className="text-primary" size={20} />
            <h3 className="text-foreground font-medium text-lg">{t('tournoiParametres.drawSection')}</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">{t('tournoiParametres.enableDraw')}</p>
              <p className="text-sm text-muted-foreground">
                {t('tournoiParametres.enableDrawDescription')}
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
                {t('tournoiParametres.saving')}
              </>
            ) : (
              <>
                <Save size={16} />
                {t('tournoiParametres.save')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}