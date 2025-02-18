import axios from 'axios';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Budgets() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: 0,
    startDate: new Date().toISOString().split('T')[0],
  });
  const [editingBudget, setEditingBudget] = useState({
    category: '',
    categoryName: '',
    limit: 0,
  });
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
    fetchBudgets();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error(
          `Server returned ${response.status}: ${
            response.data.message || 'Error fetching categories'
          }`,
        );
      }

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response: Expected an array of categories');
      }

      setCategories(response.data);
      if (response.data.length > 0) {
        setNewBudget({ ...newBudget, category: response.data[0]._id });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/budgets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(response.data || []);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  // Calculate totals
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const spent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remaining = totalBudget - spent;
  const progress = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;

  // Create budget
  const handleCreateBudget = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/budgets', newBudget, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddModal(false);
      setNewBudget({
        category: categories[0],
        limit: 0,
        startDate: new Date().toISOString().split('T')[0],
      });
      fetchBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  // Edit budget
  const handleEditBudget = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/budgets/${editingBudget._id}`,
        {
          category: editingBudget.category,
          limit: editingBudget.limit,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowEditModal(false);
      fetchBudgets();
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  // Delete budget
  const handleDeleteBudget = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget({ ...newBudget, [name]: value });
  };

  // Handle edit input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBudget({ ...editingBudget, [name]: value });
  };

  // Open edit modal
  const openEditModal = (budget) => {
    const foundCategory = categories.find((cat) => cat._id === budget.category);
    setEditingBudget({
      ...budget,
      categoryName: foundCategory?.name || 'Unknown Category',
    });
    setShowEditModal(true);
  };

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
          const progress =
            budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
          const safeProgress = Math.min(progress, 100);
          const remaining = budget.limit - budget.spent;
          // const progressColor = remaining >= 0 ? 'bg-green-500' : 'bg-red-500';

          return (
            <div key={budget._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">
                  {categories.find((cat) => cat._id === budget.category)
                    ?.name || 'Unknown Category'}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(budget)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteBudget(budget._id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </span>
                  <span>{Math.round(safeProgress)}%</span>
                </div>

                {/* Progress Bar Container */}
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      categories.find((cat) => cat._id === budget.category)
                        ?.color || 'bg-gray-400'
                    }`}
                    style={{
                      width: `${safeProgress}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Monthly Limit</span>
                  <span className="font-medium">
                    ${budget.limit.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Remaining</span>
                  <span
                    className={`font-medium ${
                      remaining > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ${remaining.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Budget Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Budget</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleEditBudget}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg bg-gray-100"
                  value={editingBudget.categoryName}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Limit
                </label>
                <input
                  type="number"
                  name="limit"
                  className="w-full p-2 border rounded-lg"
                  value={editingBudget.limit || ''}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Update Budget
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

            <form className="space-y-4" onSubmit={handleCreateBudget}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full p-2 border rounded-lg"
                  value={newBudget.category}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, category: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
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
                  name="limit"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter amount"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  className="w-full p-2 border rounded-lg"
                  onChange={handleInputChange}
                  required
                />
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
