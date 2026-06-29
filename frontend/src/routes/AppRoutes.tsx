import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LeaguePage from '../pages/League/LeaguePage';
import LeagueCreatePage from '../pages/LeagueCreate/LeagueCreatePage';
import ProfilePage from '../pages/Profile/ProfilePage';
import LeagueRegulationsPage from '../pages/LeagueRegulations/LeagueRegulationsPage';
import RaceCreatePage from '../pages/League/RaceCreatePage';
import BrowseLeaguesPage from '../pages/League/BrowseLeaguesPage';

import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/league/:id"
          element={
            <ProtectedRoute>
              <LeaguePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-league"
          element={
            <ProtectedRoute>
              <LeagueCreatePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/league/:id/regulations"
          element={
            <ProtectedRoute> 
              <LeagueRegulationsPage />
            </ProtectedRoute> 
          }
        />

        <Route
          path="/league/:id/races/create"
          element={
          <ProtectedRoute>
            <RaceCreatePage />
          </ProtectedRoute> 
        }
      />

      <Route
        path="/league/:id/races/create"
        element={
        <ProtectedRoute>
          <RaceCreatePage />
        </ProtectedRoute>
        }
      />

      <Route
        path="/leagues"
        element={<BrowseLeaguesPage />}
      />
      </Routes>
      
    </BrowserRouter>
  );
}
