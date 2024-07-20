import React from 'react';
import './App.css';
import TrainTable from './components/TrainTable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Train Tracking System</h1>
      </header>
      <div className="App-content">
        <TrainTable />
      </div>
    </div>
  );
}

export default App;