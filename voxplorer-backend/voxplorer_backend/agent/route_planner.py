from fastapi import APIRouter, HTTPException
import os
from googlemaps import Client, directions
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

gmaps = Client(key=os.environ.get('GOOGLE_MAPS_API_KEY'))

@router.get("/api/route/{day}/{schedule_index}")
async def get_route(day: int, schedule_index: int) -> Dict[str, Any]:
    # Replace with your actual locations
    waypoints = [
        "Times Square, New York",
        "Central Park, New York",
        "Empire State Building, New York"
    ]

    try:
        directions = gmaps.directions(
            origin=waypoints[0],
            destination=waypoints[-1],
            waypoints=waypoints[1:-1],
            optimize_waypoints=True,
            mode="driving"
        )
        return {
            'status': 'success',
            'route': directions
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )