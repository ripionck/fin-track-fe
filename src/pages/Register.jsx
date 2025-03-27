import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long.';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await axios.post(
        'https://fin-track-api-mu.vercel.app/api/v1/users/register',
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
      );

      if (response.status >= 200 && response.status < 300) {
        setSuccess(
          response.data.message ||
            'Registration successful! Redirecting to login...',
        );
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.error('Registration failed:', response.status, response.data);
        setError(
          response.data.message || 'Registration failed. Please try again.',
        );
      }
    } catch (err) {
      console.error('Registration failed:', err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'Registration failed. Please try again.',
        );
      } else if (err.message === 'Network Error') {
        setError(
          'A network error occurred. Please check your internet connection.',
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1e2e42] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <p className="text-gray-500 text-center mb-8">
          Join now and start managing your finances effectively!
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-600 mb-2">First Name</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="John"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-200 focus:border-[#1e2e42] outline-none"
                  required
                />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-600 mb-2">Last Name</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Doe"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-200 focus:border-[#1e2e42] outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="nick@gmail.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-200 focus:border-[#1e2e42] outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border-b-2 border-gray-200 focus:border-[#1e2e42] outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Confirm password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="********"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border-b-2 border-gray-200 focus:border-[#1e2e42] outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1"
              required
            />
            <label className="ml-2 text-sm text-gray-600">
              I agree with the
              <a href="#" className="text-[#1e2e42] mx-1">
                Terms and Condition
              </a>
              and the
              <a href="#" className="text-[#1e2e42] ml-1">
                Privacy Policy
              </a>
            </label>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <button
            type="submit"
            className="w-full bg-[#1e2e42] hover:bg-[#1e2e42] text-white py-3 uppercase cursor-pointer rounded-full"
          >
            Sign up
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?
          <Link to="/login" className="text-[#1e2e42] ml-1.5 uppercase">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
