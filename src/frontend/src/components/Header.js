import React from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import Sort from './Sort'; // Import Sort component
import './Header.css';

const Header = ({ onSort, onLanguageChange }) => {
    const handleLanguageChange = (e) => {
        onLanguageChange(e.target.value);
    };

    return (
        <header className="header">
            <h1>CineScout</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/preferences">Preferences</Link>
                <Link to="/recommendations">Recommendations</Link>
                <Link to="/surprise">Surprise Me</Link>
            </nav>
            <div className="filters-container">
                <Sort onSort={onSort} />
                <Search />
                <div className="language-container">
                    <label htmlFor="language-select">Language:</label>
                    <select id="language-select" onChange={handleLanguageChange} className="language-select">
                        <option value="">Select Language</option>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                        <option value="zh">Chinese</option>
                    </select>
                </div>
            </div>
        </header>
    );
};

export default Header;
