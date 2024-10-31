// Header.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';

describe('Header Component', () => {
    test('renders CineScout header and navigation links', () => {
        render(
            <Router>
                <Header onSort={() => {}} onLanguageChange={() => {}} />
            </Router>
        );

        // Verify header title
        expect(screen.getByText(/CineScout/i)).toBeInTheDocument();

        // Verify navigation links
        expect(screen.getByText(/Home/i)).toBeInTheDocument();
        expect(screen.getByText(/Preferences/i)).toBeInTheDocument();
        expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
        expect(screen.getByText(/Surprise Me/i)).toBeInTheDocument();
    });

    test('calls onLanguageChange when a language is selected', () => {
        const mockLanguageChange = jest.fn();
        render(
            <Router>
                <Header onSort={() => {}} onLanguageChange={mockLanguageChange} />
            </Router>
        );

        // Change the language
        fireEvent.change(screen.getByLabelText(/Language:/i), { target: { value: 'es' } });

        // Assert that onLanguageChange has been called with the selected value
        expect(mockLanguageChange).toHaveBeenCalledWith('es');
    });

    test('renders Sort and Search components', () => {
        render(
            <Router>
                <Header onSort={() => {}} onLanguageChange={() => {}} />
            </Router>
        );

        // Check if Sort and Search components are rendered
        expect(screen.getByText(/Sort/i)).toBeInTheDocument(); // Assuming Sort has a label or button with text "Sort"
        expect(screen.getByRole('textbox')).toBeInTheDocument(); // Search input field should render
    });
});
