import os
import asyncio
import websockets
from dotenv import load_dotenv
import json
import httpx

load_dotenv()

async def test_elevenlabs_websocket():
    # 1. Verify environment variables
    api_key = os.getenv("ELEVENLABS_API_KEY")
    agent_id = os.getenv("ELEVENLABS_AGENT_ID")
    
    print("\n=== Environment Variables ===")
    print(f"API Key (first 4 chars): {api_key[:4] if api_key else 'None'}")
    print(f"Agent ID (first 4 chars): {agent_id[:4] if agent_id else 'None'}")
    
    if not api_key or not agent_id:
        print("Error: Missing required environment variables")
        return
    
    # 2. Test basic API connectivity first
    print("\n=== Testing Basic API Connection ===")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                "https://api.elevenlabs.io/v1/voices",
                headers={"xi-api-key": api_key}
            )
            print(f"Basic API test status code: {response.status_code}")
            if response.status_code != 200:
                print(f"API Error: {response.text}")
                return
        except Exception as e:
            print(f"Basic API test failed: {str(e)}")
            return
    
    # 3. Test WebSocket connection
    print("\n=== Testing WebSocket Connection ===")
    ws_url = (
        f"https://api.elevenlabs.io/v1/agent/{agent_id}/call"
        f"?xi-api-key={api_key}"
    )
    
    print(f"Attempting WebSocket connection to: {ws_url[:60]}...")
    
    try:
        async with websockets.connect(
            ws_url,
            extra_headers={
                "Content-Type": "application/json",
                "xi-api-key": api_key
            }
        ) as websocket:
            print("WebSocket connected successfully!")
            print("Sending test message...")
            await websocket.send(json.dumps({
                "text": "Test connection"
            }))
            print("Waiting for response...")
            response = await websocket.recv()
            print(f"Received response: {response[:100]}...")
    except Exception as e:
        print("\n=== Connection Error Details ===")
        print(f"Error type: {type(e)}")
        print(f"Error message: {str(e)}")

if __name__ == "__main__":
    # Run only this test
    asyncio.run(test_elevenlabs_websocket()) 