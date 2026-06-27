import type { RouteObject } from 'react-router-dom';
import { Layout } from '../app/layout';
import HomePage from './_index';
import CollectifDetailPage from './collectifs.$id';
import DashboardPage from './dashboard';
import MembresPage from './membres';
import MembreDetailPage from './membres.$id';
import ProfilePage from './profile';
import TournoisPage from './tournois';
import TournoiDetailPage from './tournois.$id';
import TournoiGestionLayout from './tournoi-gestion.$id';
import TournoiParticipantsPage from './tournoi-gestion.$id.participants';
import TournoiPerformancesPage from './tournoi-gestion.$id.performances';
import TournoiClassementPage from './tournoi-gestion.$id.classement';
import TournoiParametresPage from './tournoi-gestion.$id.parametres';
import PrivacyPage from './privacy';
import TermsPage from './terms';
import ContactPage from './contact';
import SlamPoetryPage from './slam-poetry';
import InvitationPage from './invitation.$token';
import TournoiInvitationPage from './tournoi-invitation.$token';
import { AdminRoute } from '../components/AdminRoute';
import AdminDashboardPage from './admin/_index';
import AdminCollectifsPage from './admin/collectifs';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'collectifs/:id', element: <CollectifDetailPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'membres', element: <MembresPage /> },
      { path: 'membres/:id', element: <MembreDetailPage /> },
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
          { path: 'parametres', element: <TournoiParametresPage /> },
        ]
      },
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'collectifs', element: <AdminCollectifsPage /> },
        ],
      },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'slam-poetry', element: <SlamPoetryPage /> },
      { path: 'invitation/:token', element: <InvitationPage /> },
      { path: 'tournoi-invitation/:token', element: <TournoiInvitationPage /> },
    ]
  }
];