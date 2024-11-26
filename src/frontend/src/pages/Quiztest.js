import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SurpriseMeWithQuiz from './Quiz';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock Axios for API requests
jest.mock('axios');

// Test Suite
describe('SurpriseMeWithQuiz Component', () => {
    it('renders the first question correctly', () => {
        render(<SurpriseMeWithQuiz />);

        // Check if the first question is displayed
        expect(screen.getByText('What genre do you prefer?')).toBeInTheDocument();
        // Check if options are rendered
        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByText('Comedy')).toBeInTheDocument();
        expect(screen.getByText('Drama')).toBeInTheDocument();
        expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    });

     it('advances to the next question after selecting an option', () => {
     render(React.createElement(SurpriseMeWithQuiz));

     // Click an option for the first question
     fireEvent.click(screen.getByText('Action'));

     // After clicking, the second question should appear
     expect(screen.getByText('What mood are you in?')).toBeInTheDocument();
    });
