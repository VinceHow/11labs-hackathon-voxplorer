import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Narrate = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={handleBack}>
            Back
          </Button>
          <h1 className="text-3xl font-bold text-center flex-1">Narrate Your Journey</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Add your narration components here */}
          <p className="text-gray-600">Share your travel stories and experiences...</p>
        </div>
      </div>
    </div>
  );
};

export default Narrate; 