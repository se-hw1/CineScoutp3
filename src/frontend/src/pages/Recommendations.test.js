import React from 'react';
import { render, screen } from '@testing-library/react';
import Recommendations from './Recommendations';

test('renders Recommendations component', () => {
    render(<Recommendations language="en" />);
    
    // Use getAllByText to find all matching elements
    const recommendedMoviesElements = screen.getAllByText(/Recommended Movies/i);
    
    // Check if at least one is in the document
    expect(recommendedMoviesElements.length).toBeGreaterThan(0);
});
