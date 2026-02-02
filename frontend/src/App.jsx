import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoGrid from './components/VideoGrid';
import Login from './components/Login';
import { sampleVideos } from './data/videos';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSignIn = () => {
    setShowLogin(true);
  };

  const handleLogin = () => {
    setShowLogin(false);
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (showLogin) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Header 
        toggleSidebar={toggleSidebar} 
        user={user}
        onSignIn={handleSignIn}
        onLogout={handleLogout}
      />
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <VideoGrid videos={sampleVideos} />
      </main>
    </div>
  );
}

export default App;

