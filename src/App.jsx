import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import Analytics from './components/Analytics';
import Budgets from './components/Budgets';
import Layout from './components/Layout';
import NotFound from './components/NotFound';
import Overview from './components/Overview';
import ProfileSettings from './components/profileSettings/ProfileSettings';
import Categories from './components/settings/Categories';
import NotificationSettings from './components/settings/NotificationSettings';
import Preferences from './components/settings/Preferences';
import Transactions from './components/Transactions';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route index element={<Navigate to="overview" />} />
          <Route path="overview" element={<Overview />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings/profile" element={<ProfileSettings />} />
          <Route
            path="settings/notifications"
            element={<NotificationSettings />}
          />
          <Route path="settings/preferences" element={<Preferences />} />
          <Route path="settings/categories" element={<Categories />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
