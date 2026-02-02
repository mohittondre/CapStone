import './Header.css';

function Header({ toggleSidebar, user, onSignIn, onLogout, searchQuery, setSearchQuery, activeFilter, setActiveFilter }) {
  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filters = ['All', 'React', 'JavaScript', 'Computers'];

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button className="menu-button" onClick={toggleSidebar}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <a href="/" className="logo">
            <svg viewBox="0 0 90 20" width="90" height="20">
              <path fill="#FF0000" d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" />
              <path fill="#FFFFFF" d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" />
            </svg>
            <span className="logo-text">YouTube</span>
          </a>
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
          {user ? (
            <div className="user-menu">
              <span className="user-name">{user.username}</span>
              <button className="signin-button" onClick={onLogout}>Logout</button>
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
      </header>

      <div className="filter-bar">
        <div className="filter-scroll">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default Header;
