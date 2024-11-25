import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import './MovieCard.css';

const MovieCard = ({ movie, onAddToWatchlist }) => {
    const navigate = useNavigate();
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    const fetchTrailer = async () => {
        try {
            setError(null); // Clear previous error
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${config.API_KEY}`
            );

            const trailers = response.data.results.filter(
                (video) => video.type === 'Trailer' && video.site === 'YouTube'
            );
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

    const handleCardClick = () => {
        navigate(`/movie/${movie.title}`);
    };

    const handleAddToWatchlist = () => {
        if (onAddToWatchlist) {
            onAddToWatchlist(movie);
            // Show success message
            setSuccessMessage(`${movie.title} has been added to your watchlist!`);
            // Clear the message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        }
    };

    return (
        <div className="movie-card" style={{ cursor: 'pointer' }}>
            <div onClick={handleCardClick}>
                {movie.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                ) : (
                    <div className="placeholder">No Image Available</div>
                )}
                <h3>{movie.title}</h3>
                <p>{movie.release_date}</p>
                <p>{movie.overview}</p>
            </div>

            {/* Watch Trailer Button */}
            <button className="watch-trailer-button" onClick={fetchTrailer}>
                Watch Trailer
            </button>

            {/* Add to Watchlist Button */}
            <button
                className="add-to-watchlist-button"
                onClick={handleAddToWatchlist}
            >
                Add to Watchlist
            </button>

            {/* Success Message */}
            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}

            {/* Trailer Modal Overlay */}
            {showTrailer && (
                <div
                    className="trailer-overlay"
                    onClick={() => setShowTrailer(false)}
                >
                    <div
                        className="trailer-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-button"
                            onClick={() => setShowTrailer(false)}
                        >
                            ✕
                        </button>
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

            {/* Error Message if no trailer */}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default MovieCard;
