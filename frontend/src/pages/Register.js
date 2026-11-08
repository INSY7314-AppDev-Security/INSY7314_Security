import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, form);
      showToast('Account created. You can now log in.', 'success');
      setForm({ name: '', email: '', password: '', role: 'client' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Please check your details.', 'error');
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
      <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1e293b' }}>Create an Account</h2>
      <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '15px' }}>
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
          Create Account
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

export default Register;