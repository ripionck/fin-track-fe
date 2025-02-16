import axios from 'axios';
import { Edit, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export default function Categories() {
  const [categories, setCategories] = useState([
    { id: '1', name: 'Shopping', color: '#3b82f6', icon: '🛍️' },
    { id: '2', name: 'Healthcare', color: '#10b981', icon: '🏥' },
    { id: '3', name: 'Education', color: '#f59e0b', icon: '📚' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: '',
    name: '',
    color: '#6b7280', // Default gray hex code
    icon: '📌',
  });

  const colorOptions = [
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#6b7280', // Gray
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

  const openModal = (category = null) => {
    setCurrentCategory(
      category || { id: '', name: '', color: '#6b7280', icon: '📌' },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const getAuthToken = () => {
    return localStorage.getItem('token'); // Retrieve the token from localStorage
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, color, icon } = currentCategory;

    if (!name.trim()) return;

    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    try {
      if (id) {
        // Edit existing category
        await axios.put(
          `https://fin-track-api-silk.vercel.app/api/categories/${id}`,
          { name, color, icon },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCategories(
          categories.map((cat) =>
            cat.id === id ? { ...cat, name, color, icon } : cat,
          ),
        );
      } else {
        // Add new category
        const response = await axios.post(
          'https://fin-track-api-silk.vercel.app/api/categories',
          { name, color, icon },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCategories([...categories, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    try {
      await axios.delete(
        `https://fin-track-api-silk.vercel.app/api/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Custom Categories</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
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
            <div className="flex space-x-2">
              <button
                onClick={() => openModal(category)}
                className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {currentCategory.id ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Category name"
                value={currentCategory.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <select
                name="color"
                value={currentCategory.color}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {colorOptions.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <select
                name="icon"
                value={currentCategory.icon}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {currentCategory.id ? 'Save Changes' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
