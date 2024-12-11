import React, { useState, useEffect } from 'react';
import './OldRecords.css';

const OldRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchOldRecords = async () => {
      try {
        const response = await fetch('https://sltraintracking-64764a95d6f4.herokuapp.com/api/old-records'); // Adjust the API endpoint
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching old records:', error);
      }
    };

    fetchOldRecords();
  }, []);

  return (
    <div className="old-records">
      <h1>Old Records</h1>
      {records.map((record) => (
        <div key={record._id} className="record-table">
          <h2>{new Date(record.timestamp).toISOString()}</h2> {/* Timestamp as table heading */}
          <table>
            <thead>
              <tr>
                <th>EID</th>
                <th>Direction</th>
                <th>Start Time</th>
                <th>Last Station Update</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{record.EID}</td>
                <td>{record.direction}</td>
                <td>{new Date(record.startTime).toISOString()}</td>
                <td>{new Date(record.lastStationUpdate).toISOString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default OldRecords;
