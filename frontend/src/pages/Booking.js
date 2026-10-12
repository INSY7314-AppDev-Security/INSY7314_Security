import { useState } from 'react';
import axios from 'axios';

function Booking() {
  const [gigId, setGigId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in first');
      return;
    }

    try {
      await axios.post('https://localhost:5000/api/bookings', 
        { gigId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Booking successful');
      setGigId('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not book gig');
    }
  };

  return (
    <div>
      <h2>Book a Gig</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="6acca8a9fd5a9db5eab00328"
          value={gigId}
          onChange={(e) => setGigId(e.target.value)}
        /><br />
        <button type="submit">Book Gig</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Booking;