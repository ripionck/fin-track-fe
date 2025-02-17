import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { del, get, put, uploadFile } from '../../api/api';
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await get('/profile');
        setProfileData({
          ...data,
          profileImage: data.profileImage || '/placeholder-user.jpg',
        });
      } catch (error) {
        setError(error.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
        setProfileData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Update profile data
      const updatedProfile = await put('/profile', {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        currency: profileData.currency,
        bio: profileData.bio,
        twoFactorEnabled: profileData.twoFactorEnabled,
      });

      // Update profile image if new file selected
      if (selectedFile) {
        const { fileUrl } = await uploadFile('/profile/image', selectedFile);
        updatedProfile.profileImage = fileUrl;
      }

      setProfileData(updatedProfile);
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
      await del('/profile');
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
