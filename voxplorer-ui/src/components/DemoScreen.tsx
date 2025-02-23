import { useNavigate } from "react-router-dom";

interface DemoScreenProps {
  imageUrl: string;
  redirectUrl: string;
  altText: string;
}

const DemoScreen = ({ imageUrl, redirectUrl, altText }: DemoScreenProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(redirectUrl);
  };

  return (
    <div 
      className="min-h-screen bg-[#2F4F3A] p-6 flex flex-col items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <img 
        src={imageUrl} 
        alt={altText}
        className="max-w-[90%] max-h-[90vh] rounded-lg shadow-xl hover:opacity-95 transition-opacity"
      />
    </div>
  );
};

export default DemoScreen; 