import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import FlashcardList from '../components/FlashcardList';
import ProgressDashboard from '../components/ProgressDashboard';
import axios from 'axios';

const Home = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const initializeProgress = async () => {
        try {
          const statsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/progress/stats`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          if (statsResponse.data.total_count > 0) {
            console.log('Progress already initialized, skipping.');
            return;
          }

          await axios.post(
            `${import.meta.env.VITE_API_URL}/progress/initialize`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          console.log('Progress initialized for user');
        } catch (error) {
          console.error('Error initializing progress:', error);
        }
      };
      initializeProgress();
    }
  }, [user]);

  return (
    <div>
      <h1>فلش‌کارت‌های آیلتس</h1>
      {user ? (
        <>
          {/* <ProgressDashboard /> */}
          <FlashcardList />
        </>
      ) : (
        <p>لطفاً وارد شوید.</p>
      )}
    </div>
  );
};

export default Home;