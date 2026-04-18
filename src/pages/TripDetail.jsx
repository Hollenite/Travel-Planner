import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { Edit2, Save, X, AlertCircle } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

import TripHeader from "../components/itinerary/TripHeader";
import OverviewSection from "../components/itinerary/OverviewSection";
import BudgetCard from "../components/itinerary/BudgetCard";
import ExpenseTracker from "../components/itinerary/ExpenseTracker";
import DocumentManager from "../components/itinerary/DocumentManager";
import DayCard from "../components/itinerary/DayCard";
import QuickTipsSection from "../components/itinerary/QuickTipsSection";
import PackingList from "../components/itinerary/PackingList";

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryMessage, setRetryMessage] = useState("");

  useEffect(() => {
    async function fetchTrip() {
      try {
        // If the trip ID is a local mock ID from a failed save, try to recover from sessionStorage
        if (id === "local-trip-temp") {
          const pendingData = sessionStorage.getItem("pendingTrip");
          if (pendingData) {
            try {
              const { formData: formDataBackup, itinerary } =
                JSON.parse(pendingData);
              // Create a trip object from the pending data
              const recoveredTrip = {
                id: "local-trip-temp",
                tripName: itinerary.tripTitle,
                destination: formDataBackup.destination,
                startDate: formDataBackup.startDate || null,
                endDate: formDataBackup.endDate || null,
                duration: formDataBackup.duration,
                status: "upcoming",
                travelers: {
                  adults: formDataBackup.adults,
                  children: formDataBackup.children,
                },
                tripType: formDataBackup.tripType,
                interests: formDataBackup.interests,
                budget: formDataBackup.budget,
                specialRequests: formDataBackup.specialRequests,
                itinerary,
                isPublic: false,
                userId: user?.uid,
              };
              setTrip(recoveredTrip);
              setEditStatus("upcoming");
              setEditNotes("");
              setError(null);
              setLoading(false);
              return;
            } catch (parseErr) {
              console.error("Error parsing pending trip data:", parseErr);
            }
          }
          setError(
            "We couldn't save this trip to your account. Your trip data may have been lost. Please check your internet connection or adblocker settings and try planning again.",
          );
          setLoading(false);
          return;
        }

        const docRef = doc(db, "trips", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const tripData = { id: docSnap.id, ...docSnap.data() };
          // Secure route: only owner can view, unless public (we'll enforce owner-only for now)
          if (tripData.userId !== user.uid && !tripData.isPublic) {
            navigate("/dashboard", { replace: true });
            return;
          }
          setTrip(tripData);
          setEditStatus(tripData.status || "upcoming");
          setEditNotes(tripData.notes || "");
        } else {
          // Trip doesn't exist
          navigate("/trips", { replace: true });
        }
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError("Could not load trip details.");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchTrip();
    }
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-surface2">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);

      await updateDoc(doc(db, "trips", trip.id), {
        status: editStatus,
        notes: editNotes,
        updatedAt: new Date(),
      });

      setTrip({ ...trip, status: editStatus, notes: editNotes });
      setSaveSuccess(true);
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving trip:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetrySave = async () => {
    try {
      setRetrying(true);
      setRetryMessage("");

      const tripData = {
        userId: user.uid,
        tripName: trip.tripName,
        destination: trip.destination,
        startDate: trip.startDate || null,
        endDate: trip.endDate || null,
        duration: trip.duration,
        status: trip.status,
        travelers: trip.travelers,
        tripType: trip.tripType,
        interests: trip.interests,
        budget: trip.budget,
        specialRequests: trip.specialRequests,
        itinerary: trip.itinerary,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPublic: false,
      };

      const docRef = await addDoc(collection(db, "trips"), tripData);

      // Update trip with real ID
      setTrip({ ...trip, id: docRef.id });
      sessionStorage.removeItem("pendingTrip");
      setRetryMessage("Trip saved successfully!");
      setTimeout(() => {
        navigate(`/trip/${docRef.id}`, { replace: true });
      }, 1000);
    } catch (err) {
      console.error("Error retrying save:", err);
      setRetryMessage(
        "Failed to save trip. Please check your connection and try again.",
      );
    } finally {
      setRetrying(false);
    }
  };

  const handleCancelEdit = () => {
    setEditStatus(trip.status || "upcoming");
    setEditNotes(trip.notes || "");
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-surface2">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-surface2 px-4">
        <AlertCircle className="w-12 h-12 text-amber-600 mb-4" />
        <p className="text-slate-500 font-sans mb-4 text-center max-w-md">
          {error}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white border border-slate-200 text-slate-700 font-sans px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { itinerary } = trip;
  const isLocalTrip = trip.id === "local-trip-temp";

  return (
    <div className="bg-surface2 min-h-full">
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        <TripHeader trip={trip} itinerary={itinerary} />

        {/* Success Message */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <p className="text-sm text-green-700 font-sans">
              Trip details updated successfully!
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-sans">{error}</p>
          </div>
        )}

        {/* Local Trip Warning with Retry */}
        {isLocalTrip && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-700 font-sans mb-3">
                This trip hasn't been saved to your account yet. Save it now so
                you don't lose your itinerary.
              </p>
              {retryMessage && (
                <p
                  className={`text-sm font-sans mb-3 ${retryMessage.includes("successfully") ? "text-green-700" : "text-amber-700"}`}
                >
                  {retryMessage}
                </p>
              )}
              <button
                onClick={handleRetrySave}
                disabled={retrying}
                className="bg-amber-600 text-white font-sans px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {retrying ? "Saving..." : "Save Trip Now"}
              </button>
            </div>
          </div>
        )}

        {/* Edit Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-slate-900">
              Trip Details
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-sans text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              {/* Status Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Notes Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Trip Notes
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add personal notes about this trip..."
                  className="px-3 py-2 border border-slate-200 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  rows="3"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-sans text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans text-sm font-semibold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <p className="text-sm text-slate-600 font-sans capitalize">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                        editStatus === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : editStatus === "ongoing"
                            ? "bg-emerald-100 text-emerald-700"
                            : editStatus === "completed"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {editStatus}
                    </span>
                  </p>
                </div>
              </div>
              {editNotes && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-slate-600 font-sans whitespace-pre-wrap">
                    {editNotes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <OverviewSection trip={trip} itinerary={itinerary} />

        <BudgetCard budget={itinerary.estimatedBudget} />

        <ExpenseTracker
          tripId={trip.id}
          budgetEstimate={itinerary.estimatedBudget}
        />

        <DocumentManager tripId={trip.id} />

        {itinerary.days && itinerary.days.length > 0 && (
          <div className="space-y-4">
            {itinerary.days.map((day) => (
              <DayCard key={day.day} day={day} />
            ))}
          </div>
        )}

        <QuickTipsSection tips={itinerary.quickTips} />

        <PackingList items={itinerary.packingList} tripId={trip.id} />
      </div>
    </div>
  );
}
