import os
import asyncio
import httpx
from dotenv import load_dotenv

load_dotenv()

async def test_elevenlabs():
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not found in .env file")
        return
        
    base_url = "https://api.elevenlabs.io/v1"
    voice_id = "21m00Tcm4TlvDq8ikWAM"
    
    url = f"{base_url}/text-to-speech/{voice_id}"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                url,
                headers={"xi-api-key": api_key},
                json={
                    "text": "Welcome to London! This is a test.",
                    "model_id": "eleven_monolingual_v1",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.5
                    }
                }
            )
            
            if response.status_code != 200:
                print(f"Error: {response.text}")
                return
                
            with open("direct_test.mp3", "wb") as f:
                f.write(response.content)
            print("Audio saved as direct_test.mp3")
        except Exception as e:
            print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_elevenlabs())