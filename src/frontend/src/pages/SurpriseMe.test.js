import React from 'react';
import { render, screen } from '@testing-library/react';
import SurpriseMe from './SurpriseMe';

test('renders SurpriseMe component', () => {
    render(<SurpriseMe language="en" />);
    expect(screen.getByText(/Surprise Movie/i)).toBeInTheDocument();
});
