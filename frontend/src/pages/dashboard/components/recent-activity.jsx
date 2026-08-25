import React, { useState, useEffect } from 'react';
import { LuActivity } from 'react-icons/lu';
import { getRecentActivity } from '../../../lib/api/activityApi';
import useAuth from '../../../hooks/useAuth';
import './recent-activity.css';
import './skeleton.css';

const ActivitySkeleton = () => (
  <div className="activity-item skeleton">
    <div className="activity-icon skeleton-avatar" />
    <div className="activity-details">
      <div className="skeleton-text" style={{ width: '30%' }} />
      <div className="skeleton-text" style={{ width: '70%' }} />
    </div>
    <div className="activity-meta">
      <div className="skeleton-text" style={{ width: '50px' }} />
      <div className="skeleton-text" style={{ width: '40px' }} />
    </div>
  </div>
);

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchActivities = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getRecentActivity(token);
        setActivities(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, [token]);

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ActivitySkeleton />
          <ActivitySkeleton />
          <ActivitySkeleton />
        </>
      );
    }

    if (error) {
      return <div className="activity-empty-state"><p>{error}</p></div>;
    }

    if (activities.length === 0) {
      return (
        <div className="activity-empty-state">
          <LuActivity size={48} className="empty-state-icon" />
          <h3>No recent activity yet</h3>
          <p>Complete tasks, watch videos, or refer friends to see your activity here.</p>
        </div>
      );
    }

    return activities.map((activity, index) => (
      <div key={index} className="activity-item">
        <div className="activity-icon">{activity.icon}</div>
        <div className="activity-details">
          <p className="activity-type">{activity.type}</p>
          <p className="activity-description">{activity.description}</p>
        </div>
        <div className="activity-meta">
          {activity.reward ? (
            <p className="activity-reward">+{activity.reward} Coins</p>
          ) : (
            <p className="activity-status">{activity.status}</p>
          )}
          <p className="activity-timestamp">{activity.timestamp}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="recent-activity-section">
      <h2 className="section-title">Recent Activity</h2>
      <div className="activity-feed">
        {renderContent()}
      </div>
    </div>
  );
};

export default RecentActivity;