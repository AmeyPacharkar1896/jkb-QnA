import { useLocation, useNavigate } from 'react-router-dom';

export default function ResponsePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const model = state?.model;

  if (!model) {
    return (
      <div className="text-center mt-20">
        <p>No response data found.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Go back to form
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-300 to-blue-500 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl text-center space-y-6">
        <h1 className="text-3xl font-bold text-blue-800">🎉 Your Results Are In!</h1>
        <p className="text-xl text-gray-700">Score: <span className="font-semibold">{model.score}/100</span></p>
        <p className="italic text-gray-600">{model.summary}</p>
        <div className="bg-blue-100 p-4 rounded border-l-4 border-blue-600 text-blue-800">
          <strong>Our Suggestion:</strong> {model.recommendation}
        </div>

        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Fill Another Form
        </button>
      </div>
    </div>
  );
}
