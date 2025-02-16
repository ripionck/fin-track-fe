export default function GetStarted() {
  return (
    <div
      className="min-h-screen relative bg-auto bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: 'url(/fin-track.png)' }}
    >
      <div className="absolute bottom-16 rounded-lg px-8 w-full max-w-md">
        <h1 className="text-2xl text-yellow-100 font-bold text-center mb-2">
          Want to Track Your Finance?
        </h1>

        <button
          onClick={() => (window.location.href = '/login')}
          className="w-full bg-white text-lg font-bold uppercase hover:bg-gray-50 text-gray-800 py-3 rounded-full border-2 border-gray-200"
        >
          Sign in
        </button>

        <div className="flex justify-center mt-4">
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
