import React, { useState, useEffect } from 'react';

const GamifiedMovies = () => {
    const mockMovies = [
        // Action
        { id: 1, title: 'The Dark Knight', genre: 'Action' },
        { id: 2, title: 'Mad Max: Fury Road', genre: 'Action' },
        { id: 3, title: 'John Wick', genre: 'Action' },
        { id: 4, title: 'Die Hard', genre: 'Action' },
        { id: 5, title: 'Gladiator', genre: 'Action' },

        // Horror
        { id: 6, title: 'The Conjuring', genre: 'Horror' },
        { id: 7, title: 'Get Out', genre: 'Horror' },
        { id: 8, title: 'Hereditary', genre: 'Horror' },
        { id: 9, title: 'A Quiet Place', genre: 'Horror' },
        { id: 10, title: 'It', genre: 'Horror' },

        // Family
        { id: 11, title: 'Finding Nemo', genre: 'Family' },
        { id: 12, title: 'Toy Story', genre: 'Family' },
        { id: 13, title: 'The Lion King', genre: 'Family' },
        { id: 14, title: 'Frozen', genre: 'Family' },
        { id: 15, title: 'Shrek', genre: 'Family' },

        // Sci-Fi
        { id: 16, title: 'Interstellar', genre: 'Sci-Fi' },
        { id: 17, title: 'Inception', genre: 'Sci-Fi' },
        { id: 18, title: 'Blade Runner 2049', genre: 'Sci-Fi' },
        { id: 19, title: 'The Matrix', genre: 'Sci-Fi' },
        { id: 20, title: 'Arrival', genre: 'Sci-Fi' },

        // Romance
        { id: 21, title: 'The Notebook', genre: 'Romance' },
        { id: 22, title: 'Pride and Prejudice', genre: 'Romance' },
        { id: 23, title: 'La La Land', genre: 'Romance' },
        { id: 24, title: 'Titanic', genre: 'Romance' },
        { id: 25, title: 'Crazy Rich Asians', genre: 'Romance' },

        // Comedy
        { id: 26, title: 'Superbad', genre: 'Comedy' },
        { id: 27, title: 'Step Brothers', genre: 'Comedy' },
        { id: 28, title: 'The Hangover', genre: 'Comedy' },
        { id: 29, title: 'Anchorman', genre: 'Comedy' },
        { id: 30, title: 'Groundhog Day', genre: 'Comedy' },

        // Thriller
        { id: 31, title: 'Se7en', genre: 'Thriller' },
        { id: 32, title: 'Gone Girl', genre: 'Thriller' },
        { id: 33, title: 'The Girl with the Dragon Tattoo', genre: 'Thriller' },
        { id: 34, title: 'Prisoners', genre: 'Thriller' },
        { id: 35, title: 'Nightcrawler', genre: 'Thriller' },

        // Fantasy
        { id: 36, title: 'The Lord of the Rings: The Fellowship of the Ring', genre: 'Fantasy' },
        { id: 37, title: 'Harry Potter and the Sorcerer\'s Stone', genre: 'Fantasy' },
        { id: 38, title: 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe', genre: 'Fantasy' },
        { id: 39, title: 'Stardust', genre: 'Fantasy' },
        { id: 40, title: 'Pan\'s Labyrinth', genre: 'Fantasy' },

        // Animated
        { id: 41, title: 'Spirited Away', genre: 'Animated' },
        { id: 42, title: 'Coco', genre: 'Animated' },
        { id: 43, title: 'Zootopia', genre: 'Animated' },
        { id: 44, title: 'Inside Out', genre: 'Animated' },
        { id: 45, title: 'The Incredibles', genre: 'Animated' },
    ];


    const genreBadges = {
        Action: { name: 'Action Star', threshold: 5 },
        Horror: { name: 'Horror Master', threshold: 5 },
        Family: { name: 'Family Hero', threshold: 5 },
        'Sci-Fi': { name: 'Sci-Fi Explorer', threshold: 5 },
        Romance: { name: 'Romantic Guru', threshold: 5 },
        Comedy: { name: 'Comedy King', threshold: 5 },
        Thriller: { name: 'Thriller Seeker', threshold: 5 },
        Fantasy: { name: 'Fantasy Dreamer', threshold: 5 },
        Animated: {name: 'Animation Connoisseur ', threshold: 5}
    };

    // State management
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [badges, setBadges] = useState([]);
    const [levels, setLevels] = useState(1);
    const [streak, setStreak] = useState(0);
    const [explorationReward, setExplorationReward] = useState(null);

    // Handle movie watch
    const handleWatchMovie = (movie) => {
        if (!watchedMovies.some((m) => m.id === movie.id)) {
            setWatchedMovies((prev) => [...prev, movie]);
            updateBadges(movie.genre);
            updateExploration(movie.genre);
        }
    };

    // Update badges
    const updateBadges = (genre) => {
        const genreCount = watchedMovies.filter((movie) => movie.genre === genre).length + 1; // Include current movie
        const badge = genreBadges[genre];

        if (badge && genreCount >= badge.threshold && !badges.includes(badge.name)) {
            setBadges((prev) => [...prev, badge.name]);
        }
    };

    // Update streaks and levels
    useEffect(() => {
        if (watchedMovies.length > 0) {
            setStreak((prev) => prev + 1);

            // Level up every 5 streaks
            if ((streak + 1) % 5 === 0) {
                setLevels((prev) => prev + 1);
            }
        }
    }, [watchedMovies]);

    // Update exploration rewards
    const updateExploration = (genre) => {
        const watchedGenres = [...new Set(watchedMovies.map((movie) => movie.genre))];
        if (!watchedGenres.includes(genre)) {
            setExplorationReward(`Exploration Reward: ${genre} Adventurer!`);
            setTimeout(() => setExplorationReward(null), 3000); // Clear reward after 3 seconds
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Gamified Movie Journey</h1>
            <h2>Level: {levels}</h2>
            <h3>Current Streak: {streak} movies</h3>

            <div>
                <h2>Your Badges</h2>
                {badges.length > 0 ? (
                    <ul>
                        {badges.map((badge, index) => (
                            <li key={index}>{badge}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No badges earned yet. Start watching movies!</p>
                )}
            </div>

            {explorationReward && <div style={{ color: 'green', marginBottom: '10px' }}>{explorationReward}</div>}

            <div>
                <h2>Available Movies</h2>
                {mockMovies.map((movie) => (
                    <div key={movie.id} style={{ marginBottom: '10px' }}>
                        <strong>{movie.title}</strong> ({movie.genre})
                        <button
                            onClick={() => handleWatchMovie(movie)}
                            style={{
                                marginLeft: '10px',
                                padding: '5px 10px',
                                backgroundColor: '#007BFF',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Watch
                        </button>
                    </div>
                ))}
            </div>

            <div>
                <h2>Watched Movies</h2>
                {watchedMovies.length > 0 ? (
                    <ul>
                        {watchedMovies.map((movie) => (
                            <li key={movie.id}>
                                {movie.title} ({movie.genre})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No movies watched yet.</p>
                )}
            </div>
        </div>
    );
};

export default GamifiedMovies;


