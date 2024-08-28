import React, { useEffect, useState } from 'react';
import './TrainTable.css';

const TrainTable = ({ routeName, trains }) => {
  const [trainDetails, setTrainDetails] = useState([]);

  const fetchTrainDetails = async () => {
    const details = await Promise.all(trains.map(async (train) => {
      try {
        const { TID } = train;
        const response = await fetch(`https://sltraintracking-64764a95d6f4.herokuapp.com/api/train-with-engines/tid/${TID}`);
        if (!response.ok) throw new Error(`Failed to fetch train with engine data for TID ${TID}`);
        const result = await response.json();
        
        const engineResponse = await fetch(`https://sltraintracking-64764a95d6f4.herokuapp.com/api/train-engines/${result.EID}/realtime`);
        if (!engineResponse.ok) throw new Error(`Failed to fetch real-time data for engine ID ${result.EID}`);
        const engineData = await engineResponse.json();

        return {
          ...train,
          ...engineData,
          startStation: engineData.startStation || 'N/A',
          startTime: engineData.startTime || 'N/A',
          endStation: engineData.endStation || 'N/A',
          estimatedEndTime: engineData.estimatedEndTime || 'N/A',
          currentStation: engineData.currentStation || 'N/A',
          nextStation: engineData.nextStation || 'N/A'
        };
      } catch (error) {
        console.error(`Error fetching details for train ${train.TID}:`, error);
        return {
          ...train,
          startStation: 'Error',
          startTime: 'Invalid Time',
          endStation: 'Error',
          estimatedEndTime: 'Invalid Time',
          currentStation: 'Error',
          nextStation: 'Error'
        };
      }
    }));
    setTrainDetails(details);
  };

  useEffect(() => {
    // Fetch train details initially
    fetchTrainDetails();

    // Set up an interval to fetch the details every 5 seconds
    const intervalId = setInterval(fetchTrainDetails, 60000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [trains]);

  return (
    <div className="train-table">
      <h2>{routeName}</h2>
      <table>
        <thead>
          <tr>
            <th>Train Name</th>
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
