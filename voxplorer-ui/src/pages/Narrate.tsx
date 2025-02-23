import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Mic, Send, Image as ImageIcon, X, ChevronLeft, MessageSquare, Activity, Plus, ChevronRight } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  contentType: 'text' | 'image' | 'audio';
  timestamp: string;
  status?: string;
  imageUrl?: string;
}

const Narrate = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const currentTime = new Date().toISOString();
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: selectedImage ? 'Sent an image' : inputText,
      contentType: selectedImage ? 'image' : 'text',
      timestamp: currentTime,
      status: 'sent',
      imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    try {
      setIsLoading(true);
      const formData = new FormData();

      let endpoint = `http://localhost:8000/api/chat`;
      
      if (selectedImage) {
        endpoint = `http://localhost:8000/api/image-summary`;
        formData.append('file', selectedImage, selectedImage.name);
      } else {
        formData.append('message', inputText);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: data.message || 'No response from server',
        contentType: 'text',
        timestamp: data.timestamp || new Date().toISOString(),
        status: data.status || 'received'
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        contentType: 'text',
        timestamp: new Date().toISOString(),
        status: 'error'
      }]);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
          setIsLoading(true);
          const response = await fetch(`http://localhost:8000/api/transcribe`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Failed to transcribe audio');

          const data = await response.json();
          setInputText(data.transcription);
        } catch (error) {
          console.error('Error transcribing audio:', error);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#2F4F3A] p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleBack} className="text-[#E8DFD0]">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-semibold text-[#E8DFD0]">Kyoto 2025</h1>
        <button className="text-[#E8DFD0]">
          <MessageSquare className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-[#E8DFD0] rounded-3xl p-4 overflow-y-auto mb-4 max-h-[calc(100vh-220px)]">
        <div className="flex items-center gap-2 mb-4 sticky top-0 bg-[#E8DFD0] z-10 pb-2">
          <div className="w-8 h-8 rounded-full bg-[#2F4F3A] flex items-center justify-center">
            <Activity className="h-5 w-5 text-[#E8DFD0]" />
          </div>
          <span className="text-xl font-bold">Voxie</span>
        </div>

        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                message.type === 'user' 
                  ? 'bg-[#2F4F3A] text-white' 
                  : 'bg-[#333333] text-white'
              }`}>
                {message.imageUrl && (
                  <img 
                    src={message.imageUrl} 
                    alt="Sent image" 
                    className="w-full rounded-lg mb-1"
                  />
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className="flex justify-between items-center mt-1">
                  <div className={`text-[10px] ${
                    message.type === 'user' ? 'text-gray-300' : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                  {message.type === 'assistant' && (
                    <button 
                      onClick={() => navigate('/site/1')}
                      className="bg-[#9DC88D] text-[#2F4F3A] p-1 rounded-full"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="relative inline-block mb-2">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="h-20 w-20 object-cover rounded-lg"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="mt-4 relative">
        <div className="bg-[#E8DFD0] rounded-full p-3 flex items-center gap-2">
          <button 
            className="w-7 h-7 rounded-full bg-[#9DC88D] flex items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="text-[#2F4F3A] w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageSelect}
          />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Voxie a question.."
            className="flex-1 bg-transparent outline-none text-[#2F4F3A] placeholder-gray-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`${isRecording ? 'text-red-500' : 'text-[#2F4F3A]'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputText.trim() && !selectedImage)}
            className={`${isLoading || (!inputText.trim() && !selectedImage) ? 'opacity-50' : ''}`}
          >
            <Send className="text-[#2F4F3A] w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Narrate; 