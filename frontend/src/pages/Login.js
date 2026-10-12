import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    try {
      const res = await axios.post('https://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setMessage('Logged in successfully. You can now browse or create gigs.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed. Check your email and password.');
    }
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    padding: '8px',
    margin: '8px 0',
    border: '1px solid #ccc',
    borderRadius: '4px'
  };

  return (
    <div>
      <h2>Log In</h2>
      <p style={{ color: '#555', fontSize: '14px' }}>
        Use the email and password you registered with. After logging in you can browse gigs, create a gig, or book one.
      </p>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} name="email" placeholder="Email address" onChange={handleChange} />
        <input style={inputStyle} name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '4px' }}>
          Log In
        </button>
      </form>
      <p style={{ color: message.includes('successfully') ? 'green' : message ? 'red' : '#333', marginTop: '12px' }}>
        {message}
      </p>
    </div>
  );
}

export default Login;