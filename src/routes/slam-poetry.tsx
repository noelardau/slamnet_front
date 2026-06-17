import { useLanguage } from '../contexts/LanguageContext';

export default function SlamPoetryPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-5xl font-bold text-center mb-12 text-foreground" style={{ fontFamily: 'Anton, sans-serif' }}>
          {t('slamPoetry.title')}
        </h1>

        <div className="space-y-12">
          <section className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t('slamPoetry.whatsTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('slamPoetry.whatsP1') }} />
            <p className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('slamPoetry.whatsP2') }} />
            <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t('slamPoetry.whatsP3') }} />
          </section>

          <section className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t('slamPoetry.historyTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('slamPoetry.historyP1') }} />
            <p className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('slamPoetry.historyP2') }} />
            <p className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('slamPoetry.historyP3') }} />
            <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t('slamPoetry.historyP4') }} />
          </section>

          <section className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t('slamPoetry.rulesTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t('slamPoetry.rulesIntro') }} />
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.rule1') }} />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.rule2') }} />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.rule3') }} />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.rule4') }} />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.rule5') }} />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.rule6') }} />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.rule7') }} />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.rule8') }} />
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t('slamPoetry.valuesTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('slamPoetry.valuesP1') }} />
            <p className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('slamPoetry.valuesP2') }} />
            <p className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('slamPoetry.valuesP3') }} />
            <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t('slamPoetry.valuesP4') }} />
          </section>

          <section className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t('slamPoetry.worldTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('slamPoetry.worldIntro') }} />
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.worldFrance') }} />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.worldBelgium') }} />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.worldSwitzerland') }} />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.worldQuebec') }} />
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('slamPoetry.worldIndianOcean') }} />
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}