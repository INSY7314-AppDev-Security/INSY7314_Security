import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMouseEnter = (e) => { e.target.style.backgroundColor = '#1F4E79'; };
  const handleMouseLeave = (e) => { e.target.style.backgroundColor = '#2E75B6'; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      showToast('Logged in successfully. You can now browse or create gigs.', 'success');
      setForm({ email: '', password: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Check your email and password.', 'error');
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
        <input style={inputStyle} name="email" placeholder="Email address" value={form.email} onChange={handleChange} />
        <input style={inputStyle} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button
          type="submit"
          style={{ padding: '10px 18px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.2s' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Log In
        </button>
      </form>

      {toast.show && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: toast.type === 'success' ? '#d4edda' : '#f8d7da',
          color: toast.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${toast.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Login;