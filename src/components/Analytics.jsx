import { RefreshCw } from 'lucide-react';
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

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    value,
  );

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [analytics, setAnalytics] = useState({
    kpis: {
      totalIncome: 0,
      totalExpenses: 0,
      savingsRate: 0,
      budgetAdherence: 0,
    },
    monthlyData: [],
    spendingByCategory: [],
    budgetVsActual: [],
    topSpending: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch KPIs and main analytics
      const kpisResponse = await fetch(
        `/api/analytics/${timeRange === 'This year' ? 'year' : '30days'}`,
      );
      const kpisData = await kpisResponse.json();

      // Fetch budgets and transactions for budget vs actual
      const budgetsResponse = await fetch('/api/budgets');
      const transactionsResponse = await fetch('/api/transactions');
      const [budgets, transactions] = await Promise.all([
        budgetsResponse.json(),
        transactionsResponse.json(),
      ]);

      // Process budget vs actual data
      const budgetVsActual = budgets.map((budget) => {
        const actual = transactions
          .filter((t) => t.category === budget.category && t.type === 'Expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          category: budget.category,
          budget: budget.limit,
          actual,
        };
      });

      // Process spending by category
      const spendingMap = new Map();
      transactions
        .filter((t) => t.type === 'Expense')
        .forEach((t) => {
          spendingMap.set(
            t.category,
            (spendingMap.get(t.category) || 0) + t.amount,
          );
        });
      const spendingByCategory = Array.from(spendingMap, ([name, value]) => ({
        name,
        value,
        color: getCategoryColor(name),
      }));

      // Calculate KPIs
      const totalIncome = transactions
        .filter((t) => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter((t) => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const savingsRate =
        ((totalIncome - totalExpenses) / totalIncome) * 100 || 0;

      setAnalytics({
        kpis: {
          totalIncome,
          totalExpenses,
          savingsRate: parseFloat(savingsRate.toFixed(1)),
          budgetAdherence: calculateBudgetAdherence(budgetVsActual),
        },
        monthlyData: kpisData.monthlyData || [],
        spendingByCategory,
        budgetVsActual,
        topSpending: Array.from(spendingMap, ([category, amount]) => ({
          category,
          amount,
          percentage: Math.round((amount / totalExpenses) * 100),
        }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 3),
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const getCategoryColor = (category) => {
    const colors = {
      Rent: '#60A5FA',
      Food: '#34D399',
      Transportation: '#FBBF24',
      Utilities: '#A78BFA',
      Entertainment: '#F87171',
    };
    return colors[category] || '#94A3B8';
  };

  const calculateBudgetAdherence = (budgetData) => {
    const adhered = budgetData.filter(
      (item) => item.actual <= item.budget,
    ).length;
    return Math.round((adhered / budgetData.length) * 100) || 0;
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header and Time Selector */}
      <div className="space-y-4">
        <div>
          <h1 className="text-xl text-[#1e2e42] font-bold mb-1">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Detailed analysis of your spending patterns
          </p>
        </div>

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
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <RefreshCw size={20} />
            Update
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Income',
            value: analytics.kpis.totalIncome,
            color: 'text-green-500',
          },
          {
            title: 'Total Expenses',
            value: analytics.kpis.totalExpenses,
            color: 'text-red-500',
          },
          {
            title: 'Savings Rate',
            value: analytics.kpis.savingsRate,
            color: 'text-blue-500',
          },
          {
            title: 'Budget Adherence',
            value: analytics.kpis.budgetAdherence,
            color: 'text-yellow-500',
          },
        ].map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-1">{kpi.title}</h3>
            <div className="text-2xl font-bold mb-2">
              <span className={kpi.color}>
                {kpi.title.includes('Rate') || kpi.title.includes('Adherence')
                  ? `${kpi.value}%`
                  : formatCurrency(kpi.value)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income/Expenses Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Income vs Expenses Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
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

        {/* Expense Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.spendingByCategory}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {analytics.spendingByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Budget vs Actual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.budgetVsActual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="budget" fill="#93C5FD" name="Budget" />
              <Bar dataKey="actual" fill="#FCA5A5" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Spending Categories */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Top Spending Categories
          </h3>
          <div className="space-y-4">
            {analytics.topSpending.map((category, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span>{category.category}</span>
                  <span className="text-gray-600">
                    {formatCurrency(category.amount)} ({category.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: getCategoryColor(category.category),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
