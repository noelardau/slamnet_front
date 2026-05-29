import { motion } from "motion/react";

const steps = [
  {
    step: "01",
    title: "Créez votre collectif",
    description: "Inscrivez-vous en 2 minutes, nommez votre collectif et commencez à inviter vos poètes.",
  },
  {
    step: "02",
    title: "Enregistrez vos membres",
    description: "Ajoutez chaque slammeur avec son profil complet. Ils peuvent aussi rejoindre via un lien d'invitation.",
  },
  {
    step: "03",
    title: "Lancez un tournoi",
    description: "Créez un tournoi, définissez les rounds, ouvrez les inscriptions aux membres et aux invités.",
  },
  {
    step: "04",
    title: "Tirage & passages",
    description: "Déclenchez le tirage au sort. L'ordre de passage est généré automatiquement pour chaque tour.",
  },
  {
    step: "05",
    title: "Saisissez les notes",
    description: "Chaque juré note en direct. Le système calcule les moyennes et met à jour le classement.",
  },
  {
    step: "06",
    title: "Couronnez le champion",
    description: "Le classement final est établi. Partagez le podium, archivez l'événement.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-28 border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-primary" />
            <span
              className="text-primary"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
            >
              COMMENT ÇA MARCHE
            </span>
          </div>
          <h2
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 0.95,
              color: "#f2ede6",
            }}
          >
            DU COLLECTIF
            <br />
            <span style={{ color: "#ff4d00" }}>AU PODIUM</span>
            <br />
            EN 6 ÉTAPES.
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
                  className="relative z-10 flex-shrink-0 w-[4.2rem] h-[4.2rem] border border-border flex items-center justify-center group-hover:border-primary/60 transition-colors duration-300"
                  style={{ background: "#0c0a09", fontFamily: "Anton, sans-serif", fontSize: "1.2rem", color: "#ff4d00" }}
                >
                  {step.step}
                </div>

                <div className="flex-1 pt-2">
                  <h3
                    className="text-foreground mb-2 group-hover:text-primary transition-colors duration-300"
                    style={{ fontFamily: "Anton, sans-serif", fontSize: "1.3rem", letterSpacing: "0.02em" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-muted-foreground"
                    style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}
                  >
                    {step.description}
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
