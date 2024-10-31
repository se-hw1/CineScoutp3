import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App'; // Adjust the path if needed

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/welcome to cinescout/i);
  expect(welcomeElement).toBeInTheDocument();
});
