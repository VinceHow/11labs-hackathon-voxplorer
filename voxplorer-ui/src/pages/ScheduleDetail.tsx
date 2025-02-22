import { useParams } from 'react-router-dom';

const ScheduleDetail = () => {
  const { day, scheduleIndex } = useParams();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Schedule Detail</h1>
      <p>Day: {day}</p>
      <p>Schedule Index: {scheduleIndex}</p>
    </div>
  );
};

export default ScheduleDetail; 