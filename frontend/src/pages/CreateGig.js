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
      setMessage('Please log in first. Only freelancers can create gigs.');
      return;
    }

    setMessage('Creating your gig...');
    try {
      await axios.post('https://localhost:5000/api/gigs', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Gig created. Clients can now see it and book it.');
      setForm({ title: '', description: '', price: '', category: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not create gig. Make sure you are logged in as a freelancer.');
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
      <p style={{ color: '#555', fontSize: '14px' }}>
        Only freelancers can create gigs. Give it a clear title, a short description, a price, and a category.
      </p>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} name="title" placeholder="Gig title (e.g. Website Design)" value={form.title} onChange={handleChange} />
        <input style={inputStyle} name="description" placeholder="Short description of the service" value={form.description} onChange={handleChange} />
        <input style={inputStyle} name="price" type="number" placeholder="Price in Rands" value={form.price} onChange={handleChange} />
        <input style={inputStyle} name="category" placeholder="Category (e.g. Web Development)" value={form.category} onChange={handleChange} />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '4px' }}>
          Create Gig
        </button>
      </form>
      <p style={{ color: message.includes('created') ? 'green' : message ? 'red' : '#333', marginTop: '12px' }}>
        {message}
      </p>
    </div>
  );
}

export default CreateGig;