import { useState } from 'react';
import axios from 'axios';

function Booking() {
  const [gigId, setGigId] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleMouseEnter = (e) => { e.target.style.backgroundColor = '#1F4E79'; };
  const handleMouseLeave = (e) => { e.target.style.backgroundColor = '#2E75B6'; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please log in first. Only clients can book gigs.', 'error');
      return;
    }

    try {
      await axios.post('https://localhost:5000/api/bookings',
        { gigId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Booking successful. The freelancer has been notified.', 'success');
      setGigId('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not book the gig. Check the Gig ID and make sure you are logged in as a client.', 'error');
    }
  };

  return (
    <div>
      <h2>Book a Gig</h2>
      <p style={{ color: '#555', fontSize: '14px' }}>
        Only clients can book. Copy the Gig ID from the Browse Gigs page and paste it below.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          style={{ display: 'block', width: '100%', maxWidth: '300px', padding: '8px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
          placeholder="Paste the Gig ID here"
          value={gigId}
          onChange={(e) => setGigId(e.target.value)}
        />
        <button
          type="submit"
          style={{ padding: '10px 18px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.2s' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Book Gig
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

export default Booking;