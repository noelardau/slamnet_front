import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuthModal } from "../../contexts/AuthModalContext";

type Partner = {
  name: string;
  tagline: string;
  logo: (props: { className?: string }) => JSX.Element;
};

const LigueSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="32" r="20" />
    <path d="M32 12 v40 M12 32 h40" opacity="0.4" />
    <circle cx="32" cy="32" r="6" fill="currentColor" stroke="none" />
  </svg>
);

const FestivalSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 48 L24 20 L32 36 L40 20 L52 48" />
    <circle cx="32" cy="12" r="3" fill="currentColor" stroke="none" />
    <path d="M32 15 L32 20" opacity="0.5" />
  </svg>
);

const CafeSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 24 h28 v16 a14 14 0 0 1 -28 0 z" />
    <path d="M44 28 h6 a6 6 0 0 1 0 12 h-6" />
    <path d="M22 14 c-2 3 2 6 0 9 M30 12 c-2 3 2 6 0 9 M38 14 c-2 3 2 6 0 9" opacity="0.6" />
  </svg>
);

const EditionsSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16 L32 12 L52 16 L52 50 L32 46 L12 50 Z" />
    <path d="M32 12 L32 46" opacity="0.5" />
    <path d="M22 24 h-4 M22 30 h-4 M46 24 h-4 M46 30 h-4" opacity="0.6" />
  </svg>
);

const RadioSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="38" r="6" fill="currentColor" stroke="none" />
    <path d="M20 26 a16 16 0 0 1 24 0" opacity="0.7" />
    <path d="M14 20 a26 26 0 0 1 36 0" opacity="0.4" />
    <path d="M26 38 L18 14" opacity="0.5" />
    <rect x="14" y="46" width="36" height="6" rx="1" />
  </svg>
);

const MaisonSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 30 L32 14 L52 30" />
    <path d="M16 28 v22 h32 v-22" />
    <path d="M26 50 v-12 h12 v12" opacity="0.6" />
  </svg>
);

const PARTNERS: Partner[] = [
  { name: "Ligue Slam France", tagline: "FR", logo: LigueSvg },
  { name: "Festival du Verbe", tagline: "FESTIVAL", logo: FestivalSvg },
  { name: "Café des Poètes", tagline: "SCÈNE", logo: CafeSvg },
  { name: "Éditions Méridienne", tagline: "ÉDITEUR", logo: EditionsSvg },
  { name: "Radio Fréquence Mot", tagline: "RADIO", logo: RadioSvg },
  { name: "Maison de la Parole", tagline: "CULTURE", logo: MaisonSvg },
];

export function Partners() {
  const { t } = useLanguage();
  const { openSignupModal } = useAuthModal();

  return (
    <section id="partners" className="py-28 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span
                className="text-primary"
                style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
              >
                {t('partners')}
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
              {t('partners.title')}
              <br />
              {t('partners.title1')}
              <br />
              <span className="text-primary">{t('partners.title2')}</span>
            </h2>
          </div>
          <p
            className="text-muted-foreground"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "1rem", lineHeight: 1.75, maxWidth: 440 }}
          >
            {t('partners.description')}
          </p>
        </div>

        {/* Partners grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
          {PARTNERS.map((partner, i) => {
            const Logo = partner.logo;
            return (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative bg-background p-10 flex flex-col items-center justify-center text-center hover:bg-card transition-colors duration-300 cursor-default"
              >
                <div className="relative flex flex-col items-center gap-4">
                  <div
                    className="text-muted-foreground/60 group-hover:text-primary transition-colors duration-300"
                    style={{ width: 56, height: 56 }}
                  >
                    <Logo className="w-full h-full" />
                  </div>
                  <div>
                    <div
                      className="text-foreground group-hover:text-primary transition-colors duration-300"
                      style={{ fontFamily: "Anton, sans-serif", fontSize: "1.05rem", letterSpacing: "0.02em" }}
                    >
                      {partner.name}
                    </div>
                    <div
                      className="mt-1 text-muted-foreground"
                      style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem", letterSpacing: "0.18em" }}
                    >
                      {partner.tagline}
                    </div>
                  </div>
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/0 group-hover:bg-primary/40 transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>

        {/* Become partner CTA */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={openSignupModal}
            className="group inline-flex items-center gap-3 border border-border text-foreground px-8 py-4 hover:border-primary hover:text-primary transition-all duration-200 hover:gap-4"
            style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 500, letterSpacing: "0.06em", fontSize: "0.8rem" }}
          >
            {t('partners.becomePartner')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
