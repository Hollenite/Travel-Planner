import { useState } from "react";
import {
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useDocuments } from "../../hooks/useDocuments";
import LoadingSpinner from "../ui/LoadingSpinner";

const docTypeIcons = {
  passport: "🛂",
  visa: "📋",
  ticket: "🎫",
  booking: "🏨",
  insurance: "🛡️",
  itinerary: "📅",
  receipt: "💳",
  link: "🔗",
  other: "📄",
};

export default function DocumentManager({ tripId }) {
  const {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    updateDocument,
  } = useDocuments(tripId);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "other",
    link: "",
  });
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleAddDocument = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.link.trim()) {
      setFormError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Store as metadata document (simple link storage)
      const docsRef = window.firebase?.firestore?.collection(
        `trips/${tripId}/documents`,
      );

      // Use firebase directly since we're storing links
      const { collection, addDoc, serverTimestamp } =
        await import("firebase/firestore");
      const { db } = await import("../../config/firebase");

      await addDoc(collection(db, "trips", tripId, "documents"), {
        name: formData.name,
        type: formData.type,
        link: formData.link,
        uploadedAt: serverTimestamp(),
      });

      setFormData({
        name: "",
        type: "other",
        link: "",
      });
      setIsAddingDocument(false);
    } catch (err) {
      setFormError(err.message || "Failed to add document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (doc) => {
    setEditingId(doc.id);
    setEditName(doc.name);
  };

  const handleSaveEdit = async (docId) => {
    if (!editName.trim()) return;
    try {
      await updateDocument(docId, { name: editName });
      setEditingId(null);
      setEditName("");
    } catch (err) {
      alert("Failed to update document");
    }
  };

  const handleDeleteDocument = async (docId, storageRef) => {
    if (!window.confirm("Delete this document?")) return;

    setDeletingId(docId);
    try {
      await deleteDocument(docId, storageRef);
    } catch (err) {
      alert("Failed to delete document");
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-slate-900">
            Travel Documents
          </h3>
          <p className="text-sm text-slate-500 font-sans mt-1">
            Store important travel documents and links
          </p>
        </div>
        <button
          onClick={() => setIsAddingDocument(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-teal-600 transition-colors font-sans text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 font-sans">{error}</p>
        </div>
      )}

      {/* Add Document Form */}
      {isAddingDocument && (
        <form
          onSubmit={handleAddDocument}
          className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 space-y-3"
        >
          {formError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Document Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Flight Booking"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="passport">🛂 Passport</option>
                <option value="visa">📋 Visa</option>
                <option value="ticket">🎫 Ticket</option>
                <option value="booking">🏨 Booking</option>
                <option value="insurance">🛡️ Insurance</option>
                <option value="itinerary">📅 Itinerary</option>
                <option value="receipt">💳 Receipt</option>
                <option value="link">🔗 Link</option>
                <option value="other">📄 Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Link or Reference
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="https://... or document reference"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Add URL or reference number for the document
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsAddingDocument(false)}
              className="px-3 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors font-sans text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors font-sans text-sm font-semibold"
            >
              {isSubmitting ? "Adding..." : "Add Document"}
            </button>
          </div>
        </form>
      )}

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center py-8 text-slate-500 font-sans">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            No documents yet. Add important travel documents.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {documents
            .sort(
              (a, b) =>
                (b.uploadedAt?.toDate?.() || 0) -
                (a.uploadedAt?.toDate?.() || 0),
            )
            .map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">
                    {docTypeIcons[doc.type] || docTypeIcons.other}
                  </span>
                  <div className="flex-1 min-w-0">
                    {editingId === doc.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm font-sans"
                        />
                        <button
                          onClick={() => handleSaveEdit(doc.id)}
                          className="text-accent hover:text-teal-600"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="font-sans text-sm font-semibold truncate">
                          {doc.name}
                        </p>
                        {doc.link && (
                          <a
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-teal-600 text-xs truncate block"
                          >
                            {doc.link}
                          </a>
                        )}
                        <p className="font-mono text-xs text-slate-500">
                          {doc.uploadedAt?.toDate?.().toLocaleDateString() ||
                            "Recently added"}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {editingId !== doc.id && (
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <button
                      onClick={() => handleStartEdit(doc)}
                      className="text-slate-600 hover:text-slate-900 transition-colors p-1"
                      title="Edit document"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteDocument(doc.id, doc.storageRef)
                      }
                      disabled={deletingId === doc.id}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors p-1"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700 font-sans">
          💡 Store booking confirmations, visa information, insurance documents,
          and other important travel references here.
        </p>
      </div>
    </div>
  );
}
