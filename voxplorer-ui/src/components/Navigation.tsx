import { Link, useLocation } from "react-router-dom";
import { Calendar, Globe, MessageSquare, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    // Hide navigation on PreLanding page
    setIsVisible(location.pathname !== '/');
  }, [location.pathname]);

  if (!isVisible) return null;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-3 px-6 md:top-0 md:bottom-auto">
      <div className="max-w-screen-xl mx-auto flex justify-center items-center gap-8">
        <Link 
          to="/itinerary" 
          className={`flex flex-col items-center gap-1 transition-colors hover:text-primary ${
            isActive("/itinerary") ? "text-primary" : "text-gray-600"
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs font-medium">Itinerary</span>
        </Link>
        
        <Link 
          to="/manage" 
          className={`flex flex-col items-center gap-1 transition-colors hover:text-primary ${
            isActive("/manage") ? "text-primary" : "text-gray-600"
          }`}
        >
          <Globe className="h-5 w-5" />
          <span className="text-xs font-medium">Manage</span>
        </Link>
        
        <Link 
          to="/narrate" 
          className={`flex flex-col items-center gap-1 transition-colors hover:text-primary ${
            isActive("/narrate") ? "text-primary" : "text-gray-600"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs font-medium">Narrate</span>
        </Link>

        <Link 
          to="/share" 
          className={`flex flex-col items-center gap-1 transition-colors hover:text-primary ${
            isActive("/share") ? "text-primary" : "text-gray-600"
          }`}
        >
          <Share2 className="h-5 w-5" />
          <span className="text-xs font-medium">Share</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
