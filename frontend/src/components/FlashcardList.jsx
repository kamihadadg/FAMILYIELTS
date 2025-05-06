import { useEffect, useState } from 'react';
import axios from 'axios';
import Flashcard from './Flashcard';
import '../styles/FlashcardList.css';

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);

  const fetchDueFlashcards = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/progress/due`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Fetched flashcards:', response.data);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching due flashcards:', error);
    }
  };

  useEffect(() => {
    fetchDueFlashcards();
  }, []);

  const handleScore = async (flashcardId, score) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/progress/update`,
        { flashcardId, score },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      console.log('Score response:', response.data);

      // تاخیر کوچک برای اطمینان از به‌روزرسانی Backend
      setTimeout(async () => {
        await fetchDueFlashcards();
      }, 100);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handlePrevious = (currentIndex) => {
    if (currentIndex > 0) {
      const newFlashcards = [...flashcards];
      [newFlashcards[currentIndex], newFlashcards[currentIndex - 1]] = [
        newFlashcards[currentIndex - 1],
        newFlashcards[currentIndex],
      ];
      setFlashcards(newFlashcards);
    }
  };

  const handleNext = (currentIndex) => {
    if (currentIndex < flashcards.length - 1) {
      const newFlashcards = [...flashcards];
      [newFlashcards[currentIndex], newFlashcards[currentIndex + 1]] = [
        newFlashcards[currentIndex + 1],
        newFlashcards[currentIndex],
      ];
      setFlashcards(newFlashcards);
    }
  };

  if (!flashcards.length) {
    return <div className="no-flashcards">هیچ فلش‌کارتی برای امروز باقی نمانده!</div>;
  }

  return (
    <div className="flashcard-list">
      <div className="flashcard-grid">
        {flashcards.map((flashcard, index) => (
          <Flashcard
            key={flashcard.id}
            flashcard={flashcard}
            onScore={handleScore}
            onPrevious={() => handlePrevious(index)}
            onNext={() => handleNext(index)}
            isFirst={index === 0}
            isLast={index === flashcards.length - 1}
            onRefresh={fetchDueFlashcards}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardList;