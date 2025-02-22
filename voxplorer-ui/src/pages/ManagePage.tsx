import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BookingSummary from '@/components/BookingSummary';

interface BookingData {
  reference: string;
  date: string;
  destination: string;
  duration: string;
  notes: string;
}

const ManagePage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/booking-summary');
        if (!response.ok) {
          throw new Error('Failed to fetch booking data');
        }
        const data = await response.json();
        setBookingData(data);
      } catch (err) {
        setError('Failed to load booking information');
        console.error('Error fetching booking data:', err);
      }
    };

    fetchBookingData();
  }, []);

  const handlePlayAudio = async () => {
    if (!bookingData) return;

    const textToRead = `
      Booking Summary:
      Reference number: ${bookingData.reference}.
      Travel Date: ${bookingData.date}.
      Destination: ${bookingData.destination}.
      Duration: ${bookingData.duration}.
      Important Notes: ${bookingData.notes || 'No additional notes available.'}`

    try {
      const response = await fetch('http://127.0.0.1:8000/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToRead
        })
      });

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

      <BookingSummary />

      {/* Audio Player Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Audio Guide</h2>
        <div className="space-y-4">
          <button
            onClick={handlePlayAudio}
            disabled={!bookingData}
            className={`w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors duration-200 ${!bookingData ? 'opacity-50 cursor-not-allowed' : ''}`}
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