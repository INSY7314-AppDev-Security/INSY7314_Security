import { useState } from 'react';
import axios from 'axios';

function CreateGig() {
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    maxWidth: '420px',
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
      <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1e293b' }}>Create a Gig</h2>
      <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '15px' }}>
        You must be logged in as a freelancer.
      </p>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <textarea style={{ ...inputStyle, minHeight: '80px' }} name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input style={inputStyle} name="price" placeholder="Price (R)" value={form.price} onChange={handleChange} />
        <input style={inputStyle} name="category" placeholder="Category" value={form.category} onChange={handleChange} />
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
          Create Gig
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
          maxWidth: '420px'
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default CreateGig;