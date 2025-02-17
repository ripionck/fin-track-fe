import PropTypes from 'prop-types';

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
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
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(transaction.id)}
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
  );
}

TransactionTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['Income', 'Expense']).isRequired,
      amount: PropTypes.number.isRequired,
    }),
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
