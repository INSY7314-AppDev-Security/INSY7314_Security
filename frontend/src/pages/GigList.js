import { useState, useEffect } from 'react';
import axios from 'axios';

function GigList() {
  const [gigs, setGigs] = useState([]);
  const [message, setMessage] = useState('Loading gigs...');

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/gigs`, config);
        setGigs(res.data.gigs || res.data);
        setMessage('');
      } catch (err) {
        setMessage('Could not load gigs');
      }
    };
    fetchGigs();
  }, []);

  return (
    <div>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1e293b' }}>Available Gigs</h2>
      <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '15px' }}>
        Browse available services. To book one, copy its ID and go to the Book a Gig page (you must be logged in as a client).
      </p>
      {message && <p style={{ color: '#64748b' }}>{message}</p>}
      <div style={{ display: 'grid', gap: '16px' }}>
        {gigs.map((gig) => (
          <div key={gig._id} style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#f8fafc'
          }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#1F4E79', fontSize: '18px' }}>{gig.title}</h3>
            <p style={{ margin: '0 0 10px 0', color: '#475569' }}>{gig.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div>
                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '16px' }}>R{gig.price}</span>
                <span style={{ marginLeft: '12px', color: '#64748b', fontSize: '14px' }}>{gig.category}</span>
              </div>
            </div>
            <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Gig ID: <strong style={{ color: '#64748b' }}>{gig._id}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GigList;