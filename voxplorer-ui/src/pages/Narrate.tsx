import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Mic, Send, Image as ImageIcon, X } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  contentType: 'text' | 'image' | 'audio';
  timestamp: string;
  status?: string;
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
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    try {
      setIsLoading(true);
      const formData = new FormData();

      let endpoint = `http://localhost:8000/api/chat`;
      
      if (selectedImage) {
        endpoint = `localhost:8000/api/image-summary`;
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
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="hover:bg-blue-100 transition-colors"
          >
            <span className="text-blue-600">←</span> Back
          </Button>
          <h1 className="text-3xl font-bold text-center flex-1 text-blue-900">
            Narrate Your Journey
          </h1>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 h-[600px] flex flex-col border border-gray-100">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white shadow-blue-100'
                      : 'bg-gray-50 text-gray-800 shadow-gray-100'
                  } shadow-md transition-all duration-200 hover:shadow-lg`}
                >
                  <div className="mb-1">{message.content}</div>
                  <div
                    className={`flex justify-between items-center text-xs ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    <span>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    {message.status && (
                      <span className="ml-2">
                        {message.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="relative inline-block mb-4">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="h-24 w-24 object-cover rounded-lg shadow-md"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Input Container */}
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="hover:bg-blue-50 transition-colors"
            >
              <ImageIcon className="h-5 w-5 text-blue-500" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              className={`transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'hover:bg-blue-50'
              }`}
            >
              <Mic className={`h-5 w-5 ${isRecording ? 'text-white' : 'text-blue-500'}`} />
            </Button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className={`bg-blue-500 hover:bg-blue-600 text-white transition-colors ${
                isLoading || (!inputText.trim() && !selectedImage) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Narrate; 