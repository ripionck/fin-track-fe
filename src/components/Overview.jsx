import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { monthlyData, spendingByCategory, transactions } from '../data';

export default function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Financial Overview</h1>
        <p className="text-gray-600">Your financial summary for this month</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600">Total Income</p>
              <h2 className="text-3xl font-bold mt-1">$5,240.00</h2>
            </div>
            <span className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-sm flex items-center">
              <ArrowUpRight size={16} className="mr-1" />
              12%
            </span>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600">Total Expenses</p>
              <h2 className="text-3xl font-bold mt-1">$3,850.00</h2>
            </div>
            <span className="text-red-500 bg-red-50 px-2 py-1 rounded-full text-sm flex items-center">
              <ArrowDownRight size={16} className="mr-1" />
              8%
            </span>
          </div>
          <p className="text-sm text-red-600 mt-2">↑ 8% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600">Net Savings</p>
              <h2 className="text-3xl font-bold mt-1">$1,390.00</h2>
            </div>
            <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded-full text-sm flex items-center">
              <TrendingUp size={16} className="mr-1" />
              23%
            </span>
          </div>
          <p className="text-sm text-blue-600 mt-2">↑ 23% from last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#34D399" name="Income" />
              <Bar dataKey="expenses" fill="#F87171" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={spendingByCategory}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {spendingByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <a href="#" className="text-blue-500 text-sm">
            View All
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">DATE</th>
                <th className="pb-3">DESCRIPTION</th>
                <th className="pb-3">CATEGORY</th>
                <th className="pb-3 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b last:border-b-0">
                  <td className="py-3">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-3">{transaction.description}</td>
                  <td className="py-3">{transaction.category}</td>
                  <td
                    className={`py-3 text-right ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
