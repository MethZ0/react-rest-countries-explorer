"use client"

import React from 'react';
import { useState, useEffect } from "react"
import CountryCard from "../components/CountryCard"
import { Loader2, Search, Globe, Languages, SearchX, XCircle } from "lucide-react"

function HomePage() {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [allLanguages, setAllLanguages] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [searchTimeout, setSearchTimeout] = useState(null)

  // Fetch all countries or search results
  const fetchCountries = async (name = "") => {
    try {
      setLoading(true)
      
      // Use the search endpoint if a name is provided
      const url = name 
        ? `https://restcountries.com/v3.1/name/${name}` 
        : "https://restcountries.com/v3.1/all"
      
      const response = await fetch(url)
      
      if (!response.ok) {
        // If it's a search with no results, set empty array instead of error
        if (name && response.status === 404) {
          setFilteredCountries([])
          setCountries(await (await fetch("https://restcountries.com/v3.1/all")).json())
          setLoading(false)
          return
        }
        throw new Error("Failed to fetch countries")
      }
      
      const data = await response.json()
      
      if (name) {
        setFilteredCountries(data)
        
        // If we're searching, we still need complete data for filters
        if (!countries.length) {
          const allCountriesResponse = await fetch("https://restcountries.com/v3.1/all")
          if (allCountriesResponse.ok) {
            const allCountriesData = await allCountriesResponse.json()
            setCountries(allCountriesData)
            
            // Extract languages only if we don't have them yet
            if (allLanguages.length === 0) {
              extractLanguages(allCountriesData)
            }
          }
        }
      } else {
        setCountries(data)
        setFilteredCountries(data)
        extractLanguages(data)
      }
    } catch (err) {
      setError("Failed to load countries. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  // Helper function to extract languages
  const extractLanguages = (data) => {
    const languagesSet = new Set()
    data.forEach(country => {
      if (country.languages) {
        Object.values(country.languages).forEach(lang => languagesSet.add(lang))
      }
    })
    setAllLanguages(Array.from(languagesSet).sort())
  }

  // Initial load of all countries
  useEffect(() => {
    fetchCountries()
  }, [])

  // Handle search with debouncing
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    // Don't search if the term is empty
    if (!searchTerm) {
      fetchCountries()
      return
    }
    
    // Set a new timeout to delay the search
    const timeout = setTimeout(() => {
      fetchCountries(searchTerm)
    }, 500) // 500ms debounce
    
    setSearchTimeout(timeout)
    
    // Cleanup on unmount
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout)
    }
  }, [searchTerm])

  // Apply region and language filters client-side
  useEffect(() => {
    if (!selectedRegion && !selectedLanguage) return
    
    let result = [...filteredCountries]

    if (selectedRegion && selectedRegion !== "all") {
      result = result.filter(country => country.region === selectedRegion)
    }

    if (selectedLanguage && selectedLanguage !== "all") {
      result = result.filter(country => {
        if (!country.languages) return false
        return Object.values(country.languages).some(
          lang => lang.toLowerCase() === selectedLanguage.toLowerCase()
        )
      })
    }

    setFilteredCountries(result)
  }, [selectedRegion, selectedLanguage])

  // Get unique regions for the filter
  const regions = [...new Set(countries.map(country => country.region))].sort()

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen animate-fadeIn pt-24">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Countries Explorer
        </h1>
        <p className="text-gray-600 text-lg">
          Discover and explore countries from around the world
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Input */}
          <FilterSection
            icon={<Search className="h-4 w-4 text-gray-400" />}
            label="Search by country name"
            id="search"
          >
            <input
              type="text"
              id="search"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                       hover:border-gray-300"
              placeholder="Search for a country..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </FilterSection>

          {/* Region Filter */}
          <FilterSection
            icon={<Globe className="h-4 w-4 text-gray-400" />}
            label="Filter by region"
            id="region-filter"
          >
            <select
              id="region-filter"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                       hover:border-gray-300 appearance-none bg-white cursor-pointer"
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
            >
              <option value="all">All regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </FilterSection>

          {/* Language Filter */}
          <FilterSection
            icon={<Languages className="h-4 w-4 text-gray-400" />}
            label="Filter by language"
            id="language-filter"
          >
            <select
              id="language-filter"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                       hover:border-gray-300 appearance-none bg-white cursor-pointer"
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
            >
              <option value="all">All languages</option>
              {allLanguages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </FilterSection>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <LoadingState />
      )}

      {/* Error State */}
      {error && (
        <ErrorState message={error} />
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredCountries.length}</span> of{" "}
            <span className="font-semibold text-blue-600">{countries.length}</span> countries
          </p>
        </div>
      )}

      {/* Countries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {filteredCountries.map(country => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>

      {/* No Results */}
      {!loading && !error && filteredCountries.length === 0 && (
        <NoResultsState />
      )}
    </main>
  )
}

// Helper Components
const FilterSection = ({ icon, label, id, children }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {icon}
      {label}
    </label>
    {children}
  </div>
)

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
    <span className="text-gray-600 text-lg">Loading countries...</span>
  </div>
)

const ErrorState = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
    <div className="flex items-center space-x-3">
      <XCircle className="h-5 w-5 text-red-500" />
      <p className="text-red-700">{message}</p>
    </div>
  </div>
)

const NoResultsState = () => (
  <div className="text-center py-16 px-4">
    <div className="space-y-4">
      <SearchX className="h-16 w-16 text-gray-400 mx-auto" />
      <h3 className="text-lg font-medium text-gray-900">No countries found</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Try adjusting your search terms or filters to find what you're looking for.
      </p>
    </div>
  </div>
)

export default HomePage