import React from 'react';

function AccountModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div>
                    <h2>Your Account Profile</h2>
                    <p>Status: Guest Player</p>
                    <button className="auth-btn">Sign Up to Save Progress</button>
                </div>
            </div>
        </div>
    );
}

export default AccountModal;