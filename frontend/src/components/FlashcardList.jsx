import { useEffect, useState } from 'react';
import axios from 'axios';
import Flashcard from './Flashcard';
import '../styles/FlashcardList.css';


const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [stats, setStats] = useState({ unarchived_count: 0, archived_count: 0, total_count: 0 });
  const [hasUnarchived, setHasUnarchived] = useState(true);

  const userId = 7;

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/progress/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const checkUnarchivedFlashcards = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/progress/has-unarchived`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setHasUnarchived(response.data.has_unarchived);
    } catch (error) {
      console.error('Error checking unarchived flashcards:', error);
    }
  };

  const fetchFlashcards = async () => {
    try {
      let response;
      if (isQuizMode) {
        console.log('Fetching quiz flashcards (archived only)...');
        response = await axios.get(`${import.meta.env.VITE_API_URL}/progress/quiz`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        console.log('Fetching initial flashcards (unarchived only)...');
        response = await axios.get(`${import.meta.env.VITE_API_URL}/progress/initial`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      console.log('Fetched flashcards:', response.data);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setFlashcards([]);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/progress/initialize`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      await fetchStats();
      await checkUnarchivedFlashcards();
      await fetchFlashcards();
    };
    initialize();
  }, []);

  // اضافه کردن useEffect برای واکنش به تغییر حالت آزمون
  useEffect(() => {
    fetchFlashcards();
  }, [isQuizMode]);

  const handleArchive = async (flashcardId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/progress/archive`,
        { flashcardId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      await fetchFlashcards();
      await fetchStats();
      await checkUnarchivedFlashcards();
    } catch (error) {
      console.error('Error archiving flashcard:', error);
    }
  };

  const handleKeep = async (flashcardId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/progress/unarchive`,
        { flashcardId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      await fetchFlashcards();
      await fetchStats();
      await checkUnarchivedFlashcards();
    } catch (error) {
      console.error('Error keeping flashcard:', error);
    }
  };

  const handleCorrect = async (flashcardId) => {
    setFlashcards(flashcards.filter((card) => card.id !== flashcardId));
    if (flashcards.length === 1) {
      await fetchFlashcards();
      await fetchStats();
      await checkUnarchivedFlashcards();
    }
  };

  const handleIncorrect = async (flashcardId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/progress/unarchive`,
        { flashcardId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      await fetchFlashcards();
      await fetchStats();
      await checkUnarchivedFlashcards();
      if (flashcards.length === 1) {
        setIsQuizMode(false);
      }
    } catch (error) {
      console.error('Error unarchiving flashcard:', error);
    }
  };

  // حالت نمایش را به فلش‌کارت‌های بایگانی‌شده تغییر می‌دهد
  const switchToArchivedMode = () => {
    setIsQuizMode(true);
  };

  // حالت نمایش را به فلش‌کارت‌های بایگانی‌نشده تغییر می‌دهد
  const switchToUnarchivedMode = () => {
    setIsQuizMode(false);
  };

  if (stats.total_count > 0 && stats.unarchived_count === 0 && !isQuizMode) {
    return (
      <div className="no-flashcards">
        تبریک می‌گویید! همه فلش‌کارت‌ها را یاد گرفته‌اید!
        {stats.archived_count > 0 && (
          <button onClick={switchToArchivedMode} className="mode-switch-button">
            مشاهده فلش‌کارت‌های بایگانی‌شده
          </button>
        )}
      </div>
    );
  }

  if (!flashcards.length) {
    return (
      <div className="no-flashcards">
        هیچ فلش‌کارتی برای نمایش وجود ندارد!
        {hasUnarchived ? (
          <button onClick={fetchFlashcards} className="start-quiz-button">
            بارگذاری مجدد
          </button>
        ) : null}
        {stats.archived_count > 0 && !isQuizMode && (
          <button onClick={switchToArchivedMode} className="mode-switch-button">
            مشاهده فلش‌کارت‌های بایگانی‌شده
          </button>
        )}
        {stats.unarchived_count > 0 && isQuizMode && (
          <button onClick={switchToUnarchivedMode} className="mode-switch-button">
            مشاهده فلش‌کارت‌های بایگانی‌نشده
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flashcard-list">
      <div className="stats-boxes">
        <div 
          className={`stats-box unarchived-box ${!isQuizMode ? 'active' : ''}`}
          onClick={switchToUnarchivedMode}
          role="button"
          tabIndex={0}
        >
          <h3>بایگانی‌نشده</h3>
          <p>{stats.unarchived_count}</p>
        </div>
        <div 
          className={`stats-box archived-box ${isQuizMode ? 'active' : ''}`}
          onClick={switchToArchivedMode}
          role="button"
          tabIndex={0}
        >
          <h3>بایگانی‌شده</h3>
          <p>{stats.archived_count}</p>
        </div>
        <div className="stats-box total-box">
          <h3>کل</h3>
          <p>{stats.total_count}</p>
        </div>
      </div>
      <div className="flashcard-grid">
        {flashcards.map((flashcard) => (
          <Flashcard
            key={flashcard.id}
            flashcard={flashcard}
            onArchive={handleArchive}
            onKeep={handleKeep}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
            isQuizMode={isQuizMode}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardList;