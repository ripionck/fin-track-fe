import axios from 'axios';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const transactionTypes = ['Income', 'Expense'];

const dateRanges = [
  'Last 7 days',
  'Last 30 days',
  'This month',
  'Last month',
  'This year',
];

export default function Transactions() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'Last 7 days',
    category: 'All Categories',
    type: 'All Types',
    sort: 'Date (Newest)',
  });
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    type: '',
    amount: 0,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchTransactions();
    }
  }, [filters, categories]);

  const fetchCategories = async () => {
    setError(null);
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
      // Ensure we have valid categories array
      const receivedCategories = Array.isArray(response.data)
        ? response.data
        : [];

      setCategories(receivedCategories);

      // Set initial category in form data to first category's ID
      if (receivedCategories.length > 0) {
        setFormData((prevForm) => ({
          ...prevForm,
          category: receivedCategories[0]._id,
        }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again.');
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = getStartDate(filters.dateRange);
      const endDate = new Date().toISOString();

      const params = {
        ...filters,
        startDate: startDate,
        endDate: endDate,
      };

      const response = await axios.get(
        'http://localhost:5000/api/transactions',
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        },
      );

      setTransactions(
        (response.data.data || []).map((transaction) => ({
          ...transaction,
          type: String(transaction.type).toLowerCase(),
        })),
      );
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (range) => {
    const date = new Date();
    switch (range) {
      case 'Last 7 days':
        date.setDate(date.getDate() - 7);
        break;
      case 'Last 30 days':
        date.setDate(date.getDate() - 30);
        break;
      case 'This month':
        date.setDate(1);
        break;
      case 'Last month':
        date.setMonth(date.getMonth() - 1);
        date.setDate(1);
        break;
      case 'This year':
        date.setMonth(0);
        date.setDate(1);
        break;
      default:
        date.setDate(date.getDate() - 7);
    }
    return date.toISOString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetFormData = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: categories[0],
      type: transactionTypes[0],
      amount: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        amount:
          formData.type === 'Expense'
            ? -Math.abs(formData.amount)
            : Math.abs(formData.amount),
      };

      if (formData._id) {
        await axios.put(
          `http://localhost:5000/api/transactions/${formData._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        await axios.post('http://localhost:5000/api/transactions', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowAddModal(false);
      resetFormData();
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      setError('Failed to save transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
      ...transaction,
      amount: Math.abs(transaction.amount),
      date: new Date(transaction.date).toISOString().split('T')[0],
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sortTransactions = (data) => {
    if (!Array.isArray(data)) return [];
    const sortedData = [...data];
    switch (filters.sort) {
      case 'Date (Newest)':
        return sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'Date (Oldest)':
        return sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'Amount (High to Low)':
        return sortedData.sort(
          (a, b) => Math.abs(b.amount) - Math.abs(a.amount),
        );
      case 'Amount (Low to High)':
        return sortedData.sort(
          (a, b) => Math.abs(a.amount) - Math.abs(b.amount),
        );
      default:
        return sortedData;
    }
  };

  const filteredTransactions = sortTransactions(
    transactions.filter((transaction) => {
      return (
        (filters.category === 'All Categories' ||
          (transaction.category &&
            transaction.category._id === filters.category)) &&
        (filters.type === 'All Types' ||
          String(transaction.type).toLowerCase() === filters.type.toLowerCase())
      );
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Transactions</h1>
          <p className="text-gray-600">
            Manage and track your financial transactions
          </p>
        </div>
        <button
          onClick={() => {
            resetFormData();
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filters */}
        <select
          className="w-full p-2 border rounded-lg"
          value={filters.dateRange}
          onChange={(e) =>
            setFilters({ ...filters, dateRange: e.target.value })
          }
        >
          {dateRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border rounded-lg"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="All Categories">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border rounded-lg"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="All Types">All Types</option>
          {transactionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border rounded-lg"
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="Date (Newest)">Date (Newest)</option>
          <option value="Date (Oldest)">Date (Oldest)</option>
          <option value="Amount (High to Low)">Amount (High to Low)</option>
          <option value="Amount (Low to High)">Amount (Low to High)</option>
        </select>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id} className="border-t">
                <td className="px-6 py-4">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{transaction.description}</td>
                <td className="px-6 py-4">
                  {transaction.category && transaction.category.name}
                </td>
                <td className="px-1 py-4">
                  <span
                    className={`px-6 py-4 text-right ${
                      String(transaction.type).toLowerCase() === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 text-right ${
                    String(transaction.type).toLowerCase() === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {String(transaction.type).toLowerCase() === 'income'
                    ? '+'
                    : '-'}
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {formData._id ? 'Update Transaction' : 'Add Transaction'}
              </h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                {formData._id ? (
                  <input
                    type="text"
                    value={
                      categories.find(
                        (cat) => cat._id === formData.category?._id,
                      )?.name || ''
                    }
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-100"
                  />
                ) : (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                {formData._id ? (
                  <input
                    type="text"
                    value={formData.type}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-100"
                  />
                ) : (
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    {transactionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {formData._id ? 'Update Transaction' : 'Add Transaction'}
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
