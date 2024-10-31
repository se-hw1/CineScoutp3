// src/pages/Preferences.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Preferences.css';
import { getmovielist, setmovielist } from './.func';

const Preferences = () => {
    const availableGenres = [28, 35, 18, 27, 10749, 878]; // TMDB genre IDs
    const genreNames = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Documentary'];
    const [selectedGenres, setSelectedGenres] = useState([]);
    const navigate = useNavigate();

    const toggleGenre = (genreId) => {
        setSelectedGenres((prev) =>
            prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        var Arr = getmovielist();
        for (var i = 0; i < 50; i++) {
            Arr = Arr.concat("The Avengers");
        }
        setmovielist(Arr);
        localStorage.setItem('selectedGenres', JSON.stringify(selectedGenres));
        
        navigate('/recommendations');
    };

    return (
        <div className="preferences-container">
            <h2>Select Your Favorite Genres</h2>
            <div className="genres-list">
                {genreNames.map((genre, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`genre-button ${selectedGenres.includes(availableGenres[index]) ? 'selected' : ''}`}
                        onClick={() => toggleGenre(availableGenres[index])}
                    >
                        {genre}
                    </button>
                ))}
            </div>
            <button className="save-button" onClick={handleSubmit}>Save Preferences</button>
        </div>
    );
};

export default Preferences;
