import axios from 'axios';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTransactionModal from './AddTransactionModal';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'Last 7 days',
    category: 'All Categories',
    type: 'All Types',
    sort: 'Date (Newest)',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Axios instance for authenticated requests
  const authAxios = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  // Axios instance for unauthenticated requests
  const publicAxios = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactionsRes, categoriesRes] = await Promise.all([
          authAxios.get('/transactions'),
          publicAxios.get('/categories'), // No token required
        ]);

        // Null checks and default to empty arrays
        setTransactions(transactionsRes.data ? transactionsRes.data : []);
        setCategories(categoriesRes.data ? categoriesRes.data : []);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load data');
        if (error.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleAddTransaction = async (newTransaction) => {
    try {
      const response = await authAxios.post('/transactions', newTransaction);
      setTransactions([response.data, ...transactions]);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add transaction');
    }
  };

  const handleUpdateTransaction = async (updatedTransaction) => {
    try {
      const response = await authAxios.put(
        `/transactions/${updatedTransaction.id}`,
        updatedTransaction,
      );
      setTransactions(
        transactions.map((t) =>
          t.id === response.data.id ? response.data : t,
        ),
      );
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await authAxios.delete(`/transactions/${id}`);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowAddModal(true);
  };

  const filteredTransactions = applyFilters(transactions, filters);

  const totalAmount = filteredTransactions.reduce(
    (sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount),
    0,
  );

  if (loading)
    return <div className="p-4 text-gray-500">Loading transactions...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-[#1e2e42] font-bold">Transactions</h1>
          <p className="text-gray-600">
            Manage and track your financial transactions
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedTransaction(null);
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>
      <TransactionFilters
        filters={filters}
        setFilters={setFilters}
        categories={categories}
      />
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEditClick}
          onDelete={handleDeleteTransaction}
        />
      </div>
      <div className="text-right text-lg font-bold">
        Net Balance:{' '}
        <span
          className={`${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(totalAmount)}
        </span>
      </div>
      {showAddModal && (
        <AddTransactionModal
          onClose={() => setShowAddModal(false)}
          categories={categories}
          onSubmit={
            selectedTransaction ? handleUpdateTransaction : handleAddTransaction
          }
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
}

// Filter function
const applyFilters = (transactions, filters) => {
  let filtered = [...(transactions || [])];
  const now = new Date();

  // Date filtering
  switch (filters.dateRange) {
    case 'Last 7 days': {
      const cutoff = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter((t) => new Date(t.date) >= cutoff);
      break;
    }
    case 'Last 30 days': {
      const cutoff = new Date(now.setDate(now.getDate() - 30));
      filtered = filtered.filter((t) => new Date(t.date) >= cutoff);
      break;
    }
    case 'This month': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter((t) => new Date(t.date) >= startOfMonth);
      break;
    }
    default:
      break;
  }

  // Category filtering
  if (filters.category !== 'All Categories') {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  // Type filtering
  if (filters.type !== 'All Types') {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  // Sorting
  switch (filters.sort) {
    case 'Date (Newest)':
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'Date (Oldest)':
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'Amount (High to Low)':
      filtered.sort((a, b) => b.amount - a.amount);
      break;
    case 'Amount (Low to High)':
      filtered.sort((a, b) => a.amount - b.amount);
      break;
  }

  return filtered;
};
