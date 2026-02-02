import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoGrid from './components/VideoGrid';
import VideoPage from './components/VideoPage';
import ChannelPage from './components/ChannelPage';
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
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [allVideosState, setAllVideosState] = useState(sampleVideos);

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
    
    // Load all videos from localStorage if available
    const storedVideos = localStorage.getItem('allVideos');
    if (storedVideos) {
      setAllVideosState(JSON.parse(storedVideos));
    }
  }, []);

  useEffect(() => {
    let result = allVideosState;

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
  }, [searchQuery, activeFilter, allVideosState]);

  // Listen for events
  useEffect(() => {
    const handleVideoSelected = (event) => {
      setSelectedVideo(event.detail);
    };
    
    const handleOpenMyChannel = () => {
      if (!user) {
        setShowLogin(true);
        return;
      }
      
      const userChannels = JSON.parse(localStorage.getItem(`channels_${user.userId}`)) || [];
      
      if (userChannels.length === 0) {
        setSelectedChannel(null);
      } else {
        setSelectedChannel(userChannels[0]);
      }
    };

    const handleShowLogin = () => {
      setShowLogin(true);
    };

    const handleCreateChannel = () => {
      if (!user) {
        setShowLogin(true);
        return;
      }
      
      // Open create channel page (null channel shows create form)
      setSelectedChannel(null);
    };

    const handleGoHome = () => {
      // Go back to homepage - reset all views
      setSelectedVideo(null);
      setSelectedChannel(null);
    };
    
    window.addEventListener('videoSelected', handleVideoSelected);
    window.addEventListener('openMyChannel', handleOpenMyChannel);
    window.addEventListener('showLogin', handleShowLogin);
    window.addEventListener('createChannel', handleCreateChannel);
    window.addEventListener('goHome', handleGoHome);
    
    return () => {
      window.removeEventListener('videoSelected', handleVideoSelected);
      window.removeEventListener('openMyChannel', handleOpenMyChannel);
      window.removeEventListener('showLogin', handleShowLogin);
      window.removeEventListener('createChannel', handleCreateChannel);
      window.removeEventListener('goHome', handleGoHome);
    };
  }, [user]);

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
    setSelectedChannel(null);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleBackFromVideo = () => {
    setSelectedVideo(null);
  };

  const handleBackFromChannel = () => {
    setSelectedChannel(null);
  };

  const handleUpdateVideo = (updatedVideo) => {
    setAllVideosState(prev => {
      const updated = prev.map(v => 
        v.videoId === updatedVideo.videoId ? updatedVideo : v
      );
      localStorage.setItem('allVideos', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteVideo = (videoId) => {
    setAllVideosState(prev => {
      const updated = prev.filter(v => v.videoId !== videoId);
      localStorage.setItem('allVideos', JSON.stringify(updated));
      return updated;
    });
    
    localStorage.removeItem(`comments_${videoId}`);
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
          allVideos={allVideosState}
        />
      </div>
    );
  }

  if (selectedChannel !== null || (user && selectedChannel === null)) {
    const userChannels = user ? JSON.parse(localStorage.getItem(`channels_${user.userId}`)) || [] : [];
    
    if (user && userChannels.length > 0 && selectedChannel === null) {
      setSelectedChannel(userChannels[0]);
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
          user={user}
        />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <ChannelPage 
            user={user}
            channel={selectedChannel}
            onBack={handleBackFromChannel}
            allVideos={allVideosState}
            onUpdateVideo={handleUpdateVideo}
            onDeleteVideo={handleDeleteVideo}
          />
        </main>
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
        user={user}
      />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <VideoGrid 
          videos={filteredVideos} 
          searchQuery={searchQuery} 
          onVideoClick={handleVideoClick} 
        />
      </main>
    </div>
  );
}

export default App;

