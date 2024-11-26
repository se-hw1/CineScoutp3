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
import Watchlist from './pages/Watchlist'; 
import SurpriseMeWithQuiz from './pages/Quiz';
import './styles.css';

const App = () => {
    const [preferences, setPreferences] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(''); // State for selected language
    const [movieList, setMovieList] = useState([]);
    const [watchlist, setWatchlist] = useState([]);

    // Fetch watchlist from local storage
    useEffect(() => {
        const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        setWatchlist(savedWatchlist);
    }, []);

    const handlePreferencesSubmit = (selectedGenres) => {
        setPreferences(selectedGenres);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleSetMovies = (movies) => {
        setMovieList(movies);
    };

    const addToWatchlist = (movie) => {
        const updatedWatchlist = [...watchlist, movie];
        setWatchlist(updatedWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    };

    return (
        <Router>
            <div className="app">
                {isLoggedIn && <Header onLanguageChange={setSelectedLanguage} />}
                <Routes>
                    <Route path="/" element={<Login onLogin={handleLogin} />} />
                    <Route path="/create-account" element={<CreateAccount />} />
                    <Route path="/preferences" element={<Preferences onSubmit={handlePreferencesSubmit} />} />
                    <Route path="/recommendations" element={<Recommendations preferences={preferences} language={selectedLanguage} />} />
                    <Route path="/surprise" element={<SurpriseMe preferences={preferences} language={selectedLanguage} />} />
                    <Route path="/search" element={<SearchResults onAddToWatchlist={addToWatchlist} />} />
                    <Route path="/movie/:title" element={<MovieDetails />} />
                    <Route path="/watchlist" element={<Watchlist watchlist={watchlist} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                    <Route path="/search" element={<SearchResults movieListGet={movieList} movieListSet={handleSetMovies} onAddToWatchlist={addToWatchlist} />} />
                    <Route path="/quiz" element={<SurpriseMeWithQuiz language={selectedLanguage} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
