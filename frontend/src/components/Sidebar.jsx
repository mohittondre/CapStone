import './Sidebar.css';

function Sidebar({ isOpen, onClose }) {
  const mainItems = [
    { label: 'Home', icon: 'home', active: true },
    { label: 'Shorts', icon: 'flash' },
    { label: 'Subscriptions', icon: 'subscriptions' },
  ];

  const libraryItems = [
    { label: 'Library', icon: 'library' },
    { label: 'History', icon: 'history' },
    { label: 'Your videos', icon: 'video' },
    { label: 'Watch later', icon: 'clock' },
    { label: 'Liked videos', icon: 'thumbup' },
  ];

  const exploreItems = [
    { label: 'Trending', icon: 'trending' },
    { label: 'Music', icon: 'music' },
    { label: 'Gaming', icon: 'gamepad' },
    { label: 'Movies', icon: 'movie' },
    { label: 'News', icon: 'news' },
    { label: 'Sports', icon: 'sports' },
  ];

  const icons = {
    home: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
    flash: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.77 10.32l-1.2-.5L18 9.06a3.74 3.74 0 0 0-3.5-6.62L6 6.94a3.74 3.74 0 0 0 .36 7.4l1.2.5L6 15.69a3.74 3.74 0 0 0 3.5 6.62l8.5-4.5a3.74 3.74 0 0 0-.36-7.4z"/></svg>,
    subscriptions: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/></svg>,
    library: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>,
    history: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>,
    video: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M22 8v12H2V8h20m2-2H0v16h24V6zm-8 5H6v6h8v-6z"/></svg>,
    clock: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
    thumbup: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>,
    trending: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>,
    music: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
    gamepad: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/></svg>,
    movie: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>,
    news: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M22 3l-1.67 1.67L18.67 3 17 4.67 15.33 3l-1.66 1.67L12 3l-1.67 1.67L8.67 3 7 4.67 5.33 3 3.67 4.67 2 3v18l1.67-1.67 1.66 1.67L7 19.33 8.67 21l1.66-1.67L12 21l1.67-1.67 1.66 1.67L17 19.33l1.67 1.67 1.66-1.67L22 21V3zM11 19H4v-6h7v6zm9 0h-7v-2h7v2zm0-4h-7v-2h7v2zm0-4H4V8h16v3z"/></svg>,
    sports: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17 3C14.53 3 12.4 4.5 11.5 6.65C10.6 4.5 8.47 3 6 3 2.69 3 0 5.69 0 9c0 5 7 11 12 13 5-2 12-8 12-13 0-3.31-2.69-6-6-6zm-5 14.55C9.64 15.55 2 10.36 2 9c0-2.21 1.79-4 4-4 1.88 0 3.49 1.28 3.93 3.05L10 8.5h4l.07-.45C15.51 6.28 17.13 5 19 5c2.21 0 4 1.79 4 4 0 1.36-7.64 6.55-10 8.55z"/></svg>,
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-section">
          {mainItems.map((item, index) => (
            <a key={index} href="/" className={`sidebar-item ${item.active ? 'active' : ''}`}>
              <span className="sidebar-icon">{icons[item.icon]}</span>
              <span className="sidebar-label">{item.label}</span>
            </a>
          ))}
        </div>
        
        <div className="sidebar-divider"></div>
        
        <div className="sidebar-section">
          <h3 className="sidebar-title">Library</h3>
          {libraryItems.map((item, index) => (
            <a key={index} href="/" className="sidebar-item">
              <span className="sidebar-icon">{icons[item.icon]}</span>
              <span className="sidebar-label">{item.label}</span>
            </a>
          ))}
        </div>

        <div className="sidebar-divider"></div>
        
        <div className="sidebar-section">
          <h3 className="sidebar-title">Explore</h3>
          {exploreItems.map((item, index) => (
            <a key={index} href="/" className="sidebar-item">
              <span className="sidebar-icon">{icons[item.icon]}</span>
              <span className="sidebar-label">{item.label}</span>
            </a>
          ))}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

