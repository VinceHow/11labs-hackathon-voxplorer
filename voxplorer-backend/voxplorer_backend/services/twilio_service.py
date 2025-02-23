import os
import json
import asyncio
import websockets
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Connect
from typing import Dict, Any
from fastapi import WebSocket
from voxplorer_backend.services.twilio_audio_interface import TwilioAudioInterface
import base64

class TwilioService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.phone_number = os.getenv("TWILIO_PHONE_NUMBER")
        self.client = Client(self.account_sid, self.auth_token)
        self.target_number = "+447770052888"  # Fixed number
        
    async def initiate_call(self) -> Dict[str, Any]:
        response = VoiceResponse()
        connect = Connect()
        stream_url = f"wss://{os.getenv('BASE_URL')}/media-stream-eleven"
        print(f"Setting up stream URL: {stream_url}")
        connect.stream(url=stream_url)
        response.append(connect)
        
        print("Initiating Twilio call...")
        call = self.client.calls.create(
            to=self.target_number,
            from_=self.phone_number,
            twiml=str(response)
        )
        print(f"Call initiated with SID: {call.sid}")
        return {"call_sid": call.sid, "status": call.status}

    async def handle_stream(self, websocket):
        try:
            print("WebSocket connection initiated")
            print("Attempting to connect to ElevenLabs...")
            print(f"Using agent ID: {self.agent_id}")
            
            # Initialize TwilioAudioInterface
            audio_interface = TwilioAudioInterface(websocket)
            call_sid = None
            
            ws_url = (
                f"wss://api.elevenlabs.io/v1/convai/conversation"
                f"?agent_id={self.agent_id}"
                f"&input_format=ulaw_8000"
                f"&output_format=ulaw_8000"
            )
            
            headers = {
                "Content-Type": "application/json",
                "xi-api-key": self.api_key
            }
            
            print(f"Connecting to URL: {ws_url}")
            async with websockets.connect(
                ws_url,
                extra_headers=headers,
                subprotocols=["convai"]
            ) as elevenlabs_ws:
                print("Connected to ElevenLabs successfully")
                
                # Send conversation initialization
                init_data = {
                    "type": "conversation_initiation_client_data",
                    "conversation_config_override": {
                        "agent": {
                            "prompt": {
                                "prompt": "You are a helpful customer support agent named Alexis."
                            },
                            "first_message": "Hi, I'm Alexis from ElevenLabs support. How can I help you today?",
                            "language": "en"
                        },
                        "tts": {
                            "voice_id": "21m00Tcm4TlvDq8ikWAM"
                        }
                    }
                }
                await elevenlabs_ws.send(json.dumps(init_data))
                
                try:
                    # Start the audio interface
                    audio_interface.start(lambda audio: asyncio.run(elevenlabs_ws.send(audio)))
                    
                    # Create tasks for both directions
                    twilio_to_eleven = asyncio.create_task(self._handle_twilio_messages(websocket, audio_interface))
                    eleven_to_twilio = asyncio.create_task(self._handle_elevenlabs_messages(elevenlabs_ws, audio_interface))
                    
                    # Wait for either task to complete (2 minutes = 120 seconds)
                    await asyncio.wait(
                        [twilio_to_eleven, eleven_to_twilio],
                        timeout=120.0,
                        return_when=asyncio.FIRST_COMPLETED
                    )
                    
                except asyncio.TimeoutError:
                    print("Connection timed out after 2 minutes")
                except Exception as e:
                    print(f"Error in audio handling: {str(e)}")
                finally:
                    audio_interface.stop()
                    print("Audio interface stopped")
                    if call_sid:
                        try:
                            self.client.calls(call_sid).update(status="completed")
                            print(f"Successfully ended call {call_sid}")
                        except Exception as e:
                            print(f"Error ending call: {e}")
                
        except Exception as e:
            print(f"Error in stream handling: {str(e)}")

    async def _handle_twilio_messages(self, websocket, audio_interface):
        while True:
            message = await websocket.receive_text()
            data = json.loads(message)
            await audio_interface.handle_twilio_message(data)
            if data.get("event") == "stop":
                break

    async def _handle_elevenlabs_messages(self, elevenlabs_ws, audio_interface):
        try:
            while True:
                message = await elevenlabs_ws.recv()
                data = json.loads(message)
                
                # Handle different types of messages
                if data.get("type") == "audio":
                    if "audio" in data and "chunk" in data["audio"]:
                        audio_interface.output(base64.b64decode(data["audio"]["chunk"]))
                    elif "audio_event" in data and "audio_base_64" in data["audio_event"]:
                        audio_interface.output(base64.b64decode(data["audio_event"]["audio_base_64"]))
                elif data.get("type") == "message":
                    print(f"Agent message: {data.get('message', '')}")
        except websockets.exceptions.ConnectionClosed:
            print("ElevenLabs connection closed normally")
        except Exception as e:
            print(f"Error handling ElevenLabs messages: {e}")

