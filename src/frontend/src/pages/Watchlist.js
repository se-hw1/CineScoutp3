import React from 'react';
import './Watchlist.css';

const Watchlist = ({ watchlist }) => {
    const removeFromWatchlist = (movieId) => {
        const updatedWatchlist = watchlist.filter((movie) => movie.id !== movieId);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        window.location.reload(); // Refresh the page to reflect the updated watchlist
    };

    return (
        <div className="watchlist-container">
            <h2>Your Watchlist</h2>
            {watchlist.length > 0 ? (
                <div className="watchlist-grid">
                    {watchlist.map((movie) => (
                        <div key={movie.id} className="watchlist-card">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="watchlist-poster"
                            />
                            <div className="watchlist-info">
                                <h3>{movie.title}</h3>
                                <p>Release Date: {movie.release_date}</p>
                                <button
                                    onClick={() => removeFromWatchlist(movie.id)}
                                    className="remove-button"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Your watchlist is empty. Start adding movies!</p>
            )}
        </div>
    );
};

export default Watchlist;
