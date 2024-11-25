import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import config from '../config';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResults = ({ onAddToWatchlist }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/search/movie?api_key=${config.API_KEY}&query=${query}`
                );
                setMovies(response.data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [query]);

    const handleAddToWatchlist = (movie) => {
        const currentWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const updatedWatchlist = [...currentWatchlist, movie];

        // Update watchlist in localStorage
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));

        // Show success message
        setSuccessMessage(`${movie.title} has been added to your watchlist!`);

        // Clear the message after 3 seconds
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Search Results for: {query}</h2>
            {movies.length > 0 ? (
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onAddToWatchlist={onAddToWatchlist} // Pass the function to MovieCard
                        />
                    ))}
                </div>
            ) : (
                <p>No movies found.</p>
            )}
        </div>
    );
};

export default SearchResults;
