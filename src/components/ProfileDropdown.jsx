import { LogOut } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ProfileDropdown({
  userProfile,
  settingsItems,
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-expanded={isDropdownOpen}
        aria-controls="profile-menu"
      >
        <img
          src="/placeholder-user.jpg"
          className="w-9 h-9 rounded-full"
          alt="User profile"
        />
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">
            {userProfile.name}
          </p>
          <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
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
  );
}

ProfileDropdown.propTypes = {
  userProfile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  settingsItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onLogout: PropTypes.func.isRequired,
};
