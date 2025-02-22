import os
import httpx
from typing import Dict, Any, Optional

class GoogleService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        self.base_url = "https://maps.googleapis.com/maps/api"
        
    async def get_place_id(self, location: str) -> Dict[str, Any]:
        url = f"{self.base_url}/place/findplacefromtext/json"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                params={
                    "input": location,
                    "inputtype": "textquery",
                    "fields": "place_id,formatted_address,name",
                    "key": self.api_key
                }
            )
            
            if response.status_code != 200:
                raise Exception(f"Google Places API error: {response.text}")
                
            data = response.json()
            if not data.get("candidates"):
                return {"error": "No places found"}
                
            return {
                "place_id": data["candidates"][0]["place_id"],
                "name": data["candidates"][0].get("name"),
                "formatted_address": data["candidates"][0].get("formatted_address")
            } 