import { useState, useEffect } from 'react';
import axios from 'axios';

function Income() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('Loading income...');

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in as a freelancer to see your income.');
          return;
        }
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/income`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        setMessage('');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Could not load income.');
      }
    };
    fetchIncome();
  }, []);

  return (
    <div>
      <h2>Your Income</h2>
      <p style={{ color: '#555', fontSize: '14px' }}>
        This page shows how much you have earned from bookings.
      </p>
      {message && <p>{message}</p>}
      {data && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginTop: '16px' }}>
          <h3 style={{ color: '#1F4E79', margin: '0 0 12px 0' }}>Total Earned: R{data.totalEarned || 0}</h3>
          {data.earningsPerGig && data.earningsPerGig.length > 0 && (
            <div>
              <h4>Earnings per gig</h4>
              {data.earningsPerGig.map((item, index) => (
                <p key={index} style={{ margin: '4px 0' }}>
                  {item.gigTitle || 'Gig'}: R{item.amount}
                </p>
              ))}
            </div>
          )}
          {data.recentBookings && data.recentBookings.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h4>Recent bookings</h4>
              {data.recentBookings.map((booking, index) => (
                <p key={index} style={{ margin: '4px 0', fontSize: '14px' }}>
                  R{booking.price} – {booking.date || 'Recent'}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Income;