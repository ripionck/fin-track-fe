import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const BudgetModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
  categories,
  isEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={initialData.startDate}
                onChange={(e) => initialData.setStartDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={initialData.category}
              onChange={(e) => initialData.setCategory(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={isEdit}
              required
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Limit ($)</label>
            <input
              type="number"
              value={initialData.limit}
              onChange={(e) => initialData.setLimit(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEdit ? 'Save Changes' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

BudgetModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  initialData: PropTypes.shape({
    category: PropTypes.string,
    setCategory: PropTypes.func,
    limit: PropTypes.number,
    setLimit: PropTypes.func,
    startDate: PropTypes.string,
    setStartDate: PropTypes.func,
  }).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isEdit: PropTypes.bool,
};

BudgetModal.defaultProps = {
  isEdit: false,
};

export default BudgetModal;
