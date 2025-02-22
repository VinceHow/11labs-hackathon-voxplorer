import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ManagePage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlayAudio = async () => {
    try {
      // Replace with your actual backend URL
      const response = await fetch('http://localhost:5000/api/get-audio');
      if (!response.ok) {
        throw new Error('Failed to fetch audio');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setIsPlaying(true);
    } catch (err) {
      setError('Failed to load audio. Please try again.');
      console.error('Error fetching audio:', err);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 flex items-center transition-colors duration-200"
        >
          <span className="mr-2 text-lg">←</span> Back to Home
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Manage Booking</h1>

      {/* Booking Summary Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Booking Reference</p>
            <p className="font-medium">BK12345</p>
          </div>
          <div>
            <p className="text-gray-600">Travel Date</p>
            <p className="font-medium">March 15, 2024</p>
          </div>
          <div>
            <p className="text-gray-600">Destination</p>
            <p className="font-medium">Paris, France</p>
          </div>
          <div>
            <p className="text-gray-600">Duration</p>
            <p className="font-medium">7 Days</p>
          </div>
        </div>
      </div>

      {/* Audio Player Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Audio Guide</h2>
        <div className="space-y-4">
          <button
            onClick={handlePlayAudio}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors duration-200"
          >
            <span className="mr-2">
              {isPlaying ? '🔊' : '▶️'}
            </span>
            {isPlaying ? 'Playing Audio Guide' : 'Play Audio Guide'}
          </button>

          {audioUrl && (
            <audio
              controls
              className="w-full mt-4"
              autoPlay
              onEnded={() => setIsPlaying(false)}
            >
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}

          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
            Download Itinerary
          </button>
          <button className="p-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePage; 