import os
import httpx
import json
from typing import Optional, Dict, Any
from datetime import datetime

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

    async def get_conversation_history(self, conversation_id: str) -> Dict[str, Any]:
        """
        Fetch conversation history from ElevenLabs API and save it to a JSON file
        """
        url = f"{self.base_url}/convai/conversations/{conversation_id}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers={"xi-api-key": self.api_key}
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to fetch conversation history: {response.text}")
            
            conversation_data = response.json()
            
            # Create a timestamp for the filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"transcripts/CA{conversation_id}_{timestamp}.json"
            
            # Ensure the transcripts directory exists
            os.makedirs("transcripts", exist_ok=True)
            
            # Save the conversation data to a JSON file
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(conversation_data, f, indent=2, ensure_ascii=False)
            
            return conversation_data