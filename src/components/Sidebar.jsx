import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

export default function Sidebar({
  navItems,
  settingsItems,
  userProfile,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-white p-6 shadow-lg flex flex-col justify-between border-r border-gray-200">
      <div>
        <Link to="/home" className="block mb-8">
          <h1 className="text-2xl ml-4 font-bold text-gray-800">FinTrack</h1>
        </Link>
        <nav className="space-y-1">
          {navItems.map(({ id, icon: Icon, label, path }) => (
            <button
              key={id}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${
                    location.pathname === path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <ProfileDropdown
        userProfile={userProfile}
        settingsItems={settingsItems}
        onLogout={onLogout}
      />
    </aside>
  );
}

Sidebar.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
  settingsItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
  userProfile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};
