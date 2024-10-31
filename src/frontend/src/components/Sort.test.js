// src/components/Sort.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sort from './Sort';

describe('Sort Component', () => {
    test('renders genre, year, and rating input fields', () => {
        render(<Sort onSort={jest.fn()} />);

        expect(screen.getByRole('combobox')).toBeInTheDocument(); // Genre select
        expect(screen.getByPlaceholderText('Year (YYYY)')).toBeInTheDocument(); // Year input
        expect(screen.getByPlaceholderText('Rating (1-10)')).toBeInTheDocument(); // Rating input
        expect(screen.getByRole('button', { name: /Sort/i })).toBeInTheDocument(); // Sort button
    });

    test('calls onSort with selected genre, year, and rating', () => {
        const mockOnSort = jest.fn();
        render(<Sort onSort={mockOnSort} />);

        // Fill in all fields
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '35' } }); // Genre: Comedy
        fireEvent.change(screen.getByPlaceholderText('Year (YYYY)'), { target: { value: '2020' } }); // Year: 2020
        fireEvent.change(screen.getByPlaceholderText('Rating (1-10)'), { target: { value: '8' } }); // Rating: 8
        
        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Sort/i }));

        // Verify onSort is called with the correct values
        expect(mockOnSort).toHaveBeenCalledWith({ genre: '35', year: '2020', rating: '8' });
    });

    test('does not call onSort if form is incomplete', () => {
        const mockOnSort = jest.fn();
        render(<Sort onSort={mockOnSort} />);

        // Only select genre
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '35' } }); // Genre: Comedy

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Sort/i }));

        // Verify onSort is not called due to incomplete form
        expect(mockOnSort).not.toHaveBeenCalled();
    });

    // New Test Case: Does not call onSort if only year is filled
    test('does not call onSort if only year is filled', () => {
        const mockOnSort = jest.fn();
        render(<Sort onSort={mockOnSort} />);

        // Only fill the year
        fireEvent.change(screen.getByPlaceholderText('Year (YYYY)'), { target: { value: '2020' } }); // Year: 2020

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Sort/i }));

        // Verify onSort is not called due to incomplete form
        expect(mockOnSort).not.toHaveBeenCalled();
    });

    // New Test Case: Does not call onSort if only rating is filled
    test('does not call onSort if only rating is filled', () => {
        const mockOnSort = jest.fn();
        render(<Sort onSort={mockOnSort} />);

        // Only fill the rating
        fireEvent.change(screen.getByPlaceholderText('Rating (1-10)'), { target: { value: '8' } }); // Rating: 8

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Sort/i }));

        // Verify onSort is not called due to incomplete form
        expect(mockOnSort).not.toHaveBeenCalled();
    });
});
