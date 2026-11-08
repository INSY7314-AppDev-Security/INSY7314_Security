import { useState, useEffect } from 'react';
import axios from 'axios';

function Income() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('Loading income...');

  // Simplified South African progressive tax (2026 brackets, rounded for clarity)
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

  const totalEarned = data?.totalEarned || 0;
  const estimatedTax = calculateTax(totalEarned);
  const afterTax = totalEarned - estimatedTax;

  return (
    <div>
      <h2>Income & Tax Dashboard</h2>
      <p style={{ color: '#555', fontSize: '14px' }}>
        Your earnings and estimated tax based on simplified South African progressive rates.
      </p>
      {message && <p>{message}</p>}
      {data && (
        <div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '180px', backgroundColor: 'white', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#666' }}>Total Earned</p>
              <h3 style={{ margin: '8px 0 0 0', color: '#1F4E79' }}>R{totalEarned.toFixed(2)}</h3>
            </div>
            <div style={{ flex: 1, minWidth: '180px', backgroundColor: 'white', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#666' }}>Estimated Tax</p>
              <h3 style={{ margin: '8px 0 0 0', color: '#c0392b' }}>R{estimatedTax.toFixed(2)}</h3>
            </div>
            <div style={{ flex: 1, minWidth: '180px', backgroundColor: 'white', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#666' }}>After Tax</p>
              <h3 style={{ margin: '8px 0 0 0', color: '#27ae60' }}>R{afterTax.toFixed(2)}</h3>
            </div>
          </div>

          {data.earningsPerGig && data.earningsPerGig.length > 0 && (
            <div style={{ marginTop: '24px', backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ marginTop: 0 }}>Earnings per gig</h4>
              {data.earningsPerGig.map((item, index) => (
                <p key={index} style={{ margin: '6px 0' }}>
                  {item.gigTitle || 'Gig'}: R{item.amount}
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