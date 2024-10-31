// src/CreateAccount.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import CreateAccount from './CreateAccount';

describe('CreateAccount Component', () => {
    test('renders Create Account form', () => {
        render(
            <MemoryRouter> {/* Wrap with MemoryRouter */}
                <CreateAccount />
            </MemoryRouter>
        );

        // Check for the header
        expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();

        // Check for input fields
        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();

        // Check for the button
        expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    });
});
