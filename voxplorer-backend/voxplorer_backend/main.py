from fastapi import FastAPI, Request, HTTPException, WebSocket, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, HTMLResponse
from voxplorer_backend.services.elevenlabs_service import ElevenLabsService
from voxplorer_backend.services.make_service import MakeService
from voxplorer_backend.services.google_service import GoogleService
from voxplorer_backend.models.requests import TextToSpeechRequest, WebhookRequest
from voxplorer_backend.services.twilio_service import TwilioService, forward_audio
from dotenv import load_dotenv
from voxplorer_backend.agent import route_planner
from voxplorer_backend.agent.ImageSummaryService import ImageSummaryService
from voxplorer_backend.agent import planner
import os
import asyncio
import websockets
from twilio.twiml.voice_response import VoiceResponse, Connect
from fastapi import WebSocketDisconnect
import json

load_dotenv()
import uvicorn
app = FastAPI()

app.include_router(route_planner.router)
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

@app.get('/api/booking-summary')
def get_booking_summary():
    booking_data = {
        "reference": "BK12345",
        "date": "March 15, 2024",
        "destination": "Paris, France",
        "duration": "7 Days",
        "notes": "Special dietary requirements: Vegetarian\nEarly check-in requested\nAirport transfer included"
    }
    return booking_data


@app.post("/api/image-summary")
async def image_summary(file: UploadFile = File(...)):
    try:
        file_location = f"/tmp/{file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())

        summary = ImageSummaryService.get_image_summary(file_location)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/calls/outbound")
async def initiate_outbound_call():
    try:
        return await twilio_service.initiate_call()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.api_route("/twilio/inbound_call", methods=["GET", "POST"])
async def handle_incoming_call(request: Request):
    """Handle incoming call and return TwiML response."""
    response = VoiceResponse()
    host = request.url.hostname
    connect = Connect()
    connect.stream(url=f"wss://{host}/media-stream-eleven")
    response.append(connect)
    return HTMLResponse(content=str(response), media_type="application/xml")

@app.websocket("/media-stream-eleven")
async def handle_media_stream(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established")

    try:
        agent_id = os.getenv("ELEVENLABS_AGENT_ID")
        api_key = os.getenv("ELEVENLABS_API_KEY")

        ws_url = (
            f"wss://api.elevenlabs.io/v1/convai/conversation"
            f"?agent_id={agent_id}"
            f"&input_format=ulaw_8000"
            f"&output_format=ulaw_8000"
        )

        headers = {
            "Content-Type": "application/json",
            "xi-api-key": api_key
        }

        print("Connecting to ElevenLabs...")
        async with websockets.connect(
            ws_url,
            extra_headers=headers,
            subprotocols=["convai"]
        ) as elevenlabs_ws:
            print("Connected to ElevenLabs successfully")

            # Send conversation initialization
            init_data = {
                "type": "conversation_initiation_client_data"
            }
            await elevenlabs_ws.send(json.dumps(init_data))

            # Start audio forwarding
            await asyncio.gather(
                forward_audio(websocket, elevenlabs_ws),
                forward_audio(elevenlabs_ws, websocket)
            )

    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"Error in stream handling: {str(e)}")
        print(f"Error type: {type(e)}")

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)