import React, { useState, useEffect } from 'react';
import './EngineAssignment.css';

const EngineAssignment = () => {
  const [trains, setTrains] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ TID: '', EID: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/train-with-engines');
        const data = await response.json();
        const trainDetails = await Promise.all(data.map(async (train) => {
          const trainResponse = await fetch(`http://localhost:5001/api/trains-without-engines/${train.TID}`);
          const trainData = await trainResponse.json();
          return {
            ...train,
            trainName: trainData.train_name,
          };
        }));
        setTrains(trainDetails);
      } catch (error) {
        console.error('Error fetching train data:', error);
      }
    };

    fetchTrains();
  }, []);

  const handleUnassign = async (TID) => {
    try {
      await fetch(`http://localhost:5001/api/train-with-engines/tid/${TID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ EID: 'unassigned' }),
      });
      setTrains(trains.map(train =>
        train.TID === TID ? { ...train, EID: 'unassigned' } : train
      ));
    } catch (error) {
      console.error('Error unassigning engine:', error);
    }
  };

  const handleAssign = async () => {
    setError('');
    try {
      // Check if engine is already assigned
      const response = await fetch(`http://localhost:5001/api/train-with-engines`);
      const existingAssignments = await response.json();
      const engineAlreadyAssigned = existingAssignments.some(
        assignment => assignment.EID === newAssignment.EID
      );

      if (engineAlreadyAssigned) {
        setError('Engine is already assigned to another train.');
        return;
      }

      // Check if train already has an engine assigned
      const trainHasEngine = trains.some(train => train.TID === newAssignment.TID && train.EID !== 'unassigned');
      if (trainHasEngine) {
        setError('Train already has an engine assigned.');
        return;
      }

      await fetch('http://localhost:5001/api/train-with-engines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssignment),
      });

      // Update local state
      setTrains([...trains, newAssignment]);
      setNewAssignment({ TID: '', EID: '' });
    } catch (error) {
      console.error('Error assigning engine:', error);
    }
  };

  return (
    <div className="engine-assignment">
      <h2>Currently Running Trains</h2>
      <table>
        <thead>
          <tr>
            <th>Full ID</th>
            <th>Train ID</th>
            <th>Train Name</th>
            <th>Engine ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trains.map(train => (
            <tr key={train.TID}>
              <td>{train._id}</td>
              <td>{train.TID}</td>
              <td>{train.trainName}</td>
              <td>{train.EID}</td>
              <td>
                <button onClick={() => handleUnassign(train.TID)}>Unassign</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="assignment-form">
        <h3>Assign New Engine</h3>
        <input
          type="text"
          placeholder="Train ID"
          value={newAssignment.TID}
          onChange={(e) => setNewAssignment({ ...newAssignment, TID: e.target.value })}
        />
        <input
          type="text"
          placeholder="Engine ID"
          value={newAssignment.EID}
          onChange={(e) => setNewAssignment({ ...newAssignment, EID: e.target.value })}
        />
        <button onClick={handleAssign}>Assign</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default EngineAssignment;
