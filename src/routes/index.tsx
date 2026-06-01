import type { RouteObject } from 'react-router-dom';
import { Layout } from '../app/layout';
import HomePage from './_index';
import LoginPage from './login';
import SignupPage from './signup';
import CollectifsPage from './collectifs';
import CollectifDetailPage from './collectifs.$id';
import DashboardPage from './dashboard';
import MembresPage from './membres';
import ProfilePage from './profile';
import TournoisPage from './tournois';
import TournoiDetailPage from './tournois.$id';
import TournoiGestionLayout from './tournoi-gestion.$id';
import TournoiParticipantsPage from './tournoi-gestion.$id.participants';
import TournoiPerformancesPage from './tournoi-gestion.$id.performances';
import TournoiClassementPage from './tournoi-gestion.$id.classement';
import PrivacyPage from './privacy';
import TermsPage from './terms';
import ContactPage from './contact';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'collectifs', element: <CollectifsPage /> },
      { path: 'collectifs/:id', element: <CollectifDetailPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'membres', element: <MembresPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'tournois', element: <TournoisPage /> },
      { path: 'tournois/:id', element: <TournoiDetailPage /> },
      { 
        path: 'tournoi-gestion/:id', 
        element: <TournoiGestionLayout />,
        children: [
          { index: true, element: <TournoiParticipantsPage /> },
          { path: 'participants', element: <TournoiParticipantsPage /> },
          { path: 'performances', element: <TournoiPerformancesPage /> },
          { path: 'classement', element: <TournoiClassementPage /> },
        ]
      },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'contact', element: <ContactPage /> },
    ]
  }
];