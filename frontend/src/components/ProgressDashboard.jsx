import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProgressDashboard.css';

const ProgressDashboard = () => {
  const [stats, setStats] = useState({
    new_count: 0,
    learning_count: 0,
    mastered_count: 0,
    total_count: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/progress/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching progress stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="progress-dashboard">
      <h2>پیشرفت شما</h2>
      <div className="stats">
        <div className="stat">
          <h3>{stats.new_count}</h3>
          <p>فلش‌کارت‌های جدید</p>
        </div>
        <div className="stat">
          <h3>{stats.learning_count}</h3>
          <p>فلش‌کارت‌های در حال یادگیری</p>
        </div>
        <div className="stat">
          <h3>{stats.mastered_count}</h3>
          <p>فلش‌کارت‌های تسلط‌یافته</p>
        </div>
        <div className="stat">
          <h3>{stats.total_count}</h3>
          <p>کل فلش‌کارت‌ها</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;