import React, { useState } from 'react';
import './Sort.css'; // Ensure to import the updated CSS

const Sort = ({ onSort }) => {
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState('');
    const [rating, setRating] = useState('');

    const handleSort = (e) => {
        e.preventDefault();
        onSort({ genre, year, rating });
    };

    return (
        <form onSubmit={handleSort} className="sort-container">
            <select value={genre} onChange={(e) => setGenre(e.target.value)} className="sort-select">
                <option value="">Select Genre</option>
                <option value="28">Action</option>
                <option value="35">Comedy</option>
                <option value="18">Drama</option>
                <option value="27">Horror</option>
                <option value="10749">Romance</option>
                <option value="878">Sci-Fi</option>
            </select>
            <input
                type="number"
                placeholder="Year (YYYY)"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="sort-input"
            />
            <input
                type="number"
                placeholder="Rating (1-10)"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="sort-input"
            />
            <button type="submit" className="sort-button">Sort</button>
        </form>
    );
};

export default Sort;
