import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      showToast('Login successful.', 'success');
      setForm({ email: '', password: '' });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed.', 'error');
    }
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    maxWidth: '340px',
    padding: '12px 14px',
    margin: '8px 0',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    backgroundColor: '#f8fafc'
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1e293b' }}>Log In</h2>
      <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '15px' }}>
        Use the email and password you registered with.
      </p>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} name="email" placeholder="Email address" value={form.email} onChange={handleChange} />
        <input style={inputStyle} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button
          type="submit"
          style={{
            marginTop: '12px',
            padding: '12px 24px',
            backgroundColor: '#1F4E79',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 600
          }}
        >
          Log In
        </button>
      </form>
      {toast.show && (
        <div style={{
          marginTop: '20px',
          padding: '14px 16px',
          borderRadius: '10px',
          backgroundColor: toast.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: toast.type === 'success' ? '#065f46' : '#991b1b',
          border: `1px solid ${toast.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          maxWidth: '340px'
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Login;