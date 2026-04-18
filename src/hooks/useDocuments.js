import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { db } from "../config/firebase";

const storage = getStorage();

/**
 * Hook to manage trip documents
 * Stores document metadata in Firestore and files in Firebase Storage
 */
export function useDocuments(tripId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for documents
  useEffect(() => {
    if (!tripId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const docsRef = collection(db, "trips", tripId, "documents");
    const q = query(docsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const docsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDocuments(docsList);
          setLoading(false);
        } catch (err) {
          console.error("Error processing documents:", err);
          setError("Failed to load documents");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching documents:", err);
        setError("Could not fetch documents");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [tripId]);

  // Upload document
  const uploadDocument = async (file, name, type) => {
    try {
      if (!tripId) throw new Error("Trip ID is required");
      if (!file) throw new Error("File is required");

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${tripId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, `trip-documents/${filename}`);

      // Upload to Firebase Storage
      await uploadBytes(storageRef, file);

      // Store metadata in Firestore
      const docsRef = collection(db, "trips", tripId, "documents");
      await addDoc(docsRef, {
        name: name || file.name,
        type: type || file.type,
        fileName: file.name,
        fileSize: file.size,
        storageRef: filename,
        uploadedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error("Error uploading document:", err);
      throw err;
    }
  };

  // Delete document
  const deleteDocument = async (documentId, storageRef) => {
    try {
      if (!tripId) throw new Error("Trip ID is required");

      // Delete from Storage
      if (storageRef) {
        try {
          const ref_obj = ref(storage, `trip-documents/${storageRef}`);
          await deleteObject(ref_obj);
        } catch (err) {
          console.warn("File not found in storage:", err);
          // Continue with metadata deletion even if file not found
        }
      }

      // Delete from Firestore
      const docRef = doc(db, "trips", tripId, "documents", documentId);
      await deleteDoc(docRef);

      return true;
    } catch (err) {
      console.error("Error deleting document:", err);
      throw err;
    }
  };

  // Update document metadata
  const updateDocument = async (documentId, updates) => {
    try {
      if (!tripId) throw new Error("Trip ID is required");

      const docRef = doc(db, "trips", tripId, "documents", documentId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error("Error updating document:", err);
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    updateDocument,
  };
}
