import { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { getDashboardSummary } from '../../../api/userApi';
import './Stats.css';

export default function Stats() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {  
      try {
        setLoading(true);
        const res = await getDashboardSummary(token);
        setStats(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  const formatINR = (num) => new Intl.NumberFormat('en-IN').format(num);

  if (loading) {
    return <div className="stats-loading">Loading your stats...</div>;
  }

  if (error) {
    return <div className="stats-error">Couldn't load stats: {error}</div>;
  }

  if (!stats) return null;

  const statsData = [
    {
      id: 'balance',
      label: 'Total Balance',
      value: `₹${formatINR(stats.totalBalance)}`,
      icon: '👛',
      color: '#10b981',
    },
    {
      id: 'earnings',
      label: 'Total Earnings',
      value: `₹${formatINR(stats.totalEarnings)}`,
      icon: '📈',
      color: '#3b82f6',
    },
    {
      id: 'completed',
      label: 'Completed Tasks',
      value: stats.completedTasks,
      icon: '✅',
      color: '#8b5cf6',
    },
    {
      id: 'pending',
      label: 'Pending Submission',
      value: stats.pendingTasks,
      icon: '⏰',
      color: '#f59e0b',
    },
  ];

  return (
    <div className="stats-bar">
      {statsData.map((stat) => (
        <div className="stats-card" key={stat.id}>
          <div
            className="stats-icon"
            style={{ background: `${stat.color}18`, color: stat.color }}
          >
            {stat.icon}
          </div>
          <div className="stats-info">
            <div className="stats-label">{stat.label}</div>
            <div className="stats-value">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}