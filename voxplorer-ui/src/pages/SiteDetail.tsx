import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare } from "lucide-react";
import InputBar from "@/components/InputBar";
import { useState } from 'react';
import { IMAGES } from '@/constants/images';

const SiteDetail = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlayNarration = async () => {
    const textToRead = `
      Kinkaku-ji, also known as the Golden Pavilion, is a Zen temple in northern Kyoto whose top 
      two floors are completely covered in gold leaf. Formally known as Rokuonji, the temple was 
      the retirement villa of Shogun Ashikaga Yoshimitsu in the late 14th century.`;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToRead
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setIsPlaying(true);
    } catch (err) {
      setError('Failed to load audio. Please try again.');
      console.error('Error fetching audio:', err);
    }
  };

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
      <div className="bg-[#E8DFD0] rounded-3xl p-4 flex-1 flex flex-col">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-4 text-center">Kinkaku-ji</h2>

        {/* Image Carousel */}
        <div className="relative mb-4">
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
        <div className="flex justify-center mb-4">
          <button 
            onClick={handlePlayNarration}
            className="flex items-center gap-2 bg-[#6B9AC4] hover:bg-[#5B8AB4] text-white px-4 py-2 rounded-full"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
            </div>
            <span className="text-base">
              {isPlaying ? 'Playing Narration' : 'Play Narration'}
            </span>
          </button>
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <audio
            controls
            className="w-full mb-4"
            autoPlay
            onEnded={() => setIsPlaying(false)}
          >
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        {/* Description */}
        <div className="text-base leading-relaxed px-2">
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
