import os
import asyncio
import websockets
from dotenv import load_dotenv

load_dotenv()

async def test_elevenlabs_websocket():
    api_key = os.getenv("ELEVENLABS_API_KEY")
    agent_id = os.getenv("ELEVENLABS_AGENT_ID")
    
    if not api_key or not agent_id:
        print("Error: Missing required environment variables")
        return
        
    ws_url = (
        f"wss://api.elevenlabs.io/v1/agent/{agent_id}/call"
        f"?xi-api-key={api_key}"
        f"&input_format=mulaw"
        f"&output_format=mulaw"
        f"&sample_rate=8000"
    )
    
    print(f"Testing connection to: {ws_url}")
    
    try:
        async with websockets.connect(
            ws_url,
            extra_headers={"Content-Type": "application/json"}
        ) as websocket:
            print("Successfully connected!")
            await asyncio.sleep(2)  # Keep connection open briefly
    except Exception as e:
        print(f"Connection failed: {str(e)}")
        print(f"Error type: {type(e)}")

if __name__ == "__main__":
    asyncio.run(test_elevenlabs_websocket()) 