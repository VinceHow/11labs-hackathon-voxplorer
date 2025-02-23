import { Plane, Globe2, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureCardsProps {
  isExpanded: boolean;
}

const FeatureCards = ({ isExpanded }: FeatureCardsProps) => {
  if (!isExpanded) return null;

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
    <div className="absolute bottom-20 left-0 right-0 bg-[#E8DFD0] p-4 rounded-2xl shadow-lg">
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <div 
            key={index}
            className="bg-[#9DC88D] p-4 rounded-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="mb-4">{card.icon}</div>
            </div>
            <h3 className="text-[#2F4F3A] font-semibold mb-2">{card.title}</h3>
            <p className="text-[#2F4F3A] text-sm mb-4">{card.description}</p>
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
    </div>
  );
};

export default FeatureCards; 