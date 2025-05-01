import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../redux/userSlice';
import CountryCard from '../../components/CountryCard';

// Create mock functions for Redux hooks
const mockDispatch = vi.fn();
const mockUseSelector = vi.fn();

// Mock the react-redux hooks
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => mockUseSelector(selector)
}));

// Sample country data for testing
const mockCountry = {
  name: { common: 'Test Country' },
  cca3: 'TST',
  flags: { svg: 'test-flag.svg', alt: 'Flag of Test Country' },
  region: 'Test Region',
  capital: ['Test Capital'],
  population: 1000000,
  languages: { eng: 'English', spa: 'Spanish' }
};

describe('CountryCard Component', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    mockDispatch.mockReset();
    mockUseSelector.mockReset();
  });

  it('renders country information correctly', () => {
    // Setup mock for useSelector
    mockUseSelector.mockReturnValue({ currentUser: null, isAuthenticated: false });
    
    render(
      <BrowserRouter>
        <CountryCard country={mockCountry} />
      </BrowserRouter>
    );
    
    // Check if country name is displayed
    expect(screen.getByText('Test Country')).toBeInTheDocument();
    
    // Check if region, capital and population are displayed
    expect(screen.getByText(/Test Region/)).toBeInTheDocument();
    expect(screen.getByText(/Test Capital/)).toBeInTheDocument();
    expect(screen.getByText(/1,000,000/)).toBeInTheDocument();
    
    // Check if languages are displayed
    expect(screen.getByText(/English, Spanish/)).toBeInTheDocument();
    
    // Check if view details button is present
    expect(screen.getByRole('button', { name: /View Details/i })).toBeInTheDocument();
  });
  
  it('does not show favorite button when user is not authenticated', () => {
    // Setup mock for useSelector
    mockUseSelector.mockReturnValue({ currentUser: null, isAuthenticated: false });
    
    render(
      <BrowserRouter>
        <CountryCard country={mockCountry} />
      </BrowserRouter>
    );
    
    // Heart button should not be visible
    const heartButtons = screen.queryAllByRole('button').filter(
      button => button.querySelector('svg') && !button.textContent.includes('View Details')
    );
    expect(heartButtons.length).toBe(0);
  });
  
  it('shows favorite button when user is authenticated', () => {
    // Setup mock for useSelector
    mockUseSelector.mockReturnValue({ currentUser: { favoriteCountries: [] }, isAuthenticated: true });
    
    render(
      <BrowserRouter>
        <CountryCard country={mockCountry} />
      </BrowserRouter>
    );
    
    // Heart button should be visible
    const heartButtons = screen.getAllByRole('button').filter(
      button => !button.textContent.includes('View Details')
    );
    expect(heartButtons.length).toBe(1);
  });
  
  it('handles adding to favorites when clicked', () => {
    // Setup mock for useSelector
    mockUseSelector.mockReturnValue({ currentUser: { favoriteCountries: [] }, isAuthenticated: true });
    
    render(
      <BrowserRouter>
        <CountryCard country={mockCountry} />
      </BrowserRouter>
    );
    
    // Find the heart button and click it
    const heartButtons = screen.getAllByRole('button').filter(
      button => !button.textContent.includes('View Details')
    );
    fireEvent.click(heartButtons[0]);
    
    // Check if the dispatch function was called with the correct action
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.calls[0][0].type).toBe('user/addFavoriteCountry');
    expect(mockDispatch.mock.calls[0][0].payload).toBe('TST');
  });

  it('handles removing from favorites when already favorited', () => {
    // Setup mock for useSelector with the country already in favorites
    mockUseSelector.mockReturnValue({ 
      currentUser: { favoriteCountries: ['TST'] }, 
      isAuthenticated: true 
    });
    
    render(
      <BrowserRouter>
        <CountryCard country={mockCountry} />
      </BrowserRouter>
    );
    
    // Find the heart button and click it
    const heartButtons = screen.getAllByRole('button').filter(
      button => !button.textContent.includes('View Details')
    );
    fireEvent.click(heartButtons[0]);
    
    // Check if the dispatch function was called with the correct action to remove
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.calls[0][0].type).toBe('user/removeFavoriteCountry');
    expect(mockDispatch.mock.calls[0][0].payload).toBe('TST');
  });
});