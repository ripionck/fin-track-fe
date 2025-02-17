import {
  Bell,
  LayoutGrid,
  PieChart,
  Receipt,
  Settings,
  Tags,
  User,
  Wallet2,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { get } from '../api/api';
import Sidebar from './Sidebar';

export default function Layout() {
  const [userProfile, setUserProfile] = useState({
    name: 'Loading...',
    email: 'Loading...',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await get('/users/profile');
        setUserProfile({
          name: `${response.firstName} ${response.lastName}`,
          email: response.email,
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const navItems = [
    { id: 'overview', icon: LayoutGrid, label: 'Overview', path: 'overview' },
    {
      id: 'transactions',
      icon: Receipt,
      label: 'Transactions',
      path: 'transactions',
    },
    { id: 'budgets', icon: Wallet2, label: 'Budgets', path: 'budgets' },
    { id: 'analytics', icon: PieChart, label: 'Analytics', path: 'analytics' },
  ];

  const settingsItems = [
    {
      id: 'profile',
      icon: User,
      label: 'Profile Settings',
      path: 'settings/profile',
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      path: 'settings/notifications',
    },
    {
      id: 'preferences',
      icon: Settings,
      label: 'Preferences',
      path: 'settings/preferences',
    },
    {
      id: 'categories',
      icon: Tags,
      label: 'Categories',
      path: 'settings/categories',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    Navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        navItems={navItems}
        settingsItems={settingsItems}
        userProfile={userProfile}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
