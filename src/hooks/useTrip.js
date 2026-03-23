import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { generateItinerary } from '../services/groqService';

const initialFormData = {
  destination: '',
  flexibleDates: false,
  startDate: '',
  endDate: '',
  duration: 7,
  adults: 2,
  children: 0,
  tripType: '',
  interests: [],
  budget: '',
  specialRequests: '',
};

const statuses = [
  "Researching destination...",
  "Crafting your day-by-day itinerary...",
  "Finding hidden gems and local tips...",
  "Calculating your budget breakdown...",
  "Finalising your perfect trip..."
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
          status: 'upcoming',
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

        const dbPromise = addDoc(collection(db, 'trips'), tripData);
        
        // 5-second timeout to prevent infinite hang if Firestore is blocked by an adblocker
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore connection timeout')), 5000)
        );

        const docRef = await Promise.race([dbPromise, timeoutPromise]);
        setSavedTripId(docRef.id);
      } catch (dbErr) {
        console.error('Error saving trip to Firestore:', dbErr);
        // Do not block user flow just because save failed. Allow them to see the trip locally.
        setSavedTripId('local-trip-temp'); // temporary ID to satisfy complete state
        setError("Trip couldn't be saved properly, but you can still view it right now. Please check your internet connection or adblocker.");
      }

    } catch (err) {
      console.error("Trip generation error:", err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const generatingStatus = statuses[statusIndex];

  return {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    isGenerating,
    generatingStatus,
    itinerary,
    error,
    generateTrip,
    savedTripId,
  };
}
