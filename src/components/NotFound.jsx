import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-6">Page Not Found</p>
      <p className="text-gray-500 mb-8">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
