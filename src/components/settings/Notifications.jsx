import axios from 'axios';
import { useEffect, useState } from 'react';

const api = axios.create({
  baseURL: 'https://fin-track-api-ags1.onrender.com/api/v1/notifications',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function Notifications() {
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    monthlyReport: true,
    unusualActivity: false,
    newFeatures: true,
    marketingEmails: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/');
        setNotifications(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error: ', err);
        setError('Failed to load notification settings');
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async (setting) => {
    try {
      const updatedSettings = {
        ...notifications,
        [setting]: !notifications[setting],
      };
      const response = await api.put('/', updatedSettings);
      setNotifications(response.data);
    } catch (err) {
      console.error('Error: ', err);
      setError('Failed to update settings');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="space-y-6 max-w-2xl ml-8">
      <h2 className="text-2xl font-bold">Notification Settings</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div>
              <h3 className="text-lg font-medium">{formatSettingName(key)}</h3>
              <p className="text-sm text-gray-500">
                {getSettingDescription(key)}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={value}
                onChange={() => handleToggle(key)}
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions
function formatSettingName(key) {
  return key.split(/(?=[A-Z])/).join(' ');
}

function getSettingDescription(key) {
  const descriptions = {
    budgetAlerts: "Get notified when you're close to budget limits",
    monthlyReport: 'Receive a monthly summary of your spending',
    unusualActivity: 'Get alerts about suspicious transactions',
    newFeatures: 'Be the first to know about new app features',
    marketingEmails: 'Receive promotional emails and offers',
  };
  return descriptions[key] || '';
}
