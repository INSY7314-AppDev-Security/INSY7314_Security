import { useState, useEffect } from 'react';
import axios from 'axios';
import Register from './pages/Register';
import Login from './pages/Login';
import GigList from './pages/GigList';
import CreateGig from './pages/CreateGig';
import Booking from './pages/Booking';
import Income from './pages/Income';
import Transactions from './pages/Transactions';

function App() {
  const [page, setPage] = useState('login');
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role);
      } catch (e) {
        setRole(null);
      }
    }
  }, [page]);

  const navButton = (id) => ({
    margin: '0 6px 6px 0',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '20px',
    backgroundColor: page === id ? '#1F4E79' : '#e8eef4',
    color: page === id ? 'white' : '#1F4E79',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.15s ease'
  });

  const handleLogout = async () => {
    // Tell the server first, so it cancels every token for this account.
    // Even if this request fails, the token is still removed from the browser.
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`, null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        // ignore: the token may already be invalid or the server unreachable
      }
    }
    localStorage.removeItem('token');
    setRole(null);
    setPage('login');
    window.location.reload();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7fb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '32px', color: '#1F4E79', fontWeight: 700 }}>HustleHub+</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '15px' }}>Secure freelance marketplace</p>
          {localStorage.getItem('token') && (
            <p style={{ margin: '12px 0 0 0', color: '#2E75B6', fontSize: '14px', fontWeight: 500 }}>
              Logged in as {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'user'}
            </p>
          )}
        </header>

        <nav style={{ marginBottom: '28px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          <button style={navButton('login')} onClick={() => setPage('login')}>Login</button>
          <button style={navButton('register')} onClick={() => setPage('register')}>Register</button>
          <button style={navButton('gigs')} onClick={() => setPage('gigs')}>Browse Gigs</button>
          <button style={navButton('create')} onClick={() => setPage('create')}>Create Gig</button>
          <button style={navButton('book')} onClick={() => setPage('book')}>Book a Gig</button>
          {localStorage.getItem('token') && (
            <>
              <button style={navButton('income')} onClick={() => setPage('income')}>Income</button>
              <button style={navButton('transactions')} onClick={() => setPage('transactions')}>Transactions</button>
              <button
                style={{ ...navButton('logout'), backgroundColor: '#fee2e2', color: '#b91c1c' }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </nav>

        <main style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          {page === 'login' && <Login />}
          {page === 'register' && <Register />}
          {page === 'gigs' && <GigList />}
          {page === 'create' && <CreateGig />}
          {page === 'book' && <Booking />}
          {page === 'income' && <Income />}
          {page === 'transactions' && <Transactions />}
        </main>

        <footer style={{ marginTop: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
          <strong style={{ color: '#6b7280' }}>HustleHub+</strong> — Built by Justin Fussell, Thomas Pheiffer, Isabelle Devlin & Matteo Nusca<br />
          INSY7314 • Group POE • 2026
        </footer>
      </div>
    </div>
  );
}

export default App;