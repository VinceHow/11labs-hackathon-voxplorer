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
from pydantic import BaseModel
from datetime import datetime
from fastapi import Form

load_dotenv()
import uvicorn

app = FastAPI()
booking_storage = {}
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
        return {"message": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat_message(message: str = Form(...)):
    try:
        # Process the chat message here
        res = ImageSummaryService.generate_text_reply(message)
        response = {
            "timestamp": datetime.now().isoformat(),
            "message": res,
            "status": "received"
        }
        return response
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
    connection_id = id(websocket)
    print(f"Connection ID: {connection_id}")

    # Add heartbeat task
    async def heartbeat():
        while True:
            try:
                await asyncio.sleep(20)  # Send heartbeat every 20 seconds
                await websocket.send_text(json.dumps({"event": "heartbeat"}))
            except Exception as e:
                print(f"Heartbeat error: {e}")
                break

    try:
        agent_id = os.getenv("ELEVENLABS_AGENT_ID")
        api_key = os.getenv("ELEVENLABS_API_KEY")
        print(f"Using agent ID: {agent_id[:8]}... (truncated)")

        ws_url = (
            f"wss://api.elevenlabs.io/v1/convai/conversation"
            f"?agent_id={agent_id}"
            f"&input_format=ulaw_8000"
            f"&output_format=ulaw_8000"
        )
        print(f"Connecting to ElevenLabs at: {ws_url}")

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
            print(f"Connected to ElevenLabs successfully (Connection ID: {connection_id})")

            # Send conversation initialization
            init_data = {
                "type": "conversation_initiation_client_data"
            }
            print("Sending initialization data to ElevenLabs")
            await elevenlabs_ws.send(json.dumps(init_data))
            print("Initialization data sent")

            # Track stream SID
            stream_sid = None

            async def forward_twilio_to_elevenlabs():
                nonlocal stream_sid
                while True:
                    try:
                        message = await websocket.receive_text()
                        data = json.loads(message)

                        if data["event"] == "start":
                            stream_sid = data["start"]["streamSid"]
                            print(f"Stream started with SID: {stream_sid}")
                        elif data["event"] == "media" and "media" in data:
                            # Forward audio to ElevenLabs
                            await elevenlabs_ws.send(json.dumps({
                                "user_audio_chunk": data["media"]["payload"]
                            }))
                    except Exception as e:
                        print(f"Error in Twilio->ElevenLabs forwarding: {e}")
                        break

            async def forward_elevenlabs_to_twilio():
                while True:
                    try:
                        message = await elevenlabs_ws.recv()
                        data = json.loads(message)

                        if data["type"] == "audio":
                            if not stream_sid:
                                print("Warning: No stream_sid available")
                                continue

                            audio_chunk = None
                            if "audio" in data and "chunk" in data["audio"]:
                                audio_chunk = data["audio"]["chunk"]
                            elif "audio_event" in data and "audio_base_64" in data["audio_event"]:
                                audio_chunk = data["audio_event"]["audio_base_64"]

                            if audio_chunk:
                                # Send properly formatted message to Twilio
                                twilio_message = {
                                    "event": "media",
                                    "streamSid": stream_sid,
                                    "media": {
                                        "payload": audio_chunk
                                    }
                                }
                                print(f"Sending audio to Twilio, chunk size: {len(audio_chunk)}")
                                await websocket.send_text(json.dumps(twilio_message))
                    except Exception as e:
                        print(f"Error in ElevenLabs->Twilio forwarding: {e}")
                        break

            print(f"Starting audio forwarding for connection {connection_id}")
            # Add heartbeat to the gather
            await asyncio.gather(
                heartbeat(),
                forward_twilio_to_elevenlabs(),
                forward_elevenlabs_to_twilio()
            )

    except WebSocketDisconnect:
        print(f"WebSocket disconnected (Connection ID: {connection_id})")
    except Exception as e:
        print(f"Error in stream handling: {str(e)}")
        print(f"Error type: {type(e)}")


class BookingRequest(BaseModel):
    time: str
    location: str
    additional_details: str


@app.post("/api/bookings")
async def create_booking(request: BookingRequest):
    try:
        # Here you would typically save to a database
        booking_id = "BK" + datetime.now().strftime("%Y%m%d%H%M")
        booking_details = {
            "time": request.time,
            "location": request.location,
            "additional_details": request.additional_details,
        }
        booking_storage[booking_id] = booking_details
        return booking_details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/bookings")
async def get_new_bookings():
    try:
        return booking_storage
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)
