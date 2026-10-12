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
      {message && <p>{message}</p>}
      {gigs.map((gig) => (
        <div key={gig._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
          <h3>{gig.title}</h3>
          <p>{gig.description}</p>
          <p>Price: R{gig.price}</p>
          <p>Category: {gig.category}</p>
        </div>
      ))}
    </div>
  );
}

export default GigList;