import { LogOut } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({
  navItems,
  settingsItems,
  userProfile,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="w-64 bg-white p-6 shadow-lg flex flex-col justify-between border-r border-gray-200">
      <div>
        <Link to="/app/overview" className="block mb-8">
          <h1 className="text-2xl ml-4 font-bold text-[#1e2e42]">FinTrack</h1>
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
              <span className="text-md font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-expanded={isDropdownOpen}
          aria-controls="profile-menu"
        >
          <img
            src="/default.jpg"
            className="w-12 h-12 rounded-full"
            alt="User profile"
          />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">
              {userProfile.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userProfile.email}
            </p>
          </div>
        </button>

        {isDropdownOpen && (
          <div
            id="profile-menu"
            className="absolute bottom-full left-0 w-full bg-white rounded-lg shadow-xl py-2 mb-2 border border-gray-100"
          >
            {settingsItems.map(({ id, icon: Icon, label, path }) => (
              <button
                key={id}
                onClick={() => navigate(path)}
                className={`flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50
                  ${location.pathname === path ? 'bg-blue-50' : ''}`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {label}
              </button>
            ))}
            <div className="my-1 border-t border-gray-100" />
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Log out
            </button>
          </div>
        )}
      </div>
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
