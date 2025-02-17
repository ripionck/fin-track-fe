import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarUpload from './AvatarUpload';
import ProfileActions from './ProfileActions';
import ProfileFormFields from './ProfileFormFields';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currency: 'USD',
    bio: '',
    twoFactorEnabled: false,
    avatar: '/default.png',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData({
          ...response.data,
          avatar: response.data.avatar || '/default.png',
        });
      } catch (error) {
        setError(error.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setProfileData((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const updatedProfile = await axios.put(
        'http://localhost:5000/api/users/me',
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

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await axios.post(
          'http://localhost:5000/api/users/me/avatar',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        updatedProfile.data.avatar = response.data.fileUrl;
      }

      setProfileData(updatedProfile.data);
      setSuccess('Profile updated successfully!');
      setSelectedFile(null);
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message || 'Failed to update profile');
    }
  };

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

      await axios.delete('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      navigate('/login');
    } catch (error) {
      setError(error.message || 'Failed to delete account');
    }
  };

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
        <AvatarUpload
          avatar={profileData.avatar}
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
