import { useState } from 'react';
import axios from 'axios';

function CreateGig() {
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' });
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
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/gigs`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Gig created. Clients can now see it and book it.', 'success');
      setForm({ title: '', description: '', price: '', category: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not create gig.', 'error');
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
        You must be logged in as a freelancer.
      </p>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <textarea style={inputStyle} name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input style={inputStyle} name="price" placeholder="Price (R)" value={form.price} onChange={handleChange} />
        <input style={inputStyle} name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <button
          type="submit"
          style={{ padding: '10px 18px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Create Gig
        </button>
      </form>
      {toast.show && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: toast.type === 'success' ? '#d4edda' : '#f8d7da',
          color: toast.type === 'success' ? '#155724' : '#721c24'
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default CreateGig;