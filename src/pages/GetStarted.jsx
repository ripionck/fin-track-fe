import { Menu, MessageSquare } from 'lucide-react';

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <Menu className="w-6 h-6 text-gray-600" />
          <MessageSquare className="w-6 h-6 text-blue-500" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Get Started</h1>
        <p className="text-gray-500 text-center mb-12">
          Start with signing up or sign in.
        </p>

        <div className="flex justify-center mb-12">
          <img src="/chat.png" className="w-48 h-48" />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => (window.location.href = '/register')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full"
          >
            Sign up
          </button>

          <button
            onClick={() => (window.location.href = '/login')}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 py-3 rounded-full border-2 border-gray-200"
          >
            Sign in
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
