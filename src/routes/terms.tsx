import { useLanguage } from '../contexts/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h1
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 0.95,
            color: "#f2ede6",
          }}
        >
          {t('terms.title')}
        </h1>
      </div>

      <div className="space-y-8 text-muted-foreground" style={{ lineHeight: 1.7 }}>
        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            {t('terms.platformUsage.title')}
          </h2>
          <p>
            {t('terms.platformUsage.description')}
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            {t('terms.liability.title')}
          </h2>
          <p>
            {t('terms.liability.description')}
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            {t('terms.intellectualProperty.title')}
          </h2>
          <p>
            {t('terms.intellectualProperty.description')}
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            {t('terms.modification.title')}
          </h2>
          <p>
            {t('terms.modification.description')}
          </p>
        </div>
      </div>
    </div>
  );
}