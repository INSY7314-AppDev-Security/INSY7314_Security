import { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import GigList from './pages/GigList';
import CreateGig from './pages/CreateGig';
import Booking from './pages/Booking';

function App() {
  const [page, setPage] = useState('login');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>HustleHub+</h1>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setPage('login')} style={{ marginRight: '10px' }}>Login</button>
        <button onClick={() => setPage('register')} style={{ marginRight: '10px' }}>Register</button>
        <button onClick={() => setPage('gigs')} style={{ marginRight: '10px' }}>Gigs</button>
        <button onClick={() => setPage('create')} style={{ marginRight: '10px' }}>Create Gig</button>
        <button onClick={() => setPage('book')}>Book Gig</button>
      </nav>

      {page === 'login' && <Login />}
      {page === 'register' && <Register />}
      {page === 'gigs' && <GigList />}
      {page === 'create' && <CreateGig />}
      {page === 'book' && <Booking />}
    </div>
  );
}

export default App;