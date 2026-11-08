import { useState, useEffect } from 'react';
import axios from 'axios';

function Income() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('Loading income...');
  const [loading, setLoading] = useState(true);

  const calculateTax = (income) => {
    if (income <= 0) return 0;
    if (income <= 237100) return income * 0.18;
    if (income <= 370500) return 42678 + (income - 237100) * 0.26;
    if (income <= 512800) return 77362 + (income - 370500) * 0.31;
    if (income <= 673000) return 121475 + (income - 512800) * 0.36;
    if (income <= 857900) return 179147 + (income - 673000) * 0.39;
    if (income <= 1817000) return 251258 + (income - 857900) * 0.41;
    return 644489 + (income - 1817000) * 0.45;
  };

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in as a freelancer to see your income.');
          setLoading(false);
          return;
        }
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/income`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        setMessage('');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Could not load income.');
      } finally {
        setLoading(false);
      }
    };
    fetchIncome();
  }, []);

  const totalEarned = data?.totalEarned || 0;
  const estimatedTax = calculateTax(totalEarned);
  const afterTax = totalEarned - estimatedTax;

  const cardStyle = {
    flex: 1,
    minWidth: '160px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center'
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1e293b' }}>Income & Tax Dashboard</h2>
      <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '15px' }}>
        Your earnings and estimated tax based on simplified South African progressive rates.
      </p>
      {loading && <p style={{ color: '#64748b' }}>Loading income...</p>}
      {!loading && message && <p style={{ color: '#64748b' }}>{message}</p>}
      {!loading && data && (
        <div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
            <div style={cardStyle}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Total Earned</p>
              <h3 style={{ margin: '8px 0 0 0', color: '#1F4E79', fontSize: '28px' }}>R{totalEarned.toFixed(2)}</h3>
            </div>
            <div style={cardStyle}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Estimated Tax</p>
              <h3 style={{ margin: '8px 0 0 0', color: '#dc2626', fontSize: '28px' }}>R{estimatedTax.toFixed(2)}</h3>
            </div>
            <div style={cardStyle}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>After Tax</p>
              <h3 style={{ margin: '8px 0 0 0', color: '#16a34a', fontSize: '28px' }}>R{afterTax.toFixed(2)}</h3>
            </div>
          </div>

          {data.earningsPerGig && data.earningsPerGig.length > 0 && (
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>Earnings per gig</h4>
              {data.earningsPerGig.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: index < data.earningsPerGig.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                  <span>{item.gigTitle || 'Gig'}</span>
                  <strong>R{item.amount}</strong>
                </div>
              ))}
            </div>
          )}
          {(!data.earningsPerGig || data.earningsPerGig.length === 0) && (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No earnings yet. Create a gig and get booked to see income here.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Income;