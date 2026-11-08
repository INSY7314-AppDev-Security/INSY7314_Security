import { useState, useEffect } from 'react';
import axios from 'axios';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('Loading transactions...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to see your transactions.');
          setLoading(false);
          return;
        }
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data.transactions || res.data);
        setMessage('');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Could not load transactions.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1e293b' }}>Your Transactions</h2>
      <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '15px' }}>
        This page shows the bookings and payments linked to your account.
      </p>
      {loading && <p style={{ color: '#64748b' }}>Loading transactions...</p>}
      {!loading && message && <p style={{ color: '#64748b' }}>{message}</p>}
      {!loading && transactions.length === 0 && !message && (
        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No transactions yet. Book a gig or get booked to see activity here.</p>
      )}
      {!loading && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {transactions.map((tx) => (
            <div key={tx._id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px 20px',
              backgroundColor: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>R{tx.amount || tx.price}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>
                  {tx.status || 'Completed'}
                </p>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Transactions;