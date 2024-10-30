// src/CreateAccount.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const CreateAccount = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleCreate = (e) => {
        e.preventDefault();
        // Here you can add the logic to create an account (e.g., API call)
        // For now, just navigate back to the login page
        navigate('/');
    };

    return (
        <div className="login-container">
            <h1>Create Account</h1>
            <form onSubmit={handleCreate} className="login-form">
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
};

export default CreateAccount;
