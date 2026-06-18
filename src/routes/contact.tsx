import { useLanguage } from '../contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h1
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 0.95,
          }}
          className="text-foreground"
        >
          {t('contact.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
              {t('contact.email.title')}
            </h2>
            <a href="mailto:slamnetmada@protonmail.com" className="text-muted-foreground hover:text-primary transition-colors">
              slamnetmada@protonmail.com
            </a>
          </div>

          <div>
            <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
              {t('contact.phone.title')}
            </h2>
            <a href="tel:+261347717542" className="text-muted-foreground hover:text-primary transition-colors">
              +261 34 77 175 42
            </a>
          </div>

          <div>
            <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
              {t('contact.address.title')}
            </h2>
            <p className="text-muted-foreground">
              Madagascar - Fianarantsoa 301
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}