import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronLeft, MessageSquare } from "lucide-react";
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import InputBar from "@/components/InputBar";

const ScheduleDetail = () => {
  const { day, scheduleIndex } = useParams();
  const navigate = useNavigate();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '200px',
    borderRadius: '8px'
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
    <div className="min-h-screen bg-[#2F4F3A] p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate(-1)} className="text-[#E8DFD0]">
          <ChevronLeft className="h-8 w-8" />
        </button>
        <h1 className="text-2xl font-semibold text-[#E8DFD0]">Kyoto 2025</h1>
        <button className="text-[#E8DFD0]">
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-[#E8DFD0] rounded-3xl p-4 flex-1 flex flex-col">
        <h2 className="text-xl md:text-2xl font-bold mb-4 truncate text-center">Schedule Detail</h2>

        {loading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin h-6 w-6 border-3 border-[#2F4F3A] border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-3 flex-1">
          {/* Booking Details */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="border border-[#2F4F3A] rounded-lg p-3">
              <h3 className="text-lg font-bold mb-2">Booking Confirmations</h3>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Hotel Reservation #12345
                </li>
              </ul>
            </div>

            <div className="border border-[#2F4F3A] rounded-lg p-3">
              <h3 className="text-lg font-bold mb-2">Required Documents</h3>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-center">
                  <span className="text-[#2F4F3A] mr-2">📄</span>
                  Passport/ID
                </li>
                <li className="flex items-center">
                  <span className="text-[#2F4F3A] mr-2">📄</span>
                  Vaccination Records
                </li>
                <li className="flex items-center">
                  <span className="text-[#2F4F3A] mr-2">📄</span>
                  Travel Insurance
                </li>
              </ul>
            </div>
          </div>

          {/* Important Notices */}
          <div className="border border-[#2F4F3A] rounded-lg p-3">
            <h3 className="text-lg font-bold mb-2">Important Notices</h3>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start">
                <span className="text-[#2F4F3A] mr-2">⚠️</span>
                <p>Check-in time at the hotel is after 3:00 PM</p>
              </li>
              <li className="flex items-start">
                <span className="text-[#2F4F3A] mr-2">⚠️</span>
                <p>Remember to bring appropriate clothing for the weather</p>
              </li>
              <li className="flex items-start">
                <span className="text-[#2F4F3A] mr-2">⚠️</span>
                <p>Local currency is required for some activities</p>
              </li>
            </ul>
          </div>
          <div className="border border-[#2F4F3A] rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">Route Map</h3>
              <button className="bg-[#2F4F3A] text-[#E8DFD0] px-3 py-1.5 rounded-full text-sm font-medium">
                Get me there
              </button>
            </div>
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat: 34.4359, lng: 135.243 }}
                zoom={12}
              >
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <InputBar />
    </div>
  );
};

export default ScheduleDetail; 