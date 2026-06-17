import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navbar
    'nav.dashboard': 'Dashboard',
    'nav.members': 'Members',
    'nav.tournaments': 'Tournaments',
    'nav.features': 'Features',
    'nav.howItWorks': 'How It Works',
    'nav.collectives': 'Collectives',
    'nav.login': 'Login',
    'nav.signup': 'Create Account',
    'nav.myProfile': 'My Profile',
    'nav.logout': 'Logout',
    'nav.loggingOut': 'Logging out...',
    'nav.logoutConfirm': 'Are you sure you want to logout?',
    'nav.cancel': 'Cancel',
    'nav.logoutTitle': 'Logout',
    
    // Hero
    'hero.platform': 'The slam poetry collective platform',
    'hero.title': 'MANAGE YOUR',
    'hero.title1': 'WORDS.',
    'hero.title2': 'YOUR STAGES.',
    'hero.title3': 'YOUR POETS.',
    'hero.description': 'Slam Net is the platform dedicated to slam poetry collectives — manage your members, organize tournaments, draw passages and follow rankings in real time.',
    'hero.createCollective': 'CREATE MY COLLECTIVE',
    'hero.watchDemo': 'WATCH A DEMO',
    'hero.liveRanking': 'LIVE RANKING',
    'hero.tournamentInProgress': 'TOURNAMENT IN PROGRESS',
    'hero.explore': 'EXPLORE',
    
    // Features
    'features': 'FEATURES',
    'features.title': 'EVERYTHING YOUR',
    'features.title1': 'COLLECTIVE',
    'features.title2': 'NEEDS.',
    'features.description': 'A single platform to manage the life of your slam collective — from members to podiums, through every verse spoken on stage.',
    'feature01.title': 'MEMBER MANAGEMENT',
    'feature01.description': 'Register each poet of your collective — name, contact, biography, performance history. A complete directory, always at hand.',
    'feature01.detail': 'Detailed profiles · History · Status',
    'feature02.title': 'ORGANIZED TOURNAMENTS',
    'feature02.description': 'Create tournaments, set rules, manage registrations — collective members or external guests. Every event, from A to Z.',
    'feature02.detail': 'Multi-rounds · Guests · Online registration',
    'feature03.title': 'RANDOM DRAW',
    'feature03.description': 'The automatic draw decides the order of passage for each round. Transparent, impartial, without friction.',
    'feature03.detail': 'Certified random · Round by round · PDF export',
    'feature04.title': 'SCORES & RANKINGS',
    'feature04.description': 'Enter jury scores live. Rankings update instantly. The stage knows its champion as soon as the last score falls.',
    'feature04.detail': 'Real-time scores · Multiple juries · Podium',
    
    // How it works
    'howItWorks': 'HOW IT WORKS',
    'howItWorks.title': 'FROM COLLECTIVE',
    'howItWorks.title1': 'TO PODIUM',
    'howItWorks.title2': 'IN 6 STEPS.',
    'step01.title': 'Create your collective',
    'step01.description': 'Sign up in 2 minutes, name your collective and start inviting your poets.',
    'step02.title': 'Register your members',
    'step02.description': 'Add each slammer with their complete profile. They can also join via an invitation link.',
    'step03.title': 'Launch a tournament',
    'step03.description': 'Create a tournament, define rounds, open registrations to members and guests.',
    'step04.title': 'Draw & passages',
    'step04.description': 'Trigger the draw. The order of passage is automatically generated for each round.',
    'step05.title': 'Enter scores',
    'step05.description': 'Each juror scores live. The system calculates averages and updates the ranking.',
    'step06.title': 'Crown the champion',
    'step06.description': 'The final ranking is established. Share the podium, archive the event.',
    
    // CTA
    'cta.freeToStart': 'FREE TO START',
    'cta.title': 'YOUR COLLECTIVE',
    'cta.title1': 'DESERVES A',
    'cta.title2': 'REAL STAGE.',
    'cta.description': 'Join the slam collectives that organize their events with Slam Net. Free registration, no card required.',
    'cta.createFreeAccount': 'CREATE FREE ACCOUNT',
    
    // Auth modals
    'auth.login': 'LOGIN',
    'auth.signup': 'SIGNUP',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm password',
    'auth.emailPlaceholder': 'your@email.com',
    'auth.passwordPlaceholder': '••••••••',
    'auth.signIn': 'Sign in',
    'auth.signingIn': 'Signing in...',
    'auth.createAccount': 'Create my account',
    'auth.creatingAccount': 'Creating account...',
    'auth.collectiveName': 'Collective name',
    'auth.collectiveNamePlaceholder': 'Your collective name',
    'auth.city': 'City',
    'auth.cityPlaceholder': 'Your city',
    'auth.noAccount': 'No account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.signUp': 'Sign up',
    'auth.loginLink': 'Login',
    'auth.emailPasswordRequired': 'Email and password required',
    'auth.invalidEmail': 'Invalid email format',
    'auth.allFieldsRequired': 'All fields must be filled',
    'auth.passwordMinLength': 'Password must contain at least 6 characters',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.loginSuccess': 'Login successful',
    'auth.signupSuccess': 'Account created successfully',
    'auth.loginError': 'Error during login',
    'auth.signupError': 'Error during signup',
    'auth.loggingIn': 'Logging in...',
  },
  fr: {
    // Navbar
    'nav.dashboard': 'DASHBOARD',
    'nav.members': 'MEMBRES',
    'nav.tournaments': 'TOURNOIS',
    'nav.features': 'FONCTIONNALITÉS',
    'nav.howItWorks': 'COMMENT ÇA MARCHE',
    'nav.collectives': 'COLLECTIFS',
    'nav.login': 'Connexion',
    'nav.signup': 'CRÉER UN COMPTE',
    'nav.myProfile': 'Mon profil',
    'nav.logout': 'Déconnexion',
    'nav.loggingOut': 'Déconnexion...',
    'nav.logoutConfirm': 'Êtes-vous sûr de vouloir vous déconnecter ?',
    'nav.cancel': 'Annuler',
    'nav.logoutTitle': 'Déconnexion',
    
    // Hero
    'hero.platform': 'La plateforme des collectifs de slam',
    'hero.title': 'GÉREZ VOS',
    'hero.title1': 'MOTS.',
    'hero.title2': 'VOS SCÈNES.',
    'hero.title3': 'VOS POÈTES.',
    'hero.description': 'Slam Net est la plateforme dédiée aux collectifs de slam poésie — gérez vos membres, organisez vos tournois, tirez au sort les passages et suivez les classements en temps réel.',
    'hero.createCollective': 'CRÉER MON COLLECTIF',
    'hero.watchDemo': 'VOIR UNE DÉMO',
    'hero.liveRanking': 'CLASSEMENT LIVE',
    'hero.tournamentInProgress': 'TOURNOI EN COURS',
    'hero.explore': 'EXPLORER',
    
    // Features
    'features': 'FONCTIONNALITÉS',
    'features.title': 'TOUT CE DONT',
    'features.title1': 'VOTRE COLLECTIF',
    'features.title2': 'A BESOIN.',
    'features.description': 'Une seule plateforme pour gérer la vie de votre collectif de slam — des membres aux podiums, en passant par chaque vers prononcé sur scène.',
    'feature01.title': 'GESTION DES MEMBRES',
    'feature01.description': 'Enregistrez chaque poète de votre collectif — nom, contact, biographie, historique de performances. Un annuaire complet, toujours à portée de main.',
    'feature01.detail': 'Profils détaillés · Historique · Statuts',
    'feature02.title': 'TOURNOIS ORGANISÉS',
    'feature02.description': 'Créez des tournois, définissez les règles, gérez les inscriptions — membres du collectif ou invités extérieurs. Chaque événement, de A à Z.',
    'feature02.detail': 'Multi-tours · Invités · Inscriptions en ligne',
    'feature03.title': 'TIRAGE AU SORT',
    'feature03.description': 'Le tirage au sort automatique décide de l\'ordre de passage à chaque tour. Transparent, impartial, sans friction.',
    'feature03.detail': 'Aléatoire certifié · Ronde par ronde · Export PDF',
    'feature04.title': 'NOTES & CLASSEMENTS',
    'feature04.description': 'Saisissez les notes des jurés en direct. Le classement se met à jour instantanément. La scène connaît son champion dès la dernière note tombée.',
    'feature04.detail': 'Notes en temps réel · Jury multiple · Podium',
    
    // How it works
    'howItWorks': 'COMMENT ÇA MARCHE',
    'howItWorks.title': 'DU COLLECTIF',
    'howItWorks.title1': 'AU PODIUM',
    'howItWorks.title2': 'EN 6 ÉTAPES.',
    'step01.title': 'Créez votre collectif',
    'step01.description': 'Inscrivez-vous en 2 minutes, nommez votre collectif et commencez à inviter vos poètes.',
    'step02.title': 'Enregistrez vos membres',
    'step02.description': 'Ajoutez chaque slammeur avec son profil complet. Ils peuvent aussi rejoindre via un lien d\'invitation.',
    'step03.title': 'Lancez un tournoi',
    'step03.description': 'Créez un tournoi, définissez les rounds, ouvrez les inscriptions aux membres et aux invités.',
    'step04.title': 'Tirage & passages',
    'step04.description': 'Déclenchez le tirage au sort. L\'ordre de passage est généré automatiquement pour chaque tour.',
    'step05.title': 'Saisissez les notes',
    'step05.description': 'Chaque juré note en direct. Le système calcule les moyennes et met à jour le classement.',
    'step06.title': 'Couronnez le champion',
    'step06.description': 'Le classement final est établi. Partagez le podium, archivez l\'événement.',
    
    // CTA
    'cta.freeToStart': 'GRATUIT POUR COMMENCER',
    'cta.title': 'VOTRE COLLECTIF',
    'cta.title1': 'MÉRITE UNE',
    'cta.title2': 'VRAIE SCÈNE.',
    'cta.description': 'Rejoignez les collectifs de slam qui organisent leurs événements avec Slam Net. Inscription gratuite, aucune carte requise.',
    'cta.createFreeAccount': 'CRÉER MON COMPTE GRATUIT',
    
    // Auth modals
    'auth.login': 'CONNEXION',
    'auth.signup': 'INSCRIPTION',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.emailPlaceholder': 'votre@email.com',
    'auth.passwordPlaceholder': '••••••••',
    'auth.signIn': 'Se connecter',
    'auth.signingIn': 'Connexion...',
    'auth.createAccount': 'Créer mon compte',
    'auth.creatingAccount': 'Inscription...',
    'auth.collectiveName': 'Nom du collectif',
    'auth.collectiveNamePlaceholder': 'Nom de votre collectif',
    'auth.city': 'Ville',
    'auth.cityPlaceholder': 'Votre ville',
    'auth.noAccount': 'Pas encore de compte?',
    'auth.hasAccount': 'Déjà un compte?',
    'auth.signUp': 'S\'inscrire',
    'auth.loginLink': 'Se connecter',
    'auth.emailPasswordRequired': 'Email et mot de passe requis',
    'auth.invalidEmail': 'Format d\'email invalide',
    'auth.allFieldsRequired': 'Tous les champs doivent être remplis',
    'auth.passwordMinLength': 'Le mot de passe doit contenir au moins 6 caractères',
    'auth.passwordMismatch': 'Les mots de passe ne correspondent pas',
    'auth.loginSuccess': 'Connexion réussie',
    'auth.signupSuccess': 'Compte créé avec succès',
    'auth.loginError': 'Erreur lors de la connexion',
    'auth.signupError': 'Erreur lors de l\'inscription',
    'auth.loggingIn': 'Connexion en cours...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}