import React, { useState } from 'react';
import './AccountModal.css';

function AccountModal({ isOpen, onClose, user, setUser, setLifetimeWords }) {
    const [authMode, setAuthMode] = useState('login');
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');

    if (!isOpen) return null;

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');

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
                    
                    onClose();
                    clearForm();
                } else {
                    alert("Account created successfully!");
                    setAuthMode('login');
                    setPasswordInput('');
                }
            } else {
                setAuthError(data.error || "Authentication failed.");
            }
        } catch (err) {
            setAuthError("Unable to connect to the backend server.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('inf_type_token');
        localStorage.removeItem('inf_type_user');
        setUser(null);
        setLifetimeWords(0);
        onClose();
    };

    const clearForm = () => {
        setUsernameInput('');
        setPasswordInput('');
        setAuthError('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                
                {user ? (
                    /* --- Logged In View --- */
                    <div className="auth-profile">
                        <h2>Welcome, {user}!</h2>
                        <p>Status: Logged In</p>
                        <button className="logout-btn" onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                ) : (
                    /* --- Form View --- */
                    <div className="auth-form-container">
                        <h2>{authMode === 'login' ? 'Log In' : 'Create Account'}</h2>
                        
                        {authError && <div className="auth-error">{authError}</div>}
                        
                        <form onSubmit={handleAuthSubmit} className="auth-form">
                            <input 
                                type="text" 
                                placeholder="Username"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                required 
                            />
                            <input 
                                type="password" 
                                placeholder="Password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                required 
                            />
                            <button type="submit" className="auth-btn">
                                {authMode === 'login' ? 'Sign In' : 'Register'}
                            </button>
                        </form>

                        <p className="auth-toggle-text">
                            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <span onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                                {authMode === 'login' ? 'Sign Up' : 'Log In'}
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AccountModal;