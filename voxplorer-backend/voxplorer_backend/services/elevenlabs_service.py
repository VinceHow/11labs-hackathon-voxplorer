import os
import httpx
from typing import Optional

class ElevenLabsService:
    def __init__(self):
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        self.base_url = "https://api.elevenlabs.io/v1"
        
    async def convert_text_to_speech(self, text: str, voice_id: Optional[str] = None) -> bytes:
        if not voice_id:
            voice_id = "21m00Tcm4TlvDq8ikWAM"  # Default voice ID
            
        url = f"{self.base_url}/text-to-speech/{voice_id}"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers={"xi-api-key": self.api_key},
                json={
                    "text": text,
                    "model_id": "eleven_monolingual_v1",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.5
                    }
                }
            )
            
            if response.status_code != 200:
                raise Exception(f"ElevenLabs API error: {response.text}")
                
            return response.content