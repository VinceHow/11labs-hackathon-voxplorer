import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, MessageSquare, Mic, Plus, AudioLines } from "lucide-react";
import TravelPlan from "@/components/TravelPlan";
import FeatureCards from "@/components/FeatureCards";
import InputBar from "@/components/InputBar";

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

  const handleNewBooking = () => {
    navigate('/new-booking');
  };

  const toggleCards = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="min-h-screen bg-[#2F4F3A] p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button className="text-[#E8DFD0]">
          <div className="w-6 h-0.5 bg-[#E8DFD0] mb-1.5"></div>
          <div className="w-6 h-0.5 bg-[#E8DFD0]"></div>
        </button>
        <h1 className="text-3xl font-semibold text-[#E8DFD0]">Voxplorer</h1>
        <button className="text-[#E8DFD0]">
          <MessageSquare />
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-[#E8DFD0] rounded-3xl p-6 flex-1 flex flex-col">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 truncate text-center">Kyoto, Japan 2025</h2>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-[#2F4F3A] border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : (
          <div className="space-y-4 flex-1">
            <TravelPlan plans={travelPlans} />
          </div>
        )}

        <div className="flex gap-4 mt-auto mb-6">
          <button 
            onClick={handleNewBooking}
            className="flex-1 bg-[#2F4F3A] text-[#E8DFD0] py-4 px-6 rounded-3xl text-lg font-semibold hover:bg-[#1F3F2A] transition-colors"
          >
            Create new booking
          </button>
          <button 
            className="flex-1 bg-[#9DC88D] text-[#2F4F3A] py-4 px-6 rounded-3xl text-lg font-semibold hover:bg-[#8DB87D] transition-colors"
          >
            Edit existing booking
          </button>
          <FeatureCards isExpanded={isExpanded} /> 
        </div>
      </div>

      <InputBar onToggleCards={toggleCards} />
      {/* {isExpanded && <FeatureCards isExpanded={isExpanded} />} */}
    </div>
  );
};

export default Index;
