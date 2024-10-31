// src/BrowseMovies.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import BrowseMovies from './BrowseMovies';
import '@testing-library/jest-dom';
import MockAdapter from 'axios-mock-adapter';
import { act } from 'react'; // Import act

const mock = new MockAdapter(axios);

describe('BrowseMovies Component', () => {
    afterEach(() => {
        mock.reset();
    });

    test('renders loading spinner while fetching movies', async () => {
        // Mock a delayed response
        mock.onGet(/popular/).reply(200, { results: [] });

        act(() => render(<BrowseMovies />));

        // Expect the loading spinner to be in the document initially
        expect(screen.getByRole('spinner')).toBeInTheDocument();

        // Wait for loading spinner to disappear after data fetching
        await act(async () => {
        await waitFor(() => expect(screen.queryByRole('spinner')).not.toBeInTheDocument());
        })
    });

    // 
});
