import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import config from '../config';
import LoadingSpinner from '../components/LoadingSpinner';

const BrowseMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${config.API_KEY}`
                );
                setMovies(response.data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Browse Movies</h2>
            {movies.length > 0 ? (
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <p>No movies found.</p>
            )}
        </div>
    );
};

export default BrowseMovies;
