import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoGrid from './components/VideoGrid';
import VideoPage from './components/VideoPage';
import Login from './components/Login';
import { sampleVideos } from './data/videos';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredVideos, setFilteredVideos] = useState(sampleVideos);
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  useEffect(() => {
    let result = sampleVideos;

    // Filter by category
    if (activeFilter !== 'All') {
      result = result.filter(video => video.category === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.channelName.toLowerCase().includes(query)
      );
    }

    setFilteredVideos(result);
  }, [searchQuery, activeFilter]);

  // Listen for video selection from related videos sidebar
  useEffect(() => {
    const handleVideoSelected = (event) => {
      setSelectedVideo(event.detail);
    };
    
    window.addEventListener('videoSelected', handleVideoSelected);
    return () => window.removeEventListener('videoSelected', handleVideoSelected);
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

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleBackFromVideo = () => {
    setSelectedVideo(null);
  };

  if (showLogin) {
    return <Login onLogin={handleLogin} />;
  }

  if (selectedVideo) {
    return (
      <div className="app">
        <Header 
          toggleSidebar={toggleSidebar} 
          user={user}
          onSignIn={handleSignIn}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <VideoPage 
          video={selectedVideo} 
          onBack={handleBackFromVideo}
          user={user}
          allVideos={sampleVideos}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        toggleSidebar={toggleSidebar} 
        user={user}
        onSignIn={handleSignIn}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <VideoGrid videos={filteredVideos} searchQuery={searchQuery} onVideoClick={handleVideoClick} />
      </main>
    </div>
  );
}

export default App;
