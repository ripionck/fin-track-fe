import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#6b7280',
    icon: '🍔',
  });
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setError(null);
    try {
      const response = await axios.get(
        'https://fin-track-api-silk.vercel.app/api/categories',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status !== 200) {
        throw new Error(
          `Server returned ${response.status}: ${
            response.data.message || 'Error fetching categories'
          }`,
        );
      }

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response: Expected an array of categories');
      }

      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.message);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    setError(null);
    const trimmedName = newCategory.name.trim();

    if (!trimmedName) return;

    try {
      await axios.post(
        'https://fin-track-api-silk.vercel.app/api/categories',
        { ...newCategory, name: trimmedName },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await fetchCategories();
      setNewCategory({ name: '', color: '#6b7280', icon: '🍔' });
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Error adding category. Please check your input and try again.');
    }
  };

  const deleteCategory = async (id) => {
    setError(null);
    try {
      await axios.delete(
        `https://fin-track-api-silk.vercel.app/api/categories/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Error deleting category. Please try again later.');
    }
  };

  const iconOptions = [
    '🍔',
    '🏠',
    '🚗',
    '🎉',
    '💡',
    '🛍️',
    '🏥',
    '📚',
    '🛡️',
    '✈️',
    '💰',
    '💼',
    '📈',
    '💝',
    '🧴',
    '📦',
  ];

  const colorOptions = {
    '#6b7280': 'Gray',
    '#f59e0b': 'Amber',
    '#ef4444': 'Red',
    '#eab308': 'Yellow',
    '#84cc16': 'Lime',
    '#22c55e': 'Green',
    '#f97316': 'Orange',
    '#10b981': 'Emerald',
    '#a855f7': 'Purple',
    '#3b82f6': 'Blue',
    '#06b6d4': 'Cyan',
    '#8b5cf6': 'Violet',
    '#14b8a6': 'Teal',
    '#6366f1': 'Indigo',
    '#d946ef': 'Fuchsia',
    '#0ea5e9': 'Sky',
    '#64748b': 'Slate',
  };

  return (
    <div className="space-y-6 max-w-4xl ml-8">
      <h2 className="text-2xl font-bold">Custom Categories</h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={addCategory} className="space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="New category name"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={newCategory.color}
            onChange={(e) =>
              setNewCategory({ ...newCategory, color: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(colorOptions).map(([value, name]) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={newCategory.icon}
            onChange={(e) =>
              setNewCategory({ ...newCategory, icon: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {iconOptions.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </span>
                <span className="text-lg font-medium">{category.name}</span>
              </div>
              <button
                onClick={() => deleteCategory(category._id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        ) : (
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              No categories available. Add a new one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
