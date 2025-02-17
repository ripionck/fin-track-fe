import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { categories, transactions } from '../data';

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
  const [filters, setFilters] = useState({
    dateRange: 'Last 7 days',
    category: 'All Categories',
    type: 'All Types',
    sort: 'Date (Newest)',
  });

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
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <option key={category} value={category}>
              {category}
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

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-gray-500">DATE</th>
              <th className="px-6 py-3 text-gray-500">DESCRIPTION</th>
              <th className="px-6 py-3 text-gray-500">CATEGORY</th>
              <th className="px-6 py-3 text-gray-500">TYPE</th>
              <th className="px-6 py-3 text-gray-500 text-right">AMOUNT</th>
              <th className="px-6 py-3 text-gray-500">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t">
                <td className="px-6 py-4">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{transaction.description}</td>
                <td className="px-6 py-4">{transaction.category}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      transaction.type === 'Income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 text-right ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  {transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Transaction</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter amount"
                />
              </div>

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
                  Type
                </label>
                <select className="w-full p-2 border rounded-lg">
                  {transactionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input type="date" className="w-full p-2 border rounded-lg" />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Transaction
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
