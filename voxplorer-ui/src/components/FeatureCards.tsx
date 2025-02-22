import { Plane, Globe2, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureCardsProps {
  isExpanded: boolean;
}

const FeatureCards = ({ isExpanded }: FeatureCardsProps) => {
  const navigate = useNavigate();
  
  const cards = [
    {
      icon: <Plane className="w-8 h-8 text-primary" />,
      title: "Itanary",
      description: "Create detailed itineraries and organize your perfect journey.",
      buttonText: "Start Planning",
      route: "/itanary"
    },
    {
      icon: <Globe2 className="w-8 h-8 text-primary" />,
      title: "Manage",
      description: "Manage your travel plan seamlessly.",
      buttonText: "Translate Now",
      route: "/manage"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "Narrate",
      description: "Immerse yourself in the story of your journey.",
      buttonText: "View Posts",
      route: "/narrate"
    },
    {
      icon: <Share2 className="w-8 h-8 text-primary" />,
      title: "Share",
      description: "Share your travel stories with your friends and family, during the trip or after!",
      buttonText: "View Posts",
      route: "/share"
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transition-all duration-300 ${
      isExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'
    }`}>
      {cards.map((card, index) => (
        <div 
          key={index}
          className="glass-card p-6 rounded-lg hover-lift transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="mb-4">{card.icon}</div>
          </div>
          <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
          <p className="text-gray-600 mb-4">{card.description}</p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate(card.route)}
          >
            {card.buttonText}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards; 