// src/pages/SearchResults.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from './SearchResults';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import LoadingSpinner from '../components/LoadingSpinner';

// Mock the axios instance
const mock = new MockAdapter(axios);

const setup = (query) => {
    return render(
        <MemoryRouter initialEntries={[`/search?query=${query}`]}>
            <SearchResults />
        </MemoryRouter>
    );
};

describe('SearchResults Component', () => {
    beforeEach(() => {
        mock.reset();
    });
    test('displays loading spinner while fetching data', async () => {
            mock.onGet(/search/).reply(200, {
                results: []
            });

            setup('test');

            // Use waitFor to handle the loading state properly
            await waitFor(() => {
                expect(screen.getByRole('spinner')).toBeInTheDocument(); // Adjusted for spinner role or class
            });
        });

    
    test('displays movie results when data is successfully fetched', async () => {
        mock.onGet(/search/).reply(200, {
            results: [
                { id: 1, title: 'Movie 1' },
                { id: 2, title: 'Movie 2' }
            ]
        });

        setup('test');

        // Wait for the results to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Movie 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Movie 2/i)).toBeInTheDocument();
        });
    });

    test('displays error message when fetch fails', async () => {
        mock.onGet(/search/).reply(500);

        setup('test');

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Error/i)).toBeInTheDocument();
        });
    });
});
