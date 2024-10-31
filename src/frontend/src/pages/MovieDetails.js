// src/pages/MovieDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import LoadingSpinner from '../components/LoadingSpinner';
import './MovieDetails.css';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${config.API_KEY}`
                );
                setMovie(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="movie-details-container">
            <div className="movie-poster">
                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
            </div>
            <div className="movie-content">
                <h2 className="movie-title">{movie.title}</h2>
                <p><strong>Release Date:</strong> {movie.release_date}</p>
                <p className="movie-overview"><strong>Overview:</strong> {movie.overview}</p>
                <p><strong>Rating:</strong> {movie.vote_average}</p>
                <button className="watch-button" onClick={() => alert('This is a placeholder for the watch functionality!')}>
                    Watch
                </button>
            </div>
        </div>
    );
};

export default MovieDetails;
