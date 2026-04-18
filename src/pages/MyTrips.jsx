import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Trash2,
  Edit2,
  AlertCircle,
  MapPin,
  Loader,
} from "lucide-react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { useUserTrips } from "../hooks/useUserTrips";
import TripCard from "../components/dashboard/TripCard";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function MyTrips() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trips, loading, error } = useUserTrips();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, title, destination, status
  const [filterStatus, setFilterStatus] = useState("all"); // all, upcoming, ongoing, completed
  const [deletingId, setDeletingId] = useState(null);

  // Filter and sort trips
  const processedTrips = useMemo(() => {
    let filtered = trips.filter((trip) => {
      // Filter by search query
      const matchesSearch =
        trip.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.tripName?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus =
        filterStatus === "all" || trip.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    // Sort trips
    if (sortBy === "recent") {
      filtered.sort(
        (a, b) =>
          (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0),
      );
    } else if (sortBy === "title") {
      filtered.sort((a, b) =>
        (a.tripName || "").localeCompare(b.tripName || ""),
      );
    } else if (sortBy === "destination") {
      filtered.sort((a, b) =>
        (a.destination || "").localeCompare(b.destination || ""),
      );
    } else if (sortBy === "status") {
      const statusOrder = { upcoming: 0, ongoing: 1, completed: 2, draft: 3 };
      filtered.sort(
        (a, b) => (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3),
      );
    }

    return filtered;
  }, [trips, searchQuery, sortBy, filterStatus]);

  const handleDelete = async (tripId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this trip? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingId(tripId);
    try {
      await deleteDoc(doc(db, "trips", tripId));
      // Trip will be removed from list via real-time listener in useUserTrips
    } catch (err) {
      console.error("Error deleting trip:", err);
      alert("Failed to delete trip. Please try again.");
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-surface2">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-surface2 min-h-full py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <section>
          <h1 className="font-display text-3xl font-semibold text-slate-900 mb-2">
            My Trips
          </h1>
          <p className="text-slate-500 font-sans text-sm">
            You have {processedTrips.length} trip
            {processedTrips.length !== 1 ? "s" : ""}.
          </p>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-sans">{error}</p>
          </div>
        )}

        {/* Controls Row */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search trips by destination or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Filters & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">All Trips</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="recent">Most Recent</option>
                <option value="title">Trip Name</option>
                <option value="destination">Destination</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </section>

        {/* Trips Display */}
        {processedTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 bg-white border border-slate-200 border-dashed rounded-2xl p-12 min-h-80">
            <MapPin className="w-16 h-16 text-slate-300" />
            <div className="text-center max-w-md">
              <h2 className="font-display text-2xl text-slate-700 mb-2">
                No trips found
              </h2>
              <p className="font-sans text-sm text-slate-400 mb-4">
                {searchQuery
                  ? "No trips match your search. Try a different query."
                  : "You haven't created any trips yet. Start planning your first adventure!"}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate("/plan")}
            >
              Plan Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedTrips.map((trip) => (
              <div key={trip.id} className="relative group">
                {/* Trip Card */}
                <div
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  className="cursor-pointer"
                >
                  <TripCard trip={trip} />
                </div>

                {/* Action Buttons - Visible on Hover */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Edit Button */}
                  <button
                    onClick={() => navigate(`/trip/${trip.id}`)}
                    className="bg-white text-slate-700 p-2 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                    title="Edit trip"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(trip.id)}
                    disabled={deletingId === trip.id}
                    className="bg-red-50 text-red-600 p-2 rounded-lg shadow-sm border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete trip"
                  >
                    {deletingId === trip.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
