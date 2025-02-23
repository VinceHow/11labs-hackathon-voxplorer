import { Plus, Mic, AudioLines } from "lucide-react";

interface InputBarProps {
  onToggleCards?: () => void;
}

const InputBar = ({ onToggleCards }: InputBarProps) => {
  return (
    <div className="mt-6 relative">
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
        <button onClick={onToggleCards}>
          <AudioLines className="text-[#2F4F3A] w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default InputBar; 