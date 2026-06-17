import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <span
            className="text-primary"
            style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}
          >
            SLAM
          </span>
          <span
            className="text-foreground"
            style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}
          >
            NET
          </span>
        </Link>

        <p
          className="text-muted-foreground"
          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em" }}
        >
          {t('footer.copyright')}
        </p>

        <div className="flex gap-6">
          {[
            { label: t('footer.privacy'), to: '/privacy' },
            { label: t('footer.terms'), to: '/terms' },
            { label: t('footer.contact'), to: '/contact' },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
