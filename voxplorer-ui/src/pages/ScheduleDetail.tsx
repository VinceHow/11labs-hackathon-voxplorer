import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const ScheduleDetail = () => {
  const { day, scheduleIndex } = useParams();
  const navigate = useNavigate();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/route/${day}/${scheduleIndex}`);
        const data = await response.json()
        if (data.status === 'success') {
          setDirections(data.route[0]);
        } else {
          setError('Failed to load route data');
        }
      } catch (err) {
        setError('Failed to fetch route data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [day, scheduleIndex]);

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

      <h1 className="text-2xl font-bold mb-4">Schedule Detail</h1>

      {loading && <p>Loading route...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {/* New Booking Details Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Confirmations */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-3">Booking Confirmations</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Hotel Reservation #12345
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Flight Booking #AB678
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Car Rental Confirmation #CR999
              </li>
            </ul>
          </div>

          {/* Important Documents */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-3">Required Documents</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">📄</span>
                Passport/ID
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">📄</span>
                Vaccination Records
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">📄</span>
                Travel Insurance
              </li>
            </ul>
          </div>

          {/* Things to Notice */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h3 className="text-lg font-medium mb-3">Important Notices</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <p>Check-in time at the hotel is after 3:00 PM</p>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <p>Remember to bring appropriate clothing for the weather</p>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <p>Local currency is required for some activities</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: 40.7128, lng: -74.0060 }} // Default to NYC coordinates
          zoom={12}>
          {directions && (
            <DirectionsRenderer
              directions={directions}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default ScheduleDetail; 