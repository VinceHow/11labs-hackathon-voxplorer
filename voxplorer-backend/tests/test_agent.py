import os
import asyncio
import websockets
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

async def test_agent_connection():
    api_key = os.getenv("ELEVENLABS_API_KEY")
    agent_id = os.getenv("ELEVENLABS_AGENT_ID")
    
    print("\n=== Testing Agent Access ===")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"https://api.elevenlabs.io/v1/convai/agents/{agent_id}",
                headers={"xi-api-key": api_key}
            )
            print(f"Agent access test status: {response.status_code}")
            agent_data = response.json()
            print(f"Agent name: {agent_data.get('name')}")
        except Exception as e:
            print(f"Agent access test failed: {e}")
            return
    
    print("\n=== Testing WebSocket Connection ===")
    ws_url = (
        f"wss://api.elevenlabs.io/v1/convai/conversation"
        f"?agent_id={agent_id}"
        f"&input_format=ulaw_8000"
        f"&output_format=ulaw_8000"
    )
    
    headers = {
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }
    
    try:
        async with websockets.connect(
            ws_url,
            extra_headers=headers,
            subprotocols=["convai"]
        ) as websocket:
            print("Connected successfully!")
            
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
                },
                "custom_llm_extra_body": {
                    "temperature": 0.7,
                    "max_tokens": 150
                }
            }
            await websocket.send(json.dumps(init_data))
            print("Sent initialization data")
            
            # Wait for response
            response = await websocket.recv()
            print(f"Received: {response}")
            
            # Keep connection alive for testing
            await asyncio.sleep(5)
            
    except Exception as e:
        print(f"WebSocket connection failed: {e}")
        print(f"Error type: {type(e)}")

if __name__ == "__main__":
    asyncio.run(test_agent_connection()) 