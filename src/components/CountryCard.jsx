"use client"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { addFavoriteCountry, removeFavoriteCountry } from "../redux/userSlice"
import { Globe, Users, MapPin, Languages, Heart } from "lucide-react"

function CountryCard({ country }) {
  const dispatch = useDispatch()
  const { currentUser, isAuthenticated } = useSelector((state) => state.user)
  const isFavorite = currentUser?.favoriteCountries.includes(country.cca3) || false

  const formatPopulation = (population) => {
    return population.toLocaleString()
  }

  const getLanguages = () => {
    if (!country.languages) return "N/A"
    return Object.values(country.languages).join(", ")
  }

  const toggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavorite) {
      dispatch(removeFavoriteCountry(country.cca3))
    } else {
      dispatch(addFavoriteCountry(country.cca3))
    }
  }

  return (
    <div className="group bg-white overflow-hidden h-full flex flex-col rounded-xl border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/country/${country.cca3}`} className="flex-grow flex flex-col">
        <div className="relative h-48 sm:h-40 overflow-hidden">
          <img
            src={country.flags.svg || country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          {isAuthenticated && (
            <button
              onClick={toggleFavorite}
              className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full 
                        hover:bg-white shadow-lg transform transition-transform duration-200 
                        hover:scale-110 active:scale-95"
            >
              <Heart 
                className={`h-5 w-5 transition-colors duration-200 
                          ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"}`} 
              />
            </button>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="flex-grow p-5">
          <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
            {country.name.common}
          </h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 hover:text-blue-600 transition-colors duration-200">
              <Globe className="h-4 w-4 text-blue-500" />
              <span>
                <strong className="font-medium">Region:</strong> {country.region}
              </span>
            </div>
            
            <div className="flex items-center gap-3 hover:text-blue-600 transition-colors duration-200">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>
                <strong className="font-medium">Capital:</strong> {country.capital?.[0] || "N/A"}
              </span>
            </div>
            
            <div className="flex items-center gap-3 hover:text-blue-600 transition-colors duration-200">
              <Users className="h-4 w-4 text-blue-500" />
              <span>
                <strong className="font-medium">Population:</strong> {formatPopulation(country.population)}
              </span>
            </div>
            
            <div className="flex items-start gap-3 hover:text-blue-600 transition-colors duration-200">
              <Languages className="h-4 w-4 text-blue-500 mt-0.5" />
              <span className="truncate">
                <strong className="font-medium">Languages:</strong> {getLanguages()}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-5 pt-0">
        <Link to={`/country/${country.cca3}`} className="block w-full">
          <button className="w-full px-4 py-2.5 text-blue-600 border-2 border-blue-600/20 rounded-lg
                           hover:bg-blue-600 hover:text-white transition-all duration-300
                           focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            View Details
          </button>
        </Link>
      </div>
    </div>
  )
}

export default CountryCard