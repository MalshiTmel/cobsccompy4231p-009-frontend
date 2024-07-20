import React, { useState, useEffect } from 'react';
import './TrainTable.css';

const TrainTable = () => {
  const [trainData, setTrainData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from backend API here
    // For now, we'll just simulate with a timeout
    setTimeout(() => {
      setTrainData([]); // Empty array as no data is available
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="table-container">
      <h2>Train Schedule</h2>
      {loading ? (
        <p>Loading...</p>
      ) : trainData.length === 0 ? (
        <p>No data available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Train</th>
              <th>Status</th>
              <th>Departure</th>
              <th>Arrival</th>
            </tr>
          </thead>
          <tbody>
            {trainData.map((train) => (
              <tr key={train.id}>
                <td>{train.train}</td>
                <td>{train.status}</td>
                <td>{train.departure}</td>
                <td>{train.arrival}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainTable;