"use client"

import React from 'react';
import { useState, useEffect } from "react"
import CountryCard from "../components/CountryCard"
import { Loader2, Search, Globe, Languages, SearchX, XCircle, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"

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
  const [showFilters, setShowFilters] = useState(true)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [countriesPerPage, setCountriesPerPage] = useState(12)

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
    // Start with all fetched countries when applying filters
    let result = searchTerm ? [...filteredCountries] : [...countries];

    if (selectedRegion && selectedRegion !== "all") {
      result = result.filter(country => country.region === selectedRegion);
    }

    if (selectedLanguage && selectedLanguage !== "all") {
      result = result.filter(country => {
        if (!country.languages) return false;
        return Object.values(country.languages).some(
          lang => lang.toLowerCase() === selectedLanguage.toLowerCase()
        );
      });
    }

    setFilteredCountries(result);
  }, [selectedRegion, selectedLanguage, searchTerm, countries]);

  // Reset to page 1 when filters or search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedRegion, selectedLanguage, searchTerm])

  // Pagination calculation
  const indexOfLastCountry = currentPage * countriesPerPage
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage
  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry)
  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage)

  // Change page
  const paginate = (pageNumber) => {
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setCurrentPage(pageNumber)
  }

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1)
    }
  }

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1)
    }
  }

  // Get unique regions for the filter
  const regions = [...new Set(countries.map(country => country.region))].sort()

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen animate-fadeIn pt-24">
      {/* Hero Section */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Countries Explorer
        </h1>
        <p className="text-gray-600 text-lg">
          Discover and explore countries from around the world
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium border border-blue-100 transition-all hover:bg-blue-100"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </span>
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Filters Section */}
      <div className={`bg-white rounded-xl shadow-lg mb-6 md:mb-8 transition-all duration-300 hover:shadow-xl ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {/* Search Input */}
            <FilterSection
              icon={<Search className="h-4 w-4 text-gray-400" />}
              label="Search by country name"
              id="search"
            >
              <input
                type="text"
                id="search"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 
                        focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                        hover:border-gray-300 text-base"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 
                        focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                        hover:border-gray-300 appearance-none bg-white cursor-pointer text-base"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 
                        focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                        hover:border-gray-300 appearance-none bg-white cursor-pointer text-base"
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-blue-600">{indexOfFirstCountry + 1}-{Math.min(indexOfLastCountry, filteredCountries.length)}</span> of{" "}
            <span className="font-semibold text-blue-600">{filteredCountries.length}</span> countries
          </p>
          
          <div className="flex items-center">
            <label htmlFor="countries-per-page" className="text-sm text-gray-600 mr-2">Show:</label>
            <select 
              id="countries-per-page" 
              value={countriesPerPage}
              onChange={(e) => {
                setCountriesPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>
      )}

      {/* Countries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {currentCountries.map(country => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>

      {/* Pagination */}
      {!loading && !error && filteredCountries.length > 0 && (
        <div className="mt-8 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Pagination buttons */}
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className={`flex items-center justify-center p-2 rounded ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Page numbers - show up to 5 page numbers */}
            <div className="flex items-center">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                // Calculate page number to show based on current page and total pages
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (currentPage <= 3) {
                  pageNum = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = currentPage - 2 + idx;
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => paginate(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {/* Show ellipsis for more pages */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2">...</span>
              )}
              
              {/* Always show last page if there are many pages */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => paginate(totalPages)}
                  className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-blue-50"
                >
                  {totalPages}
                </button>
              )}
            </div>
            
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center p-2 rounded ${
                currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && filteredCountries.length === 0 && (
        <NoResultsState />
      )}
    </main>
  )
}

// Helper Components
const FilterSection = ({ icon, label, id, children }) => (
  <div className="space-y-1 md:space-y-2">
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