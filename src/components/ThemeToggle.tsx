import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 border border-border rounded-lg flex items-center justify-center">
        <div className="w-4 h-4 bg-muted-foreground/20 rounded animate-pulse" />
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 border border-border rounded-lg flex items-center justify-center hover:border-primary/60 transition-all duration-300 hover:scale-105 active:scale-95"
      title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
      aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
    >
      {theme === 'dark' ? (
        <Moon size={18} className="text-foreground" />
      ) : (
        <Sun size={18} className="text-foreground" />
      )}
    </button>
  );
}