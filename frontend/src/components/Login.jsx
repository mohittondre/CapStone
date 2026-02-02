import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const mockJWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
      userId: 'user01',
      username: formData.username || formData.email.split('@')[0],
      email: formData.email,
      exp: Date.now() + 86400000
    }))}.mock_signature`;

    await new Promise(resolve => setTimeout(resolve, 500));

    if (isSignUp) {
      if (formData.username && formData.email && formData.password) {
        localStorage.setItem('token', mockJWT);
        localStorage.setItem('user', JSON.stringify({
          userId: 'user01',
          username: formData.username,
          email: formData.email,
          avatar: `https://ui-avatars.com/api/?name=${formData.username}&background=random`
        }));
        onLogin();
      } else {
        setError('Please fill in all fields');
      }
    } else {
      if (formData.email && formData.password) {
        localStorage.setItem('token', mockJWT);
        localStorage.setItem('user', JSON.stringify({
          userId: 'user01',
          username: formData.email.split('@')[0],
          email: formData.email,
          avatar: `https://ui-avatars.com/api/?name=${formData.email.split('@')[0]}&background=random`
        }));
        onLogin();
      } else {
        setError('Please fill in all fields');
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">{isSignUp ? 'Create Account' : 'Sign In'}</h2>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isSignUp ? 'Register' : 'Sign In')}
          </button>
        </form>

        <div className="toggle-mode">
          {isSignUp ? (
            <p>Already have an account? <button onClick={() => {setIsSignUp(false); setError('')}}>Sign In</button></p>
          ) : (
            <p>Don't have an account? <button onClick={() => {setIsSignUp(true); setError('')}}>Register</button></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;

