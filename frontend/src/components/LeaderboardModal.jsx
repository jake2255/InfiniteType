import { useState, useEffect } from 'react';

function LeaderboardModal({ isOpen, onClose }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchLeaderboard();
        }
    }, [isOpen]);

    const fetchLeaderboard = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/leaderboard/');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to load leaderboard data.');
            }
            
            const list = data.leaderboard_data || [];

            if (Array.isArray(list)) {
                setLeaderboard(list);
            } else {
                setLeaderboard([]);
                setError('Invalid data format received from server.');
            }
        } catch (err) {
            console.error("Leaderboard fetch error:", err);
            setError('Could not retrieve standings. Make sure server is running.');
            setLeaderboard([]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Global Leaderboard</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {isLoading ? (
                    <div className="modal-status">Loading top typists...</div>
                ) : error ? (
                    <div className="modal-status error">{error}</div>
                ) : (
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Typist</th>
                                <th>Lifetime Words</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(leaderboard) && leaderboard.length > 0 ? (
                                leaderboard.map((player) => (
                                    <tr key={player.rank} className={player.rank <= 3 ? `top-rank rank-${player.rank}` : ''}>
                                        <td className="rank-col">#{player.rank}</td>
                                        <td className="user-col">{player.username}</td>
                                        <td className="words-col">{player.lifetime_words.toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center' }}>No typists found yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default LeaderboardModal;