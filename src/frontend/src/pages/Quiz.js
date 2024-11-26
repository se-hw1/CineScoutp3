import React, { useState } from 'react';
import './Quiz.css'; // Importing the CSS file
import axios from 'axios';
const SurpriseMeWithQuiz = () => {
    // State Management
    const [quizStep, setQuizStep] = useState(0);
    const [preferences, setPreferences] = useState({});
    const [surpriseMovie, setSurpriseMovie] = useState(null);
    const [error, setError] = useState(null);

    // Your API key
    const apiKey = '553e58f2e00ea880760f32eb9549e073';

    // Quiz Questions
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
        {
            question: 'How long should the movie duration be?',
            options: ['Short (Under 90 mins)', 'Medium (90-150 mins)', 'Long (Over 150 mins)'],
            key: 'duration',
        },
        {
            question: 'Which rating range do you prefer?',
            options: ['Under 5', '5-7', '7-9', '9+'],
            key: 'rating',
        },
    ];

    // Fetch a Surprise Movie
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

            const durationMap = {
                'Short (Under 90 mins)': { min: 0, max: 90 },
                'Medium (90-150 mins)': { min: 90, max: 150 },
                'Long (Over 150 mins)': { min: 150, max: 999 },
            };

            const duration = durationMap[currentPreferences.duration];

            const ratingMap = {
                'Under 5': { min: 0, max: 5 },
                '5-7': { min: 5, max: 7 },
                '7-9': { min: 7, max: 9 },
                '9+': { min: 9, max: 10 },
            };

            const rating = ratingMap[currentPreferences.rating];

            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&with_genres=${genre}&primary_release_date.gte=${yearRange.min}-01-01&primary_release_date.lte=${yearRange.max}-12-31&with_original_language=en&vote_average.gte=${rating.min}&vote_average.lte=${rating.max}&sort_by=popularity.desc&with_runtime.gte=${duration.min}&with_runtime.lte=${duration.max}`;

            console.log("Generated API URL:", url);

            const response = await axios.get(url);
            console.log("API Response:", response.data);

            if (response.data.results && response.data.results.length > 0) {
                const randomMovie = response.data.results[Math.floor(Math.random() * response.data.results.length)];
                setSurpriseMovie(randomMovie);
            } else {
                setError('No suitable movies found.');
            }
        } catch (err) {
            console.error("Error details:", err);
            setError('Error fetching a surprise movie.');
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
                fetchSurpriseMovie(updatedPreferences);
                setQuizStep(questions.length);
            }

            return updatedPreferences;
        });
    };

    // Reset Quiz
    const resetQuiz = () => {
        setQuizStep(0);
        setPreferences({});
        setSurpriseMovie(null);
        setError(null);
    };

    // Get the class name for dynamic styling of questions
    const getQuestionClass = () => {
        return `question question-step-${quizStep}`;
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Surprise Movie Quiz</h2>
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
                    ) : surpriseMovie ? (
                        <div>
                            <h3>Your Surprise Movie:</h3>
                            <p><strong>Title:</strong> {surpriseMovie.title}</p>
                            <p><strong>Release Date:</strong> {surpriseMovie.release_date}</p>
                            <p><strong>Overview:</strong> {surpriseMovie.overview}</p>
                            <p><strong>Rating:</strong> {surpriseMovie.vote_average}</p>
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${surpriseMovie.poster_path}`}
                                alt={surpriseMovie.title}
                                style={{ maxWidth: '200px', margin: '10px 0' }}
                            />
                        </div>
                    ) : (
                        <p>Loading your surprise movie...</p>
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

export default SurpriseMeWithQuiz;


