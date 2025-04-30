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
    // Mock fetch responses based on URL
    global.fetch = vi.fn((url) => {
      if (url === 'https://restcountries.com/v3.1/all') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCountries),
        });
      } 
      else if (url.includes('https://restcountries.com/v3.1/name/japan')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockCountries[1]]),
        });
      }
      else if (url.includes('https://restcountries.com/v3.1/name/xyz123')) {
        return Promise.resolve({
          ok: false,
          status: 404,
        });
      }
      // Default response for any other URL
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCountries),
      });
    });
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
    
    // Check if countries are displayed (look for country names in the cards)
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    
    // Check if fetch was called
    expect(global.fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
  });

  it('filters countries by search term using API', async () => {
    // Setup user event
    const user = userEvent.setup();
    
    renderWithProviders(<HomePage />);
    
    // Wait for initial countries to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });

    // Get the search input
    const searchInput = screen.getByPlaceholderText(/Search for a country/i);
    expect(searchInput).toBeInTheDocument();
    
    // Mock setTimeout to instantly trigger debounced functions
    const realSetTimeout = global.setTimeout;
    global.setTimeout = vi.fn((fn) => {
      fn();
      return 123; // dummy timeout id
    });
    
    // Clear any existing value and type in it
    await user.clear(searchInput);
    await user.type(searchInput, 'japan');
    
    // Restore setTimeout
    global.setTimeout = realSetTimeout;
    
    // Wait for the search results to load
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/japan');
    });
    
    // Only Japan should be visible
    await waitFor(() => {
      expect(screen.getByText('Japan')).toBeInTheDocument();
      expect(screen.queryByText('Germany')).not.toBeInTheDocument();
      expect(screen.queryByText('Brazil')).not.toBeInTheDocument();
    });
  });

  it('filters countries by region', async () => {
    renderWithProviders(<HomePage />);
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });

    // Find the region filter by its ID
    const regionSelect = screen.getByLabelText(/Filter by region/i);
    expect(regionSelect).toBeInTheDocument();
    
    // Select Europe region using fireEvent (more reliable than userEvent in some test environments)
    fireEvent.change(regionSelect, { target: { value: 'Europe' } });
    
    // Only Germany should be visible
    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(screen.queryByText('Japan')).not.toBeInTheDocument();
      expect(screen.queryByText('Brazil')).not.toBeInTheDocument();
    });
  });

  it('filters countries by language', async () => {
    renderWithProviders(<HomePage />);
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });

    // Find the language filter by its ID
    const languageSelect = screen.getByLabelText(/Filter by language/i);
    expect(languageSelect).toBeInTheDocument();
    
    // Select Portuguese language using fireEvent
    fireEvent.change(languageSelect, { target: { value: 'Portuguese' } });
    
    // Only Brazil should be visible
    await waitFor(() => {
      expect(screen.getByText('Brazil')).toBeInTheDocument();
      expect(screen.queryByText('Japan')).not.toBeInTheDocument();
      expect(screen.queryByText('Germany')).not.toBeInTheDocument();
    });
  });

  it('shows error state when fetch fails', async () => {
    // Override the mock for this specific test
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Failed to fetch'));
    
    renderWithProviders(<HomePage />);
    
    // Wait for error state to show
    await waitFor(() => {
      expect(screen.getByText(/Failed to load countries/i)).toBeInTheDocument();
    });
  });

  it('handles 404 response when no search results found', async () => {
    // Setup user event
    const user = userEvent.setup();
    
    renderWithProviders(<HomePage />);
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });

    // Clear the fetch mock call history
    global.fetch.mockClear();

    // Mock setTimeout to instantly trigger debounced functions
    const realSetTimeout = global.setTimeout;
    global.setTimeout = vi.fn((fn) => {
      fn();
      return 123; // dummy timeout id
    });
    
    // Enter a search term that will return 404
    const searchInput = screen.getByPlaceholderText(/Search for a country/i);
    await user.clear(searchInput);
    await user.type(searchInput, 'xyz123');
    
    // Restore setTimeout
    global.setTimeout = realSetTimeout;
    
    // Wait for the search to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/xyz123');
    });
    
    // Should show no results state
    await waitFor(() => {
      expect(screen.getByText(/No countries found/i)).toBeInTheDocument();
    });
  });
  
  it('calls fetch with all countries endpoint when search is cleared', async () => {
    // Setup user event
    const user = userEvent.setup();
    
    renderWithProviders(<HomePage />);
    
    // Wait for initial countries to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });
    
    // Clear fetch mock call history after initial load
    global.fetch.mockClear();
    
    // Create a direct mock for setTimeout to avoid timing issues
    const originalSetTimeout = global.setTimeout;
    
    // Replace setTimeout with a function that calls the callback immediately
    global.setTimeout = vi.fn((fn) => {
      fn();
      return 123; // dummy timeout id
    });
    
    // Search for Japan
    const searchInput = screen.getByPlaceholderText(/Search for a country/i);
    await user.clear(searchInput);
    await user.type(searchInput, 'japan');
    
    // Verify search API was called
    expect(global.fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/japan');
    
    // Clear fetch history again
    global.fetch.mockClear();
    
    // Clear the search input
    await user.clear(searchInput);
    
    // Verify the all countries API was called
    expect(global.fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
    
    // Restore setTimeout
    global.setTimeout = originalSetTimeout;
  });
});