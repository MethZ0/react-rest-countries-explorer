"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import CountryCard from "../components/CountryCard"
import { Loader2 } from "lucide-react"

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Favorite Countries</h1>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Loading favorite countries...</span>
        </div>
      )}

      {/* Error state */}
      {error && <div className="text-red-500 text-center p-4 border border-red-300 rounded-md">{error}</div>}

      {/* No favorites */}
      {!loading && !error && favoriteCountries.length === 0 && (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-lg mb-4">You haven't added any favorite countries yet.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Explore Countries
          </button>
        </div>
      )}

      {/* Favorites grid */}
      {!loading && !error && favoriteCountries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteCountries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
