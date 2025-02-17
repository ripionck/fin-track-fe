import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { budgets, categories } from '../data';

export default function Budgets() {
  const [showAddModal, setShowAddModal] = useState(false);
  const totalBudget = 4500;
  const spent = 2850;
  const remaining = totalBudget - spent;
  const progress = (spent / totalBudget) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl text-[#1e2e42] font-bold mb-1">
            Budget Management
          </h1>
          <p className="text-gray-600">Set and track your monthly budgets</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Create New Budget</span>
        </button>
      </div>

      {/* Total Budget Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-[#1e2e42] font-semibold">
            Total Monthly Budget
          </h2>
          <span className="text-2xl font-bold">${totalBudget}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Spent: ${spent}</span>
            <span>Remaining: ${remaining}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const progress = (budget.spent / budget.limit) * 100;
          return (
            <div key={budget.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{budget.category}</h3>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Pencil size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    ${budget.spent} / ${budget.limit}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-full rounded-full ${budget.color}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Monthly Limit</span>
                  <span className="font-medium">${budget.limit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining</span>
                  <span
                    className={`font-medium ${
                      budget.remaining > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ${budget.remaining}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Budget</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select className="w-full p-2 border rounded-lg">
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Limit
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input type="date" className="w-full p-2 border rounded-lg" />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Budget
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
