import { useState } from 'react';
import '../styles/Flashcard.css';

const Flashcard = ({ flashcard, onScore, onPrevious, onNext, isFirst, isLast }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleScore = (score) => {
    onScore(flashcard.id, score);
    setIsFlipped(false);
  };

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <h2>{flashcard.word}</h2>
            <p>{flashcard.pronunciation}</p>
          </div>
          <div className="flashcard-back">
            <p><strong>ترجمه:</strong> {flashcard.translation}</p>
            <p><strong>معنی:</strong> {flashcard.meaning}</p>
            <p><strong>مثال:</strong> {flashcard.example}</p>
            <p><strong>نکته:</strong> {flashcard.tip}</p>
            <p><strong>دسته‌بندی:</strong> {flashcard.category}</p>
          </div>
        </div>
      </div>
      {isFlipped && (
        <div className="score-buttons">
          <button onClick={onPrevious} disabled={isFirst} className="nav-button previous">
            قبلی
          </button>
          <button onClick={() => handleScore(0)} className="score-button again">
            دوباره
          </button>
          <button onClick={() => handleScore(1)} className="score-button hard">
            سخت
          </button>
          <button onClick={() => handleScore(2)} className="score-button good">
            متوسط
          </button>
          <button onClick={() => handleScore(3)} className="score-button easy">
            آسان
          </button>
          <button onClick={onNext} disabled={isLast} className="nav-button next">
            بعدی
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;