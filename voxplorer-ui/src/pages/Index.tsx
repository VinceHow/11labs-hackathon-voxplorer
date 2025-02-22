import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import FeatureCards from "@/components/FeatureCards";
import TravelPlan from "@/components/TravelPlan";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

interface Schedule {
  time: string;
  activity: string;
  location: string;
}

interface DayPlan {
  day: number;
  date: string;
  schedules: Schedule[];
}

const Index = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [travelPlans, setTravelPlans] = useState<DayPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTravelPlans = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/travel-plans');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTravelPlans(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch travel plans');
        console.error('Error fetching travel plans:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelPlans();
  }, []);

  const toggleCards = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNewBooking = () => {
    navigate('/new-booking');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-4xl animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Voxplorer -Your Personal Travel Companion
        </h1>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Plan your journey, overcome language barriers, and share your adventures with our all-in-one travel platform.
        </p>

        {isLoading ? (
          <div className="text-center p-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading travel plans...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg">
            {error}
          </div>
        ) : (
          <TravelPlan plans={travelPlans} />
        )}
        
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            onClick={toggleCards}
            className="flex items-center gap-2"
          >
            {isExpanded ? 'Hide Features' : 'Show Features'}
            <ChevronDown 
              className={`w-5 h-5 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </div>
        <FeatureCards isExpanded={isExpanded} />
        
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="default" onClick={handleNewBooking}>
            New
          </Button>
          <Button variant="outline">
            Modify
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
