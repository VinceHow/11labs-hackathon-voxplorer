import { useEffect, useState } from 'react';

interface BookingData {
    reference: string;
    date: string;
    destination: string;
    duration: string;
    notes: string;  // Add notes to the interface
  }

const BookingSummary = () => {
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookingData();
    }, []);

    if (isLoading) {
        return (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index}>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        );
      }
    
      if (!bookingData) {
        return null;
      }
      return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Booking Reference</p>
              <p className="font-medium">{bookingData.reference}</p>
            </div>
            <div>
              <p className="text-gray-600">Travel Date</p>
              <p className="font-medium">{bookingData.date}</p>
            </div>
            <div>
              <p className="text-gray-600">Destination</p>
              <p className="font-medium">{bookingData.destination}</p>
            </div>
            <div>
              <p className="text-gray-600">Duration</p>
              <p className="font-medium">{bookingData.duration}</p>
            </div>
          </div>
    
          {/* Notes Section */}
          <div className="border-t pt-4">
            <h3 className="text-gray-600 font-medium mb-2">Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {bookingData.notes || 'No additional notes available.'}
              </p>
            </div>
          </div>
        </div>
      );
};

export default BookingSummary; 