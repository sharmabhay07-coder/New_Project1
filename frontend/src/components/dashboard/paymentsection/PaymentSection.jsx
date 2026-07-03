import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import './PaymentSection.css';

const METHODS = ['UPI', 'PayPal', 'Bank', 'Crypto'];

const TRANSACTIONS = [
  { id: 1, type: 'withdrawal', title: 'Withdrawal', date: 'Jun 24 · 10:30 AM', amount: '-$25.00', status: 'success' },
  { id: 2, type: 'earning',    title: 'Task Earning', date: 'Jun 24 · 09:15 AM', amount: '+$0.35', status: 'success' },
  { id: 3, type: 'earning',    title: 'Task Earning', date: 'Jun 24 · 08:45 AM', amount: '+$0.50', status: 'success' },
  { id: 4, type: 'earning',    title: 'Referral Bonus', date: 'Jun 23 · 05:00 PM', amount: '+$5.00', status: 'success' },
  { id: 5, type: 'withdrawal', title: 'Withdrawal', date: 'Jun 22 · 11:00 AM', amount: '-$10.00', status: 'pending' },
];

export default function PaymentSection() {
  const [activeMethod, setActiveMethod] = useState('UPI');

  return (
    <div className="ps-wrap">
      <div className="ps-head">
        <h2 className="ps-title">Payment Section</h2>
        <button className="ps-view-all">View All Transactions</button>
      </div>

      {/* Balance card */}
      <div className="ps-balance-card">
        <div>
          <div className="ps-balance-label">Current Balance</div>
          <div className="ps-balance-value">$24.85</div>
          <div className="ps-balance-min">Minimum withdrawal $5.00</div>
        </div>
        <div className="ps-verified">
          <span className="ps-verified-icon">✓</span>
          Verified
        </div>
      </div>

      {/* Payment method */}
      <div className="ps-method-label">CHOOSE PAYMENT METHOD</div>
      <div className="ps-methods">
        {METHODS.map((m) => (
          <button
            key={m}
            className={`ps-method-btn ${activeMethod === m ? 'active' : ''}`}
            onClick={() => setActiveMethod(m)}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Withdraw button */}
      <button className="ps-withdraw-btn">Withdraw Now</button>

      {/* Recent transactions */}
      <div className="ps-tx-label">RECENT TRANSACTIONS</div>
      <div className="ps-tx-list">
        {TRANSACTIONS.map((tx) => (
          <div className="ps-tx-row" key={tx.id}>
            <div className={`ps-tx-icon ${tx.type}`}>
              {tx.type === 'withdrawal'
                ? <ArrowUpRight size={15} />
                : <ArrowDownLeft size={15} />}
            </div>
            <div className="ps-tx-info">
              <div className="ps-tx-title">{tx.title}</div>
              <div className="ps-tx-date">{tx.date}</div>
            </div>
            <div className="ps-tx-right">
              <div className={`ps-tx-amount ${tx.type}`}>{tx.amount}</div>
              <div className={`ps-tx-status ${tx.status}`}>{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}