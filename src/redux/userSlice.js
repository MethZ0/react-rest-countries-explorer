import { createSlice } from "@reduxjs/toolkit"

// Mock user data
export const mockUsers = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123", // In a real app, this would be hashed
    name: "Demo User",
    favoriteCountries: ["USA", "CAN", "JPN"],
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    favoriteCountries: ["GBR", "FRA", "DEU"],
  },
]

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  error: null,
  loading: false,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
    },
    registerStart: (state) => {
      state.loading = true
      state.error = null
    },
    registerSuccess: (state, action) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    registerFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    addFavoriteCountry: (state, action) => {
      if (state.currentUser) {
        if (!state.currentUser.favoriteCountries.includes(action.payload)) {
          state.currentUser.favoriteCountries.push(action.payload)
        }
      }
    },
    removeFavoriteCountry: (state, action) => {
      if (state.currentUser) {
        state.currentUser.favoriteCountries = state.currentUser.favoriteCountries.filter(
          (code) => code !== action.payload,
        )
      }
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  addFavoriteCountry,
  removeFavoriteCountry,
} = userSlice.actions

export default userSlice.reducer
