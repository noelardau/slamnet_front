import { useLanguage } from '../contexts/LanguageContext';
import { Languages } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary/60 transition-all duration-300 text-sm"
      title={language === 'en' ? 'Switch to French' : 'Switch to English'}
    >
      <Languages size={16} />
      <span className="font-medium">{language === 'en' ? 'EN' : 'FR'}</span>
    </button>
  );
}