// src/pages/MovieDetails.js
import React from 'react';

const MovieDetails = ({ movie }) => {
    if (!movie) {
        return <div>Loading...</div>; // Show loading state if no movie data is available
    }

    return (
        <div>
            <h1>{movie.title}</h1>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <p>{movie.overview}</p>
            {/* Add more movie details as needed */}
        </div>
    );
};

export default MovieDetails;
