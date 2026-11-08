import { useState } from 'react';
import axios from 'axios';

function Booking() {
  const [gigId, setGigId] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings`,
        { gigId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Booking successful. The freelancer has been notified.', 'success');
      setGigId('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Booking failed.', 'error');
    }
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1e293b' }}>Book a Gig</h2>
      <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '15px' }}>
        Paste the Gig ID from the Browse Gigs page. You must be logged in as a client.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          style={{
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
          }}
          placeholder="Gig ID"
          value={gigId}
          onChange={(e) => setGigId(e.target.value)}
        />
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
          Book Gig
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

export default Booking;