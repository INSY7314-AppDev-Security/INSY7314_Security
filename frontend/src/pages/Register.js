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
    setMessage('Creating your account...');
    try {
      await axios.post('https://localhost:5000/api/auth/register', form);
      setMessage('Account created. You can now log in.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed. Please check your details.');
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
        <input style={inputStyle} name="name" placeholder="Your full name" onChange={handleChange} />
        <input style={inputStyle} name="email" placeholder="Email address" onChange={handleChange} />
        <input style={inputStyle} name="password" type="password" placeholder="Password (min 8 characters)" onChange={handleChange} />
        <select style={inputStyle} name="role" onChange={handleChange}>
          <option value="client">I am a Client</option>
          <option value="freelancer">I am a Freelancer</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '4px' }}>
          Create Account
        </button>
      </form>
      <p style={{ color: message.includes('created') ? 'green' : message ? 'red' : '#333', marginTop: '12px' }}>
        {message}
      </p>
    </div>
  );
}

export default Register;