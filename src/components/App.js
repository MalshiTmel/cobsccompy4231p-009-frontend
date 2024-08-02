import React from 'react';
import TrainRoutes from './TrainRoutes';
import './App.css'; // Added custom CSS for App component

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Train Routes Overview</h1>
      </header>
      <TrainRoutes />
    </div>
  );
};

export default App;
