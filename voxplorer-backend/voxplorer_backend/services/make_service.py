import os
import httpx
from typing import Dict, Any

class MakeService:
    def __init__(self):
        self.webhook_url = os.getenv("MAKE_WEBHOOK_URL")
        
    async def trigger_workflow(self, data: Dict[str, Any]) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.webhook_url,
                json=data
            )
            return response.json()
            
    async def handle_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        # Process incoming webhooks from Make.com
        event_type = webhook_data.get("event_type")
        data = webhook_data.get("data", {})
        
        # Add your webhook handling logic here
        return {"status": "processed", "event_type": event_type} 