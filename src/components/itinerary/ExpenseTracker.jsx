import { useState } from "react";
import { Plus, Trash2, DollarSign, AlertCircle } from "lucide-react";
import { useExpenses } from "../../hooks/useExpenses";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function ExpenseTracker({ tripId, budgetEstimate }) {
  const {
    expenses,
    loading,
    error,
    calculateTotal,
    addExpense,
    deleteExpense,
  } = useExpenses(tripId);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [formData, setFormData] = useState({
    category: "food",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const totalSpent = calculateTotal();

  // Extract budget amount from string like "$1,200 - $1,800"
  const parseBudget = (budgetStr) => {
    if (!budgetStr) return null;
    const match = budgetStr.match(/\$[\d,]+/);
    if (match) {
      return parseFloat(match[0].replace(/[$,]/g, ""));
    }
    return null;
  };

  const budgetAmount = budgetEstimate
    ? parseBudget(budgetEstimate.total)
    : null;
  const budgetPercentage = budgetAmount
    ? (totalSpent / budgetAmount) * 100
    : null;

  // Get budget status color
  const getBudgetStatus = () => {
    if (!budgetPercentage) return "gray";
    if (budgetPercentage <= 50) return "green";
    if (budgetPercentage <= 90) return "yellow";
    return "red";
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.description.trim() || !formData.amount) {
      setFormError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await addExpense({
        category: formData.category,
        description: formData.description,
        amount: formData.amount,
        date: formData.date,
      });

      setFormData({
        category: "food",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      setIsAddingExpense(false);
    } catch (err) {
      setFormError(err.message || "Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Delete this expense?")) return;

    setDeletingId(expenseId);
    try {
      await deleteExpense(expenseId);
    } catch (err) {
      alert("Failed to delete expense");
      setDeletingId(null);
    }
  };

  const categoryEmojis = {
    food: "🍽️",
    accommodation: "🏨",
    transport: "🚗",
    activities: "🎫",
    shopping: "🛍️",
    other: "📝",
  };

  const categoryColors = {
    food: "bg-orange-50 border-orange-200 text-orange-700",
    accommodation: "bg-blue-50 border-blue-200 text-blue-700",
    transport: "bg-purple-50 border-purple-200 text-purple-700",
    activities: "bg-pink-50 border-pink-200 text-pink-700",
    shopping: "bg-green-50 border-green-200 text-green-700",
    other: "bg-slate-50 border-slate-200 text-slate-700",
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
            Budget Tracker
          </h3>
          <p className="text-sm text-slate-500 font-sans mt-1">
            Track your actual trip expenses
          </p>
        </div>
        <button
          onClick={() => setIsAddingExpense(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-teal-600 transition-colors font-sans text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 font-sans">{error}</p>
        </div>
      )}

      {/* Budget Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">
            Total Spent
          </p>
          <p className="font-display text-lg font-semibold text-slate-900">
            ${totalSpent.toFixed(2)}
          </p>
        </div>

        {budgetAmount && (
          <>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">
                Budget
              </p>
              <p className="font-display text-lg font-semibold text-slate-900">
                ${budgetAmount.toFixed(2)}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">
                Remaining
              </p>
              <p
                className={`font-display text-lg font-semibold ${
                  budgetAmount - totalSpent >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ${Math.abs(budgetAmount - totalSpent).toFixed(2)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Budget Progress */}
      {budgetPercentage !== null && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">
              Budget Usage
            </span>
            <span className="text-sm text-slate-600 font-mono">
              {budgetPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                getBudgetStatus() === "green"
                  ? "bg-green-500"
                  : getBudgetStatus() === "yellow"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Add Expense Form */}
      {isAddingExpense && (
        <form
          onSubmit={handleAddExpense}
          className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 space-y-3"
        >
          {formError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="food">🍽️ Food</option>
                <option value="accommodation">🏨 Accommodation</option>
                <option value="transport">🚗 Transport</option>
                <option value="activities">🎫 Activities</option>
                <option value="shopping">🛍️ Shopping</option>
                <option value="other">📝 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0.00"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., Dinner at local restaurant"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsAddingExpense(false)}
              className="px-3 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors font-sans text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors font-sans text-sm font-semibold"
            >
              {isSubmitting ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      )}

      {/* Expenses List */}
      {expenses.length === 0 ? (
        <div className="text-center py-8 text-slate-500 font-sans">
          <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            No expenses yet. Start tracking your spending!
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((expense) => (
              <div
                key={expense.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${categoryColors[expense.category] || categoryColors.other}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg">
                    {categoryEmojis[expense.category] || "📝"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-semibold truncate">
                      {expense.description}
                    </p>
                    <p className="font-mono text-xs opacity-75">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <span className="font-display font-semibold text-sm">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    disabled={deletingId === expense.id}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
