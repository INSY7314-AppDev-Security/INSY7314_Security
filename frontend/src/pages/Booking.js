import { useState } from 'react';
import axios from 'axios';

function Booking() {
  const [gigId, setGigId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in first. Only clients can book gigs.');
      return;
    }

    setMessage('Booking the gig...');
    try {
      await axios.post('https://localhost:5000/api/bookings',
        { gigId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Booking successful. The freelancer has been notified.');
      setGigId('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not book the gig. Check the Gig ID and make sure you are logged in as a client.');
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
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '4px' }}>
          Book Gig
        </button>
      </form>
      <p style={{ color: message.includes('successful') ? 'green' : message ? 'red' : '#333', marginTop: '12px' }}>
        {message}
      </p>
    </div>
  );
}

export default Booking;