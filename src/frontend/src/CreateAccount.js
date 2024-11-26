import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const CreateAccount = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Validate password: At least 8 characters with 1 number
        const isValid = /^(?=.*\d).{8,}$/.test(value);
        if (!isValid) {
            setPasswordError('Password must be at least 8 characters long and include at least 1 number.');
        } else {
            setPasswordError('');
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        let formData = new FormData();
        if (username && email && password && !passwordError) {
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);

            fetch("http://localhost:5000/register", {
                body: formData,
                method: "post",
            })
                .then((response) => response.json())
                .then((resp) => {
                    if (resp["redirect_url_key"] === "HOME") {
                        navigate("/recommendations");
                    } else if (resp["redirect_url_key"] === "LOGIN") {
                        navigate("/login");
                    } else {
                        alert('Failed to create account. Please try again.');
                    }
                });
        } else {
            alert('Please fill in all fields correctly.');
        }
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
                    className="login-input"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="login-input"
                />
                {passwordError && <p className="error-message">{passwordError}</p>}
                <button type="submit" className="login-button" disabled={!!passwordError}>
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default CreateAccount;
