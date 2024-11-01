// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './Login';
import Preferences from './pages/Preferences';
import Recommendations from './pages/Recommendations';
import SearchResults from './pages/SearchResults';
import MovieDetails from './pages/MovieDetails';
import CreateAccount from './CreateAccount'; 
import SurpriseMe from './pages/SurpriseMe'; 
import './styles.css';

const App = () => {
    const [preferences, setPreferences] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(''); // State for selected language
    const [movieList, setMovieList] = useState([])

    // Fetch preferences from local storage
    useEffect(() => {
        const storedGenres = JSON.parse(localStorage.getItem('selectedGenres')) || [];
        setPreferences(storedGenres);
    }, []);

    const handlePreferencesSubmit = (selectedGenres) => {
        setPreferences(selectedGenres);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleSetMovies = (movies) => {
        setMovieList(movies)
    }

    return (
        <Router>
            <div className="app">
                {isLoggedIn && <Header onLanguageChange={setSelectedLanguage} />} {/* Pass setSelectedLanguage */}
                <Routes>
                    <Route path="/" element={<Login onLogin={handleLogin} movieListGet={movieList} movieListSet={handleSetMovies}/>} />
                    <Route path="/create-account" element={<CreateAccount />} />
                    <Route path="/preferences" element={<Preferences onSubmit={handlePreferencesSubmit} movieListGet={movieList} movieListSet={handleSetMovies}/>} />
                    <Route path="/recommendations" element={<Recommendations preferences={preferences} language={selectedLanguage} movieListGet={movieList} movieListSet={handleSetMovies} />} /> {/* Pass language prop */}
                    <Route path="/surprise" element={<SurpriseMe preferences={preferences} language={selectedLanguage} movieListGet={movieList} movieListSet={handleSetMovies} />} /> {/* Pass language prop */}
                    <Route path="/search" element={<SearchResults movieListGet={movieList} movieListSet={handleSetMovies}/>} />
                    <Route path="/movie/:title" element={<MovieDetails movieListGet={movieList} movieListSet={handleSetMovies}/>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
