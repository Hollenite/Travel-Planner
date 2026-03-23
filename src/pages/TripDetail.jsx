import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

import TripHeader from '../components/itinerary/TripHeader';
import OverviewSection from '../components/itinerary/OverviewSection';
import BudgetCard from '../components/itinerary/BudgetCard';
import DayCard from '../components/itinerary/DayCard';
import QuickTipsSection from '../components/itinerary/QuickTipsSection';
import PackingList from '../components/itinerary/PackingList';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrip() {
      try {
        // If the trip ID is a local mock ID from a failed save, navigate away or handle
        if (id === 'local-trip-temp') {
          setError("We couldn't save this trip earlier. Please try planning a new trip when your connection is stable.");
          setLoading(false);
          return;
        }

        const docRef = doc(db, 'trips', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const tripData = { id: docSnap.id, ...docSnap.data() };
          // Secure route: only owner can view, unless public (we'll enforce owner-only for now)
          if (tripData.userId !== user.uid && !tripData.isPublic) {
            navigate('/dashboard', { replace: true });
            return;
          }
          setTrip(tripData);
        } else {
          // Trip doesn't exist
          navigate('/trips', { replace: true });
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

  if (error || !trip) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-surface2 px-4">
        <p className="text-slate-500 font-sans mb-4">{error}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-white border border-slate-200 text-slate-700 font-sans px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { itinerary } = trip;

  return (
    <div className="bg-surface2 min-h-full">
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        
        <TripHeader trip={trip} itinerary={itinerary} />
        
        <OverviewSection trip={trip} itinerary={itinerary} />
        
        <BudgetCard budget={itinerary.estimatedBudget} />

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
