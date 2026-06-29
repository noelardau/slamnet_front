import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuthModal } from "../../contexts/AuthModalContext";

export function Plans() {
  const { t } = useLanguage();
  const { openSignupModal } = useAuthModal();

  const plans = [
    {
      key: "free",
      icon: null,
      popular: false,
    },
    {
      key: "pro",
      icon: Sparkles,
      popular: true,
    },
    {
      key: "enterprise",
      icon: null,
      popular: false,
    },
  ];

  return (
    <section id="plans" className="py-28 border-t border-border bg-card">
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
                {t('plans')}
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
              {t('plans.title')}
              <br />
              {t('plans.title1')}
              <br />
              <span className="text-primary">{t('plans.title2')}</span>
            </h2>
          </div>
          <p
            className="text-muted-foreground"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "1rem", lineHeight: 1.75, maxWidth: 420 }}
          >
            {t('plans.description')}
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const priceKey = t(`plans.${plan.key}.price`);
            const isPriceNumeric = /\d/.test(priceKey);
            const isPopular = plan.popular;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {/* Gradient glow on popular plan */}
                {isPopular && (
                  <div
                    className="absolute -inset-px rounded-lg opacity-70 blur-sm pointer-events-none"
                    style={{ background: "linear-gradient(180deg, #ff4d00, #ffe033)" }}
                  />
                )}

                <div
                  className={`relative h-full flex flex-col border bg-background transition-colors duration-300 ${
                    isPopular
                      ? "border-primary/40"
                      : "border-border hover:border-foreground/20"
                  }`}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div
                      className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2"
                      style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", fontWeight: 700 }}
                    >
                      {Icon && <Icon size={12} />}
                      {t('plans.popular')}
                    </div>
                  )}

                  <div className="p-8 flex flex-col h-full">
                    {/* Name */}
                    <h3
                      className="text-foreground"
                      style={{ fontFamily: "Anton, sans-serif", fontSize: "1.6rem", letterSpacing: "0.04em" }}
                    >
                      {t(`plans.${plan.key}.name`)}
                    </h3>

                    {/* Price */}
                    <div className="mt-4 flex items-baseline gap-2">
                      <span
                        className={isPopular ? "text-primary" : "text-foreground"}
                        style={{ fontFamily: "Anton, sans-serif", fontSize: "3rem", lineHeight: 1 }}
                      >
                        {priceKey}
                      </span>
                      {isPriceNumeric && (
                        <span
                          className="text-muted-foreground"
                          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", letterSpacing: "0.1em" }}
                        >
                          {t('plans.perMonth')}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p
                      className="mt-3 text-muted-foreground"
                      style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem", lineHeight: 1.6, minHeight: "2.6em" }}
                    >
                      {t(`plans.${plan.key}.description`)}
                    </p>

                    {/* Divider */}
                    <div className="my-6 h-px bg-border" />

                    {/* Features */}
                    <ul className="flex flex-col gap-3 flex-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                        const featureKey = `plans.${plan.key}.feature0${n}`;
                        return (
                          <li key={n} className="flex items-start gap-3">
                            <Check
                              size={15}
                              className={`mt-0.5 shrink-0 ${isPopular ? "text-primary" : "text-primary/70"}`}
                              strokeWidth={2.5}
                            />
                            <span
                              className="text-foreground"
                              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem", lineHeight: 1.5 }}
                            >
                              {t(featureKey)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={openSignupModal}
                      className={`mt-8 w-full flex items-center justify-center gap-2 px-6 py-3.5 transition-all duration-200 ${
                        isPopular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-border text-foreground hover:border-primary hover:text-primary"
                      }`}
                      style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, letterSpacing: "0.06em", fontSize: "0.8rem" }}
                    >
                      {t(`plans.${plan.key}.cta`)}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
