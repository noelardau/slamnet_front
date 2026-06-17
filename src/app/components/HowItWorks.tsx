import { motion } from "motion/react";
import { useLanguage } from "../../contexts/LanguageContext";

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      step: "01",
      key: "01",
    },
    {
      step: "02",
      key: "02",
    },
    {
      step: "03",
      key: "03",
    },
    {
      step: "04",
      key: "04",
    },
    {
      step: "05",
      key: "05",
    },
    {
      step: "06",
      key: "06",
    },
  ];
  return (
    <section id="how-it-works" className="py-28 border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-primary" />
            <span
              className="text-primary"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
            >
              {t('howItWorks')}
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
            {t('howItWorks.title')}
            <br />
            <span className="text-primary">{t('howItWorks.title1')}</span>
            <br />
            {t('howItWorks.title2')}
          </h2>
        </div>

        <div className="relative">
          {/* Vertical spine */}
          <div
            className="absolute left-[2.1rem] top-0 bottom-0 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, #ff4d00, rgba(255,77,0,0.1))" }}
          />

          <div className="flex flex-col gap-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative flex gap-8 items-start py-8 border-b border-border last:border-0"
              >
                 {/* Step number bubble */}
                 <div
                   className="relative z-10 flex-shrink-0 w-[4.2rem] h-[4.2rem] border border-border flex items-center justify-center group-hover:border-primary/60 transition-colors duration-300 bg-card text-primary"
                   style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}
                 >
                   {step.step}
                 </div>

                 <div className="flex-1 pt-2">
                   <h3
                     className="text-foreground mb-2 group-hover:text-primary transition-colors duration-300"
                     style={{ fontFamily: "Anton, sans-serif", fontSize: "1.3rem", letterSpacing: "0.02em" }}
                   >
                     {t(`step${step.key}.title`)}
                   </h3>
                   <p
                     className="text-muted-foreground"
                     style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}
                   >
                     {t(`step${step.key}.description`)}
                   </p>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
