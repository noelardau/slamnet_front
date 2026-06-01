import { motion } from "motion/react";
import { Users, Trophy, Shuffle, Star } from "lucide-react";

const features = [
  {
    icon: Users,
    number: "01",
    title: "GESTION DES MEMBRES",
    description:
      "Enregistrez chaque poète de votre collectif — nom, contact, biographie, historique de performances. Un annuaire complet, toujours à portée de main.",
    detail: "Profils détaillés · Historique · Statuts",
  },
  {
    icon: Trophy,
    number: "02",
    title: "TOURNOIS ORGANISÉS",
    description:
      "Créez des tournois, définissez les règles, gérez les inscriptions — membres du collectif ou invités extérieurs. Chaque événement, de A à Z.",
    detail: "Multi-tours · Invités · Inscriptions en ligne",
  },
  {
    icon: Shuffle,
    number: "03",
    title: "TIRAGE AU SORT",
    description:
      "Le tirage au sort automatique décide de l'ordre de passage à chaque tour. Transparent, impartial, sans friction.",
    detail: "Aléatoire certifié · Ronde par ronde · Export PDF",
  },
  {
    icon: Star,
    number: "04",
    title: "NOTES & CLASSEMENTS",
    description:
      "Saisissez les notes des jurés en direct. Le classement se met à jour instantanément. La scène connaît son champion dès la dernière note tombée.",
    detail: "Notes en temps réel · Jury multiple · Podium",
  },
];

export function Features() {
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
                FONCTIONNALITÉS
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
              TOUT CE DONT
              <br />
              VOTRE COLLECTIF
              <br />
              <span className="text-primary">A BESOIN.</span>
            </h2>
          </div>
          <p
            className="text-muted-foreground"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "1rem", lineHeight: 1.75, maxWidth: 420 }}
          >
            Une seule plateforme pour gérer la vie de votre collectif de slam — des membres aux podiums, en passant
            par chaque vers prononcé sur scène.
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
                    {feature.title}
                  </h3>

                  <p
                    className="text-muted-foreground mb-6"
                    style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </p>

                  <div
                    className="text-primary/70"
                    style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em" }}
                  >
                    {feature.detail}
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
