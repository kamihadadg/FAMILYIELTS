import { useState } from 'react';
import '../styles/Flashcard.css';

const Flashcard = ({ flashcard, onArchive, onKeep, onCorrect, onIncorrect, isQuizMode }) => {
  const [isFlipped, setIsFlipped] = useState(false);

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
            <p><strong>ترجمه:</strong> {flashcard.translation}</p>
            <p><strong>معنی:</strong> {flashcard.meaning}</p>
            <p><strong>مثال:</strong> {flashcard.example}</p>
            <p><strong>نکته:</strong> {flashcard.tip}</p>
            <p><strong>دسته‌بندی:</strong> {flashcard.category}</p>
            <p><strong>وضعیت:</strong> {flashcard.is_archived ? 'بایگانی‌شده' : 'بایگانی‌نشده'}</p>
          </div>
        </div>
      </div>
      {isFlipped && (
        <div className="score-buttons">
          {isQuizMode ? (
            <>
              <button onClick={() => onCorrect(flashcard.id)} className="score-button correct">
                درست
              </button>
              <button onClick={() => onIncorrect(flashcard.id)} className="score-button incorrect">
                غلط
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onArchive(flashcard.id)} className="score-button archive">
                بایگانی (یاد گرفتم)
              </button>
              <button onClick={() => onKeep(flashcard.id)} className="score-button keep">
                باقی بماند
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Flashcard;