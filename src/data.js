// Monthly Data for Income vs Expenses Trend
export const monthlyData = [
  { month: 'Jan', income: 4500, expenses: 3200 },
  { month: 'Feb', income: 4200, expenses: 3400 },
  { month: 'Mar', income: 4800, expenses: 3100 },
  { month: 'Apr', income: 5000, expenses: 3500 },
  { month: 'May', income: 4800, expenses: 3400 },
  { month: 'Jun', income: 5200, expenses: 3800 },
];

// Analytics Data
export const analyticsData = {
  monthlySavings: [
    { month: 'Jan', savings: 1300 },
    { month: 'Feb', savings: 800 },
    { month: 'Mar', savings: 1700 },
    { month: 'Apr', savings: 1500 },
    { month: 'May', savings: 1400 },
    { month: 'Jun', savings: 1350 },
  ],

  budgetVsActual: [
    { category: 'Rent', budget: 1200, actual: 1200 },
    { category: 'Food', budget: 600, actual: 800 },
    { category: 'Transport', budget: 400, actual: 350 },
    { category: 'Utilities', budget: 300, actual: 280 },
    { category: 'Entertainment', budget: 200, actual: 180 },
  ],

  topSpending: [
    { category: 'Rent', amount: 1200, percentage: 30, color: 'bg-blue-500' },
    { category: 'Food', amount: 800, percentage: 20, color: 'bg-green-500' },
    {
      category: 'Transportation',
      amount: 600,
      percentage: 15,
      color: 'bg-yellow-500',
    },
  ],

  kpis: {
    totalIncome: { value: 15750.0, change: 12 },
    totalExpenses: { value: 9280.0, change: 8 },
    savingsRate: { value: 41.1, change: 5 },
    budgetAdherence: { value: 85, change: -3 },
  },
};

// Spending Categories Data for Pie Chart
export const spendingByCategory = [
  { name: 'Rent', value: 1200, color: '#60A5FA' },
  { name: 'Food', value: 800, color: '#34D399' },
  { name: 'Transportation', value: 400, color: '#FBBF24' },
  { name: 'Utilities', value: 300, color: '#A78BFA' },
  { name: 'Entertainment', value: 200, color: '#F87171' },
];
