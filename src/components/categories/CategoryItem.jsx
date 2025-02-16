import { Edit, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

export default function CategoryItem({ category, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: category.color }}
        >
          {category.icon}
        </span>
        <span className="text-lg font-medium">{category.name}</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(category)}
          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(category._id)}
          className="p-2 text-red-600 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

CategoryItem.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
