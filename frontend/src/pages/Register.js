import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:5000/api/auth/register', form);
      setMessage('Registered successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
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
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} name="name" placeholder="Name" onChange={handleChange} />
        <input style={inputStyle} name="email" placeholder="Email" onChange={handleChange} />
        <input style={inputStyle} name="password" type="password" placeholder="Password" onChange={handleChange} />
        <select style={inputStyle} name="role" onChange={handleChange}>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '4px' }}>
          Register
        </button>
      </form>
      <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>
    </div>
  );
}

export default Register;