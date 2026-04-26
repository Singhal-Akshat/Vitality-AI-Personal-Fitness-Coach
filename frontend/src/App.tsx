import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ActivityLog from './pages/ActivityLog';
import Advice from './pages/Advice';
import Trends from './pages/Trends';
import Login from './pages/Login';
import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Scrub the demo key if it matches exactly
    const currentKey = localStorage.getItem('ai_api_key');
    if (currentKey === 'AQ.Ab8RN6IfJLdGC57lcuJMxmMuN7Fbx7YCyCkbYhchYnBB-jftxA') {
      localStorage.removeItem('ai_api_key');
    }

    const auth = localStorage.getItem('isAuthenticated') === 'true';
    if (auth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      {isAuthenticated ? (
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="logs" element={<ActivityLog />} />
              <Route path="advice" element={<Advice />} />
              <Route path="trends" element={<Trends />} />
            </Route>
          </Routes>
        </Router>
      ) : (
        <Router>
          <Routes>
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
