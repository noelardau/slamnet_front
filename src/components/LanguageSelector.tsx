import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCollectifStore } from '../stores/collectifStore';
import { Languages } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { updatePreferences } = useCollectifStore();

  const handleToggle = () => {
    const newLang = language === 'en' ? 'fr' : 'en';
    setLanguage(newLang);

    // Persister côté serveur uniquement si l'utilisateur est connecté
    if (isAuthenticated) {
      updatePreferences({ prefLang: newLang }).catch((err) => {
        console.error('Erreur lors de la sauvegarde de la langue:', err);
      });
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary/60 transition-all duration-300 text-sm"
      title={language === 'en' ? 'Switch to French' : 'Switch to English'}
    >
      <Languages size={16} />
      <span className="font-medium">{language === 'en' ? 'EN' : 'FR'}</span>
    </button>
  );
}
