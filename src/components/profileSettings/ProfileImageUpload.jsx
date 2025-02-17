import { Camera } from 'lucide-react';
import PropTypes from 'prop-types';

const ProfileImageUpload = ({ profileImage, onFileChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <img
          src={profileImage}
          alt="Profile"
          className="h-20 w-20 rounded-full object-cover"
        />
        <label
          htmlFor="profileImage"
          className="absolute -bottom-2 -right-2 rounded-full bg-white p-1 shadow-md cursor-pointer"
        >
          <Camera className="h-4 w-4 text-gray-600" />
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </label>
      </div>
      <button
        type="button"
        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        onClick={() => document.getElementById('profileImage').click()}
      >
        Change Photo
      </button>
    </div>
  );
};

ProfileImageUpload.propTypes = {
  profileImage: PropTypes.string.isRequired,
  onFileChange: PropTypes.func.isRequired,
};

export default ProfileImageUpload;
