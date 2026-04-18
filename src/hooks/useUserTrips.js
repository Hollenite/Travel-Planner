import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

/**
 * Hook to fetch user's trips and compute useful stats
 * Real-time updates via snapshot listener
 */
export function useUserTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    uniqueCountries: new Set(),
  });

  useEffect(() => {
    if (!user) {
      setTrips([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query: get all trips for this user
    const q = query(collection(db, "trips"), where("userId", "==", user.uid));

    // Use snapshot listener for real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const tripsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setTrips(tripsList);

          // Compute stats
          const uniqueCountries = new Set();
          let upcomingCount = 0;
          let completedCount = 0;

          tripsList.forEach((trip) => {
            if (trip.destination) {
              uniqueCountries.add(trip.destination);
            }
            if (trip.status === "upcoming") upcomingCount += 1;
            if (trip.status === "completed") completedCount += 1;
          });

          setStats({
            totalTrips: tripsList.length,
            upcomingTrips: upcomingCount,
            completedTrips: completedCount,
            uniqueCountries: uniqueCountries.size,
          });

          setLoading(false);
        } catch (err) {
          console.error("Error processing trips:", err);
          setError("Failed to load trips");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching trips:", err);
        setError("Could not fetch trips. Please check your connection.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  return {
    trips,
    loading,
    error,
    stats,
  };
}
