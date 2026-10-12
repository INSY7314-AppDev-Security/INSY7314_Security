import { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import GigList from './pages/GigList';
import CreateGig from './pages/CreateGig';
import Booking from './pages/Booking';

function App() {
  const [page, setPage] = useState('login');

  const buttonStyle = {
    margin: '0 8px 8px 0',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#2E75B6',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setPage('login');
    window.location.reload();
  };

  const handleMouseEnter = (e) => { e.target.style.backgroundColor = '#1F4E79'; };
  const handleMouseLeave = (e) => { e.target.style.backgroundColor = '#2E75B6'; };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#1F4E79' }}>HustleHub+</h1>
      <p style={{ color: '#666' }}>Secure freelance marketplace</p>

      {localStorage.getItem('token') && (
        <p style={{ color: '#2E75B6', fontSize: '14px' }}>
          You are logged in. You can browse gigs, create a gig, or book one.
        </p>
      )}

      <nav style={{ marginBottom: '24px' }}>
        <button style={buttonStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setPage('login')}>Login</button>
        <button style={buttonStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setPage('register')}>Register</button>
        <button style={buttonStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setPage('gigs')}>Browse Gigs</button>
        <button style={buttonStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setPage('create')}>Create Gig</button>
        <button style={buttonStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setPage('book')}>Book a Gig</button>
        {localStorage.getItem('token') && (
          <button
            style={{ ...buttonStyle, backgroundColor: '#c0392b' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#922b21'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#c0392b'}
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </nav>

      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        {page === 'login' && <Login />}
        {page === 'register' && <Register />}
        {page === 'gigs' && <GigList />}
        {page === 'create' && <CreateGig />}
        {page === 'book' && <Booking />}
      </div>

      <footer style={{
        marginTop: '40px',
        padding: '16px',
        textAlign: 'center',
        borderTop: '1px solid #ddd',
        color: '#666',
        fontSize: '13px'
      }}>
        <strong>HustleHub+</strong> — Built by Justin Fussell, Thomas Pheiffer, Isabelle Devlin & Matteo Nusca<br />
        INSY7314 • Group POE • 2026
      </footer>
    </div>
  );
}

export default App;