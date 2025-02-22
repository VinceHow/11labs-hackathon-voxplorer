import os
import json
import asyncio
import websockets
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Connect
from typing import Dict, Any

class TwilioService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.phone_number = os.getenv("TWILIO_PHONE_NUMBER")
        self.client = Client(self.account_sid, self.auth_token)
        self.agent_id = os.getenv("ELEVENLABS_AGENT_ID")
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        self.target_number = "+447770052888"  # Fixed number
        
    async def initiate_call(self) -> Dict[str, Any]:
        # Create TwiML for the call
        response = VoiceResponse()
        connect = Connect()
        connect.stream(url=f"wss://{os.getenv('BASE_URL')}/stream")
        response.append(connect)
        
        # Initiate the call
        call = self.client.calls.create(
            to=self.target_number,
            from_=self.phone_number,
            twiml=str(response)
        )
        
        return {"call_sid": call.sid, "status": call.status}

    async def handle_stream(self, websocket):
        try:
            print("WebSocket connection initiated")
            # Initialize ElevenLabs websocket connection
            print("Attempting to connect to ElevenLabs...")
            async with websockets.connect(
                f"wss://api.elevenlabs.io/v1/agent/{self.agent_id}/call",
                extra_headers={
                    "xi-api-key": self.api_key,
                    "Content-Type": "application/json"
                }
            ) as elevenlabs_ws:
                print("Connected to ElevenLabs successfully")
                # Handle bidirectional audio streaming
                try:
                    await asyncio.gather(
                        self._forward_audio(websocket, elevenlabs_ws),
                        self._forward_audio(elevenlabs_ws, websocket)
                    )
                except Exception as e:
                    print(f"Error in audio forwarding: {str(e)}")
        except Exception as e:
            print(f"Error in stream handling: {str(e)}")
            print(f"Agent ID: {self.agent_id}")
            print(f"API Key present: {bool(self.api_key)}")

    async def _forward_audio(self, source, destination):
        try:
            async for message in source:
                await destination.send(message)
        except Exception as e:
            print(f"Error forwarding audio: {str(e)}") 