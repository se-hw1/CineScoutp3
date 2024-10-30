// src/pages/Recommendations.js
import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import './Recommendations.css';
import { getmovielist } from './.func';

const Recommendations = ({ language }) => {
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendedMovies = async () => {
            const selectedGenres = JSON.parse(localStorage.getItem('selectedGenres')) || [];

            if (selectedGenres.length === 0) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const apiKey = '553e58f2e00ea880760f32eb9549e073';
                const genreQuery = selectedGenres.join(',');
                var K = Array();
                var movietitle = getmovielist();

                for (var i = 0; i < 50; i++) {
                    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movietitle[i]}&with_original_language=${language}&include_adult=false`;
                    const response = await fetch(url);
                    const data = await response.json();
                    K = K.concat(data.results[0]);
                }

                if (K && K.length > 0) {
                    setRecommendedMovies(K);
                } else {
                    setError('No movies found for the selected genres.');
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                setError('Error fetching movies.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedMovies();
    }, [language]); // Added language as a dependency

    if (loading) return <div className="spinner">Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="recommendations-container">
            <h2>Recommended Movies</h2>
            <div className="movie-list">
                {recommendedMovies.length > 0 ? (
                    recommendedMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                ) : (
                    <p>No recommended movies available.</p>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
