import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileActions from './ProfileActions';
import ProfileFormFields from './ProfileFormFields';
import ProfileImageUpload from './ProfileImageUpload';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currency: 'USD',
    bio: '',
    twoFactorEnabled: false,
    profileImage: '/placeholder-user.jpg',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get(
          'http://localhost:5000/api/users/profile',
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProfileData({
          ...response.data.user,
          profileImage: response.data.user.profileImage || '/default.png',
        });
      } catch (error) {
        setError(error.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle toggle for two-factor authentication
  const handleToggle = () => {
    setProfileData((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }));
  };

  // Handle file selection for profile image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      // Update profile data
      const updatedProfile = await axios.put(
        'http://localhost:5000/api/users/profile',
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          currency: profileData.currency,
          bio: profileData.bio,
          twoFactorEnabled: profileData.twoFactorEnabled,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update profile image if a new file is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await axios.post(
          'http://localhost:5000/api/users/upload',
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        updatedProfile.data.user.profileImage = response.data.fileUrl;
      }

      setProfileData(updatedProfile.data.user);
      setSuccess('Profile updated successfully!');
      setSelectedFile(null);
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message || 'Failed to update profile');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    )
      return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      await axios.delete('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      navigate('/login');
    } catch (error) {
      setError(error.message || 'Failed to delete account');
    }
  };

  // Render loading state
  if (isLoading)
    return <div className="p-4 text-gray-500">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-2xl ml-8">
      <h2 className="text-2xl font-bold">Profile Settings</h2>
      {error && (
        <div className="text-red-500 p-2 rounded bg-red-50">{error}</div>
      )}
      {success && (
        <div className="text-green-500 p-2 rounded bg-green-50">{success}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProfileImageUpload
          profileImage={profileData.profileImage}
          onFileChange={handleFileChange}
        />
        <ProfileFormFields
          profileData={profileData}
          handleInputChange={handleInputChange}
          handleToggle={handleToggle}
        />
        <ProfileActions onSave={handleSubmit} onDelete={handleDeleteAccount} />
      </form>
    </div>
  );
};

export default ProfileSettings;
