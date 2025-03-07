import { useState } from 'react';
import { ChevronLeft, MessageSquare, ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputBar from "@/components/InputBar";
import { IMAGES } from '@/constants/images';

const Welcome = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRentalExpanded, setIsRentalExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#2F4F3A] p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="text-[#E8DFD0]">
          <ChevronLeft className="h-8 w-8" />
        </button>
        <h1 className="text-3xl font-semibold text-[#E8DFD0]">Kyoto 2025</h1>
        <button className="text-[#E8DFD0]">
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-[#E8DFD0] rounded-3xl p-6 flex-1 flex flex-col">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 truncate text-center">Welcome to Kyoto!</h2>

        {/* Directions Section */}
        <div className="border-2 border-[#2F4F3A] rounded-xl p-4 mb-4">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex justify-between items-center"
          >
            <h3 className="text-2xl font-bold">Directions</h3>
            {isExpanded ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </button>

          {/* Direction Steps */}
          {isExpanded && (
            <div className="space-y-6 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#2F4F3A] mt-1"></div>
                  <p className="text-xl font-semibold">
                    Follow the directions to Kansai Airport station
                  </p>
                </div>
                <img 
                  src={IMAGES.TERMINAL_1}
                  alt="Terminal 1 direction" 
                  className="w-full rounded-xl border border-[#2F4F3A]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#2F4F3A] mt-1"></div>
                  <p className="text-xl font-semibold">
                    Please go across the pedestrian overpass and go to AEROPLAZA.
                  </p>
                </div>
                <img 
                  src={IMAGES.AEROPLAZA}
                  alt="Aeroplaza direction" 
                  className="w-full rounded-xl border border-[#2F4F3A]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#2F4F3A] mt-1"></div>
                  <p className="text-xl font-semibold">
                    Please exit the airport and go to Times Car Rental.
                  </p>
                </div>
                <img 
                  src={IMAGES.RENTAL}
                  alt="Car rental" 
                  className="w-full rounded-xl border border-[#2F4F3A] cursor-pointer"
                  onClick={() => {
                    setIsRentalExpanded(!isRentalExpanded);
                    setIsExpanded(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Car Rental Details Section */}
        {isRentalExpanded && (
          <div className="border-2 border-[#2F4F3A] rounded-xl p-4">
            <img 
                  src={IMAGES.RENTAL}
                  alt="Car rental" 
                  className="w-full rounded-xl border border-[#2F4F3A] cursor-pointer"
                />
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Rental Details</h3>
              <ChevronUp className="h-6 w-6" />
            </div>

            <div className="space-y-6 mt-4">
              {/* Booking Reference */}
              <div className="bg-[#E8DFD0] rounded-xl p-4 border border-[#2F4F3A]">
                <h4 className="text-xl font-bold mb-1">Booking reference:</h4>
                <p className="text-xl">#CR999</p>
              </div>

              {/* Required Documents */}
              <div className="bg-[#E8DFD0] rounded-xl p-4 border border-[#2F4F3A]">
                <h4 className="text-xl font-bold mb-2">Required documents</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#2F4F3A]"></div>
                    <span className="text-lg">Passport/ID</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#2F4F3A]"></div>
                    <span className="text-lg">Travel insurance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <InputBar />
    </div>
  );
};

export default Welcome; 