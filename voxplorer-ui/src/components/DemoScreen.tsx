import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface DemoScreenProps {
  imageUrl: string;
  redirectUrl: string;
  altText: string;
}

const DemoScreen = ({ imageUrl, redirectUrl, altText }: DemoScreenProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#2F4F3A] flex flex-col"
    onClick={() => navigate(redirectUrl)}>
      <img 
        src={imageUrl} 
        alt={altText} 
        className="w-full h-screen object-cover"
      />
    </div>
  );
};

export default DemoScreen; 