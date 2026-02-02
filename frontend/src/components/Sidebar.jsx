import './Sidebar.css';

function Sidebar({ isOpen, onClose, user }) {
  const menuItems = [
    { icon: 'home', label: 'Home', active: true },
    { icon: 'shorts', label: 'Shorts' },
    { icon: 'subscriptions', label: 'Subscriptions' },
  ];

  const libraryItems = [
    { icon: 'history', label: 'History' },
    { icon: 'smart_display', label: 'Your videos' },
    { icon: 'schedule', label: 'Watch later' },
    { icon: 'thumb_up', label: 'Liked videos' },
  ];

  const handleCreateChannel = () => {
    if (!user) {
      // Dispatch event to show login
      const event = new CustomEvent('showLogin');
      window.dispatchEvent(event);
      return;
    }
    
    // Check if user already has a channel
    const userChannels = JSON.parse(localStorage.getItem(`channels_${user.userId}`)) || [];
    if (userChannels.length > 0) {
      // User already has a channel, open it
      const event = new CustomEvent('openMyChannel');
      window.dispatchEvent(event);
    } else {
      // Open create channel page
      const event = new CustomEvent('createChannel');
      window.dispatchEvent(event);
    }
    onClose();
  };

  const handleMyChannel = () => {
    if (!user) {
      const event = new CustomEvent('showLogin');
      window.dispatchEvent(event);
      onClose();
      return;
    }
    
    const event = new CustomEvent('openMyChannel');
    window.dispatchEvent(event);
    onClose();
  };

  const renderIcon = (iconName) => {
    const icons = {
      home: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
      shorts: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.77 10.32l-1.2-.5L18 9.06a3.74 3.74 0 0 0-3.5-6.62L6 6.94a3.74 3.74 0 0 0 .36 7.4l1.2.5L6 15.69a3.74 3.74 0 0 0 3.5 6.62l8.5-4.5a3.74 3.74 0 0 0-.36-7.4z"/></svg>,
      subscriptions: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/></svg>,
      video_library: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>,
      history: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>,
      smart_display: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M22 8v12H2V8h20m2-2H0v16h24V6zm-8 5H6v6h8v-6z"/></svg>,
      schedule: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
      thumb_up: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>,
      person: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
      add_channel: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
    };
    return icons[iconName] || null;
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-section">
          {menuItems.map((item, index) => (
            <a key={index} href="/" className={`sidebar-item ${item.active ? 'active' : ''}`}>
              <span className="sidebar-icon">{renderIcon(item.icon)}</span>
              <span className="sidebar-label">{item.label}</span>
            </a>
          ))}
        </div>
        
        <div className="sidebar-divider"></div>
        
        <div className="sidebar-section">
          <h3 className="sidebar-title">You</h3>
          <button className="sidebar-item" onClick={handleMyChannel}>
            <span className="sidebar-icon">{renderIcon('person')}</span>
            <span className="sidebar-label">Your channel</span>
          </button>
          <button className="sidebar-item" onClick={handleCreateChannel}>
            <span className="sidebar-icon">{renderIcon('add_channel')}</span>
            <span className="sidebar-label">Create channel</span>
          </button>
        </div>
        
        <div className="sidebar-divider"></div>
        
        <div className="sidebar-section">
          <h3 className="sidebar-title">Library</h3>
          {libraryItems.map((item, index) => (
            <a key={index} href="/" className="sidebar-item">
              <span className="sidebar-icon">{renderIcon(item.icon)}</span>
              <span className="sidebar-label">{item.label}</span>
            </a>
          ))}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

