import React, { useState } from 'react';
import axios from 'axios';
import './Quiz.css';

const SurpriseMeWithQuiz = ({ language }) => {
    const [quizStep, setQuizStep] = useState(0);
    const [preferences, setPreferences] = useState({});
    const [surpriseMovie, setSurpriseMovie] = useState(null);
    const [error, setError] = useState(null);

    // Quiz questions
    const questions = [
        {
            question: 'What genre do you prefer?',
            options: ['Action', 'Comedy', 'Drama', 'Sci-Fi'],
            key: 'genre',
        },
        {
            question: 'What mood are you in?',
            options: ['Excited', 'Relaxed', 'Emotional', 'Curious'],
            key: 'mood',
        },
        {
            question: 'Pick a release year range:',
            options: ['Before 2000', '2000-2010', '2010-2020', '2020-Present'],
            key: 'year',
        },
    ];

    const fetchSurpriseMovie = async (currentPreferences) => {
        try {
            setError(null); // Clear previous errors
            const genreMap = {
                Action: 28,
                Comedy: 35,
                Drama: 18,
                SciFi: 878,
            };

            const genre = genreMap[currentPreferences.genre];
            const yearRange = {
                'Before 2000': { min: 1900, max: 1999 },
                '2000-2010': { min: 2000, max: 2010 },
                '2010-2020': { min: 2010, max: 2020 },
                '2020-Present': { min: 2020, max: new Date().getFullYear() },
            }[currentPreferences.year];

            const url = `https://api.themoviedb.org/3/discover/movie?api_key=553e58f2e00ea880760f32eb9549e073&include_adult=false&with_genres=${genre}&primary_release_date.gte=${yearRange.min}-01-01&primary_release_date.lte=${yearRange.max}-12-31&with_original_language=${language}&sort_by=popularity.desc`;

            const response = await axios.get(url);
            if (response.data.results && response.data.results.length > 0) {
                const randomMovie = response.data.results[Math.floor(Math.random() * response.data.results.length)];
                setSurpriseMovie(randomMovie);
            } else {
                setError('No suitable movies found.');
            }
        } catch (err) {
            setError('Error fetching a surprise movie.');
        }
    };

    const handleAnswer = (option) => {
        const updatedPreferences = {
            ...preferences,
            [questions[quizStep].key]: option,
        };

        setPreferences(updatedPreferences);

        if (quizStep < questions.length - 1) {
            // Move to the next question
            setQuizStep(quizStep + 1);
        } else {
            // Fetch the surprise movie once the quiz is complete
            fetchSurpriseMovie(updatedPreferences);
        }
    };

    const resetQuiz = () => {
        setQuizStep(0);
        setPreferences({});
        setSurpriseMovie(null);
        setError(null);
    };

    return (
        <div className="surprise-container">
            <h2>Surprise Movie Quiz</h2>
            {quizStep < questions.length ? (
                <div className="quiz-container">
                    <h3>{questions[quizStep].question}</h3>
                    <div className="quiz-options">
                        {questions[quizStep].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                className="quiz-option"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    {error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        surpriseMovie && (
                            <div className="movie-details-container">
                                <div className="movie-poster">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500/${surpriseMovie.poster_path}`}
                                        alt={surpriseMovie.title}
                                    />
                                </div>
                                <div className="movie-content">
                                    <h3>{surpriseMovie.title}</h3>
                                    <p>
                                        <strong>Release Date:</strong>{' '}
                                        {surpriseMovie.release_date}
                                    </p>
                                    <p>
                                        <strong>Overview:</strong>{' '}
                                        {surpriseMovie.overview}
                                    </p>
                                    <p>
                                        <strong>Rating:</strong>{' '}
                                        {surpriseMovie.vote_average}
                                    </p>
                                    <button className="watch-button" onClick={resetQuiz}>
                                        Retake Quiz
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default SurpriseMeWithQuiz;
