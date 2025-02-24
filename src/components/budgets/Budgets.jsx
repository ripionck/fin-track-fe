import axios from 'axios';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import BudgetCard from './BudgetCard';
import BudgetModal from './BudgetModal';

const Budgets = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: 0,
    startDate: new Date().toISOString().split('T')[0],
  });
  const [editingBudget, setEditingBudget] = useState({
    _id: '',
    category: '',
    limit: 0,
  });
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchCategories();
        await fetchBudgets();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        'https://fin-track-api-ags1.onrender.com/api/v1/categories',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCategories(response.data);
      if (response.data.length > 0) {
        setNewBudget((prev) => ({ ...prev, category: response.data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(
        'https://fin-track-api-ags1.onrender.com/api/v1/budgets',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBudgets(response.data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://fin-track-api-ags1.onrender.com/api/v1/budgets',
        newBudget,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowAddModal(false);
      setNewBudget({
        category: categories[0]?._id || '',
        limit: 0,
        startDate: new Date().toISOString().split('T')[0],
      });
      fetchBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleEditBudget = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://fin-track-api-ags1.onrender.com/api/v1/budgets/${editingBudget._id}`,
        { category: editingBudget.category, limit: editingBudget.limit },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowEditModal(false);
      fetchBudgets();
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await axios.delete(
        `https://fin-track-api-ags1.onrender.com/api/v1/budgets/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const openEditModal = (budget) => {
    setEditingBudget({
      _id: budget._id,
      category: budget.category._id,
      limit: budget.limit,
    });
    setShowEditModal(true);
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const spent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remaining = totalBudget - spent;
  const progress = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;

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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-[#1e2e42] font-semibold">
                Total Monthly Budget
              </h2>
              <span className="text-2xl font-bold">
                ${totalBudget.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Spent: ${spent.toFixed(2)}</span>
                <span>Remaining: ${remaining.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                onEdit={openEditModal}
                onDelete={handleDeleteBudget}
              />
            ))}
          </div>
        </>
      )}

      <BudgetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateBudget}
        title="Create New Budget"
        initialData={{
          category: newBudget.category,
          setCategory: (value) =>
            setNewBudget({ ...newBudget, category: value }),
          limit: newBudget.limit,
          setLimit: (value) => setNewBudget({ ...newBudget, limit: value }),
          startDate: newBudget.startDate,
          setStartDate: (value) =>
            setNewBudget({ ...newBudget, startDate: value }),
        }}
        categories={categories}
      />

      <BudgetModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditBudget}
        title="Edit Budget"
        initialData={{
          category: editingBudget.category,
          limit: editingBudget.limit,
          setLimit: (value) =>
            setEditingBudget({ ...editingBudget, limit: value }),
        }}
        categories={categories}
        isEdit
      />
    </div>
  );
};

export default Budgets;
