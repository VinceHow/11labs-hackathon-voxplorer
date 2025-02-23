import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
import { Clock, MapPin, FileText, Loader2, Phone, ChevronLeft } from "lucide-react";

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
    <div className="min-h-screen bg-[#2F4F3A] p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleBack} className="text-[#E8DFD0]">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-semibold text-[#E8DFD0]">New Booking</h1>
        <button 
          onClick={initiateCall}
          disabled={isCallLoading}
          className="text-[#E8DFD0]"
        >
          <Phone className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 bg-[#E8DFD0] rounded-3xl p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#2F4F3A]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(bookings).map(([id, booking]) => (
              <div
                key={id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-[#2F4F3A] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Time</div>
                      <div className="text-sm text-gray-700">
                        {booking.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-[#2F4F3A] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Location</div>
                      <div className="text-sm text-gray-700">
                        {booking.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-[#2F4F3A] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Additional Details</div>
                      <div className="text-sm text-gray-700">
                        {booking.additional_details}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                  <button 
                    className="w-full bg-[#2F4F3A] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#264231] transition-colors"
                    onClick={() => {/* Add booking selection handler */}}
                  >
                    Select Booking
                  </button>
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