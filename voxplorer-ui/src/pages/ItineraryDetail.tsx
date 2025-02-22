import { useNavigate } from 'react-router-dom';

const ItineraryDetail = () => {
  const navigate = useNavigate();

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

      <h1 className="text-2xl font-bold mb-6">Trip Itinerary</h1>

      <div className="grid gap-6">
        {/* Daily Schedule Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Schedule</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-600 pl-4">
              <div className="flex items-center">
                <span className="text-lg font-medium">Morning</span>
                <span className="text-gray-500 ml-4">8:00 AM - 12:00 PM</span>
              </div>
              <p className="text-gray-600 mt-1">Breakfast at hotel followed by city tour</p>
            </div>

            <div className="border-l-4 border-indigo-600 pl-4">
              <div className="flex items-center">
                <span className="text-lg font-medium">Afternoon</span>
                <span className="text-gray-500 ml-4">12:00 PM - 5:00 PM</span>
              </div>
              <p className="text-gray-600 mt-1">Museum visit and local cuisine experience</p>
            </div>

            <div className="border-l-4 border-indigo-600 pl-4">
              <div className="flex items-center">
                <span className="text-lg font-medium">Evening</span>
                <span className="text-gray-500 ml-4">5:00 PM - 10:00 PM</span>
              </div>
              <p className="text-gray-600 mt-1">Dinner and cultural show</p>
            </div>
          </div>
        </div>

        {/* Activities and Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Activities</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-indigo-600 mr-2">•</span>
                City Walking Tour
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 mr-2">•</span>
                Museum Visit
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 mr-2">•</span>
                Local Food Tasting
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 mr-2">•</span>
                Cultural Performance
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Important Details</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">📍</span>
                <div>
                  <p className="font-medium">Meeting Point</p>
                  <p className="text-gray-600">Hotel Lobby</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">⏰</span>
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-gray-600">Full Day (12 hours)</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">👤</span>
                <div>
                  <p className="font-medium">Guide</p>
                  <p className="text-gray-600">English Speaking</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">⚠️</span>
              <p className="text-gray-600">Wear comfortable walking shoes</p>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">⚠️</span>
              <p className="text-gray-600">Bring water and sunscreen</p>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">⚠️</span>
              <p className="text-gray-600">Camera recommended for sightseeing</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetail; 