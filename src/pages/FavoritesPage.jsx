"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import CountryCard from "../components/CountryCard"
import { Loader2, HeartOff, Map } from "lucide-react"

function FavoritesPage() {
  const navigate = useNavigate()
  const { currentUser, isAuthenticated } = useSelector((state) => state.user)
  const [favoriteCountries, setFavoriteCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [animateIn, setAnimateIn] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  // Add animation on mount
  useEffect(() => {
    // Short delay before animations start
    const timer = setTimeout(() => {
      setAnimateIn(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Fetch favorite countries
  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (!currentUser || !currentUser.favoriteCountries.length) {
        setFavoriteCountries([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const codes = currentUser.favoriteCountries.join(",")
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes}`)

        if (!response.ok) {
          throw new Error("Failed to fetch favorite countries")
        }

        const data = await response.json()
        setFavoriteCountries(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load favorite countries. Please try again later.")
        setLoading(false)
        console.error(err)
      }
    }

    fetchFavoriteCountries()
  }, [currentUser])

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen pt-8 pb-16 bg-dark-primary text-dark-text-primary relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-50">
        <div className="absolute top-[-5%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-[-5%] left-[-10%] w-[30%] h-[30%] rounded-full bg-purple-900/10 blur-3xl animate-pulse-slow"></div>
        {/* Grid background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: "linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)", 
          backgroundSize: "40px 40px" 
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className={`space-y-4 text-center mb-12 transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-px rounded-full">
              <div className="bg-dark-primary rounded-full p-3">
                <svg className="h-8 w-8 text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            Your Favorite Countries
          </h1>
          <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
            Your personally curated collection of countries from around the globe.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className={`flex justify-center items-center h-64 transition-all duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col items-center bg-dark-secondary/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-indigo-400/30 border-t-indigo-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 bg-dark-primary rounded-full"></div>
                </div>
              </div>
              <span className="mt-6 text-dark-text-secondary font-medium">Loading your favorites...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center p-8 border border-red-500/20 bg-red-500/5 backdrop-blur-sm rounded-2xl shadow-xl mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Favorites</h3>
              <p className="text-dark-text-secondary">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-6 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* No favorites */}
        {!loading && !error && favoriteCountries.length === 0 && (
          <div className={`flex flex-col items-center justify-center space-y-8 p-10 max-w-md mx-auto transition-all duration-700 ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="p-6 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 shadow-lg">
              <HeartOff className="h-14 w-14 text-indigo-400/80" />
            </div>
            
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-semibold text-dark-text-primary">No Favorite Countries</h3>
              <p className="text-dark-text-secondary max-w-sm">
                Your collection is empty. Start exploring and add countries that interest you to your favorites.
              </p>
            </div>
            
            <button
              onClick={() => navigate("/explore")}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <Map className="mr-2.5 h-5 w-5" /> 
              Discover Countries
            </button>
          </div>
        )}

        {/* Favorites grid with improved styling */}
        {!loading && !error && favoriteCountries.length > 0 && (
          <div className="space-y-8">
            <div className="flex justify-between items-center px-3">
              <span className="text-sm font-medium text-dark-text-secondary">
                {favoriteCountries.length} {favoriteCountries.length === 1 ? 'Country' : 'Countries'}
              </span>
              <button
                onClick={() => navigate("/explore")}
                className="text-sm flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                <Map className="mr-1.5 h-4 w-4" /> 
                Explore More
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {favoriteCountries.map((country, index) => (
                <div 
                  key={country.cca3} 
                  className={`transition-all duration-500 transform ${
                    animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${Math.min(index * 100, 800)}ms` }}
                >
                  <CountryCard country={country} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
