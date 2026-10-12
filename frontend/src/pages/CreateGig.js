import { useState } from 'react';
import axios from 'axios';

function CreateGig() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: ''
  });
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

  return (
    <div>
      <h2>Create a Gig</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} /><br />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} /><br />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} /><br />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} /><br />
        <button type="submit">Create Gig</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CreateGig;