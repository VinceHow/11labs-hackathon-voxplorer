import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare } from "lucide-react";
import InputBar from "@/components/InputBar";
import { IMAGES } from '@/constants/images';

const SiteDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#2F4F3A] p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
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
        {/* Title */}
        <h2 className="text-4xl font-bold mb-8">Kinkaku-ji</h2>

        {/* Image Carousel */}
        <div className="relative mb-6">
          <img 
            src={IMAGES.KINKAKUJI} 
            alt="Kinkaku-ji Temple" 
            className="w-full aspect-[4/3] object-cover"
          />
          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <div className="w-2 h-2 rounded-full bg-black opacity-30"></div>
            <div className="w-2 h-2 rounded-full bg-black opacity-30"></div>
          </div>
        </div>

        {/* Play Narration Button */}
        <button 
          className="flex items-center gap-2 bg-[#6B9AC4] hover:bg-[#5B8AB4] text-white px-6 py-3 rounded-full mb-6 self-start"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
          </div>
          <span className="text-xl">Play Narration</span>
        </button>

        {/* Description */}
        <div className="text-lg leading-relaxed">
          <p>
            Kinkaku-ji, also known as the Golden Pavilion, is a Zen temple in northern Kyoto whose top two floors are completely covered in gold leaf. Formally known as Rokuonji, the temple was the retirement villa of Shogun Ashikaga Yoshimitsu in the late 14th century.
          </p>
        </div>
      </div>

      {/* Input Bar */}
      <InputBar />
    </div>
  );
};

export default SiteDetail;
