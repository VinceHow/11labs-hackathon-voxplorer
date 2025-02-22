from pydantic import BaseModel
from typing import Optional, Dict, Any

class TextToSpeechRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None

class WebhookRequest(BaseModel):
    event_type: str
    data: Dict[str, Any] 