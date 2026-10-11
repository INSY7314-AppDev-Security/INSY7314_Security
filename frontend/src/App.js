import { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  const [page, setPage] = useState('login');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>HustleHub+</h1>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setPage('login')} style={{ marginRight: '10px' }}>
          Login
        </button>
        <button onClick={() => setPage('register')}>
          Register
        </button>
      </nav>

      {page === 'login' && <Login />}
      {page === 'register' && <Register />}
    </div>
  );
}

export default App;