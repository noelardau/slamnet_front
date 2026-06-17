export default function TermsPage() {
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
          CONDITIONS GÉNÉRALES
        </h1>
      </div>

      <div className="space-y-8 text-muted-foreground" style={{ lineHeight: 1.7 }}>
        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            Utilisation de la plateforme
          </h2>
          <p>
            Slam Net est destiné aux collectifs de slam poésie pour organiser des événements et gérer
            leurs membres. Toute utilisation abusive ou frauduleuse entraînera la suppression du compte.
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            Responsabilité
          </h2>
          <p>
            Slam Net ne peut être tenu responsable des dommages directs ou indirects résultant de
            l'utilisation de la plateforme. Les utilisateurs sont responsables du contenu qu'ils publient.
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            Propriété intellectuelle
          </h2>
          <p>
            Les créations originales (poèmes, textes, performances) restent la propriété de leurs auteurs.
            Slam Net ne revendique aucun droit sur le contenu créé par les utilisateurs.
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            Modification des conditions
          </h2>
          <p>
            Slam Net se réserve le droit de modifier ces conditions générales à tout moment.
            Les utilisateurs seront informés des changements importants.
          </p>
        </div>
      </div>
    </div>
  );
}