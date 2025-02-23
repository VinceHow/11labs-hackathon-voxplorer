# Voxie - Your AI-Powered Travel Companion

## Overview
Voxie is a AI travel agent that transforms how you plan and experience your journeys. Using advanced voice AI technology and natural conversation, Voxie helps you create personalized travel itineraries, make bookings, and get real-time travel assistance - all through natural voice conversations.

### Backend (Python)
- **FastAPI** - High-performance async web framework
- **WebSockets** - Real-time bidirectional communication
- **ElevenLabs API** - State-of-the-art voice AI integration
- **Twilio** - Enterprise-grade telephony integration
- **HTTPX** - Modern async HTTP client
- **Async/Await** - Non-blocking I/O operations
- **Google Cloud Sevice** - Google Map, Google Place, Google Place Details, Google Place Reviews, Google Image API
- **OpenAI**: SOTA LLM model integration

### Frontend (React)
- **React** - Modern UI development
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **React Router** - Client-side routing
- **WebSocket Client** - Real-time communication

## Architecture
Voxplorer employs a microservices architecture with:
- Async service handlers for optimal performance
- Real-time WebSocket streams for voice data
- Secure API integration with ElevenLabs
- Automated conversation history management
- Robust error handling and logging

## Voice AI Integration
The platform integrates with ElevenLabs' advanced voice AI capabilities:
- Custom voice agent configuration
- Real-time speech synthesis
- Natural language understanding
- Context-aware responses
- Conversation flow management

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- ElevenLabs API key
- Twilio account (optional)

### Installation
1. Clone the repository
2. Set up the backend:
```bash
cd voxplorer-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd voxplorer-ui
npm install
```

### Configuration
Create a `.env` file in the backend directory:
```
ELEVENLABS_API_KEY=your_key
ELEVENLABS_AGENT_ID=your_agent_id
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
```

### Running the Application
1. Start the backend server:
```bash
uvicorn voxplorer_backend.main:app --reload
```

2. Start the frontend development server:
```bash
npm run dev
```

## Future Roadmap
- Multi-language support
- Advanced analytics dashboard
- Custom voice model training
- Integration with additional AI services
- Enhanced conversation flow management

## Contributing
We welcome contributions! Please see our contributing guidelines for more details.

## License
MIT License - see LICENSE for details