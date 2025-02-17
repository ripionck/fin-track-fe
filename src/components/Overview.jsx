import axios from 'axios';
import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
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

// Predefined colors for categories
const CATEGORY_COLORS = [
  '#60A5FA',
  '#34D399',
  '#FBBF24',
  '#A78BFA',
  '#F87171',
  '#818CF8',
  '#F472B6',
];

export default function Overview() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [totals, setTotals] = useState({
    income: 0,
    expenses: 0,
    net: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/transactions',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );

        const { monthlyData, spendingData, totals } = processTransactions(data);

        setTransactions(data);
        setMonthlyData(monthlyData);
        setSpendingByCategory(spendingData);
        setTotals(totals);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processTransactions = (transactions) => {
    const totals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expenses += Math.abs(transaction.amount);
        }
        acc.net = acc.income - acc.expenses;
        return acc;
      },
      { income: 0, expenses: 0, net: 0 },
    );

    const monthlyDataMap = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month}-${year}`;

      if (!acc[key]) {
        acc[key] = {
          month: `${month} ${year}`,
          income: 0,
          expenses: 0,
        };
      }

      if (transaction.type === 'income') {
        acc[key].income += transaction.amount;
      } else {
        acc[key].expenses += Math.abs(transaction.amount);
      }

      return acc;
    }, {});

    const spendingData = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, transaction) => {
        const existing = acc.find((item) => item.name === transaction.category);
        if (existing) {
          existing.value += Math.abs(transaction.amount);
        } else {
          acc.push({
            name: transaction.category,
            value: Math.abs(transaction.amount),
            color: CATEGORY_COLORS[acc.length % CATEGORY_COLORS.length],
          });
        }
        return acc;
      }, []);

    return {
      monthlyData: Object.values(monthlyDataMap),
      spendingData,
      totals: {
        income: totals.income,
        expenses: totals.expenses,
        net: totals.net,
      },
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Financial Overview
        </h1>
        <p className="text-gray-600">Your financial summary</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <h2 className="text-2xl font-semibold mt-1">
                ${totals.income.toFixed(2)}
              </h2>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <ArrowUpRight className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <h2 className="text-2xl font-semibold mt-1">
                ${totals.expenses.toFixed(2)}
              </h2>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <ArrowDownRight className="text-red-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Net Savings</p>
              <h2 className="text-2xl font-semibold mt-1">
                ${totals.net.toFixed(2)}
              </h2>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Income vs Expenses</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#34D399"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#F87171"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
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
                <Tooltip />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Recent Transactions</h3>
          <button className="text-blue-600 text-sm hover:underline">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Date</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((transaction) => (
                <tr
                  key={transaction._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 text-sm">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-sm">{transaction.description}</td>
                  <td className="py-3 text-sm">
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor:
                          spendingByCategory.find(
                            (c) => c.name === transaction.category,
                          )?.color + '20',
                        color: spendingByCategory.find(
                          (c) => c.name === transaction.category,
                        )?.color,
                      }}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td
                    className={`py-3 text-right text-sm ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}$
                    {Math.abs(transaction.amount).toFixed(2)}
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

// import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react';
// import {
//   Bar,
//   BarChart,
//   Cell,
//   Legend,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from 'recharts';
// import { monthlyData, spendingByCategory, transactions } from '../data';

// export default function Overview() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-xl text-[#1e2e42] font-bold mb-1">
//           Financial Overview
//         </h1>
//         <p className="text-gray-600">Your financial summary for this month</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-gray-600">Total Income</p>
//               <h2 className="text-3xl font-bold mt-1">$5,240.00</h2>
//             </div>
//             <span className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-sm flex items-center">
//               <ArrowUpRight size={16} className="mr-1" />
//               12%
//             </span>
//           </div>
//           <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-gray-600">Total Expenses</p>
//               <h2 className="text-3xl font-bold mt-1">$3,850.00</h2>
//             </div>
//             <span className="text-red-500 bg-red-50 px-2 py-1 rounded-full text-sm flex items-center">
//               <ArrowDownRight size={16} className="mr-1" />
//               8%
//             </span>
//           </div>
//           <p className="text-sm text-red-600 mt-2">↑ 8% from last month</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-gray-600">Net Savings</p>
//               <h2 className="text-3xl font-bold mt-1">$1,390.00</h2>
//             </div>
//             <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded-full text-sm flex items-center">
//               <TrendingUp size={16} className="mr-1" />
//               23%
//             </span>
//           </div>
//           <p className="text-sm text-blue-600 mt-2">↑ 23% from last month</p>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg text-[#1e2e42] font-semibold mb-4">
//             Income vs Expenses
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={monthlyData}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="income" fill="#34D399" name="Income" />
//               <Bar dataKey="expenses" fill="#F87171" name="Expenses" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg text-[#1e2e42] font-semibold mb-4">
//             Spending by Category
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={spendingByCategory}
//                 innerRadius={60}
//                 outerRadius={80}
//                 paddingAngle={5}
//                 dataKey="value"
//               >
//                 {spendingByCategory.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg text-[#1e2e42] font-semibold">
//             Recent Transactions
//           </h3>
//           <a href="#" className="text-blue-500 text-sm">
//             View All
//           </a>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-gray-500 border-b">
//                 <th className="pb-3">DATE</th>
//                 <th className="pb-3">DESCRIPTION</th>
//                 <th className="pb-3">CATEGORY</th>
//                 <th className="pb-3 text-right">AMOUNT</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map((transaction) => (
//                 <tr key={transaction.id} className="border-b last:border-b-0">
//                   <td className="py-3">
//                     {new Date(transaction.date).toLocaleDateString()}
//                   </td>
//                   <td className="py-3">{transaction.description}</td>
//                   <td className="py-3">{transaction.category}</td>
//                   <td
//                     className={`py-3 text-right ${
//                       transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
//                     }`}
//                   >
//                     {transaction.amount > 0 ? '+' : ''}
//                     {transaction.amount.toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
