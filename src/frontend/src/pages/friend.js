import React, { useState, useEffect } from 'react';

const SocialMovieDiscovery = () => {
    // Mock Data
    const mockFriends = [
        { id: 1, name: 'Alice', currentMovie: 'The Dark Knight', recentlyWatched: ['Inception', 'Interstellar'] },
        { id: 2, name: 'Bob', currentMovie: 'Frozen', recentlyWatched: ['The Lion King', 'Finding Nemo'] },
        { id: 3, name: 'Charlie', currentMovie: 'Get Out', recentlyWatched: ['Hereditary', 'The Conjuring'] },
    ];

    const mockMovies = [
        { id: 1, title: 'The Dark Knight', genre: 'Action' },
        { id: 2, title: 'Frozen', genre: 'Family' },
        { id: 3, title: 'Get Out', genre: 'Horror' },
        { id: 4, title: 'Inception', genre: 'Sci-Fi' },
        { id: 5, title: 'The Conjuring', genre: 'Horror' },
    ];

    // State
    const [ratings, setRatings] = useState({});
    const [recommendations, setRecommendations] = useState([]);
    const [movieNight, setMovieNight] = useState({ date: '', time: '', movie: '', friends: [] });
    const [movieNights, setMovieNights] = useState([]); // Stores all planned movie nights

    // Load Movie Nights from Local Storage on Mount
    useEffect(() => {
        const storedMovieNights = localStorage.getItem('movieNights');
        if (storedMovieNights) {
            setMovieNights(JSON.parse(storedMovieNights)); // Parse and load saved movie nights
        }
    }, []);

    // Save Movie Nights to Local Storage whenever they change
    useEffect(() => {
        localStorage.setItem('movieNights', JSON.stringify(movieNights));
    }, [movieNights]);

    // Handle Rating a Movie
    const handleRateMovie = (movieId, rating) => {
        setRatings((prev) => ({ ...prev, [movieId]: rating }));
    };

    // Handle Recommend a Movie
    const handleRecommendMovie = (movieId, friendName) => {
        const movie = mockMovies.find((m) => m.id === movieId);
        if (movie) {
            setRecommendations((prev) => [
                ...prev,
                { movie: movie.title, genre: movie.genre, friend: friendName },
            ]);
        }
    };

    // Handle Plan Movie Night
    const handlePlanMovieNight = (e) => {
        e.preventDefault();
        if (movieNight.date && movieNight.time && movieNight.movie && movieNight.friends.length > 0) {
            setMovieNights((prev) => [
                ...prev,
                {
                    date: movieNight.date,
                    time: movieNight.time,
                    movie: movieNight.movie,
                    friends: movieNight.friends,
                },
            ]);
            setMovieNight({ date: '', time: '', movie: '', friends: [] }); // Reset
            alert('Movie night successfully planned!');
        } else {
            alert('Please fill in all fields to plan the movie night.');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Social Movie Discovery</h1>

            {/* Section: What Friends Are Watching */}
            <div>
                <h2>What Your Friends Are Watching</h2>
                {mockFriends.map((friend) => (
                    <div key={friend.id} style={{ marginBottom: '15px' }}>
                        <strong>{friend.name}</strong> is watching <em>{friend.currentMovie}</em>.
                        <br />
                        Recently watched: {friend.recentlyWatched.join(', ')}.
                    </div>
                ))}
            </div>

            {/* Section: Rate Movies */}
            <div>
                <h2>Rate Movies</h2>
                {mockMovies.map((movie) => (
                    <div key={movie.id} style={{ marginBottom: '10px' }}>
                        <strong>{movie.title}</strong> ({movie.genre})
                        <div>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleRateMovie(movie.id, rating)}
                                    style={{
                                        margin: '2px',
                                        padding: '5px',
                                        backgroundColor: ratings[movie.id] === rating ? '#28A745' : '#007BFF',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {rating} ★
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Section: Recommend Movies */}
            <div>
                <h2>Recommend Movies to Friends</h2>
                {mockMovies.map((movie) => (
                    <div key={movie.id} style={{ marginBottom: '10px' }}>
                        <strong>{movie.title}</strong> ({movie.genre})
                        <select
                            onChange={(e) => handleRecommendMovie(movie.id, e.target.value)}
                            style={{ marginLeft: '10px', padding: '5px' }}
                        >
                            <option value="">Select Friend</option>
                            {mockFriends.map((friend) => (
                                <option key={friend.id} value={friend.name}>
                                    {friend.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                <h3>Your Recommendations</h3>
                {recommendations.length > 0 ? (
                    <ul>
                        {recommendations.map((rec, index) => (
                            <li key={index}>
                                You recommended <strong>{rec.movie}</strong> ({rec.genre}) to <strong>{rec.friend}</strong>.
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recommendations made yet.</p>
                )}
            </div>

            {/* Section: Plan Movie Night */}
            <div>
                <h2>Plan a Movie Night</h2>
                <form onSubmit={handlePlanMovieNight}>
                    <label>
                        Date:
                        <input
                            type="date"
                            value={movieNight.date}
                            onChange={(e) => setMovieNight((prev) => ({ ...prev, date: e.target.value }))}
                            style={{ marginLeft: '10px', marginBottom: '10px' }}
                        />
                    </label>
                    <br />
                    <label>
                        Time:
                        <input
                            type="time"
                            value={movieNight.time}
                            onChange={(e) => setMovieNight((prev) => ({ ...prev, time: e.target.value }))}
                            style={{ marginLeft: '10px', marginBottom: '10px' }}
                        />
                    </label>
                    <br />
                    <label>
                        Movie:
                        <select
                            value={movieNight.movie}
                            onChange={(e) => setMovieNight((prev) => ({ ...prev, movie: e.target.value }))}
                            style={{ marginLeft: '10px', marginBottom: '10px' }}
                        >
                            <option value="">Select a Movie</option>
                            {mockMovies.map((movie) => (
                                <option key={movie.id} value={movie.title}>
                                    {movie.title}
                                </option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <label>
                        Invite Friends:
                        <select
                            multiple
                            value={movieNight.friends}
                            onChange={(e) =>
                                setMovieNight((prev) => ({
                                    ...prev,
                                    friends: Array.from(e.target.selectedOptions, (option) => option.value),
                                }))
                            }
                            style={{ marginLeft: '10px', marginBottom: '10px' }}
                        >
                            {mockFriends.map((friend) => (
                                <option key={friend.id} value={friend.name}>
                                    {friend.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <button
                        type="submit"
                        style={{
                            padding: '10px',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Plan Movie Night
                    </button>
                </form>
            </div>

            {/* Section: Display Planned Movie Nights */}
            <div>
                <h2>Planned Movie Nights</h2>
                {movieNights.length > 0 ? (
                    <ul>
                        {movieNights.map((night, index) => (
                            <li key={index}>
                                <strong>Movie:</strong> {night.movie} <br />
                                <strong>Date:</strong> {night.date} <br />
                                <strong>Time:</strong> {night.time} <br />
                                <strong>Friends:</strong> {night.friends.join(', ')}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No movie nights planned yet.</p>
                )}
            </div>
        </div>
    );
};

export default SocialMovieDiscovery;


