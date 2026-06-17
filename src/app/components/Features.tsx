import { motion } from "motion/react";
import { Users, Trophy, Shuffle, Star } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      number: "01",
      key: "01",
    },
    {
      icon: Trophy,
      number: "02",
      key: "02",
    },
    {
      icon: Shuffle,
      number: "03",
      key: "03",
    },
    {
      icon: Star,
      number: "04",
      key: "04",
    },
  ];

  return (
    <section id="features" className="py-28 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span
                className="text-primary"
                style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
              >
                {t('features')}
              </span>
            </div>
            <h2
              className="text-foreground"
              style={{
                fontFamily: "Anton, sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 0.95,
              }}
            >
              {t('features.title')}
              <br />
              {t('features.title1')}
              <br />
              <span className="text-primary">{t('features.title2')}</span>
            </h2>
          </div>
          <p
            className="text-muted-foreground"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "1rem", lineHeight: 1.75, maxWidth: 420 }}
          >
            {t('features.description')}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-background p-10 hover:bg-card transition-colors duration-300 cursor-default"
              >
                {/* Number watermark */}
                <div
                  className="absolute top-6 right-8 text-muted-foreground/15 select-none pointer-events-none"
                  style={{ fontFamily: "Anton, sans-serif", fontSize: "5rem", lineHeight: 1 }}
                >
                  {feature.number}
                </div>

                <div className="relative">
                  <div
                    className="w-12 h-12 border border-border flex items-center justify-center mb-6 group-hover:border-primary/50 transition-colors duration-300 bg-card"
                  >
                    <Icon size={20} className="text-primary" strokeWidth={1.5} />
                  </div>

                  <h3
                    className="mb-4 text-foreground"
                    style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem", letterSpacing: "0.02em" }}
                  >
                    {t(`feature${feature.key}.title`)}
                  </h3>

                  <p
                    className="text-muted-foreground mb-6"
                    style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}
                  >
                    {t(`feature${feature.key}.description`)}
                  </p>

                  <div
                    className="text-primary/70"
                    style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em" }}
                  >
                    {t(`feature${feature.key}.detail`)}
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute -bottom-10 left-0 right-0 h-px bg-primary/0 group-hover:bg-primary/30 transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}