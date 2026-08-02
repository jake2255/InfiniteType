import { useState, useEffect, useRef } from 'react';
import LeaderboardModal from './components/LeaderboardModal';
import AccountModal from './components/AccountModal';
import './App.css';

function App() {
    const [wordQueue, setWordQueue] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [lifetimeWords, setLifetimeWords] = useState(0);
    const [sessionWords, setSessionWords] = useState(0);
    const [previousWord, setPreviousWord] = useState('');
    const [activeModal, setActiveModal] = useState(null);
    const [user, setUser] = useState(null);
    const unsavedWordCount = useRef(0);
    const inputRef = useRef(null);
    
    const fetchWords = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/get_words/');
            const data = await response.json();
            return data.words || [];
        } catch (err) {
            console.error("Failed to fetch words from server:", err)
            return []
        }
    };
    
    useEffect(() => {
        const initializeGame = async () => {
            const newWords = await fetchWords();
            if (newWords.length > 0) {
                setWordQueue(newWords)
            }
        };
    
        initializeGame();
        
        const cachedUser = localStorage.getItem('inf_type_user');
        if (cachedUser) {
            setUser(cachedUser);
        }
        
        const cachedWordCount = localStorage.getItem('inf_type_lifetime_words');
        if (cachedWordCount) {
            setLifetimeWords(parseInt(cachedWordCount, 10));
        }
    }, [])

    const syncWordsToBackend = async () => {
        const token = localStorage.getItem('inf_type_token');
        const wordCountToSend = unsavedWordCount.current;

        if (!token || wordCountToSend <= 0) return;

        unsavedWordCount.current = 0;

        try {
            const response = await fetch('http://127.0.0.1:8000/api/update_count/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ words_typed: wordCountToSend }),
                keepalive: true
            });
            
            const data = await response.json();
            
            if (response.ok && data.lifetime_words !== undefined) {
                setLifetimeWords(data.lifetime_words);
                localStorage.setItem('inf_type_lifetime_words', data.lifetime_words);
            } else {
                unsavedWordCount.current += wordCountToSend;
            }
        } catch (err) {
            console.error("Sync error:", err);
            unsavedWordCount.current += wordCountToSend;
        }
    };

    useEffect(() => {
        const handleExit = () => syncWordsToBackend();
        window.addEventListener('beforeunload', handleExit);

        return () => {
            window.removeEventListener('beforeunload', handleExit);
        };
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;

        if (value.endsWith(' ')) {
            const trimmedInput = value.trim();
            const currentTargetWord = wordQueue[0];

            if (trimmedInput === currentTargetWord) {
                setSessionWords(prev => prev + 1);
                setLifetimeWords(prev => prev + 1);
                unsavedWordCount.current += 1;

                if (unsavedWordCount.current >= 5) { // CHANGE 5 TO LARGER VALUE 
                    syncWordsToBackend();
                }
            }

            setPreviousWord(currentTargetWord);
            setUserInput('');
            
            setWordQueue(prevQueue => {
                const updatedQueue = prevQueue.slice(1);
                
                if (updatedQueue.length < 10) { // INCREASE BUFFER WAIT SIZE
                    fetchWords().then(newWords => {
                        if (newWords.length > 0) {
                            setWordQueue(currentQueue => [...currentQueue, ...newWords]);
                        }
                    });
                }
                return updatedQueue;
            });
        } else {
            if (value.length <= (wordQueue[0]?.length || 0)) {
                setUserInput(value);
            }
        }
    };

    const openModal = (modalName) => {
        syncWordsToBackend(); 
        setActiveModal(modalName);
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
            
            <header className="game-header" onClick={(e) => e.stopPropagation()}>
                <div className="logo">InfiniteType</div>
                <div className="nav-buttons">
                    <button onClick={() => openModal('leaderboard')}>Leaderboard</button>
                    <button onClick={() => openModal('account')}>{user || 'Account'}</button>
                </div>
            </header>

            <div className="stats-dashboard">
                <div className="stat-box">
                    <span className="stat-label">Session</span>
                    <span className="stat-value">{sessionWords}</span>
                </div>
                <div className="stat-box">
                    <span className="stat-label">Lifetime</span>
                    <span className="stat-value">{lifetimeWords}</span>
                </div>
            </div>

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

            <footer className="game-footer">
                <p>Press space after each word.</p>
            </footer>

            <LeaderboardModal 
                isOpen={activeModal === 'leaderboard'} 
                onClose={() => setActiveModal(null)} 
            />

            <AccountModal 
                isOpen={activeModal === 'account'} 
                onClose={() => setActiveModal(null)} 
                user={user}
                setUser={setUser}
                setLifetimeWords={setLifetimeWords}
            />
        </div>
    );
}

export default App;