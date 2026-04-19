import { useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { generateItinerary } from "../services/groqService";

const PENDING_TRIP_KEY = "pendingTrip";
const TRIP_CACHE_VERSION = 1;

const initialFormData = {
  destination: "",
  flexibleDates: false,
  startDate: "",
  endDate: "",
  duration: 7,
  adults: 2,
  children: 0,
  tripType: "",
  interests: [],
  budget: "",
  specialRequests: "",
};

const statuses = [
  "Researching destination...",
  "Crafting your day-by-day itinerary...",
  "Finding hidden gems and local tips...",
  "Calculating your budget breakdown...",
  "Finalising your perfect trip...",
];

const createPendingTripId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const createTimeoutPromise = () =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Firestore connection timeout")), 5000);
  });

const createTripId = (pendingTripId) => `trip-${pendingTripId}`;

const createTripData = (formData, itinerary, userId, pendingTripId) => ({
  userId,
  pendingTripId,
  tripName: itinerary.tripTitle,
  destination: formData.destination,
  startDate: formData.startDate || null,
  endDate: formData.endDate || null,
  duration: formData.duration,
  status: "upcoming",
  travelers: { adults: formData.adults, children: formData.children },
  tripType: formData.tripType,
  interests: formData.interests,
  budget: formData.budget,
  specialRequests: formData.specialRequests,
  itinerary,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  isPublic: false,
});

const createPendingTripPayload = (formData, itinerary, pendingTripId) => ({
  pendingTripId,
  formData,
  itinerary,
  timestamp: Date.now(),
});

const saveTripDocument = async (tripId, tripData) => {
  const tripRef = doc(db, "trips", tripId);
  const savePromise = setDoc(tripRef, tripData, { merge: true }).then(() => tripRef);
  return Promise.race([savePromise, createTimeoutPromise()]);
};

export const clearPendingTrip = () => {
  sessionStorage.removeItem(PENDING_TRIP_KEY);
};

export const getPendingTrip = () => {
  try {
    const pendingTrip = sessionStorage.getItem(PENDING_TRIP_KEY);
    return pendingTrip ? JSON.parse(pendingTrip) : null;
  } catch (error) {
    console.error("Error reading pending trip:", error);
    return null;
  }
};

const writePendingTrip = (pendingTrip) => {
  sessionStorage.setItem(PENDING_TRIP_KEY, JSON.stringify(pendingTrip));
};

export const getCachedTripById = (tripId, userId) => {
  if (!tripId || !userId) return null;

  try {
    const stored = localStorage.getItem(
      `travel-planner:user-trips:v${TRIP_CACHE_VERSION}:${userId}`,
    );
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed?.trips?.find((trip) => trip.id === tripId) ?? null;
  } catch (error) {
    console.error("Error reading cached trip:", error);
    return null;
  }
};

export const fetchTripById = async (tripId) => {
  const tripRef = doc(db, "trips", tripId);
  const snapshot = await Promise.race([getDoc(tripRef), createTimeoutPromise()]);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const savePendingTripToAccount = async (pendingTrip, userId) => {
  if (!pendingTrip?.pendingTripId || !userId) {
    throw new Error("Pending trip data is missing.");
  }

  const tripId = createTripId(pendingTrip.pendingTripId);
  const existingTrip = await fetchTripById(tripId);

  if (existingTrip) {
    return tripId;
  }

  const tripData = createTripData(
    pendingTrip.formData,
    pendingTrip.itinerary,
    userId,
    pendingTrip.pendingTripId,
  );

  const savedRef = await saveTripDocument(tripId, tripData);
  return savedRef.id;
};

export function useTrip() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [savedTripId, setSavedTripId] = useState(null);
  const [retryError, setRetryError] = useState(null);

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, 6));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const generateTrip = async () => {
    setIsGenerating(true);
    setError(null);
    setStatusIndex(0);

    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 3000);

    try {
      const generatedItinerary = await generateItinerary(formData);
      const pendingTripId = createPendingTripId();
      setItinerary(generatedItinerary);

      try {
        const tripId = createTripId(pendingTripId);
        const tripData = createTripData(
          formData,
          generatedItinerary,
          user.uid,
          pendingTripId,
        );
        const savedRef = await saveTripDocument(tripId, tripData);
        setSavedTripId(savedRef.id);
      } catch (dbError) {
        console.error("Error saving trip to Firestore:", dbError);
        writePendingTrip(
          createPendingTripPayload(formData, generatedItinerary, pendingTripId),
        );
        setSavedTripId("local-trip-temp");
        setError(
          "Trip couldn't be saved to your account, but you can still view it now. Check your internet connection or adblocker settings, then try saving again.",
        );
      }
    } catch (generationError) {
      console.error("Trip generation error:", generationError);
      setError(
        generationError.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const retrySaveTrip = async () => {
    const pendingTrip = getPendingTrip();
    if (!pendingTrip || !user?.uid) return null;

    setRetryError(null);

    try {
      const tripId = await savePendingTripToAccount(pendingTrip, user.uid);
      setSavedTripId(tripId);
      setError(null);
      clearPendingTrip();
      return tripId;
    } catch (retrySaveError) {
      console.error("Error retrying save:", retrySaveError);
      setRetryError(
        retrySaveError.message || "Failed to save trip. Please check your connection.",
      );
      return null;
    }
  };

  return {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    isGenerating,
    generatingStatus: statuses[statusIndex],
    itinerary,
    error,
    generateTrip,
    savedTripId,
    retrySaveTrip,
    retryError,
  };
}
