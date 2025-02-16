import axios from 'axios';
import {
  Bell,
  LayoutGrid,
  LogOut,
  PieChart,
  Receipt,
  Settings,
  Tags,
  User,
  Wallet2,
} from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function Layout({
  children,
  activePage,
  onPageChange,
  activeSettings,
  onSettingsChange,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://fin-track-api-silk.vercel.app/api/users/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUserProfile({
          name: `${response.data.firstName} ${response.data.lastName}`,
          email: response.data.email,
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const navItems = [
    { id: 'overview', icon: LayoutGrid, label: 'Overview' },
    { id: 'transactions', icon: Receipt, label: 'Transactions' },
    { id: 'budgets', icon: Wallet2, label: 'Budgets' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
  ];

  const settingsItems = [
    { id: 'profile', icon: User, label: 'Profile Settings' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'preferences', icon: Settings, label: 'Preferences' },
    { id: 'categories', icon: Tags, label: 'Categories' },
  ];

  const handleSettingsClick = (settingId) => {
    onSettingsChange(settingId);
    onPageChange('settings');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white p-6 shadow-md flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-8">FinTrack</h1>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center space-x-2 p-2 rounded transition-colors
                    ${
                      activePage === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 w-full"
          >
            <img
              src="/placeholder-user.jpg"
              className="w-10 h-10 rounded-full"
              alt="Profile"
            />
            <div className="text-left">
              <p className="font-medium">{userProfile.name}</p>
              <p className="text-sm text-gray-500">{userProfile.email}</p>
            </div>
          </button>
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 w-56 bg-white rounded-md shadow-lg py-1 mb-2">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSettingsClick(item.id)}
                    className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                      activeSettings === item.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  activePage: PropTypes.string.isRequired,
  onPageChange: PropTypes.func.isRequired,
  activeSettings: PropTypes.string,
  onSettingsChange: PropTypes.func.isRequired,
};
