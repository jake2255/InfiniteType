import { useState, useEffect, useRef } from 'react';
import './App.css';

const WORD_POOL = [
  "the", "cool", "breeze", "whispered", "through", "the", "trees", "as", "i", "typed",
  "infinite", "loops", "are", "fun", "until", "they", "crash", "your", "browser", "zen",
  "javascript", "python", "django", "react", "keyboard", "spacebar", "flow", "rhythm"
];

function App() {
  const [wordQueue, setWordQueue] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [lifetimeWords, setLifetimeWords] = useState(0);
  const [sessionWords, setSessionWords] = useState(0);
  const [previousWord, setPreviousWord] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const initialQueue = Array.from({ length: 5 }, () => 
      WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]
    );
    setWordQueue(initialQueue);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value.endsWith(' ')) {
      const trimmedInput = value.trim();
      const currentTargetWord = wordQueue[0];

      if (trimmedInput === currentTargetWord) {
        setSessionWords(prev => prev + 1);
        setLifetimeWords(prev => prev + 1);
      }

      setPreviousWord(currentTargetWord);

      setWordQueue(prevQueue => {
        const updatedQueue = [...prevQueue.slice(1)];
        const nextNewWord = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
        return [...updatedQueue, nextNewWord];
      });

      setUserInput('');
    } else {
      setUserInput(value);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const currentWord = wordQueue[0] || '';
  const nextWord = wordQueue[1] || '';

  return (
    <div className="app-container" onClick={focusInput}>
      
      {/* --- Top Navigation --- */}
      <header className="game-header" onClick={(e) => e.stopPropagation()}>
        <div className="logo">InfiniteType</div>
        <div className="nav-buttons">
          <button onClick={() => setActiveModal('leaderboard')}>Leaderboard</button>
          <button onClick={() => setActiveModal('account')}>Account</button>
        </div>
      </header>

      {/* --- Score Dashboard --- */}
      <div className="stats-dashboard">
        <div className="stat-box">
          <span className="stat-label">Session</span>
          <span className="stat-value">{sessionWords}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Lifetime Total</span>
          <span className="stat-value">{lifetimeWords}</span>
        </div>
      </div>

      {/* --- Main Typing Area (The Wheel Setup) --- */}
      <main className="typing-area">
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="hidden-input"
          autoFocus
        />
        
        {/* The Scrolling Wheel Track */}
        <div className="wheel-container">
          <div className="wheel-slot slot-previous">{previousWord}</div>
          <div className="wheel-slot slot-current">
            {currentWord}
            <div className="underline-glow"></div>
          </div>
          <div className="wheel-slot slot-next">{nextWord}</div>
        </div>
      </main>

      {/* --- Footer Hint --- */}
      <footer className="game-footer">
        <p>Press space after each word. Pure focus.</p>
      </footer>

      {/* --- Pop-up Modals Overlay --- */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            {activeModal === 'leaderboard' && (
              <div>
                <h2>Global Leaderboard</h2>
                <ol className="modal-list">
                  <li>Wordsmith_99 - 142,000 words</li>
                  <li>TypeRacerX - 98,500 words</li>
                  <li>CoffeeCoder - 45,210 words</li>
                </ol>
              </div>
            )}
            {activeModal === 'account' && (
              <div>
                <h2>Your Account Profile</h2>
                <p>Status: Guest Player</p>
                <button className="auth-btn">Sign Up to Save Progress</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;