import { useState, useEffect } from 'react';
import axios from 'axios';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('Loading transactions...');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to see your transactions.');
          return;
        }
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data.transactions || res.data);
        setMessage('');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Could not load transactions.');
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Your Transactions</h2>
      <p style={{ color: '#555', fontSize: '14px' }}>
        This page shows the bookings and payments linked to your account.
      </p>
      {message && <p>{message}</p>}
      {transactions.length === 0 && !message && <p>No transactions yet.</p>}
      {transactions.map((tx) => (
        <div key={tx._id} style={{
          border: '1px solid #ddd',
          borderRadius: '6px',
          padding: '16px',
          margin: '12px 0',
          backgroundColor: 'white'
        }}>
          <p style={{ margin: '4px 0', fontWeight: 'bold' }}>Amount: R{tx.amount || tx.price}</p>
          <p style={{ margin: '4px 0' }}>Status: {tx.status || 'Completed'}</p>
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
            Date: {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent'}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Transactions;