from fastapi import FastAPI, Request, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from voxplorer_backend.services.elevenlabs_service import ElevenLabsService
from voxplorer_backend.services.make_service import MakeService
from voxplorer_backend.services.google_service import GoogleService
from voxplorer_backend.models.requests import TextToSpeechRequest, WebhookRequest
from voxplorer_backend.services.twilio_service import TwilioService
from dotenv import load_dotenv

load_dotenv()
import uvicorn
app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

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
twilio_service = TwilioService()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/api/travel-plans")
def read_root():
    return planner.get_all_plan("demo")

@app.get("/api/travel-plans/{day}/schedules/{schedule_index}")
async def get_schedule_detail(day: int, schedule_index: int):
    # In a real app, you would fetch this from a database
    travel_plans = [
        # ... your existing travel_plans data ...
    ]

    day_plan = next((plan for plan in travel_plans if plan["day"] == day), None)
    if not day_plan:
        raise HTTPException(status_code=404, detail="Day plan not found")

    try:
        schedule = day_plan["schedules"][schedule_index]
        return {
            "day": day_plan["day"],
            "date": day_plan["date"],
            "schedule": schedule
        }
    except IndexError:
        raise HTTPException(status_code=404, detail="Schedule not found")

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

@app.post("/api/calls/outbound")
async def initiate_outbound_call():
    try:
        return await twilio_service.initiate_call()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/stream")
async def handle_call_stream(websocket: WebSocket):
    await websocket.accept()
    await twilio_service.handle_stream(websocket)

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)