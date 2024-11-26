import React, { useState } from 'react';
import './Seasonal.css'; // Import the seasonal CSS file
import axios from 'axios';

const SeasonalMovieQuiz = () => {
    // State Management
    const [quizStep, setQuizStep] = useState(0);
    const [preferences, setPreferences] = useState({});
    const [seasonalMovie, setSeasonalMovie] = useState(null);
    const [error, setError] = useState(null);

    // Your API key for TMDb
    const apiKey = '553e58f2e00ea880760f32eb9549e073';

    // Seasonal themes and questions
    const questions = [
        {
            question: 'Which season are you in the mood for?',
            options: ['Summer Fun', 'Halloween Spooks', 'Christmas Cheer', 'Winter Relaxation'],
            key: 'season',
        }
    ];

    // Fetch Movies Based on Season
    const fetchSeasonalMovies = async (currentPreferences) => {
        try {
            setError(null); // Clear previous errors

            const genreMap = {
                'Summer Fun': 35, // Comedy
                'Halloween Spooks': 27, // Horror
                'Christmas Cheer': 10751, // Family
                'Winter Relaxation': 18, // Drama
            };

            const genre = genreMap[currentPreferences.season];
            const yearRange = { min: 2000, max: 2023 }; // Use a wide year range

            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&with_genres=${genre}&primary_release_date.gte=${yearRange.min}-01-01&primary_release_date.lte=${yearRange.max}-12-31&with_original_language=en&sort_by=popularity.desc`;

            console.log("Generated API URL:", url);

            const response = await axios.get(url);
            console.log("API Response:", response.data);

            if (response.data.results && response.data.results.length > 0) {
                const randomMovie = response.data.results[Math.floor(Math.random() * response.data.results.length)];
                setSeasonalMovie(randomMovie);
            } else {
                setError('No suitable movies found.');
            }
        } catch (err) {
            console.error("Error details:", err);
            setError('Error fetching seasonal movies.');
        }
    };

    // Handle Answer Selection
    const handleAnswer = (option) => {
        setPreferences((prev) => {
            const updatedPreferences = { ...prev, [questions[quizStep].key]: option };
            console.log('Updated Preferences:', updatedPreferences);

            if (quizStep + 1 < questions.length) {
                setQuizStep((prevStep) => prevStep + 1);
            } else {
                fetchSeasonalMovies(updatedPreferences);
                setQuizStep(questions.length);
            }

            return updatedPreferences;
        });
    };

    // Reset Quiz
    const resetQuiz = () => {
        setQuizStep(0);
        setPreferences({});
        setSeasonalMovie(null);
        setError(null);
    };

    // Get the class name for dynamic styling of questions
    const getQuestionClass = () => {
        return `seasonal-question seasonal-question-step-${quizStep}`;
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Seasonal Movie Quiz</h2>
            {quizStep < questions.length ? (
                <div>
                    <h3 className={getQuestionClass()}>{questions[quizStep].question}</h3>
                    <div className="quiz-options">
                        {questions[quizStep].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                style={{
                                    margin: '5px',
                                    padding: '10px',
                                    backgroundColor: '#007BFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    {error ? (
                        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
                    ) : seasonalMovie ? (
                        <div>
                            <h3>Your Seasonal Movie:</h3>
                            <p><strong>Title:</strong> {seasonalMovie.title}</p>
                            <p><strong>Release Date:</strong> {seasonalMovie.release_date}</p>
                            <p><strong>Overview:</strong> {seasonalMovie.overview}</p>
                            <p><strong>Rating:</strong> {seasonalMovie.vote_average}</p>
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${seasonalMovie.poster_path}`}
                                alt={seasonalMovie.title}
                                style={{ maxWidth: '200px', margin: '10px 0' }}
                            />
                        </div>
                    ) : (
                        <p>Loading your seasonal movie...</p>
                    )}
                    <button
                        onClick={resetQuiz}
                        style={{
                            padding: '10px',
                            backgroundColor: '#28A745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Retake Quiz
                    </button>
                </div>
            )}
        </div>
    );
};

export default SeasonalMovieQuiz;

