
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Globe2, MessageCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-4xl animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Your Personal Travel Companion
        </h1>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Plan your journey, overcome language barriers, and share your adventures with our all-in-one travel platform.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-lg hover-lift">
            <Plane className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Trip Planning</h2>
            <p className="text-gray-600 mb-4">Create detailed itineraries and organize your perfect journey.</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/planner")}
            >
              Start Planning
            </Button>
          </div>
          
          <div className="glass-card p-6 rounded-lg hover-lift">
            <Globe2 className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Translation</h2>
            <p className="text-gray-600 mb-4">Break through language barriers with real-time translation.</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/translate")}
            >
              Translate Now
            </Button>
          </div>
          
          <div className="glass-card p-6 rounded-lg hover-lift">
            <MessageCircle className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Travel Posts</h2>
            <p className="text-gray-600 mb-4">Share your experiences and inspire fellow travelers.</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/posts")}
            >
              View Posts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
