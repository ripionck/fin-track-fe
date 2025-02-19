import axios from 'axios';
import { useEffect, useState } from 'react';

const api = axios.create({
  baseURL: 'https://fin-track-api-silk.vercel.app/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export default function Preferences() {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    dateFormat: 'MM/DD/YYYY',
    compactView: false,
    language: 'en',
    startOfWeek: 'sunday',
    currency: 'USD',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await api.get('/preferences');
        setPreferences(response.data);
      } catch (error) {
        setError(error.response?.data?.error || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setPreferences((prev) => ({ ...prev, compactView: !prev.compactView }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.put('/preferences', preferences);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-4">Loading preferences...</div>;

  return (
    <div className="space-y-6 max-w-2xl ml-8 p-4">
      <h2 className="text-2xl font-bold">Preferences</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          Preferences updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Theme Selection */}
        <div>
          <label
            htmlFor="theme"
            className="block text-sm font-medium text-gray-700"
          >
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            value={preferences.theme}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Date Format Selection */}
        <div>
          <label
            htmlFor="dateFormat"
            className="block text-sm font-medium text-gray-700"
          >
            Date Format
          </label>
          <select
            id="dateFormat"
            name="dateFormat"
            value={preferences.dateFormat}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        {/* Language Selection */}
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700"
          >
            Language
          </label>
          <select
            id="language"
            name="language"
            value={preferences.language}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        {/* Currency Selection */}
        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700"
          >
            Default Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={preferences.currency}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>

        {/* Start of Week Selection */}
        <div>
          <label
            htmlFor="startOfWeek"
            className="block text-sm font-medium text-gray-700"
          >
            Start of Week
          </label>
          <select
            id="startOfWeek"
            name="startOfWeek"
            value={preferences.startOfWeek}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
          </select>
        </div>

        {/* Compact View Toggle */}
        <div className="flex items-center justify-between">
          <span className="flex-grow flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Compact View
            </span>
            <span className="text-sm text-gray-500">
              Use a more compact layout for tables and lists
            </span>
          </span>
          <button
            type="button"
            className={`${
              preferences.compactView ? 'bg-indigo-600' : 'bg-gray-200'
            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onClick={() => handleToggle('compactView')}
          >
            <span className="sr-only">Use compact view</span>
            <span
              aria-hidden="true"
              className={`${
                preferences.compactView ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
            />
          </button>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 rounded-md ${
              isSaving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white transition-colors`}
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}
