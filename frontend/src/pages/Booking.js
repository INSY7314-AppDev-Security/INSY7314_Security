import { useState } from 'react';
import axios from 'axios';

function Booking() {
  const [gigId, setGigId] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [confirming, setConfirming] = useState(false);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gigId.trim()) {
      showToast('Please enter a Gig ID.', 'error');
      return;
    }
    setConfirming(true);
  };

  const confirmBooking = async () => {
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
    } finally {
      setConfirming(false);
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

      {confirming && (
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#fef9c3', borderRadius: '10px', maxWidth: '340px' }}>
          <p style={{ margin: '0 0 12px 0', color: '#854d0e' }}>Confirm booking for this Gig ID?</p>
          <button onClick={confirmBooking} style={{ marginRight: '8px', padding: '8px 16px', backgroundColor: '#1F4E79', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Yes, Book</button>
          <button onClick={() => setConfirming(false)} style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

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