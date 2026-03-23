import { Routes, Route, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PlanTrip from './pages/PlanTrip';
import TripDetail from './pages/TripDetail';
import ProtectedRoute from './routes/ProtectedRoute';
import AppShell from './components/layout/AppShell';

const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <h1 className="font-display text-3xl text-slate-400 mb-2">{title}</h1>
      <p className="text-slate-500 font-sans">Coming in the next phase</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plan" element={<PlanTrip />} />
          <Route path="/trip/:id" element={<TripDetail />} />
          <Route path="/trips" element={<PlaceholderPage title="My Trips" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Route>
    </Routes>
  );
}
