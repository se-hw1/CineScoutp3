import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate here
import './Search.css'; // Ensure to import the updated CSS

const Search = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?query=${query}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="search-container">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a movie..."
                required
                className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    );
};

export default Search;
