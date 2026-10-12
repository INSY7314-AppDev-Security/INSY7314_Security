import { useState, useEffect } from 'react';
import axios from 'axios';

function GigList() {
  const [gigs, setGigs] = useState([]);
  const [message, setMessage] = useState('Loading gigs...');

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get('https://localhost:5000/api/gigs');
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
      <h2>Available Gigs</h2>
      <p style={{ color: '#555', fontSize: '14px' }}>
        Browse available services. To book one, copy its ID and go to the Book a Gig page (you must be logged in as a client).
      </p>
      {message && <p>{message}</p>}
      {gigs.map((gig) => (
        <div key={gig._id} style={{
          border: '1px solid #ddd',
          borderRadius: '6px',
          padding: '16px',
          margin: '12px 0',
          backgroundColor: 'white'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1F4E79' }}>{gig.title}</h3>
          <p style={{ margin: '4px 0' }}>{gig.description}</p>
          <p style={{ margin: '4px 0', fontWeight: 'bold' }}>R{gig.price}</p>
          <p style={{ margin: '4px 0', color: '#666' }}>{gig.category}</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#888' }}>
            Gig ID: <strong>{gig._id}</strong>
          </p>
        </div>
      ))}
    </div>
  );
}

export default GigList;