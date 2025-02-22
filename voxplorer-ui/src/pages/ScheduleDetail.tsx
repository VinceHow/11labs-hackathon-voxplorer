import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const ScheduleDetail = () => {
  const { day, scheduleIndex } = useParams();
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
      <h1 className="text-2xl font-bold mb-4">Schedule Detail</h1>
      <p className="mb-4">Day: {day}</p>
      <p className="mb-4">Schedule Index: {scheduleIndex}</p>

      {loading && <p>Loading route...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
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