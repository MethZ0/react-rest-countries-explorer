import { describe, it, expect } from 'vitest';
import userReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  addFavoriteCountry,
  removeFavoriteCountry,
  mockUsers
} from '../../redux/userSlice';

describe('User Redux Slice', () => {
  const initialState = {
    currentUser: null,
    isAuthenticated: false,
    error: null,
    loading: false
  };

  describe('Authentication reducers', () => {
    it('should handle initial state', () => {
      expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle loginStart', () => {
      const nextState = userReducer(initialState, loginStart());
      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBe(null);
    });

    it('should handle loginSuccess', () => {
      const user = mockUsers[0];
      const nextState = userReducer(initialState, loginSuccess(user));
      expect(nextState.currentUser).toEqual(user);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe(null);
    });

    it('should handle loginFailure', () => {
      const error = 'Invalid credentials';
      const nextState = userReducer(initialState, loginFailure(error));
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe(error);
    });

    it('should handle logout', () => {
      // Start with a logged-in state
      const loggedInState = {
        currentUser: mockUsers[0],
        isAuthenticated: true,
        error: null,
        loading: false
      };
      
      const nextState = userReducer(loggedInState, logout());
      expect(nextState).toEqual(initialState);
    });

    it('should handle registerStart', () => {
      const nextState = userReducer(initialState, registerStart());
      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBe(null);
    });

    it('should handle registerSuccess', () => {
      const newUser = {
        id: '3',
        email: 'newuser@example.com',
        name: 'New User',
        favoriteCountries: []
      };
      
      const nextState = userReducer(initialState, registerSuccess(newUser));
      expect(nextState.currentUser).toEqual(newUser);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe(null);
    });

    it('should handle registerFailure', () => {
      const error = 'Email already exists';
      const nextState = userReducer(initialState, registerFailure(error));
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe(error);
    });
  });

  describe('Favorite countries reducers', () => {
    const loggedInState = {
      currentUser: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        favoriteCountries: ['USA', 'CAN']
      },
      isAuthenticated: true,
      error: null,
      loading: false
    };

    it('should add a country to favorites if not already added', () => {
      const nextState = userReducer(loggedInState, addFavoriteCountry('JPN'));
      expect(nextState.currentUser.favoriteCountries).toEqual(['USA', 'CAN', 'JPN']);
    });

    it('should not add duplicate country to favorites', () => {
      const nextState = userReducer(loggedInState, addFavoriteCountry('USA'));
      expect(nextState.currentUser.favoriteCountries).toEqual(['USA', 'CAN']);
    });

    it('should remove a country from favorites', () => {
      const nextState = userReducer(loggedInState, removeFavoriteCountry('USA'));
      expect(nextState.currentUser.favoriteCountries).toEqual(['CAN']);
    });

    it('should do nothing if trying to add a favorite when not logged in', () => {
      const nextState = userReducer(initialState, addFavoriteCountry('USA'));
      expect(nextState).toEqual(initialState);
    });

    it('should do nothing if trying to remove a favorite when not logged in', () => {
      const nextState = userReducer(initialState, removeFavoriteCountry('USA'));
      expect(nextState).toEqual(initialState);
    });
  });
});