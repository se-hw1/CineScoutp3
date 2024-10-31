import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import MovieCard from './MovieCard';

// Mock movie data
const mockMovie = {
    id: 1,
    title: 'Inception',
    poster_path: '/path/to/poster.jpg',
    release_date: '2010-07-16',
    // Add other necessary properties
};

test('renders MovieCard component', () => {
    render(
        <Router>
            <MovieCard movie={mockMovie} />  {/* Pass the mock movie as a prop */}
        </Router>
    );

    // Assertions based on the mock movie data
    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Inception/i)).toBeInTheDocument(); // Assuming you have an <img> with alt text
});
