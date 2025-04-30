import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../redux/userSlice';
import HomePage from '../../pages/HomePage';

// Mock country data for testing
const mockCountries = [
  {
    name: { common: 'Germany' },
    cca3: 'DEU',
    flags: { svg: 'germany-flag.svg', alt: 'Flag of Germany' },
    region: 'Europe',
    capital: ['Berlin'],
    population: 83000000,
    languages: { deu: 'German' }
  },
  {
    name: { common: 'Japan' },
    cca3: 'JPN',
    flags: { svg: 'japan-flag.svg', alt: 'Flag of Japan' },
    region: 'Asia',
    capital: ['Tokyo'],
    population: 126000000,
    languages: { jpn: 'Japanese' }
  },
  {
    name: { common: 'Brazil' },
    cca3: 'BRA',
    flags: { svg: 'brazil-flag.svg', alt: 'Flag of Brazil' },
    region: 'Americas',
    capital: ['Brasília'],
    population: 212000000,
    languages: { por: 'Portuguese' }
  }
];

// Mock fetch response
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockCountries),
  })
);

// Component wrapper with required providers
const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: {
      user: userReducer
    },
    preloadedState: {
      user: { currentUser: null, isAuthenticated: false }
    }
  });
  
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  );
};

describe('HomePage Integration Tests', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and displays countries on initial load', async () => {
    renderWithProviders(<HomePage />);
    
    // Initially shows loading state
    expect(screen.getByText(/Loading countries/i)).toBeInTheDocument();
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });
    
    // Check if countries are displayed
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    
    // Check if fetch was called
    expect(global.fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
  });

  it('filters countries by search term', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });

    // Get the search input and type in it
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    await user.clear(searchInput);
    await user.type(searchInput, 'japan');
    
    // Only Japan should be visible
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.queryByText('Germany')).not.toBeInTheDocument();
    expect(screen.queryByText('Brazil')).not.toBeInTheDocument();
  });

  it('filters countries by region', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });

    // Select Europe region
    const regionSelect = screen.getByLabelText(/Filter by region/i);
    await user.selectOptions(regionSelect, 'Europe');
    
    // Only Germany should be visible
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.queryByText('Japan')).not.toBeInTheDocument();
    expect(screen.queryByText('Brazil')).not.toBeInTheDocument();
  });

  it('filters countries by language', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });

    // Select Portuguese language
    const languageSelect = screen.getByLabelText(/Filter by language/i);
    await user.selectOptions(languageSelect, 'Portuguese');
    
    // Only Brazil should be visible
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    expect(screen.queryByText('Japan')).not.toBeInTheDocument();
    expect(screen.queryByText('Germany')).not.toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    // Mock fetch to fail for this test
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('Failed to fetch'))
    );
    
    renderWithProviders(<HomePage />);
    
    // Initially shows loading state
    expect(screen.getByText(/Loading countries/i)).toBeInTheDocument();
    
    // Wait for error state to show
    await waitFor(() => {
      expect(screen.queryByText(/Failed to load countries/i)).toBeInTheDocument();
    });
  });

  it('shows no results state when filters match no countries', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });

    // Enter a search term that won't match any countries
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    await user.clear(searchInput);
    await user.type(searchInput, 'XYZ123');
    
    // Should show no results state
    await waitFor(() => {
      expect(screen.getByText(/No countries found/i)).toBeInTheDocument();
    });
  });
});