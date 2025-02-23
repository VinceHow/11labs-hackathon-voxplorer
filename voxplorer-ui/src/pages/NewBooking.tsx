import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
import { Clock, MapPin, FileText, Loader2, Phone } from "lucide-react";

interface Booking {
  time: string;  // Simple string type now
  location: string;
  additional_details: string;
}

interface BookingMap {
  [key: string]: Booking;
}

const NewBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCallLoading, setIsCallLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8000/api/bookings`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setBookings(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchBookings();

    // Set up interval for fetching every 2 seconds
    const intervalId = setInterval(fetchBookings, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const initiateCall = async () => {
    try {
      setIsCallLoading(true);
      const response = await fetch(`http://localhost:8000/api/calls/outbound`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      // Show success message
      alert('Call initiated successfully!');

    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to initiate call. Please try again.');
    } finally {
      setIsCallLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={handleBack}>
            Back
          </Button>
          <h1 className="text-3xl font-bold text-center flex-1">New Booking</h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={initiateCall}
            disabled={isCallLoading}
          >
            <Phone className="h-5 w-5" />
            {isCallLoading ? 'Calling...' : 'Start Call'}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(bookings).map(([id, booking]) => (
              <div
                key={id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Time</div>
                      <div className="text-gray-700">
                        {booking.time}  {/* Direct string display */}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Location</div>
                      <div className="text-gray-700">
                        {booking.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Additional Details</div>
                      <div className="text-gray-700">
                        {booking.additional_details}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {/* Add booking selection handler */}}
                  >
                    Select Booking
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {Object.keys(bookings).length === 0 && !isLoading && !error && (
          <div className="text-center text-gray-500 p-8">
            No bookings available
          </div>
        )}
      </div>
    </div>
  );
};

export default NewBooking; 