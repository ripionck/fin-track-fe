import { ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { analyticsData, monthlyData, spendingByCategory } from '../data';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const { monthlySavings, budgetVsActual, topSpending, kpis } = analyticsData;

  const COLORS = {
    rent: '#60A5FA',
    food: '#34D399',
    transport: '#FBBF24',
    utilities: '#A78BFA',
    entertainment: '#F87171',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl text-[#1e2e42] font-bold mb-1">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Detailed analysis of your spending patterns
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-4">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <RefreshCw size={20} />
          Update
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Income',
            value: `$${kpis.totalIncome.value.toLocaleString()}`,
            change: kpis.totalIncome.change,
            color: 'text-green-500',
          },
          {
            title: 'Total Expenses',
            value: `$${kpis.totalExpenses.value.toLocaleString()}`,
            change: kpis.totalExpenses.change,
            color: 'text-red-500',
          },
          {
            title: 'Savings Rate',
            value: `${kpis.savingsRate.value}%`,
            change: kpis.savingsRate.change,
            color: 'text-blue-500',
          },
          {
            title: 'Budget Adherence',
            value: `${kpis.budgetAdherence.value}%`,
            change: kpis.budgetAdherence.change,
            color: 'text-yellow-500',
          },
        ].map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-1">{kpi.title}</h3>
            <div className="text-2xl font-bold mb-2">
              <span className={kpi.color}>{kpi.value}</span>
            </div>
            <div className="flex items-center">
              {kpi.change > 0 ? (
                <ArrowUp className="text-green-500" size={16} />
              ) : (
                <ArrowDown className="text-red-500" size={16} />
              )}
              <span
                className={`ml-1 ${
                  kpi.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.abs(kpi.change)}% from last period
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Savings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Savings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySavings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="savings" fill="#60A5FA" name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget vs Actual */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Budget vs Actual Spending
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetVsActual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#93C5FD" name="Budget" />
              <Bar dataKey="actual" fill="#FCA5A5" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income vs Expenses Trend & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Income vs Expenses Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#34D399"
                name="Income"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#F87171"
                name="Expenses"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
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
      {/* Top Spending Categories */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Spending Categories</h3>
        <div className="space-y-4">
          {topSpending.map((category, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span>{category.category}</span>
                <span className="text-gray-600">
                  ${category.amount.toLocaleString()} ({category.percentage}%)
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className={`h-full rounded-full ${category.color}`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
