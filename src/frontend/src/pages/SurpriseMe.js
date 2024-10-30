// src/pages/SurpriseMe.js
import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import axios from 'axios';
import './SurpriseMe.css'; // Import the CSS file for styling

const SurpriseMe = ({ language }) => {
    const [surpriseMovie, setSurpriseMovie] = useState(null);
    const [error, setError] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState('');

    const fetchSurpriseMovie = async () => {
        setError(null);
        try {
            const apiKey = '553e58f2e00ea880760f32eb9549e073';
            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&with_original_language=${language}&sort_by=popularity.desc`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
                setSurpriseMovie(randomMovie);
            } else {
                setError('No suitable movies found.');
            }
        } catch (err) {
            setError('Error fetching a surprise movie.');
        }
    };

    const fetchTrailer = async () => {
        if (!surpriseMovie) return; // Ensure there is a movie selected
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${surpriseMovie.id}/videos?api_key=553e58f2e00ea880760f32eb9549e073`
            );

            const trailers = response.data.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailers.length > 0) {
                setTrailerUrl(`https://www.youtube.com/embed/${trailers[0].key}`);
                setShowTrailer(true);
            } else {
                setError('Trailer not available for this movie.');
            }
        } catch (error) {
            setError('Failed to fetch trailer.');
            console.error('Error fetching trailer:', error);
        }
    };

    useEffect(() => {
        fetchSurpriseMovie();
    }, [language]); // Added language as a dependency

    return (
        <div className="surprise-container">
            <h2>Surprise Movie</h2>
            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                surpriseMovie && (
                    <div className="movie-details-container">
                        <div className="movie-poster">
                            <img src={`https://image.tmdb.org/t/p/w500/${surpriseMovie.poster_path}`} alt={surpriseMovie.title} />
                        </div>
                        <div className="movie-content">
                            <h3 className="movie-title">{surpriseMovie.title}</h3>
                            <p><strong>Release Date:</strong> {surpriseMovie.release_date}</p>
                            <p className="movie-overview"><strong>Overview:</strong> {surpriseMovie.overview}</p>
                            <p><strong>Rating:</strong> {surpriseMovie.vote_average}</p>
                            <button className="watch-button" onClick={() => alert('This is a placeholder for the watch functionality!')}>
                                Watch
                            </button>
                            {/* Add Watch Trailer Button */}
                            <button className="watch-button" onClick={fetchTrailer}>
                                Watch Trailer
                            </button>
                        </div>
                    </div>
                )
            )}
            <button className="surprise-button" onClick={fetchSurpriseMovie}>Get Another Surprise</button>

            {/* Trailer Modal Overlay */}
            {showTrailer && (
                <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
                    <div className="trailer-content">
                        <iframe
                            width="100%"
                            height="100%"
                            src={trailerUrl}
                            title="Movie Trailer"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SurpriseMe;
