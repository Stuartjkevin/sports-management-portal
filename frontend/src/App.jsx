import { Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleHomeRedirect from './components/RoleHomeRedirect';
import { getRolesForPath } from './utils/roles';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ClubsPage from './pages/ClubsPage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import MatchesPage from './pages/MatchesPage';
import TournamentsPage from './pages/TournamentsPage';
import TrainingPage from './pages/TrainingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TeamSelectionPage from './pages/TeamSelectionPage';
import PlayerDashboardPage from './pages/PlayerDashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboard pages. The allowed roles for each path come from utils/roles.js (NAV_ITEMS).
const dashboardRoutes = [
  { path: 'overview', element: <AdminDashboardPage /> },
  { path: 'me', element: <PlayerDashboardPage /> },
  { path: 'clubs', element: <ClubsPage /> },
  { path: 'teams', element: <TeamsPage /> },
  { path: 'players', element: <PlayersPage /> },
  { path: 'matches', element: <MatchesPage /> },
  { path: 'tournaments', element: <TournamentsPage /> },
  { path: 'training', element: <TrainingPage /> },
  { path: 'analytics', element: <AnalyticsPage /> },
  { path: 'team-selection', element: <TeamSelectionPage /> },
  { path: 'notifications', element: <NotificationsPage /> },
  { path: 'profile', element: <ProfilePage /> },
];

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Dashboard routes: must be "logged in" (demo user set) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleHomeRedirect />} />
        {dashboardRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute allowedRoles={getRolesForPath(`/dashboard/${path}`)}>{element}</ProtectedRoute>}
          />
        ))}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
