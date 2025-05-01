"use client"

import React from 'react';
import { useState, useEffect } from "react"
import CountryCard from "../components/CountryCard"
import { Loader2, Search, Globe, Languages, SearchX, XCircle, Filter, RefreshCw, Sparkles, GlobeIcon, MapPin, Users, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)
  const [viewMode, setViewMode] = useState("grid") // grid or compact
  const [sortBy, setSortBy] = useState("name") // name, population, area
  const [sortOrder, setSortOrder] = useState("asc") // asc, desc
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [countriesPerPage, setCountriesPerPage] = useState(12)
  const [totalPages, setTotalPages] = useState(1)

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

  // Apply sorting
  useEffect(() => {
    if (!filteredCountries.length) return;

    const sorted = [...filteredCountries].sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.common.localeCompare(b.name.common)
          : b.name.common.localeCompare(a.name.common);
      } else if (sortBy === "population") {
        return sortOrder === "asc"
          ? a.population - b.population
          : b.population - a.population;
      } else if (sortBy === "area") {
        // Handle undefined areas by treating them as 0
        const areaA = a.area || 0;
        const areaB = b.area || 0;
        return sortOrder === "asc" ? areaA - areaB : areaB - areaA;
      }
      return 0;
    });

    setFilteredCountries(sorted);
  }, [sortBy, sortOrder]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedRegion("")
    setSelectedLanguage("")
    setFilteredCountries(countries)
    setCurrentPage(1) // Reset to first page when filters are reset
  }

  // Get unique regions for the filter
  const regions = [...new Set(countries.map(country => country.region))].sort()

  // Calculate total pages based on filtered countries
  useEffect(() => {
    if (filteredCountries.length) {
      setTotalPages(Math.ceil(filteredCountries.length / countriesPerPage))
      // If current page is now beyond available pages, reset to page 1
      if (currentPage > Math.ceil(filteredCountries.length / countriesPerPage)) {
        setCurrentPage(1)
      }
    } else {
      setTotalPages(1)
    }
  }, [filteredCountries, countriesPerPage])

  // Get the current countries to display
  const indexOfLastCountry = currentPage * countriesPerPage
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage
  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry)

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 sm:px-6"
    >
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden mb-16">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 rounded-3xl"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20 rounded-3xl" style={{ 
          backgroundImage: "linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px" 
        }}></div>
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 -right-20 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <div className="container mx-auto relative z-10 py-16 px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 backdrop-blur-sm mb-4"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">Discover the World</span>
            </motion.div>
            
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent 
                bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500 leading-tight"
            >
              Explore Countries
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-slate-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Discover detailed information about countries from around the world.
              Use the filters below to find specific regions, languages, or search by name.
            </motion.p>
            
            {/* Feature icons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-6 mt-6"
            >
              {[
                { icon: <GlobeIcon className="w-6 h-6 text-cyan-400" />, label: "196 Countries" },
                { icon: <Users className="w-6 h-6 text-indigo-400" />, label: "Population Data" },
                { icon: <MapPin className="w-6 h-6 text-violet-400" />, label: "Detailed Maps" },
                { icon: <BookOpen className="w-6 h-6 text-pink-400" />, label: "Cultural Insights" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-slate-300">
                  <div className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/50">{item.icon}</div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container mx-auto mb-10"
      >
        <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-800 hover:border-indigo-500/30 transition-all duration-300">
          <div className="flex flex-col space-y-6">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-12 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300
                         hover:border-indigo-400/30 placeholder-slate-500 shadow-md"
                placeholder="Search for a country..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-3 flex items-center" 
                  onClick={() => setSearchTerm("")}
                >
                  <XCircle className="h-5 w-5 text-slate-500 hover:text-white transition-colors" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <button 
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 hover:bg-slate-800 rounded-lg border border-slate-700 
                  text-slate-300 hover:text-white transition-all text-sm"
              >
                <Filter className="h-4 w-4" />
                {isFiltersExpanded ? "Hide Filters" : "Show Filters"}
              </button>
              
              {/* Display options */}
              <div className="flex items-center gap-3">
                {/* View mode toggle */}
                <div className="flex items-center gap-1 p-1 bg-slate-800/70 rounded-lg border border-slate-700">
                  <button 
                    className={`p-1.5 rounded ${viewMode === 'grid' 
                      ? 'bg-indigo-500/30 text-indigo-300' 
                      : 'text-slate-400 hover:text-slate-300'}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    className={`p-1.5 rounded ${viewMode === 'compact' 
                      ? 'bg-indigo-500/30 text-indigo-300' 
                      : 'text-slate-400 hover:text-slate-300'}`}
                    onClick={() => setViewMode('compact')}
                    aria-label="Compact view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                
                {/* Sort options */}
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="bg-slate-800/70 border border-slate-700 rounded-lg text-slate-300 text-sm px-3 py-1.5
                    focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="population-desc">Population (High-Low)</option>
                  <option value="population-asc">Population (Low-High)</option>
                  <option value="area-desc">Area (Large-Small)</option>
                  <option value="area-asc">Area (Small-Large)</option>
                </select>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 hover:bg-slate-800
                    border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all text-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {isFiltersExpanded && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700/50"
                >
                  {/* Region Filter */}
                  <FilterSection
                    icon={<Globe className="h-4 w-4 text-cyan-400" />}
                    label="Filter by region"
                    id="region-filter"
                  >
                    <div className="relative">
                      <select
                        id="region-filter"
                        className="w-full appearance-none px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-white
                                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300
                                hover:border-indigo-400/30 cursor-pointer pr-10"
                        value={selectedRegion}
                        onChange={e => setSelectedRegion(e.target.value)}
                      >
                        <option value="all">All regions</option>
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </FilterSection>

                  {/* Language Filter */}
                  <FilterSection
                    icon={<Languages className="h-4 w-4 text-violet-400" />}
                    label="Filter by language"
                    id="language-filter"
                  >
                    <div className="relative">
                      <select
                        id="language-filter"
                        className="w-full appearance-none px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-white
                                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300
                                hover:border-indigo-400/30 cursor-pointer pr-10"
                        value={selectedLanguage}
                        onChange={e => setSelectedLanguage(e.target.value)}
                      >
                        <option value="all">All languages</option>
                        {allLanguages.map(language => (
                          <option key={language} value={language}>{language}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </FilterSection>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto flex items-center justify-between mb-6"
        >
          <div className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
            <p className="text-slate-300 flex items-center gap-2">
              <GlobeIcon className="h-4 w-4 text-cyan-400" />
              Showing <span className="font-semibold text-cyan-400">{filteredCountries.length}</span> of{" "}
              <span className="font-semibold text-cyan-400">{countries.length}</span> countries
            </p>
          </div>
        </motion.div>
      )}

      {/* Countries Grid or List */}
      {viewMode === 'grid' ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
        >
          {currentCountries.map((country, index) => (
            <motion.div
              key={country.cca3}
              variants={fadeInUp}
              custom={index}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <CountryCard country={country} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="container mx-auto space-y-3"
        >
          {currentCountries.map((country, index) => (
            <motion.div
              key={country.cca3}
              variants={fadeInUp}
              custom={index}
              transition={{ delay: index * 0.03 }}
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
              className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 hover:border-indigo-500/30 
                rounded-xl p-4 flex items-center gap-4 transition-all duration-300"
            >
              <img 
                src={country.flags?.svg || country.flags?.png} 
                alt={country.flags?.alt || `Flag of ${country.name.common}`}
                className="w-12 h-8 object-cover rounded shadow-md"
              />
              <div className="flex-1">
                <h3 className="font-medium text-white text-lg">{country.name.common}</h3>
                <div className="flex items-center gap-6 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" /> {country.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-violet-400" /> {country.population?.toLocaleString()}
                  </span>
                </div>
              </div>
              <a href={`/country/${country.cca3}`} className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm hover:bg-indigo-500/30 transition-colors">
                Details
              </a>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto mt-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Countries per page:</span>
              <select
                aria-label="Countries per page"
                value={countriesPerPage}
                onChange={(e) => {
                  setCountriesPerPage(Number(e.target.value))
                  setCurrentPage(1) // Reset to first page when changing items per page
                }}
                className="bg-slate-800/70 border border-slate-700 rounded-lg text-slate-300 text-sm px-2 py-1
                  focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
                <option value="96">96</option>
              </select>
            </div>
            
            <div className="text-sm text-slate-400">
              Page {currentPage} of {totalPages} ({indexOfFirstCountry + 1}-{Math.min(indexOfLastCountry, filteredCountries.length)} of {filteredCountries.length})
            </div>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => paginate(1)}
              className="px-3 py-1.5 bg-slate-800/70 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all text-sm"
              disabled={currentPage === 1}
            >
              First
            </button>
            <button 
              onClick={() => paginate(currentPage - 1)}
              className="px-3 py-1.5 bg-slate-800/70 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all text-sm"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {/* Dynamic pagination buttons */}
            {[...Array(totalPages)].map((_, index) => {
              // Show current page, 2 pages before and after, first and last pages
              if (
                index === 0 || 
                index === totalPages - 1 || 
                (index >= currentPage - 2 && index <= currentPage + 1)
              ) {
                return (
                  <button 
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1.5 border rounded-lg text-sm transition-all ${currentPage === index + 1 
                      ? 'bg-indigo-500/30 border-indigo-500 text-indigo-300' 
                      : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:text-white'}`}
                  >
                    {index + 1}
                  </button>
                );
              }
              
              // Show ellipsis for skipped pages, but only once
              if (
                (index === 1 && currentPage > 3) || 
                (index === totalPages - 2 && currentPage < totalPages - 2)
              ) {
                return (
                  <span 
                    key={index}
                    className="px-3 py-1.5 text-slate-500 flex items-center"
                  >
                    ...
                  </span>
                );
              }
              
              return null;
            })}
            
            <button 
              onClick={() => paginate(currentPage + 1)}
              className="px-3 py-1.5 bg-slate-800/70 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all text-sm"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button 
              onClick={() => paginate(totalPages)}
              className="px-3 py-1.5 bg-slate-800/70 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all text-sm"
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </nav>
        </motion.div>
      )}

      {/* No Results */}
      {!loading && !error && filteredCountries.length === 0 && (
        <NoResultsState resetFilters={resetFilters} />
      )}
    </motion.div>
  )
}

