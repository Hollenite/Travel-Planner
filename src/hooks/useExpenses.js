import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Hook to manage trip expenses
 * Handles CRUD operations with Firestore subcollection
 */
export function useExpenses(tripId) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for expenses
  useEffect(() => {
    if (!tripId) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const expensesRef = collection(db, "trips", tripId, "expenses");
    const q = query(expensesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const expensesList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setExpenses(expensesList);
          setLoading(false);
        } catch (err) {
          console.error("Error processing expenses:", err);
          setError("Failed to load expenses");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching expenses:", err);
        setError("Could not fetch expenses");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [tripId]);

  // Calculate totals
  const calculateTotal = () => {
    return expenses.reduce(
      (sum, exp) => sum + (parseFloat(exp.amount) || 0),
      0,
    );
  };

  // Add expense
  const addExpense = async (expenseData) => {
    try {
      if (!tripId) throw new Error("Trip ID is required");

      const expensesRef = collection(db, "trips", tripId, "expenses");
      await addDoc(expensesRef, {
        ...expenseData,
        amount: parseFloat(expenseData.amount),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.error("Error adding expense:", err);
      throw err;
    }
  };

  // Update expense
  const updateExpense = async (expenseId, expenseData) => {
    try {
      if (!tripId) throw new Error("Trip ID is required");

      const expenseRef = doc(db, "trips", tripId, "expenses", expenseId);
      await updateDoc(expenseRef, {
        ...expenseData,
        amount: parseFloat(expenseData.amount),
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.error("Error updating expense:", err);
      throw err;
    }
  };

  // Delete expense
  const deleteExpense = async (expenseId) => {
    try {
      if (!tripId) throw new Error("Trip ID is required");

      const expenseRef = doc(db, "trips", tripId, "expenses", expenseId);
      await deleteDoc(expenseRef);
      return true;
    } catch (err) {
      console.error("Error deleting expense:", err);
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    calculateTotal,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
