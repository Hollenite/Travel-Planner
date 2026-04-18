import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { generateItinerary } from "../services/groqService";

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
      setItinerary(generatedItinerary);

      try {
        const tripData = {
          userId: user.uid,
          tripName: generatedItinerary.tripTitle,
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
          itinerary: generatedItinerary,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isPublic: false,
        };

        const dbPromise = addDoc(collection(db, "trips"), tripData);

        // 5-second timeout to prevent infinite hang if Firestore is blocked by an adblocker
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Firestore connection timeout")),
            5000,
          ),
        );

        const docRef = await Promise.race([dbPromise, timeoutPromise]);
        setSavedTripId(docRef.id);
      } catch (dbErr) {
        console.error("Error saving trip to Firestore:", dbErr);
        // Store the generated itinerary in sessionStorage as backup
        const localTripData = {
          formData,
          itinerary: generatedItinerary,
          timestamp: Date.now(),
        };
        sessionStorage.setItem("pendingTrip", JSON.stringify(localTripData));
        // Use temporary ID to navigate to trip detail
        setSavedTripId("local-trip-temp");
        setError(
          "Trip couldn't be saved to your account, but you can still view it now. Check your internet connection or adblocker settings, then try saving again.",
        );
      }
    } catch (err) {
      console.error("Trip generation error:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const generatingStatus = statuses[statusIndex];

  const retrySaveTrip = async (tripId) => {
    if (!itinerary) return;
    setRetryError(null);

    try {
      const tripData = {
        userId: user.uid,
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
      };

      const dbPromise = addDoc(collection(db, "trips"), tripData);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Firestore connection timeout")),
          5000,
        ),
      );

      const docRef = await Promise.race([dbPromise, timeoutPromise]);
      setSavedTripId(docRef.id);
      setError(null);
      sessionStorage.removeItem("pendingTrip");
    } catch (err) {
      console.error("Error retrying save:", err);
      setRetryError(
        err.message || "Failed to save trip. Please check your connection.",
      );
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
