"use client"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { addFavoriteCountry, removeFavoriteCountry } from "../redux/userSlice"
import { Globe, Users, MapPin, Languages, Heart, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 overflow-hidden h-full flex flex-col rounded-xl hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 hover:border-blue-500/30"
    >
      <Link to={`/country/${country.cca3}`} className="flex-grow flex flex-col">
        <div className="relative h-48 sm:h-40 overflow-hidden">
          <img
            src={country.flags.svg || country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFavorite}
              className="absolute top-3 right-3 p-2.5 bg-black/60 backdrop-blur-sm rounded-full 
                        hover:bg-black/80 shadow-lg z-10"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={`h-5 w-5 transition-colors duration-200 
                          ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-red-500"}`} 
              />
            </motion.button>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="flex-grow p-5">
          <h2 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors duration-200">
            {country.name.common}
          </h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 transition-colors duration-200">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                <strong className="font-medium">Region:</strong> {country.region}
              </span>
            </div>
            
            <div className="flex items-center gap-3 transition-colors duration-200">
              <MapPin className="h-4 w-4 text-purple-500" />
              <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                <strong className="font-medium">Capital:</strong> {country.capital?.[0] || "N/A"}
              </span>
            </div>
            
            <div className="flex items-center gap-3 transition-colors duration-200">
              <Users className="h-4 w-4 text-emerald-500" />
              <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                <strong className="font-medium">Population:</strong> {formatPopulation(country.population)}
              </span>
            </div>
            
            <div className="flex items-start gap-3 transition-colors duration-200">
              <Languages className="h-4 w-4 text-amber-500 mt-0.5" />
              <span className="truncate text-gray-300 group-hover:text-white transition-colors duration-200">
                <strong className="font-medium">Languages:</strong> {getLanguages()}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-5 pt-0">
        <Link to={`/country/${country.cca3}`} className="block w-full">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600 hover:to-purple-600
                     text-blue-400 hover:text-white border border-blue-500/30 rounded-lg
                     transition-all duration-300 font-medium flex items-center justify-center gap-2
                     group-hover:shadow-lg group-hover:shadow-blue-500/20"
          >
            View Details
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

export default CountryCard