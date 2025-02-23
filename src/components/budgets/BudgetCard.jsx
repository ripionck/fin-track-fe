import { Pencil, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const progress = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
  const safeProgress = Math.min(progress, 100);
  const remaining = budget.limit - budget.spent;
  const category = budget.category;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">
          {category?.name || 'Unknown Category'}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(budget)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(budget._id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
          </span>
          <span>{Math.round(safeProgress)}%</span>
        </div>

        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              backgroundColor: category?.color || '#6b7280',
              width: `${safeProgress}%`,
            }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span>Monthly Limit</span>
          <span className="font-medium">${budget.limit.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Remaining</span>
          <span
            className={`font-medium ${
              remaining > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ${remaining.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

BudgetCard.propTypes = {
  budget: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    category: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
    }).isRequired,
    limit: PropTypes.number.isRequired,
    spent: PropTypes.number.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BudgetCard;
