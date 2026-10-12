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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#1F4E79' }}>HustleHub+</h1>
      <p style={{ color: '#666' }}>Secure freelance marketplace</p>

      <nav style={{ marginBottom: '24px' }}>
        <button style={buttonStyle} onClick={() => setPage('login')}>Login</button>
        <button style={buttonStyle} onClick={() => setPage('register')}>Register</button>
        <button style={buttonStyle} onClick={() => setPage('gigs')}>Browse Gigs</button>
        <button style={buttonStyle} onClick={() => setPage('create')}>Create Gig</button>
        <button style={buttonStyle} onClick={() => setPage('book')}>Book a Gig</button>
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