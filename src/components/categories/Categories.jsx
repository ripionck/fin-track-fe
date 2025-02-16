import axios from 'axios';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import CategoryFormModal from './CategoryFormModal';
import CategoryList from './CategoryList';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [error, setError] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/categories/',
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  // Handle adding or editing a category
  const handleAddOrEditCategory = async (category) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token is missing.');
      return;
    }

    if (!category.name || !category.color || !category.icon) {
      setError('All fields are required.');
      return;
    }

    // Client-side duplicate check
    const existingCategory = categories.find(
      (cat) =>
        cat.name.toLowerCase() === category.name.toLowerCase() &&
        cat._id !== category._id,
    );
    if (existingCategory) {
      setError('A category with this name already exists.');
      return;
    }

    try {
      let response;
      if (category._id) {
        // Edit existing category
        response = await axios.put(
          `http://localhost:5000/api/categories/${category._id}`,
          {
            name: category.name,
            color: category.color,
            icon: category.icon,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCategories(
          categories.map((cat) =>
            cat._id === category._id ? response.data.category : cat,
          ),
        );
      } else {
        // Add new category
        response = await axios.post(
          'http://localhost:5000/api/categories/',
          {
            name: category.name,
            color: category.color,
            icon: category.icon,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCategories([...categories, response.data.category]);
      }
      setError(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        'Error saving category:',
        error.response?.data || error.message,
      );
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message.includes('already exists')) {
        setError('A category with this name already exists.');
      } else {
        setError('Failed to save category.');
      }
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (_id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token is missing.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/categories/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((category) => category._id !== _id));
      setError(null);
    } catch (error) {
      console.error(
        'Error deleting category:',
        error.response?.data || error.message,
      );
      setError(error.response?.data?.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Custom Categories</h2>
        <button
          onClick={() => {
            setCurrentCategory(null);
            setIsModalOpen(true);
            setError(null);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <CategoryList
        categories={categories}
        onEdit={(category) => {
          console.log('Editing category:', category);
          setCurrentCategory(category);
          setIsModalOpen(true);
          setError(null);
        }}
        onDelete={handleDeleteCategory}
      />

      {/* Modal for Adding/Editing Categories */}
      {isModalOpen && (
        <CategoryFormModal
          key={isModalOpen ? 'open' : 'closed'}
          category={currentCategory}
          onClose={() => {
            setIsModalOpen(false);
            setError(null);
          }}
          onSubmit={handleAddOrEditCategory}
        />
      )}
    </div>
  );
}