// Helper Components
const FilterSection = ({ icon, label, id, children }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium text-slate-300 flex items-center gap-2">
      {icon}
      {label}
    </label>
    {children}
  </div>
)

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="relative"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 blur-md opacity-50"></div>
      <Loader2 className="h-16 w-16 text-indigo-400 relative z-10" />
    </motion.div>
    <span className="text-slate-300 text-lg">Loading countries...</span>
  </div>
)

const ErrorState = ({ message }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="container mx-auto bg-rose-500/10 border border-rose-500/30 p-6 rounded-xl shadow-lg"
  >
    <div className="flex items-center space-x-3">
      <XCircle className="h-6 w-6 text-rose-500" />
      <p className="text-rose-400 font-medium">{message}</p>
    </div>
  </motion.div>
)

const NoResultsState = ({ resetFilters }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="container mx-auto text-center py-16 px-4 border border-dashed border-slate-700 rounded-xl bg-slate-900/20 shadow-inner"
  >
    <div className="space-y-4">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        className="relative w-16 h-16 mx-auto"
      >
        <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-md"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <SearchX className="h-16 w-16 text-violet-400" />
        </div>
      </motion.div>
      <h3 className="text-xl font-medium text-white">No countries found</h3>
      <p className="text-slate-400 max-w-md mx-auto">
        Try adjusting your search terms or filters to find what you're looking for.
      </p>
      <button
        onClick={resetFilters}
        className="mt-4 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg text-white font-medium 
          hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
      >
        Clear filters
      </button>
    </div>
  </motion.div>
)

export default HomePage