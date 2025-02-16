import PropTypes from 'prop-types';
import CategoryItem from './CategoryItem';

export default function CategoryList({ categories, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {Array.isArray(categories) &&
        categories.map((category) => (
          <CategoryItem
            key={category._id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
}

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
