import { useState } from 'react';
import axios from 'axios';

function CreateGig() {
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in first');
      return;
    }

    try {
      await axios.post('https://localhost:5000/api/gigs', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Gig created successfully');
      setForm({ title: '', description: '', price: '', category: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not create gig');
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
      <h2>Create a Gig</h2>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input style={inputStyle} name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input style={inputStyle} name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
        <input style={inputStyle} name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '4px' }}>
          Create Gig
        </button>
      </form>
      <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>
    </div>
  );
}

export default CreateGig;