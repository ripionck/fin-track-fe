import PropTypes from 'prop-types';

const ProfileFormFields = ({
  profileData,
  handleInputChange,
  handleToggle,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={profileData.firstName}
            onChange={handleInputChange}
            className="mt-1 py-1.5 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={profileData.lastName}
            onChange={handleInputChange}
            className="mt-1 py-1.5 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          className="mt-1 py-1.5 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="currency"
          className="block text-sm font-medium text-gray-700"
        >
          Currency
        </label>
        <select
          id="currency"
          name="currency"
          value={profileData.currency}
          onChange={handleInputChange}
          className="mt-1 py-1.5 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          value={profileData.bio}
          onChange={handleInputChange}
          className="mt-1 py-1.5 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Tell us about yourself"
        ></textarea>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="twoFactorEnabled"
          checked={profileData.twoFactorEnabled}
          onChange={() => handleToggle('twoFactorEnabled')}
          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <label
          htmlFor="twoFactorEnabled"
          className="text-sm font-medium text-gray-700"
        >
          Enable Two-Factor Authentication
        </label>
      </div>
    </div>
  );
};

ProfileFormFields.propTypes = {
  profileData: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    twoFactorEnabled: PropTypes.bool.isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleToggle: PropTypes.func.isRequired,
};

export default ProfileFormFields;
