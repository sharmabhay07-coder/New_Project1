import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Coins } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { getDashboardSummary } from "@/lib/api/userApi";
import "./dashboard-mini-profile.css";

export default function DashboardMiniProfile() {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getDashboardSummary(token);
        setSummary(res.data);
      } catch (error) {
        console.error("Failed to fetch mini profile summary", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  // NOTE: check the actual field name your stat-cards.jsx uses for
  // "Total Balance" (e.g. summary.totalBalance / summary.balance /
  // summary.walletBalance) and adjust the line below if it doesn't match.
  const balance =
    summary?.totalBalance ?? summary?.balance ?? summary?.walletBalance ?? 0;

  const name = summary?.name || user?.name || "User";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.aside
      className="mini-profile-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mini-profile-top">
        {summary?.profilePicture || user?.profilePicture ? (
          <img src={summary?.profilePicture || user?.profilePicture} alt={name} className="mini-profile-avatar" style={{ objectFit: 'cover' }} />
        ) : (
          <div className="mini-profile-avatar">{initials}</div>
        )}
        <div className="mini-profile-info">
          <h4>{loading ? "Loading..." : name}</h4>
          <span>{user?.email || ""}</span>
        </div>
      </div>

      <div className="mini-profile-earning">
        <div className="mini-profile-earning-icon">
          <Coins size={18} />
        </div>
        <div>
          <p className="mini-profile-earning-label">Total Earning</p>
          <p className="mini-profile-earning-value">
            {loading ? "..." : `₹${Number(balance).toFixed(2)}`}
          </p>
        </div>
      </div>

      <Link to="/dashboard" className="mini-profile-dashboard-btn">
        <LayoutDashboard size={16} />
        Go to Dashboard
      </Link>
    </motion.aside>
  );
}