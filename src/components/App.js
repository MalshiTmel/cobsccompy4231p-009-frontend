import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TrainRoutes from './User/TrainRoutes';
import Login from './Admin/Login'; // Adjusted the path
import AdminDashboard from './Admin/AdminDashboard'; // Adjusted the path
import OldRecords from './Admin/OldRecords'; // Import OldRecords component
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/admin" 
            element={isAuthenticated ? <AdminDashboard /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/admin/old-records" 
            element={isAuthenticated ? <OldRecords /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/" 
            element={
              <>
                <h1>Train Tracking System</h1>
                <TrainRoutes />
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
