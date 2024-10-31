// src/pages/Home.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Home Component', () => {
  test('renders the welcome message', () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    expect(screen.getByText('Welcome to CineScout')).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    const { container } = render(
      <Router>
        <Home />
      </Router>
    );
    expect(container).toBeInTheDocument();
  });
});
