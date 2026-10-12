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
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#2E75B6',
    color: 'white',
    cursor: 'pointer'
  };

  const handleLogout = () => {
  localStorage.removeItem('token');
  setPage('login');
  window.location.reload();
};

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
      <button style={buttonStyle} onClick={() => setPage('login')}>Login</button>
      <button style={buttonStyle} onClick={() => setPage('register')}>Register</button>
      <button style={buttonStyle} onClick={() => setPage('gigs')}>Browse Gigs</button>
      <button style={buttonStyle} onClick={() => setPage('create')}>Create Gig</button>
      <button style={buttonStyle} onClick={() => setPage('book')}>Book a Gig</button>
      {localStorage.getItem('token') && (
  <button style={{ ...buttonStyle, backgroundColor: '#c0392b' }} onClick={handleLogout}>
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
  </div>
);
}

export default App;