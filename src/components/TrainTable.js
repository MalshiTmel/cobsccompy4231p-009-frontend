import React, { useEffect, useState } from 'react';
import './TrainTable.css';

const TrainTable = ({ routeName, trains }) => {
  const [trainDetails, setTrainDetails] = useState([]);

  useEffect(() => {
    const fetchTrainDetails = async () => {
      const details = await Promise.all(trains.map(async (train) => {
        try {
          const { TID } = train;
          const response = await fetch(`http://localhost:5001/api/train-with-engines/tid/${TID}`);
          if (!response.ok) throw new Error(`Failed to fetch train with engine data for TID ${TID}`);
          const result = await response.json();
          
          const engineResponse = await fetch(`http://localhost:5001/api/train-engines/${result.EID}/realtime`);
          if (!engineResponse.ok) throw new Error(`Failed to fetch real-time data for engine ID ${result.EID}`);
          const engineData = await engineResponse.json();

          // Parse and format dates
          const startTime = new Date(engineData.startTime);
          const estimatedEndTime = new Date(engineData.estimatedEndTime);

          return {
            ...train,
            ...engineData,
            direction: engineData.direction || 'N/A',
            startStation: engineData.startStation || 'N/A',
            startTime: isNaN(startTime.getTime()) ? 'Invalid Date' : startTime.toLocaleTimeString(),
            endStation: engineData.endStation || 'N/A',
            estimatedEndTime: isNaN(estimatedEndTime.getTime()) ? 'Invalid Date' : estimatedEndTime.toLocaleTimeString(),
            currentStation: engineData.currentStation || 'N/A',
            nextStation: engineData.nextStation || 'N/A'
          };
        } catch (error) {
          console.error(`Error fetching details for train ${train.TID}:`, error);
          return {
            ...train,
            direction: 'Error',
            startStation: 'Error',
            startTime: 'Invalid Date',
            endStation: 'Error',
            estimatedEndTime: 'Invalid Date',
            currentStation: 'Error',
            nextStation: 'Error'
          };
        }
      }));
      setTrainDetails(details);
    };

    fetchTrainDetails();
  }, [trains]);

  return (
    <div className="train-table">
      <h2>{routeName}</h2>
      <table>
        <thead>
          <tr>
            <th>Train Name</th>
            <th>Direction</th>
            <th>Start Station</th>
            <th>Start Time</th>
            <th>Current Station</th>
            <th>Next Station</th>
            <th>End Station</th>
            <th>Estimated End Time</th>
          </tr>
        </thead>
        <tbody>
          {trainDetails.map(train => (
            <tr key={train.TID}>
              <td>{train.TName || 'N/A'}</td>
              <td>{train.direction}</td>
              <td>{train.startStation}</td>
              <td>{train.startTime}</td>
              <td>{train.currentStation}</td>
              <td>{train.nextStation}</td>
              <td>{train.endStation}</td>
              <td>{train.estimatedEndTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainTable;
