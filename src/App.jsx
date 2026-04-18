import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppShell from "./components/layout/AppShell";

// Lazy-load all pages for code splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PlanTrip = lazy(() => import("./pages/PlanTrip"));
const TripDetail = lazy(() => import("./pages/TripDetail"));
const MyTrips = lazy(() => import("./pages/MyTrips"));
const Settings = lazy(() => import("./pages/Settings"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface2">
    <LoadingSpinner size="lg" />
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<PageLoader />}>
            <LandingPage />
          </Suspense>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/plan"
            element={
              <Suspense fallback={<PageLoader />}>
                <PlanTrip />
              </Suspense>
            }
          />
          <Route
            path="/trip/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <TripDetail />
              </Suspense>
            }
          />
          <Route
            path="/trips"
            element={
              <Suspense fallback={<PageLoader />}>
                <MyTrips />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
