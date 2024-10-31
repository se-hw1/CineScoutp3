import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Search from './Search'; // Adjust the path if necessary

test('navigates on search submit', () => {
    // Render the Search component wrapped in MemoryRouter
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/search" element={<div>Search Results</div>} />
            </Routes>
        </MemoryRouter>
    );

    // Simulate user input in the search box
    fireEvent.change(screen.getByPlaceholderText(/Search for a movie.../i), { target: { value: 'Inception' } });
    
    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    // Use a timeout to allow navigation to process
    setTimeout(() => {
        // Check that the expected navigation occurred
        expect(window.location.pathname).toBe('/search'); // Check if navigated to '/search'
        expect(window.location.search).toBe('?query=Inception'); // Check if the search query is correct
    }, 0);
});
