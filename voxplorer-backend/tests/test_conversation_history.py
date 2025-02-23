import os
import asyncio
from dotenv import load_dotenv
from voxplorer_backend.services.elevenlabs_service import ElevenLabsService

load_dotenv()

async def test_conversation_history():
    print("\n=== Testing Conversation History Fetch ===")
    
    # Initialize ElevenLabs service
    elevenlabs_service = ElevenLabsService()
    
    # Test conversation ID
    conversation_id = "FV95HB0I102G9UyRFwvh"
    
    try:
        # Fetch conversation history
        conversation_data = await elevenlabs_service.get_conversation_history(conversation_id)
        
        # Print relevant information
        print(f"\nConversation ID: {conversation_id}")
        print("\nConversation Details:")
        print(f"Agent ID: {conversation_data.get('agent_id')}")
        print(f"Status: {conversation_data.get('status')}")
        
        # Print transcript if available
        if 'transcript' in conversation_data:
            print("\nTranscript:")
            for turn in conversation_data['transcript']:
                role = turn.get('role', 'unknown')
                message = turn.get('message', 'No message')
                time = turn.get('time_in_call_secs', 0)
                print(f"\n[{time}s] {role}: {message}")
                
    except Exception as e:
        print(f"\nError fetching conversation history: {e}")
        print(f"Error type: {type(e)}")

if __name__ == "__main__":
    asyncio.run(test_conversation_history()) 