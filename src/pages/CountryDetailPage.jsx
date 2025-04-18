"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { addFavoriteCountry, removeFavoriteCountry } from "../redux/userSlice"
import { Loader2, Globe, Users, MapPin, Languages, Landmark, Coins, Map, ArrowLeft, Heart } from "lucide-react"

function CountryDetailPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const countryCode = code

  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [borderCountries, setBorderCountries] = useState([])

  const dispatch = useDispatch()
  const { currentUser, isAuthenticated } = useSelector((state) => state.user)

  const isFavorite = currentUser?.favoriteCountries.includes(countryCode) || false

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        if (!response.ok) {
          throw new Error("Failed to fetch country details")
        }
        const data = await response.json()
        setCountry(data[0])

        // Fetch border countries if any
        if (data[0].borders && data[0].borders.length > 0) {
          const borderCodes = data[0].borders.join(",")
          const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`)
          if (borderResponse.ok) {
            const borderData = await borderResponse.json()
            const borderInfo = borderData.map((b) => ({
              code: b.cca3,
              name: b.name.common,
            }))
            setBorderCountries(borderInfo)
          }
        }

        setLoading(false)
      } catch (err) {
        setError("Failed to load country details. Please try again later.")
        setLoading(false)
        console.error(err)
      }
    }

    fetchCountryDetails()
  }, [countryCode])

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavoriteCountry(countryCode))
    } else {
      dispatch(addFavoriteCountry(countryCode))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading country details...</span>
      </div>
    )
  }

  if (error || !country) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 border rounded-md flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>
        <div className="text-red-500 text-center p-4 border border-red-300 rounded-md">
          {error || "Country information not available"}
        </div>
      </div>
    )
  }

  // Format population with commas
  const formatPopulation = (population) => {
    return population.toLocaleString()
  }

  // Format area with commas
  const formatArea = (area) => {
    return area.toLocaleString()
  }

  // Get languages as a comma-separated string
  const getLanguages = () => {
    if (!country.languages) return "N/A"
    return Object.values(country.languages).join(", ")
  }

  // Get currencies as a formatted string
  const getCurrencies = () => {
    if (!country.currencies) return "N/A"
    return Object.values(country.currencies)
      .map((currency) => `${currency.name} (${currency.symbol})`)
      .join(", ")
  }

  // Get native names
  const getNativeNames = () => {
    if (!country.name.nativeName) return "N/A"
    return Object.values(country.name.nativeName)
      .map((name) => name.official)
      .join(", ")
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 border rounded-md flex items-center hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Countries
        </button>

        {isAuthenticated && (
          <button
            onClick={toggleFavorite}
            className={`px-4 py-2 rounded-md flex items-center transition-all duration-200 ${
              isFavorite 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "border hover:bg-gray-50"
            }`}
          >
            <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-md">
        <div className="flex flex-col space-y-6">
          <div className="relative h-48 md:h-64 overflow-hidden rounded-lg">
            <img
              src={country.flags.svg || country.flags.png}
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{country.name.common}</h1>
            <p className="text-gray-500">{country.name.official}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-500" />
                <span>
                  <strong>Region:</strong> {country.region}
                </span>
              </div>
              {country.subregion && (
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <span>
                    <strong>Subregion:</strong> {country.subregion}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>
                  <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span>
                  <strong>Population:</strong> {formatPopulation(country.population)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-gray-500" />
                <span>
                  <strong>Area:</strong> {formatArea(country.area)} km²
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-gray-500" />
                <span>
                  <strong>Continent:</strong> {country.continents.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Languages</h3>
            <div className="flex items-start gap-2 bg-gray-100 p-3 rounded-md">
              <Languages className="h-5 w-5 text-gray-500 mt-0.5" />
              <span>{getLanguages()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Currencies</h3>
            <div className="flex items-start gap-2 bg-gray-100 p-3 rounded-md">
              <Coins className="h-5 w-5 text-gray-500 mt-0.5" />
              <span>{getCurrencies()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Native Name</h3>
            <p className="bg-gray-100 p-3 rounded-md">{getNativeNames()}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Timezones</h3>
            <p className="bg-gray-100 p-3 rounded-md">{country.timezones.join(", ")}</p>
          </div>

          {borderCountries.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Border Countries</h3>
              <div className="flex flex-wrap gap-2">
                {borderCountries.map((border) => (
                  <button
                    key={border.code}
                    className="px-3 py-1 border rounded-md hover:bg-gray-50"
                    onClick={() => navigate(`/country/${border.code}`)}
                  >
                    {border.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Maps</h3>
            <div className="space-y-2">
              <a
                href={country.maps.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline block bg-gray-100 p-3 rounded-md"
              >
                View on Google Maps
              </a>
              <a
                href={country.maps.openStreetMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline block bg-gray-100 p-3 rounded-md"
              >
                View on OpenStreetMap
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountryDetailPage
