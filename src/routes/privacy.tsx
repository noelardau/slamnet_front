import { useLanguage } from '../contexts/LanguageContext';

export default function PrivacyPage() {
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
          {t('privacy.title')}
        </h1>
      </div>

      <div className="space-y-8 text-muted-foreground" style={{ lineHeight: 1.7 }}>
        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            {t('privacy.dataCollection.title')}
          </h2>
          <p>
            {t('privacy.dataCollection.description')}
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            {t('privacy.dataUsage.title')}
          </h2>
          <p>
            {t('privacy.dataUsage.description')}
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            {t('privacy.hosting.title')}
          </h2>
          <p>
            {t('privacy.hosting.description')}
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            {t('privacy.yourRights.title')}
          </h2>
          <p>
            {t('privacy.yourRights.description')}
          </p>
        </div>
      </div>
    </div>
  );
}