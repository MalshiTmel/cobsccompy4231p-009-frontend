import React, { useState, useEffect } from 'react';
import TrainRoutes from '../TrainRoutes';
import './AdminDashboard.css';
import './EngineAssignment.css';

const AdminDashboard = () => {
  const [runningTrains, setRunningTrains] = useState([]);
  const [trainIDToUnassign, setTrainIDToUnassign] = useState('');
  const [newTrainID, setNewTrainID] = useState('');
  const [newEngineID, setNewEngineID] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRunningTrains = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/train-with-engines');
        const data = await response.json();

        const trainDetails = await Promise.all(
          data.map(async (train) => {
            const trainResponse = await fetch(`http://localhost:5001/api/trains-without-engines/${train.TID}`);
            const trainData = await trainResponse.json();
            return {
              ...train,
              trainName: trainData.train_name,
            };
          })
        );

        setRunningTrains(trainDetails);
      } catch (error) {
        console.error('Error fetching running trains:', error);
      }
    };

    fetchRunningTrains();
  }, []);

  const handleUnassign = async (trainID) => {
    try {
        await fetch(`http://localhost:5001/api/train-with-engines/unassign/${trainID}`, {
            method: 'PATCH', // Use PATCH for partial updates
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ EID: 'unassigned' }), // Send only the fields that need updating
        });

        setRunningTrains((prevTrains) =>
            prevTrains.map((train) =>
                train.TID === trainID ? { ...train, EID: 'unassigned' } : train
            )
        );
    } catch (error) {
        console.error('Error unassigning engine:', error);
    }
};

  

const handleAssign = async () => {
    try {
      // Check for engine assignment conflicts
      const response = await fetch('http://localhost:5001/api/train-with-engines');
      const data = await response.json();
      const engines = data.map((item) => item.EID);
      if (engines.includes(newEngineID)) {
        setError('Engine is already assigned to another train.');
        return;
      }
  
      // Update existing TrainWithEngine record
      await fetch(`http://localhost:5001/api/train-with-engines/${newTrainID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ EID: newEngineID }),
      });
  
      setRunningTrains((prevTrains) =>
        prevTrains.map((train) =>
          train.TID === newTrainID ? { ...train, EID: newEngineID } : train
        )
      );
  
      setNewTrainID('');
      setNewEngineID('');
      setError('');
    } catch (error) {
      console.error('Error assigning engine:', error);
    }
  };
  
  

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-content">
        <div className="train-routes-section">
          <TrainRoutes />
        </div>
        <div className="engine-assignment-section">
          <h2>Engine Assignment</h2>
          <table className="running-trains-table">
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
              {runningTrains.map((train) => (
                <tr key={train._id}>
                  <td>{train._id}</td>
                  <td>{train.TID}</td>
                  <td>{train.trainName}</td>
                  <td>{train.EID}</td>
                  <td>
                    {train.EID !== 'unassigned' && (
                      <button onClick={() => handleUnassign(train.TID)}>Unassign</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="engine-assign-section">
            <h3>Assign Engine</h3>
            <input
              type="text"
              placeholder="Train ID"
              value={newTrainID}
              onChange={(e) => setNewTrainID(e.target.value)}
            />
            <input
              type="text"
              placeholder="Engine ID"
              value={newEngineID}
              onChange={(e) => setNewEngineID(e.target.value)}
            />
            <button onClick={handleAssign}>Assign</button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
