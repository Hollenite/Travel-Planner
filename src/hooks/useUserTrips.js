import { useState, useEffect, useMemo } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

const EMPTY_STATS = {
  totalTrips: 0,
  upcomingTrips: 0,
  completedTrips: 0,
  uniqueCountries: 0,
};

const CACHE_VERSION = 1;

const getCacheKey = (userId) => `travel-planner:user-trips:v${CACHE_VERSION}:${userId}`;

const toMilliseconds = (value) => {
  if (!value) return null;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

export const normalizeTrip = (trip) => ({
  ...trip,
  travelers: {
    adults: trip.travelers?.adults ?? 0,
    children: trip.travelers?.children ?? 0,
  },
  createdAtMs: toMilliseconds(trip.createdAtMs ?? trip.createdAt),
  updatedAtMs: toMilliseconds(trip.updatedAtMs ?? trip.updatedAt),
  startDateMs: toMilliseconds(trip.startDateMs ?? trip.startDate),
  endDateMs: toMilliseconds(trip.endDateMs ?? trip.endDate),
});

const getStatsFromTrips = (trips) => {
  const uniqueCountries = new Set();
  let upcomingTrips = 0;
  let completedTrips = 0;

  trips.forEach((trip) => {
    if (trip.destination) {
      uniqueCountries.add(trip.destination);
    }
    if (trip.status === "upcoming") upcomingTrips += 1;
    if (trip.status === "completed") completedTrips += 1;
  });

  return {
    totalTrips: trips.length,
    upcomingTrips,
    completedTrips,
    uniqueCountries: uniqueCountries.size,
  };
};

const readTripsCache = (userId) => {
  if (!userId) return [];

  try {
    const stored = localStorage.getItem(getCacheKey(userId));
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed?.trips)) return [];

    return parsed.trips.map(normalizeTrip);
  } catch (error) {
    console.warn("Failed to read trip cache:", error);
    return [];
  }
};

const writeTripsCache = (userId, trips) => {
  if (!userId) return;

  try {
    localStorage.setItem(
      getCacheKey(userId),
      JSON.stringify({
        version: CACHE_VERSION,
        userId,
        savedAt: Date.now(),
        trips,
      }),
    );
  } catch (error) {
    console.warn("Failed to write trip cache:", error);
  }
};

/**
 * Hook to fetch user's trips and compute useful stats
 * Real-time updates via snapshot listener with localStorage hydration
 */
export function useUserTrips() {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setTrips([]);
      setLoading(false);
      setIsRefreshing(false);
      setError(null);
      return undefined;
    }

    const cachedTrips = readTripsCache(userId);
    setTrips(cachedTrips);
    setLoading(false);
    setIsRefreshing(true);
    setError(null);

    const q = query(collection(db, "trips"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const normalizedTrips = snapshot.docs.map((doc) =>
            normalizeTrip({
              id: doc.id,
              ...doc.data(),
            }),
          );

          setTrips(normalizedTrips);
          writeTripsCache(userId, normalizedTrips);
          setError(null);
        } catch (snapshotError) {
          console.error("Error processing trips:", snapshotError);
          setError("Failed to load trips");
        } finally {
          setLoading(false);
          setIsRefreshing(false);
        }
      },
      (snapshotError) => {
        console.error("Error fetching trips:", snapshotError);
        setError("Could not fetch trips. Please check your connection.");
        setLoading(false);
        setIsRefreshing(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  const stats = useMemo(() => getStatsFromTrips(trips), [trips]);

  const recentTrips = useMemo(
    () => [...trips].sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0)).slice(0, 3),
    [trips],
  );

  return {
    trips,
    recentTrips,
    loading,
    isRefreshing,
    error,
    stats: stats ?? EMPTY_STATS,
  };
}
