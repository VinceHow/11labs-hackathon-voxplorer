import { useNavigate } from "react-router-dom";
import { Sparkles, Plus, MessageSquare, Mic } from "lucide-react";

const PreLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#2F4F3A] p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <button className="text-[#E8DFD0]">
          <div className="w-6 h-0.5 bg-[#E8DFD0] mb-1.5"></div>
          <div className="w-6 h-0.5 bg-[#E8DFD0]"></div>
        </button>
        <h1 className="text-3xl font-semibold text-[#E8DFD0]">Hi! I'm Voxie.</h1>
        <button className="text-[#E8DFD0]">
          <MessageSquare />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-4 mb-8 bg-[#3A5C46] rounded-xl p-4">
        <div className="w-12 h-12 rounded-full bg-[#E8DFD0] flex items-center justify-center overflow-hidden">
          {/* If you have an avatar image, use this: */}
          {/* <img src="/path-to-avatar.jpg" alt="User avatar" className="w-full h-full object-cover" /> */}
          {/* Otherwise, show initials: */}
          <span className="text-[#2F4F3A] text-xl font-semibold">JD</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#E8DFD0] text-lg font-semibold">John Doe</span>
          <span className="text-[#E8DFD0] opacity-75 text-sm">Explorer</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 flex-grow">
        {/* Plan New Trip Card */}
        <button 
          onClick={() => navigate('/new-booking')}
          className="w-full h-[180px] bg-[#5C8B9D] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-transform hover:scale-105"
        >
          <Sparkles className="text-[#E8DFD0] w-8 h-8" />
          <span className="text-2xl font-semibold text-[#E8DFD0]">Plan new trip</span>
        </button>

        {/* Import Trip Card */}
        <button 
          onClick={() => navigate('/home')}
          className="w-full h-[180px] bg-[#E8DFD0] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-transform hover:scale-105"
        >
          <Plus className="text-[#2F4F3A] w-8 h-8" />
          <span className="text-2xl font-semibold text-[#2F4F3A]">Import your trip</span>
        </button>
      </div>

      {/* Bottom Input Bar */}
      <div className="mt-auto pt-6">
        <div className="bg-[#E8DFD0] rounded-full p-4 flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-[#9DC88D] flex items-center justify-center">
            <Plus className="text-[#2F4F3A] w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Ask Voxie a question.."
            className="flex-1 bg-transparent outline-none text-[#2F4F3A] placeholder-gray-500"
          />
          <button>
            <Mic className="text-[#2F4F3A] w-6 h-6" />
          </button>
          <button className="w-6">
            <div className="w-1 h-6 bg-[#2F4F3A] rounded-full"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreLanding; 