async def forward_audio(source, destination):
    try:
        print(f"Starting audio forwarding from {type(source).__name__} to {type(destination).__name__}")
        message_count = 0
        while True:
            if isinstance(source, WebSocket):  # FastAPI WebSocket
                message = await source.receive_text()
                print(f"Received from Twilio (message {message_count}): {message[:100]}...")
            else:  # Regular websockets connection
                message = await source.recv()
                print(f"Received from ElevenLabs (message {message_count}): {message[:100]}...")
                
            if isinstance(message, str):
                try:
                    data = json.loads(message)
                    
                    # Handle Twilio -> ElevenLabs
                    if "event" in data:
                        if data["event"] == "media":
                            print(f"Forwarding media from Twilio to ElevenLabs (message {message_count})")
                            payload_size = len(data["media"]["payload"]) if "media" in data else 0
                            print(f"Media payload size: {payload_size} bytes")
                            
                            if isinstance(destination, WebSocket):
                                await destination.send_text(json.dumps({
                                    "user_audio_chunk": data["media"]["payload"]
                                }))
                            else:
                                await destination.send(json.dumps({
                                    "user_audio_chunk": data["media"]["payload"]
                                }))
                        elif data["event"] == "start":
                            print(f"Stream started - StreamSid: {data['start']['streamSid']}")
                    
                    # Handle ElevenLabs -> Twilio
                    elif "type" in data:
                        if data["type"] == "audio":
                            audio_chunk = None
                            if "audio" in data and "chunk" in data["audio"]:
                                audio_chunk = data["audio"]["chunk"]
                                print("Found audio chunk in data['audio']['chunk']")
                            elif "audio_event" in data and "audio_base_64" in data["audio_event"]:
                                audio_chunk = data["audio_event"]["audio_base_64"]
                                print("Found audio chunk in data['audio_event']['audio_base_64']")
                            
                            if audio_chunk:
                                print(f"Forwarding audio from ElevenLabs to Twilio (message {message_count})")
                                print(f"Audio chunk size: {len(audio_chunk)} bytes")
                                
                                if isinstance(destination, WebSocket):
                                    await destination.send_text(json.dumps({
                                        "event": "media",
                                        "media": {
                                            "payload": audio_chunk
                                        }
                                    }))
                                else:
                                    await destination.send(json.dumps({
                                        "event": "media",
                                        "media": {
                                            "payload": audio_chunk
                                        }
                                    }))
                            else:
                                print("Warning: Received audio message but no chunk found")
                                print(f"Full message structure: {json.dumps(data, indent=2)}")
                        elif data["type"] == "interruption":
                            print("Received interruption event")
                            if isinstance(destination, WebSocket):
                                await destination.send_text(json.dumps({
                                    "event": "clear"
                                }))
                            else:
                                await destination.send(json.dumps({
                                    "event": "clear"
                                }))
                        
                except json.JSONDecodeError as e:
                    print(f"JSON decode error: {str(e)}")
                    print("Received non-JSON message:", message[:100])
            else:
                print(f"Received non-string message of type: {type(message)}")
            
            message_count += 1
                
    except websockets.exceptions.ConnectionClosed:
        print("WebSocket connection closed")
    except Exception as e:
        print(f"Error in audio forwarding: {str(e)}")
        print(f"Error type: {type(e)}")
        if isinstance(message, str):
            print(f"Last message received: {message[:200]}")
