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
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {isEdit ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg bg-gray-100"
                value={initialData.categoryName}
                readOnly
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full p-2 border rounded-lg"
                value={initialData.category}
                onChange={(e) => initialData.setCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Limit
            </label>
            <input
              type="number"
              name="limit"
              className="w-full p-2 border rounded-lg"
              value={initialData.limit || ''}
              onChange={(e) => initialData.setLimit(e.target.value)}
              required
            />
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                className="w-full p-2 border rounded-lg"
                value={initialData.startDate}
                onChange={(e) => initialData.setStartDate(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {isEdit ? 'Update Budget' : 'Create Budget'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
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
  initialData: PropTypes.object.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isEdit: PropTypes.bool,
};

export default BudgetModal;
