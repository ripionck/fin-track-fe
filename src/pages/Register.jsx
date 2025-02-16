import { Menu, MessageSquare, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <Menu className="w-6 h-6 text-gray-600" />
          <MessageSquare className="w-6 h-6 text-blue-500" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Register</h1>
        <p className="text-gray-500 text-center mb-8">
          You and Your Friends always Connected
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-2">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="nick@gmail.com"
                className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
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
                className="w-full pl-10 pr-10 py-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
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
                className="w-full pl-10 pr-10 py-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
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
            <input type="checkbox" className="mt-1" />
            <label className="ml-2 text-sm text-gray-600">
              I agree with the
              <a href="#" className="text-blue-500">
                Terms and Condition
              </a>
              and the
              <a href="#" className="text-blue-500">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full"
          >
            Sign up
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
