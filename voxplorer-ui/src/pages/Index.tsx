import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Globe2, MessageCircle, Share2, ChevronDown } from "lucide-react";
import FeatureCards from "@/components/FeatureCards";
import TravelPlan from "@/components/TravelPlan";

const Index = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sample travel plan data
  const travelPlans = [
    {
      day: 1,
      date: "2024-03-20",
      schedules: [
        {
          time: "09:00 AM",
          activity: "Check-in at Hotel Sunrise",
          location: "123 Beach Road"
        },
        {
          time: "11:00 AM",
          activity: "City Tour",
          location: "Downtown Area"
        },
        {
          time: "02:00 PM",
          activity: "Lunch at Local Restaurant",
          location: "Harbor View Restaurant"
        }
      ]
    },
    {
      day: 2,
      date: "2024-03-21",
      schedules: [
        {
          time: "10:00 AM",
          activity: "Museum Visit",
          location: "National History Museum"
        },
        {
          time: "03:00 PM",
          activity: "Beach Activities",
          location: "Sunset Beach"
        }
      ]
    }
  ];

  const toggleCards = () => {
    setIsExpanded(!isExpanded);
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

        <TravelPlan plans={travelPlans} />
        
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
      </div>
    </div>
  );
};

export default Index;
