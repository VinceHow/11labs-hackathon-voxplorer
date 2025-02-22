
import { Link, useLocation } from "react-router-dom";
import { Calendar, Globe, MessageSquare } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-3 px-6 md:top-0 md:bottom-auto">
      <div className="max-w-screen-xl mx-auto flex justify-center items-center gap-8">
        <Link 
          to="/planner" 
          className={`flex flex-col items-center gap-1 transition-colors hover:text-primary ${
            isActive("/planner") ? "text-primary" : "text-gray-600"
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs font-medium">Plan</span>
        </Link>
        
        <Link 
          to="/translate" 
          className={`flex flex-col items-center gap-1 transition-colors hover:text-primary ${
            isActive("/translate") ? "text-primary" : "text-gray-600"
          }`}
        >
          <Globe className="h-5 w-5" />
          <span className="text-xs font-medium">Translate</span>
        </Link>
        
        <Link 
          to="/posts" 
          className={`flex flex-col items-center gap-1 transition-colors hover:text-primary ${
            isActive("/posts") ? "text-primary" : "text-gray-600"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs font-medium">Posts</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
