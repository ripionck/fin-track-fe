import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Categories() {
  const [categories, setCategories] = useState([
    { id: '1', name: 'Shopping', color: 'bg-blue-500', icon: '🛍️' },
    { id: '2', name: 'Healthcare', color: 'bg-green-500', icon: '🏥' },
    { id: '3', name: 'Education', color: 'bg-yellow-500', icon: '📚' },
  ]);

  const [newCategory, setNewCategory] = useState({
    name: '',
    color: 'bg-gray-500',
    icon: '📌',
  });

  const addCategory = (e) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      const id = Math.random().toString(36).substr(2, 9);
      setCategories([...categories, { id, ...newCategory }]);
      setNewCategory({ name: '', color: 'bg-gray-500', icon: '📌' });
    }
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const colorOptions = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-gray-500',
  ];

  const iconOptions = [
    '📌',
    '🛍️',
    '🏥',
    '📚',
    '🍔',
    '🚗',
    '🏠',
    '💼',
    '🎉',
    '✈️',
  ];

  return (
    <div className="space-y-6 max-w-4xl ml-8">
      <h2 className="text-2xl font-bold">Custom Categories</h2>

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
            {colorOptions.map((color) => (
              <option key={color} value={color}>
                {color.split('-')[1]}
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
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div className="flex items-center space-x-4">
              <span
                className={`w-8 h-8 ${category.color} rounded-full flex items-center justify-center text-white`}
              >
                {category.icon}
              </span>
              <span className="text-lg font-medium">{category.name}</span>
            </div>
            <button
              onClick={() => deleteCategory(category.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
