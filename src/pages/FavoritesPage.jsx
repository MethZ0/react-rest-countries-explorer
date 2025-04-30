"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import CountryCard from "../components/CountryCard"
import { Loader2, Heart, ArrowLeft, AlertCircle } from "lucide-react"

function FavoritesPage() {
  const navigate = useNavigate()
  const { currentUser, isAuthenticated } = useSelector((state) => state.user)
  const [favoriteCountries, setFavoriteCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

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
    <main className="container mx-auto px-4 py-8 pt-24 animate-fadeIn">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Your Favorite Countries
          </h1>
          <p className="text-gray-600">Countries you've added to your favorites collection</p>
        </div>
        
        <button 
          onClick={() => navigate("/")} 
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explorer
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <span className="text-gray-600 text-lg">Loading your favorites...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* No favorites */}
      {!loading && !error && favoriteCountries.length === 0 && (
        <div className="text-center p-12 border-2 border-dashed rounded-xl bg-gray-50">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Heart className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't added any countries to your favorites collection yet. Explore countries and click the heart icon to add them here.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
          >
            Explore Countries
          </button>
        </div>
      )}

      {/* Favorites grid */}
      {!loading && !error && favoriteCountries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {favoriteCountries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </main>
  )
}

export default FavoritesPage
