import axios from 'axios';
import { Camera, Save, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://fin-track-api-mu.vercel.app/api/v1',
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function ProfileSettings() {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currency: 'USD',
    bio: '',
    twoFactorEnabled: false,
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/me');
        setProfileData(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle two-factor authentication
  const handleToggle = async () => {
    try {
      setIsUpdating(true);
      const { data } = await api.patch('/users/me', {
        twoFactorEnabled: !profileData.twoFactorEnabled,
      });
      setProfileData((prev) => ({ ...prev, ...data }));
      setSuccess('Two-factor authentication updated successfully');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to update security settings',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      setError('');
      setSuccess('');

      // Validate required fields
      if (!profileData.firstName?.trim() || !profileData.lastName?.trim()) {
        return setError('First and last names are required');
      }

      // Send only allowed fields
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        currency: profileData.currency,
        bio: profileData.bio,
      };

      const { data } = await api.patch('/users/me', updateData);
      setProfileData(data);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        return setError('Only image files allowed (JPEG, PNG, GIF)');
      }

      setIsUpdating(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await api.put('/users/me/avatar', formData);

      setProfileData((prev) => ({
        ...prev,
        avatar: `${data.avatar}?${Date.now()}`,
      }));
      setSuccess('Avatar updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Avatar upload failed');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (
      !window.confirm('Permanently delete your account? This cannot be undone!')
    )
      return;

    try {
      setIsUpdating(true);
      await api.delete('/users/me');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.error || 'Account deletion failed');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl ml-8">
      <h2 className="text-2xl font-bold">Profile Settings</h2>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}
      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={profileData.avatar || '/default.jpg'}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default.jpg';
              }}
            />
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 rounded-full bg-white p-1 shadow-md cursor-pointer"
            >
              <Camera className="h-4 w-4 text-gray-600" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              className="mt-1 py-1.5 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              className="mt-1 py-1.5 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            readOnly
            value={profileData.email}
            onChange={handleInputChange}
            className="mt-1 py-1.5 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={profileData.currency}
            onChange={handleInputChange}
            className="mt-1 py-1.5 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={profileData.bio}
            onChange={handleInputChange}
            className="mt-1 py-1.5 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Tell us about yourself"
          ></textarea>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="twoFactorEnabled"
            checked={profileData.twoFactorEnabled}
            onChange={() => handleToggle('twoFactorEnabled')}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <label
            htmlFor="twoFactorEnabled"
            className="text-sm font-medium text-gray-700"
          >
            Enable Two-Factor Authentication
          </label>
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
}
