// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Update to use the new CSS file

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username && password) {
            onLogin();
            navigate('/preferences');
        }
    };

    const handleCreateAccount = () => {
        navigate('/create-account'); // Navigate to Create Account page
    };

    return (
        <div className="login-container">
            <h1>Welcome to CineScout</h1>
            <form onSubmit={handleLogin} className="login-form">
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    className="login-input" // Apply new styling
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="login-input" // Apply new styling
                />
                <button type="submit" className="login-button">Login</button> {/* Apply new styling */}
            </form>
            <p>
                Don't have an account? 
                <button onClick={handleCreateAccount} className="create-account-button">Create Account</button> {/* Apply new styling */}
            </p>
        </div>
    );
};

export default Login;
