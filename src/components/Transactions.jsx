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
    date: new Date().toLocaleDateString('en-CA'),
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
      const response = await axios.get(
        'https://fin-track-api-silk.vercel.app/api/categories',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const receivedCategories = Array.isArray(response.data)
        ? response.data
        : [];
      setCategories(receivedCategories);

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

  const getStartDate = (range) => {
    const now = new Date();
    const date = new Date(now);

    switch (range) {
      case 'Last 7 days':
        date.setUTCDate(now.getUTCDate() - 6);
        break;
      case 'Last 30 days':
        date.setUTCDate(now.getUTCDate() - 29);
        break;
      case 'This month':
        date.setUTCDate(1);
        break;
      case 'Last month':
        date.setUTCMonth(now.getUTCMonth() - 1);
        date.setUTCDate(1);
        break;
      case 'This year':
        date.setUTCMonth(0);
        date.setUTCDate(1);
        break;
      default:
        date.setUTCDate(now.getUTCDate() - 6);
    }

    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const getEndDate = (range) => {
    const now = new Date();
    const date = new Date(now);

    switch (range) {
      case 'Last month':
        // Set to last day of previous month
        date.setUTCMonth(now.getUTCMonth());
        date.setUTCDate(0);
        break;
      case 'This month':
        // Last day of current month
        date.setUTCMonth(now.getUTCMonth() + 1, 0);
        break;
      case 'This year':
        // Last day of current year
        date.setUTCMonth(11, 31);
        break;
      default:
        // Current date for other ranges
        date.setUTCHours(23, 59, 59, 999);
    }

    date.setUTCHours(23, 59, 59, 999);
    return date.toISOString();
  };

  // Update the fetchTransactions function
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = getStartDate(filters.dateRange);
      const endDate = getEndDate(filters.dateRange);

      const params = {
        startDate,
        endDate,
        category: filters.category === 'All Categories' ? '' : filters.category,
        type: filters.type === 'All Types' ? '' : filters.type,
        sort: filters.sort,
      };

      const response = await axios.get(
        'https://fin-track-api-silk.vercel.app/api/transactions',
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        },
      );

      setTransactions(
        (response.data.data || []).map((transaction) => ({
          ...transaction,
          type: transaction.type.toLowerCase(),
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      const localDate = new Date(value + 'T00:00:00');
      const isoDate = localDate.toISOString();
      setFormData({ ...formData, [name]: isoDate });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetFormData = () => {
    setFormData({
      date: new Date().toLocaleDateString('en-CA'),
      description: '',
      category: categories[0]?._id || '',
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

      const url = formData._id
        ? `https://fin-track-api-silk.vercel.app/api/transactions/${formData._id}`
        : 'https://fin-track-api-silk.vercel.app/api/transactions';

      const method = formData._id ? 'put' : 'post';

      await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowAddModal(false);
      resetFormData();
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      setError(
        error.response?.data?.message ||
          'Failed to save transaction. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    const localDate = new Date(transaction.date);
    const dateString = localDate.toLocaleDateString('en-CA');

    setFormData({
      ...transaction,
      amount: Math.abs(transaction.amount),
      date: dateString,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(
        `https://fin-track-api-silk.vercel.app/api/transactions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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

      {loading && (
        <div className="flex justify-center items-center h-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
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
                  value={new Date(formData.date).toLocaleDateString('en-CA')}
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
