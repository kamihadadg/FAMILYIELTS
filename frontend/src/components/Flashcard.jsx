import { useState } from 'react';
import '../styles/Flashcard.css';

const Flashcard = ({ flashcard, onScore, onPrevious, onNext, isFirst, isLast, onRefresh }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleScore = (score) => {
    console.log(`Scoring flashcard ${flashcard.id} with score ${score}`);
    onScore(flashcard.id, score);
    setIsFlipped(false);
    if (onRefresh) {
      console.log('Calling onRefresh after scoring');
      onRefresh();
    }
  };

  const speakPronunciation = () => {
    if (!window.speechSynthesis) {
      console.log('Speech Synthesis API is not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(flashcard.pronunciation || flashcard.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Female')) || voices[0];
    if (voice) utterance.voice = voice;

    utterance.onend = () => console.log('Pronunciation finished');
    utterance.onerror = (event) => console.error('Speech synthesis error:', event.error);

    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    speakPronunciation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <h2>{flashcard.word}</h2>
            <p>{flashcard.pronunciation}</p>
          </div>
          <div className="flashcard-back">
            <h2>{flashcard.word}</h2>
            <p><strong>ترجمه:</strong> {flashcard.translation}</p>
            <p><strong>معنی:</strong> {flashcard.meaning}</p>
            <p><strong>مثال:</strong> {flashcard.example}</p>
            <p><strong>نکته:</strong> {flashcard.tip}</p>
            <p><strong>دسته‌بندی:</strong> {flashcard.category}</p>
            <p><strong>وضعیت:</strong> {flashcard.status}</p>
          </div>
        </div>
      </div>
      {isFlipped && (
        <div className="score-buttons">
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
        </div>
      )}
    </div>
  );
};

export default Flashcard;