import { useState } from "react";
import { ChevronDown, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Schedule {
  time: string;
  activity: string;
  location?: string;
}

interface DayPlan {
  day: number;
  date: string;
  schedules: Schedule[];
}

interface TravelPlanProps {
  plans: DayPlan[];
}

const TravelPlan = ({ plans }: TravelPlanProps) => {
  const [expandedDays, setExpandedDays] = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleDay = (dayNumber: number) => {
    setExpandedDays(prev => 
      prev.includes(dayNumber)
        ? prev.filter(d => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  const handleScheduleClick = (dayNumber: number, scheduleIndex: number) => {
    navigate(`/schedule/${dayNumber}/${scheduleIndex}`);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-primary" />
        Travel Itinerary
      </h2>
      
      <div className="space-y-2">
        {plans.map((plan) => (
          <div key={plan.day} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleDay(plan.day)}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">Day {plan.day}</span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-600">{plan.date}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  expandedDays.includes(plan.day) ? 'rotate-180' : ''
                }`}
              />
            </div>
            
            <div
              className={`transition-all duration-300 ${
                expandedDays.includes(plan.day)
                  ? 'max-h-[500px] opacity-100'
                  : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="p-4 bg-gray-50 space-y-3">
                {plan.schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-2 bg-white rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleScheduleClick(plan.day, index)}
                  >
                    <Clock className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <div className="font-medium">{schedule.time}</div>
                      <div className="text-gray-600">{schedule.activity}</div>
                      {schedule.location && (
                        <div className="text-gray-500 text-sm">{schedule.location}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelPlan; 