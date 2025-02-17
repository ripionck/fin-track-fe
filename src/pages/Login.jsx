import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../api/api'; // Changed import

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await post('/auth/login', formData);

      console.log('Login successful:', response);

      // Store tokens
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);

      navigate('/overview');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1e2e42] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <p className="text-gray-500 text-center mb-8">
          Welcome back! Log in to keep track of your finances.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
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

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#1e2e42] hover:bg-[#1e2e42]/90 text-white cursor-pointer py-3 rounded-full transition-all"
          >
            Sign in
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/forgot-password" className="text-[#1e2e42] hover:underline">
            Forgot password?
          </a>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Don&apos;t have an account?
          <a href="/register" className="text-[#1e2e42] ml-1.5 hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
