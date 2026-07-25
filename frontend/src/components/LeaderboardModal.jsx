import React from 'react';

function LeaderboardModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div>
                    <h2>Global Leaderboard</h2>
                    <ol className="modal-list">
                        <li>Wordsmith_99 - 142,000 words</li>
                        <li>TypeRacerX - 98,500 words</li>
                        <li>CoffeeCoder - 45,210 words</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default LeaderboardModal;