import { useState } from 'react';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    monthlyReport: true,
    unusualActivity: false,
    newFeatures: true,
    marketingEmails: false,
  });

  const handleToggle = (setting) => {
    setNotifications((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Notification Settings</h2>

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
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

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
