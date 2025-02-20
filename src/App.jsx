import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import Analytics from './components/Analytics';
import Budgets from './components/Budgets';
import Layout from './components/Layout';
import Overview from './components/Overview';
import Categories from './components/settings/Categories';
import Notifications from './components/settings/Notifications';
import Preferences from './components/settings/Preferences';
import ProfileSettings from './components/settings/ProfileSettings';
import Transactions from './components/Transactions';
import GetStarted from './pages/GetStarted';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="overview" />} />
          <Route path="overview" element={<Overview />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings/profile" element={<ProfileSettings />} />
          <Route path="settings/notifications" element={<Notifications />} />
          <Route path="settings/preferences" element={<Preferences />} />
          <Route path="settings/categories" element={<Categories />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
