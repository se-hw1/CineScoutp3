// src/pages/MovieDetails.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import LoadingSpinner from '../components/LoadingSpinner';
import './MovieDetails.css';

const MovieDetails = ({movieListGet, movieListSet}) => {
    const { title } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    const onWatchMovie = () => {
        var movieTitle = title
        console.log(title)
        fetch("http://localhost:5000/updatehistory", {
            method : 'post',
            credentials : 'include',
            body: JSON.stringify({movie_title : movieTitle})
        }).then((response) => {
                navigate("/recommendations")
        })
        
    }

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/search/movie?api_key=${config.API_KEY}&query=${title}`
                );
                
                setMovie(response.data.results[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [title]);

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
                <button className="watch-button" onClick={onWatchMovie}>
                    Watch
                </button>
            </div>
        </div>
    );
};

export default MovieDetails;
