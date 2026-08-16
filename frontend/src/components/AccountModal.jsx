import React, { useState } from 'react';
import './AccountModal.css';

function AccountModal({ isOpen, onClose, user, setUser, setLifetimeWords }) {
    const [authMode, setAuthMode] = useState('login');
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const clearForm = () => {
        setUsernameInput('');
        setPasswordInput('');
        setAuthError('');
    };

    const handleModeSwitch = (mode) => {
        setAuthMode(mode);
        setAuthError('');
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setIsSubmitting(true);

        const endpoint = authMode === 'login' 
            ? 'http://127.0.0.1:8000/api/login/' 
            : 'http://127.0.0.1:8000/api/register/';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usernameInput,
                    password: passwordInput
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (authMode === 'login') {
                    localStorage.setItem('inf_type_token', data.token);
                    localStorage.setItem('inf_type_user', data.username);
                    localStorage.setItem('inf_type_lifetime_words', data.lifetime_words);
                    
                    setUser(data.username);
                    setLifetimeWords(data.lifetime_words);
                    
                    clearForm();
                    onClose();
                } else {
                    handleModeSwitch('login');
                    setPasswordInput('');
                    setAuthError('Account created successfully! You can now log in.');
                }
            } else {
                setAuthError(data.error || data.detail || 'Authentication failed. Please check your credentials.');
            }
        } catch (err) {
            console.error(err);
            setAuthError('Unable to connect to the backend server.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('inf_type_token');
        localStorage.removeItem('inf_type_user');
        localStorage.removeItem('inf_type_lifetime_words');
        setUser(null);
        setLifetimeWords(0);
        clearForm();
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content account-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{user ? 'Account' : authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                {user ? (
                    <div className="auth-profile">
                        <div className="profile-avatar">
                            {user.slice(0, 2).toUpperCase()}
                        </div>
                        <h3 className="profile-username">{user}</h3>
                        <p className="profile-status">Status: <span>Connected</span></p>

                        <button className="logout-btn" onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                ) : (
                    <div className="auth-form-container">
                        {authError && (
                            <div className={`auth-message ${authError.includes('successfully') ? 'success' : 'error'}`}>
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleAuthSubmit} className="auth-form">
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    placeholder="Username"
                                    value={usernameInput}
                                    onChange={(e) => setUsernameInput(e.target.value)}
                                    autoComplete="username"
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <input 
                                    type="password" 
                                    placeholder="Password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                                    required 
                                />
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                                {isSubmitting 
                                    ? 'Processing...' 
                                    : authMode === 'login' ? 'Sign In' : 'Register'}
                            </button>
                        </form>

                        <p className="auth-toggle-text">
                            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button 
                                type="button" 
                                className="auth-toggle-btn"
                                onClick={() => handleModeSwitch(authMode === 'login' ? 'register' : 'login')}
                            >
                                {authMode === 'login' ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AccountModal;