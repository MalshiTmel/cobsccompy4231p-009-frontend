import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrainTable from './TrainTable';
import './TrainRoutes.css';

const TrainRoutes = () => {
  const [trainData, setTrainData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5001/api/trains')
      .then(response => {
        console.log("Fetched train data:", response.data);
        setTrainData(removeDuplicates(response.data));
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching train data:", error);
        setLoading(false);
      });
  }, []);

  const removeDuplicates = (arr) => {
    const seen = new Set();
    return arr.filter(item => {
      const key = `${item.train_name}-${item.route_name}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  const filterTrainsByRoute = (route) => {
    return trainData.filter(train => train.route_name === route);
  };

  if (loading) return <div className="loading">Loading data...</div>;

  return (
    <div className="TrainRoutes">
      <h2>Main Line</h2>
      <TrainTable trains={filterTrainsByRoute('Main Line')} />
      
      <h2>Coastal Line</h2>
      <TrainTable trains={filterTrainsByRoute('Coastal Line')} />
      
      <h2>Northern Line</h2>
      <TrainTable trains={filterTrainsByRoute('Northern Line')} />
      
      <h2>Upcountry Line</h2>
      <TrainTable trains={filterTrainsByRoute('Upcountry Line')} />
      
      <h2>Batticaloa Line</h2>
      <TrainTable trains={filterTrainsByRoute('Batticaloa Line')} />
    </div>
  );
};

export default TrainRoutes;
