import React, { useState, useEffect } from 'react';
import TrainTable from './TrainTable';
import './TrainRoutes.css';

const routes = [
  { id: 'r01', name: 'Kandy Line' },
  { id: 'r02', name: 'Main Line' },
  { id: 'r03', name: 'Matara Line' },
  { id: 'r04', name: 'Coastal Line' },
  { id: 'r05', name: 'Galle Line' },
  { id: 'r06', name: 'Batticaloa Line' },
  { id: 'r07', name: 'Trincomalee Line' },
  { id: 'r08', name: 'Northern Line' },
  { id: 'r09', name: 'Vavuniya Line' },

];

const TrainRoutes = () => {
  const [trainData, setTrainData] = useState({});

  useEffect(() => {
    const fetchTrainData = async () => {
      const data = {};
      for (const route of routes) {
        try {
          const response = await fetch(`http://localhost:5001/api/trains-without-engines/route/${route.id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data for route ${route.id}`);
          }
          const result = await response.json();

          // Ensure result is an array
          data[route.id] = Array.isArray(result) ? result : [];
        } catch (error) {
          console.error(`Error fetching data for route ${route.id}:`, error);
          data[route.id] = []; // Fallback to empty array on error
        }
      }
      setTrainData(data);
    };

    fetchTrainData();
  }, []);

  return (
    <div className="train-routes">
      {routes.map(route => (
        <TrainTable
          key={route.id}
          routeName={route.name}
          trains={trainData[route.id] || []} // Ensure trains is an array
        />
      ))}
    </div>
  );
};

export default TrainRoutes;
