import { motion } from "motion/react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Avant Slam Net, on gérait nos tournois sur des feuilles Excel. Maintenant le tirage au sort se fait en un clic et le classement apparaît en direct sur grand écran. Les poètes adorent.",
    author: "Kofi Mensah",
    role: "Coordinateur",
    collective: "Collectif Parole Libre — Lyon",
    avatar: "KM",
  },
  {
    quote:
      "On a 47 membres et on organisait des événements pour 200 personnes. Gérer ça à la main c'était l'enfer. Slam Net nous a sauvé la mise pour notre grande finale nationale.",
    author: "Yasmine Bouali",
    role: "Présidente",
    collective: "Association Voix du Sud — Marseille",
    avatar: "YB",
  },
  {
    quote:
      "La fonction d'inscription pour les invités est parfaite. On peut accueillir des slammeurs hors-collectif sans paperasse. Le système de notes est simple et les jurés l'ont pris en main en 5 minutes.",
    author: "Théo Garnier",
    role: "Organisateur événements",
    collective: "Le Verbe Urbain — Paris",
    avatar: "TG",
  },
];

export function Testimonials() {
  return (
    <section className="py-28 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-primary" />
            <span
              className="text-primary"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
            >
              ILS EN PARLENT
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
            LA VOIX
            <br />
            <span className="text-primary">DES COLLECTIFS.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background p-8 flex flex-col gap-6"
            >
              <Quote size={24} className="text-primary/50" strokeWidth={1.5} />

              <p
                className="text-foreground/85 flex-1"
                style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.925rem", lineHeight: 1.75, fontStyle: "italic" }}
              >
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                 <div
                   className="w-10 h-10 flex items-center justify-center flex-shrink-0 border border-primary/30 bg-card text-primary"
                   style={{
                     fontFamily: "Anton, sans-serif",
                     fontSize: "0.75rem",
                   }}
                 >
                   {t.avatar}
                 </div>
                <div>
                  <div
                    className="text-foreground"
                    style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: "0.875rem" }}
                  >
                    {t.author}
                  </div>
                  <div
                    className="text-muted-foreground"
                    style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.08em" }}
                  >
                    {t.role} · {t.collective}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
