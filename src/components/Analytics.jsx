import axios from 'axios';
import { ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
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

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [analyticsData, setAnalyticsData] = useState({
    monthlySavings: [],
    budgetVsActual: [],
    topSpending: [],
    kpis: {},
    monthlyData: [],
    spendingByCategory: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(value || 0));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const endpointMap = {
        'Last 30 days': '30days',
        'Last 90 days': '90days',
        'This year': 'current-year',
      };

      const { data } = await axios.get(
        `https://fin-track-api-silk.vercel.app/api/analytics/${endpointMap[timeRange]}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const processedData = {
        monthlySavings:
          data.monthlySavings?.map((item) => ({
            month: item.month,
            savings: item.savings || 0,
          })) || [],

        budgetVsActual:
          data.budgetVsActual?.map((item) => ({
            category: item.category,
            budget: item.budget || 0,
            actual: Math.abs(item.actual) || 0,
          })) || [],

        topSpending:
          data.topSpending?.map((item) => ({
            category: item.category,
            amount: Math.abs(item.amount) || 0,
            percentage: parseFloat(item.percentage) || 0,
          })) || [],

        kpis: {
          totalIncome: {
            value: Math.abs(data.kpis?.totalIncome?.value) || 0,
            change: parseFloat(data.kpis?.totalIncome?.change) || 0,
          },
          totalExpenses: {
            value: Math.abs(data.kpis?.totalExpenses?.value) || 0,
            change: parseFloat(data.kpis?.totalExpenses?.change) || 0,
          },
          savingsRate: {
            value: parseFloat(data.kpis?.savingsRate?.value) || 0,
            change: parseFloat(data.kpis?.savingsRate?.change) || 0,
          },
          budgetAdherence: {
            value: parseFloat(data.kpis?.budgetAdherence?.value) || 0,
            change: parseFloat(data.kpis?.budgetAdherence?.change) || 0,
          },
        },

        monthlyData:
          data.monthlyData?.map((item) => ({
            month: item.month,
            income: Math.abs(item.income) || 0,
            expenses: Math.abs(item.expenses) || 0,
          })) || [],

        spendingByCategory:
          data.spendingByCategory?.map((item) => ({
            name: item.name,
            value: Math.abs(item.value) || 0,
            color: item.color || '#CCCCCC',
          })) || [],
      };

      // Calculate percentages if not provided
      const totalExpenses = processedData.kpis.totalExpenses.value;
      if (totalExpenses > 0) {
        processedData.topSpending = processedData.topSpending.map((item) => ({
          ...item,
          percentage: item.percentage || (item.amount / totalExpenses) * 100,
        }));
      }

      setAnalyticsData(processedData);
    } catch (error) {
      setError(
        error.response?.data?.message || 'Failed to fetch analytics data',
      );
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const {
    monthlySavings,
    budgetVsActual,
    topSpending,
    kpis,
    monthlyData,
    spendingByCategory,
  } = analyticsData;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Financial Analytics
        </h1>
        <p className="text-gray-600">
          Interactive financial insights and spending patterns
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white w-full sm:w-auto"
        >
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>

        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400 w-full sm:w-auto justify-center"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-6 text-gray-600">
          Loading financial data...
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Total Income',
                value: kpis.totalIncome?.value,
                change: kpis.totalIncome?.change,
                color: 'text-green-600',
                prefix: '$',
              },
              {
                title: 'Total Expenses',
                value: kpis.totalExpenses?.value,
                change: kpis.totalExpenses?.change,
                color: 'text-red-600',
                prefix: '$',
              },
              {
                title: 'Savings Rate',
                value: kpis.savingsRate?.value,
                change: kpis.savingsRate?.change,
                color: 'text-blue-600',
                suffix: '%',
              },
              {
                title: 'Budget Adherence',
                value: kpis.budgetAdherence?.value,
                change: kpis.budgetAdherence?.change,
                color: 'text-purple-600',
                suffix: '%',
              },
            ].map((kpi, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-sm font-medium text-gray-500">
                  {kpi.title}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`text-2xl font-semibold ${kpi.color}`}>
                    {kpi.prefix}
                    {kpi.value?.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                    {kpi.suffix}
                  </span>
                  <div className="flex items-center text-sm">
                    {kpi.change >= 0 ? (
                      <ArrowUp className="text-green-500" size={16} />
                    ) : (
                      <ArrowDown className="text-red-500" size={16} />
                    )}
                    <span
                      className={`ml-1 ${
                        kpi.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {kpi.change >= 0 ? '+' : ''}
                      {typeof kpi.change === 'number'
                        ? kpi.change.toFixed(1)
                        : '0.0'}
                      %
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Savings */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Monthly Savings</h3>
              {monthlySavings.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlySavings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar
                      dataKey="savings"
                      fill="#60A5FA"
                      name="Savings"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No savings data available
                </div>
              )}
            </div>

            {/* Budget vs Actual */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">
                Budget vs Actual Spending
              </h3>
              {budgetVsActual.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetVsActual}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar
                      dataKey="budget"
                      fill="#93C5FD"
                      name="Budget"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="actual"
                      fill="#FCA5A5"
                      name="Actual"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No budget data available
                </div>
              )}
            </div>
          </div>

          {/* Second Row Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expenses Trend */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">
                Income vs Expenses Trend
              </h3>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#34D399"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Income"
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#F87171"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Expenses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No transaction trend data available
                </div>
              )}
            </div>

            {/* Expense Distribution */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">
                Expense Distribution
              </h3>
              {spendingByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={spendingByCategory}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                    >
                      {spendingByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [formatCurrency(value), name]}
                    />
                    <Legend
                      formatter={(value) => {
                        const category = spendingByCategory.find(
                          (c) => c.name === value,
                        );
                        const total = kpis.totalExpenses?.value || 1;
                        const percentage = category
                          ? ((category.value / total) * 100).toFixed(1)
                          : '0.0';
                        return `${value} (${percentage}%)`;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No expense distribution data available
                </div>
              )}
            </div>
          </div>

          {/* Top Spending Categories */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">
              Top Spending Categories
            </h3>
            <div className="space-y-4">
              {topSpending.length > 0 ? (
                topSpending.map((category, index) => {
                  const categoryColor = spendingByCategory.find(
                    (c) =>
                      c.name.toLowerCase() === category.category.toLowerCase(),
                  )?.color;

                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-gray-600">
                          {formatCurrency(category.amount)} (
                          {typeof category.percentage === 'number'
                            ? `${category.percentage.toFixed(1)}%`
                            : '0.0%'}
                          )
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(category.percentage, 100)}%`,
                            backgroundColor: categoryColor || '#CCCCCC',
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No spending categories to display
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
