import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { normalizeTrip } from "../hooks/useUserTrips";
import {
  clearPendingTrip,
  fetchTripById,
  getCachedTripById,
  getPendingTrip,
  savePendingTripToAccount,
} from "../hooks/useTrip";
import { Edit2, Save, AlertCircle } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

import TripHeader from "../components/itinerary/TripHeader";
import OverviewSection from "../components/itinerary/OverviewSection";
import BudgetCard from "../components/itinerary/BudgetCard";
import ExpenseTracker from "../components/itinerary/ExpenseTracker";
import DocumentManager from "../components/itinerary/DocumentManager";
import DayCard from "../components/itinerary/DayCard";
import QuickTipsSection from "../components/itinerary/QuickTipsSection";
import PackingList from "../components/itinerary/PackingList";

const createRecoveredTrip = (pendingTrip, userId) => {
  const { formData, itinerary, pendingTripId } = pendingTrip;

  return normalizeTrip({
    id: "local-trip-temp",
    pendingTripId,
    tripName: itinerary.tripTitle,
    destination: formData.destination,
    startDate: formData.startDate || null,
    endDate: formData.endDate || null,
    duration: formData.duration,
    status: "upcoming",
    travelers: {
      adults: formData.adults,
      children: formData.children,
    },
    tripType: formData.tripType,
    interests: formData.interests,
    budget: formData.budget,
    specialRequests: formData.specialRequests,
    itinerary,
    isPublic: false,
    userId,
  });
};

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const exportRef = useRef(null);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryMessage, setRetryMessage] = useState("");

  useEffect(() => {
    if (!user || !id) return;

    const hydratedTrip = (() => {
      if (id === "local-trip-temp") {
        const pendingTrip = getPendingTrip();
        return pendingTrip ? createRecoveredTrip(pendingTrip, user.uid) : null;
      }

      if (location.state?.trip?.id === id) {
        return normalizeTrip(location.state.trip);
      }

      const cachedTrip = getCachedTripById(id, user.uid);
      return cachedTrip ? normalizeTrip(cachedTrip) : null;
    })();

    if (hydratedTrip) {
      setTrip(hydratedTrip);
      setEditStatus(hydratedTrip.status || "upcoming");
      setEditNotes(hydratedTrip.notes || "");
      setLoading(false);
      setIsRefreshing(id !== "local-trip-temp");
      setError(null);
    } else {
      setLoading(true);
      setIsRefreshing(true);
    }

    async function loadTrip() {
      try {
        if (id === "local-trip-temp") {
          if (!hydratedTrip) {
            setError(
              "We couldn't save this trip to your account. Your trip data may have been lost. Please check your internet connection or adblocker settings and try planning again.",
            );
          }
          return;
        }

        const fetchedTrip = await fetchTripById(id);

        if (!fetchedTrip) {
          navigate("/trips", { replace: true });
          return;
        }

        if (fetchedTrip.userId !== user.uid && !fetchedTrip.isPublic) {
          navigate("/dashboard", { replace: true });
          return;
        }

        const normalizedTrip = normalizeTrip(fetchedTrip);
        setTrip(normalizedTrip);
        setEditStatus(normalizedTrip.status || "upcoming");
        setEditNotes(normalizedTrip.notes || "");
        setError(null);
      } catch (fetchError) {
        console.error("Error fetching trip:", fetchError);
        if (!hydratedTrip) {
          setError("Could not load trip details.");
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }

    loadTrip();
  }, [id, user, navigate, location.state]);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);

      await setDoc(
        doc(db, "trips", trip.id),
        {
          status: editStatus,
          notes: editNotes,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setTrip((prev) => ({ ...prev, status: editStatus, notes: editNotes }));
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (saveError) {
      console.error("Error saving trip:", saveError);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetrySave = async () => {
    try {
      setRetrying(true);
      setRetryMessage("");

      const pendingTrip = getPendingTrip();
      const savedTripId = await savePendingTripToAccount(pendingTrip, user.uid);

      clearPendingTrip();
      setRetryMessage("Trip saved successfully!");
      setTimeout(() => {
        navigate(`/trip/${savedTripId}`, { replace: true });
      }, 600);
    } catch (retryError) {
      console.error("Error retrying save:", retryError);
      setRetryMessage(
        retryError.message ||
          "Failed to save trip. Please check your connection and try again.",
      );
    } finally {
      setRetrying(false);
    }
  };

  const handleExportPdf = async () => {
    if (!exportRef.current || !trip) return;

    try {
      setIsExportingPdf(true);
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f8fafc",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const imageData = canvas.toDataURL("image/png");
      pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${(trip.tripName || trip.destination || "trip-itinerary")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "trip-itinerary"}.pdf`;

      pdf.save(fileName);
    } catch (pdfError) {
      console.error("Error exporting PDF:", pdfError);
      setError("Failed to export PDF. Please try again.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCancelEdit = () => {
    setEditStatus(trip.status || "upcoming");
    setEditNotes(trip.notes || "");
    setIsEditing(false);
  };

  if (loading && !trip) {
    return (
      <div className="min-h-full flex items-center justify-center bg-surface2">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !trip) {
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

  const itinerary = trip?.itinerary;
  const isLocalTrip = trip?.id === "local-trip-temp";

  return (
    <div className="bg-surface2 min-h-full">
      <div ref={exportRef} className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        <TripHeader
          trip={trip}
          itinerary={itinerary}
          onExportPdf={handleExportPdf}
          isExportingPdf={isExportingPdf}
        />

        {isRefreshing && (
          <p className="text-xs font-mono text-slate-400">Refreshing trip details...</p>
        )}

        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <p className="text-sm text-green-700 font-sans">
              Trip details updated successfully!
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-sans">{error}</p>
          </div>
        )}

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

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-slate-900">
              Trip Details
            </h3>
            {!isEditing && !isLocalTrip && (
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
        <ExpenseTracker tripId={trip.id} budgetEstimate={itinerary.estimatedBudget} />
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
