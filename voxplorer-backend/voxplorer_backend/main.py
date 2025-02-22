from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from .services.elevenlabs_service import ElevenLabsService
from .services.make_service import MakeService
from .services.google_service import GoogleService
from .models.requests import TextToSpeechRequest, WebhookRequest
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
elevenlabs_service = ElevenLabsService()
make_service = MakeService()
google_service = GoogleService()

@app.get("/")
def read_root():
    return {"status": "healthy"}

@app.post("/api/tts")
async def text_to_speech(request: TextToSpeechRequest):
    try:
        audio = await elevenlabs_service.convert_text_to_speech(request.text, request.voice_id)
        return Response(content=audio, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/make/webhook")
async def make_webhook(request: WebhookRequest):
    try:
        return await make_service.handle_webhook(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/places/search")
async def search_places(query: str, location: str = None):
    try:
        return await google_service.search_places(query, location)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/places/id")
async def get_place_id(location: str):
    try:
        return await google_service.get_place_id(location)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))