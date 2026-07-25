import { useState, useEffect, useRef } from 'react';
import LeaderboardModal from './components/LeaderboardModal';
import AccountModal from './components/AccountModal';
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
            if (value.length <= (wordQueue[0]?.length || 0)) {
                setUserInput(value);
            }
        }
    };

    const focusInput = () => {
        if (!activeModal) inputRef.current?.focus();
    };

    const currentWord = wordQueue[0] || '';
    const nextWord = wordQueue[1] || '';

    const renderLetters = () => {
        return currentWord.split('').map((letter, index) => {
            let charClass = "char";
            if (index >= userInput.length) charClass += " untyped";
            else if (userInput[index] === letter) charClass += " correct";
            else charClass += " incorrect";
            return <span key={index} className={charClass}>{letter}</span>;
        });
    };

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

            {/* --- Main Typing Area --- */}
            <main className="typing-area">
                <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    className="hidden-input"
                    autoFocus
                />
                
                <div className="wheel-container">
                    <div className="wheel-slot slot-side">{previousWord}</div>
                    <div className="wheel-slot slot-current">
                        {renderLetters()}
                        <div className="underline-glow"></div>
                    </div>
                    <div className="wheel-slot slot-side">{nextWord}</div>
                </div>
            </main>

            {/* --- Footer --- */}
            <footer className="game-footer">
                <p>Press space after each word.</p>
            </footer>

            {/* --- Modular Modals --- */}
            <LeaderboardModal 
                isOpen={activeModal === 'leaderboard'} 
                onClose={() => setActiveModal(null)} 
            />

            <AccountModal 
                isOpen={activeModal === 'account'} 
                onClose={() => setActiveModal(null)} 
            />

        </div>
    );
}

export default App;