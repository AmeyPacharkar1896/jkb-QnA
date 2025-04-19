import { useLocation, useNavigate } from 'react-router-dom';

export default function ResponsePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const model = state?.model;

  if (!model) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-400 via-pink-300 to-indigo-500 p-6 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md text-center space-y-6">
          <p className="text-2xl text-gray-700">No response data found.</p>

          <button
            onClick={() => navigate('/')}
            className="mt-6 px-8 py-3 bg-gradient-to-br from-violet-600 to-pink-500 text-white rounded-full shadow-md hover:scale-105 transition-all duration-300"
          >
            Go back to form
          </button>
        </div>
      </div>

    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-pink-300 to-indigo-500 p-6 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-violet-700 drop-shadow-md">
          🎉 Your Results Are In!
        </h1>
        <p className="text-xl text-gray-800">
          Score: <span className="font-semibold text-violet-600">{model.score}/100</span>
        </p>
        <p className="italic text-gray-700">{model.summary}</p>
        <div className="bg-violet-100 p-4 rounded-xl border-l-4 border-violet-600 text-violet-800">
          <strong>Our Suggestion:</strong> {model.recommendation}
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 px-8 py-3 bg-gradient-to-br from-violet-600 to-pink-500 text-white rounded-full shadow-md hover:scale-105 transition-all duration-300"
        >
          Fill Another Form
        </button>
      </div>
    </div>

  );
}
