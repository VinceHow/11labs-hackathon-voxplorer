from datetime import datetime, timedelta

def get_all_plan(user:str="Demo"):
    travel_plans = [
        {
            "day": 1,
            "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
            "schedules": [
                {
                    "time": "09:00 AM",
                    "activity": "Land at Kansai Airport",
                    "location": "123 Beach Road"
                },
                {
                    "time": "11:00 AM",
                    "activity": "Check-in at Hotel Gion",
                    "location": "Downtown Area"
                },
                {
                    "time": "02:00 PM",
                    "activity": "Lunch at Ichiban Curry",
                    "location": "Harbor View Restaurant"
                }
            ]
        },
        {
            "day": 2,
            "date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
            "schedules": [
                {
                    "time": "10:00 AM",
                    "activity": "Museum Visit",
                    "location": "National History Museum"
                },
                {
                    "time": "03:00 PM",
                    "activity": "Beach Activities",
                    "location": "Sunset Beach"
                }
            ]
        }
    ]

    return travel_plans