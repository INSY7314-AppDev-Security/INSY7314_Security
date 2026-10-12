import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
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
      await axios.post('https://localhost:5000/api/auth/register', form);
      showToast('Account created. You can now log in.', 'success');
      setForm({ name: '', email: '', password: '', role: 'client' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Please check your details.', 'error');
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
      <h2>Create an Account</h2>
      <p style={{ color: '#555', fontSize: '14px' }}>
        Choose Client if you want to book services. Choose Freelancer if you want to offer services.
      </p>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} name="name" placeholder="Your full name" value={form.name} onChange={handleChange} />
        <input style={inputStyle} name="email" placeholder="Email address" value={form.email} onChange={handleChange} />
        <input style={inputStyle} name="password" type="password" placeholder="Password (min 8 characters)" value={form.password} onChange={handleChange} />
        <select style={inputStyle} name="role" value={form.role} onChange={handleChange}>
          <option value="client">I am a Client</option>
          <option value="freelancer">I am a Freelancer</option>
        </select>
        <button
          type="submit"
          style={{ padding: '10px 18px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.2s' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Create Account
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

export default Register;