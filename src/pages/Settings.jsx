import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserTrips } from "../hooks/useUserTrips";
import { LogOut, User, Mail, Globe, BarChart3 } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { trips, stats } = useUserTrips();

  const handleSignOut = async () => {
    if (!window.confirm("Are you sure you want to sign out?")) return;
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error signing out:", err);
      alert("Failed to sign out");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-surface2 min-h-full py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Header */}
        <section>
          <h1 className="font-display text-3xl font-semibold text-slate-900 mb-2">
            Settings
          </h1>
          <p className="text-slate-500 font-sans text-sm">
            Manage your account and preferences
          </p>
        </section>

        {/* Profile Section */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Profile Header with Avatar */}
          <div className="h-32 bg-gradient-to-br from-[#6C63FF]/80 to-[#43E8D8]/60" />

          <div className="px-6 pb-6">
            {/* Avatar and Basic Info */}
            <div className="flex gap-4 -mt-14 mb-6">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-20 h-20 rounded-xl border-4 border-white shadow-md object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl border-4 border-white shadow-md bg-slate-300 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}

              <div className="flex-1 pt-2">
                <h2 className="font-display text-2xl font-semibold text-slate-900">
                  {user.displayName || "Traveler"}
                </h2>
                <p className="text-sm text-slate-500 font-sans">{user.email}</p>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                Account Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Full Name
                    </p>
                    <p className="text-sm text-slate-600 font-sans mt-0.5">
                      {user.displayName || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Email Address
                    </p>
                    <p className="text-sm text-slate-600 font-sans mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Auth Provider
                    </p>
                    <p className="text-sm text-slate-600 font-sans mt-0.5">
                      Google
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Statistics */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h3 className="font-display text-lg font-semibold text-slate-900">
              Your Travel Stats
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">
                Total Trips
              </p>
              <p className="font-display text-2xl font-semibold text-slate-900">
                {stats.totalTrips}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">
                Countries
              </p>
              <p className="font-display text-2xl font-semibold text-slate-900">
                {stats.uniqueCountries}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">
                Upcoming
              </p>
              <p className="font-display text-2xl font-semibold text-slate-900">
                {stats.upcomingTrips}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">
                Completed
              </p>
              <p className="font-display text-2xl font-semibold text-slate-900">
                {stats.completedTrips}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          {trips.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 font-sans">
                You've been planning amazing trips since{" "}
                {new Date(user.metadata?.createdAt).toLocaleDateString()} 🌍
              </p>
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold text-slate-900 mb-4">
            Account Actions
          </h3>

          <div className="space-y-2">
            <p className="text-sm text-slate-600 font-sans mb-3">
              Want to manage your trips? You can always view and edit them from
              the dashboard.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-4 py-2.5 text-left bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors font-sans text-sm font-semibold text-slate-700"
            >
              ← Go back to Dashboard
            </button>
          </div>
        </div>

        {/* Sign Out Section */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold text-red-900">
            Danger Zone
          </h3>

          <p className="text-sm text-red-800 font-sans">
            You can sign out of your account at any time. You'll be able to sign
            back in with your Google account.
          </p>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-sans text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-slate-500 font-sans pb-4">
          <p>Smart Travel Planner • Version 1.0</p>
          <p className="mt-1">Build trips smarter, travel better 🚀</p>
        </div>
      </div>
    </div>
  );
}
