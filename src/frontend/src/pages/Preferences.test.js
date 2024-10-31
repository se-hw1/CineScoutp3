import React from 'react';
import { render, screen } from '@testing-library/react';
import Preferences from './Preferences';
import { MemoryRouter } from 'react-router-dom';

test('renders Preferences component', () => {
    render(
        <MemoryRouter initialEntries={['/preferences']}>
            <Preferences />
        </MemoryRouter>
    );

    // Check if the text is in the document
    expect(screen.getByText(/Select Your Favorite Genres/i)).toBeInTheDocument();
});
