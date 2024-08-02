import React from 'react';
import './TrainTable.css';

const TrainTable = ({ trains }) => {
  return (
    <table className="TrainTable">
      <thead>
        <tr>
          <th>Train Name</th>
          <th>Status</th>
          <th>Start Time</th>
          <th>Current Location</th>
          <th>Next Stop</th>
          <th>End Time</th>
        </tr>
      </thead>
      <tbody>
        {trains.length > 0 ? (
          trains.map((train, index) => (
            <tr key={index}>
              <td>{train.train_name || 'No name'}</td>
              <td>{train.status || 'No status'}</td>
              <td>{train.start_time ? new Date(train.start_time).toLocaleString() : 'No start time'}</td>
              <td>{train.current_location || 'No current location'}</td>
              <td>{train.next_stop || 'No next stop'}</td>
              <td>{train.estimated_end_time ? new Date(train.estimated_end_time).toLocaleString() : 'No end time'}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">No trains available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TrainTable;
