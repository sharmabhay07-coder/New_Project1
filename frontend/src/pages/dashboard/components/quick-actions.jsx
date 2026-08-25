import React from 'react';
import { Link } from 'react-router-dom';
import './quick-actions.css';
import { LuPlay, LuClipboardCheck, LuUserPlus, LuCrown } from 'react-icons/lu';

const actions = [
  {
    title: 'Watch Videos',
    subtitle: 'Earn points by watching videos',
    link: '/dashboard/videos',
    icon: <LuPlay />,
  },
  {
    title: 'Complete Tasks',
    subtitle: 'Finish tasks to get rewards',
    link: '/dashboard/tasks',
    icon: <LuClipboardCheck />,
  },
  {
    title: 'Refer Friends',
    subtitle: 'Invite friends and earn more',
    link: '/dashboard/referrals',
    icon: <LuUserPlus />,
  },
  {
    title: 'Upgrade Plan',
    subtitle: 'Get more benefits and features',
    link: '/dashboard/plans',
    icon: <LuCrown />,
  },
];

const QuickActions = () => {
  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <Link to={action.link} key={index} className="action-card">
          <div className="action-icon-wrapper">{action.icon}</div>
          <div className="action-text">
            <div className="action-title">{action.title}</div>
            <div className="action-subtitle">{action.subtitle}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
