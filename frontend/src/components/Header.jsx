import { useState } from 'react';
import './Header.css';

function Header({ toggleSidebar, user, onSignIn, onLogout, searchQuery, setSearchQuery }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChannelCreate, setShowChannelCreate] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    // Force full page reload to go to homepage
    window.location.reload();
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const newChannel = {
      channelId: `channel_${user.userId}_${Date.now()}`,
      name: newChannelName.trim(),
      description: newChannelDescription.trim(),
      ownerId: user.userId,
      createdAt: new Date().toISOString(),
      subscriberCount: 0
    };

    // Save channel to localStorage
    const userChannels = JSON.parse(localStorage.getItem(`channels_${user.userId}`)) || [];
    userChannels.push(newChannel);
    localStorage.setItem(`channels_${user.userId}`, JSON.stringify(userChannels));

    // Update user's channel list
    const updatedUser = { ...user, channels: [...(user.channels || []), newChannel.channelId] };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('token', 'logged_in');

    setShowChannelCreate(false);
    setNewChannelName('');
    setNewChannelDescription('');
    
    // Force full page reload
    window.location.reload();
  };

  const handleMyChannel = () => {
    setShowProfileMenu(false);
    const event = new CustomEvent('openMyChannel');
    window.dispatchEvent(event);
  };

  const hasChannel = user?.channels?.length > 0;

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={toggleSidebar}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
        <button className="logo-button" onClick={handleLogoClick}>
          <svg viewBox="0 0 90 20" width="90" height="20">
            <path fill="#FF0000" d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" />
            <path fill="#FFFFFF" d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" />
          </svg>
          <span className="logo-text">YouTube</span>
        </button>
      </div>

      <div className="header-center">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </form>
      </div>

      <div className="header-right">
        <button className="icon-button">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6m1-1v3.83L22 7v8l-4-1.83V19H2V5h16z" />
          </svg>
        </button>
        <button className="icon-button">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
          </svg>
        </button>

        {user ? (
          <div className="profile-container">
            <button 
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                {user.username.charAt(0)}
              </div>
            </button>

            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-avatar-large">
                    {user.username.charAt(0)}
                  </div>
                  <div className="profile-info">
                    <h4>{user.username}</h4>
                    <p>@{user.username.toLowerCase()}</p>
                  </div>
                </div>
                <div className="profile-menu-divider"></div>
                <button className="profile-menu-item" onClick={handleMyChannel}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span>Your channel</span>
                </button>
                {!hasChannel && (
                  <button 
                    className="profile-menu-item create-channel"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowChannelCreate(true);
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Create channel</span>
                  </button>
                )}
                <div className="profile-menu-divider"></div>
                <button className="profile-menu-item" onClick={onLogout}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="signin-button" onClick={onSignIn}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>Sign in</span>
          </button>
        )}
      </div>

      {/* Create Channel Modal */}
      {showChannelCreate && (
        <div className="modal-overlay" onClick={() => setShowChannelCreate(false)}>
          <div className="create-channel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create channel</h2>
              <button className="close-button" onClick={() => setShowChannelCreate(false)}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateChannel}>
              <div className="form-group">
                <label>Channel name</label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="Enter channel name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                  placeholder="Tell viewers about your channel"
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowChannelCreate(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

