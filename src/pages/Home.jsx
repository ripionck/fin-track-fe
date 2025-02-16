import { useState } from 'react';
import Analytics from '../components/Analytics';
import Budgets from '../components/Budgets';
import Layout from '../components/Layout';
import Overview from '../components/Overview';
import Transactions from '../components/Transactions';
import Categories from '../components/settings/Categories';
import NotificationSettings from '../components/settings/NotificationSettings';
import Preferences from '../components/settings/Preferences';
import ProfileSettings from '../components/settings/ProfileSettings';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [activeSettings, setActiveSettings] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
      case 'transactions':
        return <Transactions />;
      case 'budgets':
        return <Budgets />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        switch (activeSettings) {
          case 'profile':
            return <ProfileSettings />;
          case 'notifications':
            return <NotificationSettings />;
          case 'preferences':
            return <Preferences />;
          case 'categories':
            return <Categories />;
          default:
            return <ProfileSettings />;
        }
    }
  };

  return (
    <Layout
      activePage={currentPage}
      onPageChange={setCurrentPage}
      activeSettings={activeSettings}
      onSettingsChange={setActiveSettings}
    >
      {renderPage()}
    </Layout>
  );
}
