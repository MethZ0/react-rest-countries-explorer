"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { addFavoriteCountry, removeFavoriteCountry } from "../redux/userSlice"
import { 
  Loader2, Globe, Globe2, Users, MapPin, Languages, Landmark, Coins, Map, ArrowLeft, 
  Heart, ExternalLink, Compass, Building2, Phone, Car, Plane, Palmtree, Mountain, 
  Waves, Cloud, Droplets, Wind, Utensils, Music, BookOpen, Calendar, Ticket, Hotel, AlertTriangle,
  Sparkles, GlobeIcon
} from "lucide-react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import CountryImages from "../components/CountryImages"

function CountryDetailPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const countryCode = code

  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [borderCountries, setBorderCountries] = useState([])
  const [flagLoaded, setFlagLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [previewStats, setPreviewStats] = useState([])

  // Create refs for sections
  const detailsRef = useRef(null)
  const mapRef = useRef(null) 
  const geographyRef = useRef(null)
  const cultureRef = useRef(null)
  const travelRef = useRef(null)
  const bordersRef = useRef(null)
  const imagesRef = useRef(null)

  // Create useInView hooks for each section
  const isDetailsInView = useInView(detailsRef, { triggerOnce: true, threshold: 0.2 })
  const isMapInView = useInView(mapRef, { triggerOnce: true, threshold: 0.2 })
  const isGeographyInView = useInView(geographyRef, { triggerOnce: true, threshold: 0.2 })
  const isCultureInView = useInView(cultureRef, { triggerOnce: true, threshold: 0.2 })
  const isTravelInView = useInView(travelRef, { triggerOnce: true, threshold: 0.2 })
  const isBordersInView = useInView(bordersRef, { triggerOnce: true, threshold: 0.2 })
  const isImagesInView = useInView(imagesRef, { triggerOnce: true, threshold: 0.2 })

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

        // Create preview stats for hero section
        if (data[0]) {
          setPreviewStats([
            { 
              label: "Population", 
              value: data[0].population.toLocaleString(),
              icon: <Users className="w-4 h-4 text-cyan-400" />
            },
            { 
              label: "Capital", 
              value: data[0].capital?.[0] || "N/A",
              icon: <Landmark className="w-4 h-4 text-indigo-400" />
            },
            { 
              label: "Region", 
              value: data[0].region,
              icon: <GlobeIcon className="w-4 h-4 text-violet-400" />
            },
            { 
              label: "Area", 
              value: `${data[0].area.toLocaleString()} km²`,
              icon: <Map className="w-4 h-4 text-pink-400" />
            },
          ])
        }

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
    
    // Scroll to top when navigating between countries
    window.scrollTo(0, 0)

    // Add scroll listener for parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [countryCode])

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavoriteCountry(countryCode))
    } else {
      dispatch(addFavoriteCountry(countryCode))
    }
  }

  // Handle tab click and smooth scroll to section
  const handleTabClick = (tab) => {
    setActiveTab(tab)

    // Smooth scroll to the appropriate section
    const sectionMap = {
      overview: detailsRef,
      map: mapRef,
      geography: geographyRef,
      culture: cultureRef,
      travel: travelRef,
    }

    const targetRef = sectionMap[tab]
    if (targetRef && targetRef.current) {
      window.scrollTo({
        top: targetRef.current.offsetTop - 100, // Offset for the sticky header
        behavior: "smooth",
      })
    }
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    initial: { opacity: 1 },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/80 backdrop-blur-lg p-10 rounded-2xl border border-slate-800 shadow-xl text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-cyan-500/50 animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-2 border-b-transparent border-indigo-500/50 animate-spin-slow"></div>
            <Globe2 className="absolute inset-0 m-auto w-10 h-10 text-indigo-400" />
          </div>
          <p className="text-xl text-slate-300 mt-4">Loading country details...</p>
          <p className="text-sm text-slate-400 mt-2">Fetching information about {code}</p>
        </motion.div>
      </div>
    )
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md bg-slate-900/80 backdrop-blur-lg p-8 rounded-2xl border border-rose-700/30 shadow-xl text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-900/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-6">{error || "Country not found"}</p>
          <Link
            to="/explore"
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl text-white font-medium 
            shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/20 border border-indigo-500/20 transition-all duration-300 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>
        </motion.div>
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

  // Extract country data
  const countryName = country.name.common
  const flagUrl = country.flags.svg || country.flags.png
  const flagAlt = country.flags.alt || `Flag of ${countryName}`
  const capital = country.capital?.[0] || "N/A"
  const region = country.region
  const subregion = country.subregion
  const population = formatPopulation(country.population)
  const languages = getLanguages()
  const currencies = getCurrencies()
  const area = formatArea(country.area) + " km²"
  const googleMapsUrl = country.maps?.googleMaps
  const openStreetMapsUrl = country.maps?.openStreetMaps
  const drivingSide = country.car?.side || "N/A"
  const tld = country.tld?.join(", ") || "N/A"
  const callingCode = country.idd?.root && country.idd?.suffixes?.[0] ? `${country.idd.root}${country.idd.suffixes[0]}` : "N/A"

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hero Section with Parallax Flag Background */}
      <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        {/* Dark overlay with gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-slate-950 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Background pattern grid */}
        <div className="absolute inset-0 opacity-20 z-0" style={{ 
          backgroundImage: "linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px)", 
          backgroundSize: "40px 40px" 
        }}></div>

        {/* Flag background with parallax effect */}
        {flagLoaded ? (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{ duration: 1.5 }}
            style={{
              backgroundImage: `url(${flagUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950"></div>
        )}

        {/* Animated accent gradients */}
        <motion.div
          className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">
                {region} {subregion ? `• ${subregion}` : ""}
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg 
              bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {countryName}
          </motion.h1>

          <motion.p
            className="text-lg text-slate-300 max-w-2xl mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {country.name.official}
          </motion.p>

          {/* Key stats in hero */}
          <motion.div
            className="flex flex-wrap justify-center gap-5 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {previewStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-xl 
                bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 text-slate-300">
                {stat.icon}
                <span className="text-sm">{stat.label}: <span className="font-medium text-white">{stat.value}</span></span>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/explore"
                className="px-6 py-3.5 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl 
                  text-white font-medium hover:bg-slate-700/20 transition-all duration-300 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Explore
              </Link>
            </motion.div>

            {isAuthenticated && (
              <motion.button
                onClick={toggleFavorite}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                  isFavorite
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "bg-slate-800/50 text-white border border-slate-700"
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                <span>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
              </motion.button>
            )}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md z-30 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar py-4 gap-2">
            {[
              { id: "overview", label: "Overview", icon: <Globe2 className="w-4 h-4" /> },
              { id: "map", label: "Map", icon: <Map className="w-4 h-4" /> },
              { id: "geography", label: "Geography", icon: <Mountain className="w-4 h-4" /> },
              { id: "culture", label: "Culture", icon: <Palmtree className="w-4 h-4" /> },
              { id: "travel", label: "Travel", icon: <Plane className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-indigo-900/30 text-indigo-400 border border-indigo-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Overview Section */}
        <motion.div
          ref={detailsRef}
          initial="visible"
          animate={isDetailsInView ? "visible" : "visible"}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">Country Details</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Overview</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Flag Card */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-1 bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden group shadow-lg hover:shadow-indigo-900/10 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={flagUrl}
                  alt={flagAlt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onLoad={() => setFlagLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">National Flag</h3>
                <p className="text-slate-300 text-sm">{flagAlt}</p>
              </div>
            </motion.div>

            {/* Key Facts */}
            <motion.div variants={fadeInUp} className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <MapPin className="text-rose-400" />, title: "Capital", value: capital },
                {
                  icon: <Globe2 className="text-cyan-400" />,
                  title: "Region",
                  value: `${region}${subregion ? ` (${subregion})` : ""}`,
                },
                { icon: <Users className="text-indigo-400" />, title: "Population", value: population },
                { icon: <Map className="text-amber-400" />, title: "Area", value: area },
                { icon: <Languages className="text-violet-400" />, title: "Languages", value: languages },
                { icon: <DollarSign className="text-emerald-400" />, title: "Currencies", value: currencies },
                {
                  icon: <Clock className="text-blue-400" />,
                  title: "Timezones",
                  value:
                    country.timezones.length > 3
                      ? `${country.timezones.slice(0, 3).join(", ")} (+${country.timezones.length - 3} more)`
                      : country.timezones.join(", ") || "N/A",
                },
                { icon: <Building2 className="text-slate-400" />, title: "Top-level Domain", value: tld },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="bg-slate-900/60 backdrop-blur-sm p-5 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-lg bg-slate-800">{item.icon}</div>
                    <div>
                      <h3 className="font-medium text-slate-300">{item.title}</h3>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          ref={mapRef}
          initial="visible"
          animate={isMapInView ? "visible" : "visible"}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">Location</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Discover on the Map</h2>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-slate-900/60 backdrop-blur-sm p-1 rounded-2xl border border-slate-800 overflow-hidden shadow-xl"
          >
            {/* Using OpenStreetMap instead of Google Maps to avoid API key requirement */}
            <div className="w-full h-[500px] rounded-xl overflow-hidden">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${country.latlng ? (country.latlng[1] - 10) : 0}%2C${country.latlng ? (country.latlng[0] - 10) : 0}%2C${country.latlng ? (country.latlng[1] + 10) : 0}%2C${country.latlng ? (country.latlng[0] + 10) : 0}&layer=mapnik&marker=${country.latlng ? country.latlng[0] : 0}%2C${country.latlng ? country.latlng[1] : 0}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${countryName}`}
                className="rounded-xl"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-4">
            {googleMapsUrl && (
              <motion.a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -5 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-cyan-400 
                rounded-lg border border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-900/10 transition-all duration-300 group"
              >
                <Map className="h-5 w-5" />
                <span>View on Google Maps</span>
                <ExternalLink className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </motion.a>
            )}

            {openStreetMapsUrl && (
              <motion.a
                href={openStreetMapsUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -5 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500/20 to-violet-600/20 text-violet-400 
                rounded-lg border border-violet-500/30 hover:shadow-lg hover:shadow-violet-900/10 transition-all duration-300 group"
              >
                <Map className="h-5 w-5" />
                <span>View on OpenStreetMap</span>
                <ExternalLink className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </motion.a>
            )}
          </motion.div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial="visible"
          animate={isDetailsInView ? "visible" : "visible"}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">More Details</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Additional Information</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Car className="text-cyan-400 w-10 h-10" />,
                title: "Driving Side",
                value: drivingSide.charAt(0).toUpperCase() + drivingSide.slice(1),
                color: "from-cyan-600/20 to-cyan-400/10",
                border: "border-cyan-500/30",
              },
              {
                icon: <Phone className="text-indigo-400 w-10 h-10" />,
                title: "Calling Code",
                value: callingCode,
                color: "from-indigo-600/20 to-indigo-400/10",
                border: "border-indigo-500/30",
              },
              {
                icon: <Compass className="text-violet-400 w-10 h-10" />,
                title: "Continent",
                value: country.continents?.join(", ") || "N/A",
                color: "from-violet-600/20 to-violet-400/10",
                border: "border-violet-500/30",
              },
              {
                icon: <Waves className="text-pink-400 w-10 h-10" />,
                title: "Landlocked",
                value: country.landlocked ? "Yes" : "No",
                color: "from-pink-600/20 to-pink-400/10",
                border: "border-pink-500/30",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border ${item.border} shadow-lg shadow-slate-900/50 
                  hover:shadow-lg transition-all duration-300 text-center`}
              >
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${item.color} blur-md`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">{item.icon}</div>
                </div>
                <h3 className="text-lg font-medium text-white mb-1">{item.title}</h3>
                <p className="text-slate-300">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Geography Section */}
        <motion.div
          ref={geographyRef}
          initial="visible"
          animate={isGeographyInView ? "visible" : "visible"}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Physical Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Geography</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-emerald-500/20 
                shadow-lg shadow-emerald-900/5 hover:shadow-emerald-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Mountain className="text-emerald-400" /> Terrain
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  The terrain of {country.name.common} features diverse landscapes including mountains, plains, and coastal areas. The geography is shaped by its {region} location and natural boundaries.
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20 
                shadow-lg shadow-cyan-900/5 hover:shadow-cyan-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Cloud className="text-cyan-400" /> Climate
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  {country.name.common}'s climate is influenced by its geographical location in {region}. The weather patterns vary across different parts of the country, with seasonal changes affecting temperature and precipitation.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 
                shadow-lg shadow-blue-900/5 hover:shadow-blue-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Droplets className="text-blue-400" /> Natural Resources
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  {country.name.common} possesses various natural resources that contribute to its economy and development. These resources are distributed across the country's diverse geographical regions.
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20 
                shadow-lg shadow-cyan-900/5 hover:shadow-cyan-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Wind className="text-cyan-400" /> Environmental Issues
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  Like many nations, {country.name.common} faces environmental challenges related to development, resource management, and climate change. Conservation efforts are ongoing to protect the country's natural heritage.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Culture Section */}
        <motion.div
          ref={cultureRef}
          initial="visible"
          animate={isCultureInView ? "visible" : "visible"}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">Heritage & Traditions</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Culture</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-amber-500/20 
                shadow-lg shadow-amber-900/5 hover:shadow-amber-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Utensils className="text-amber-400" /> Cuisine
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  The cuisine of {country.name.common} reflects its cultural heritage and local ingredients. Traditional dishes are an important part of the national identity and are often featured in celebrations and gatherings.
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-pink-500/20 
                shadow-lg shadow-pink-900/5 hover:shadow-pink-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Music className="text-pink-400" /> Arts & Music
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  {country.name.common} has a rich artistic heritage that includes traditional and contemporary forms of expression. Music, dance, visual arts, and literature all contribute to the country's cultural landscape.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 
                shadow-lg shadow-blue-900/5 hover:shadow-blue-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Landmark className="text-blue-400" /> Historical Sites
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  {country.name.common} is home to numerous historical sites that reflect its past. These landmarks are important for understanding the nation's development and are often popular destinations for visitors.
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/20 
                shadow-lg shadow-indigo-900/5 hover:shadow-indigo-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="text-indigo-400" /> Language & Literature
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  The linguistic landscape of {country.name.common} includes {languages}. Literature in these languages has contributed to the country's cultural identity and has gained recognition both nationally and internationally.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Travel Section */}
        <motion.div
          ref={travelRef}
          initial="visible"
          animate={isTravelInView ? "visible" : "visible"}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">Visitor Information</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Travel</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 
                shadow-lg shadow-blue-900/5 hover:shadow-blue-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="text-blue-400" /> Best Time to Visit
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  The ideal time to visit {country.name.common} depends on the region and activities planned. Weather patterns, seasonal events, and tourist seasons should be considered when planning a trip.
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-pink-500/20 
                shadow-lg shadow-pink-900/5 hover:shadow-pink-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Ticket className="text-pink-400" /> Attractions
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  {country.name.common} offers a variety of attractions for visitors, from natural wonders to cultural sites. These destinations showcase the country's unique characteristics and provide memorable experiences.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-amber-500/20 
                shadow-lg shadow-amber-900/5 hover:shadow-amber-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Hotel className="text-amber-400" /> Accommodation
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  Accommodation options in {country.name.common} range from luxury hotels to budget-friendly alternatives. Visitors can find places to stay that suit their preferences and budget in various locations throughout the country.
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-amber-500/20 
                shadow-lg shadow-amber-900/5 hover:shadow-amber-900/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-amber-400" /> Travel Advisory
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  Before traveling to {country.name.common}, visitors should check current travel advisories and requirements. Information about safety, health precautions, and entry regulations can help ensure a smooth and enjoyable trip.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Image Gallery Section */}
        <motion.div
          ref={imagesRef}
          initial="visible"
          animate={isImagesInView ? "visible" : "visible"}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">Photo Gallery</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Explore {countryName} in Pictures</h2>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <CountryImages countryName={countryName} />
          </motion.div>
        </motion.div>

        {/* Bordering Countries */}
        {borderCountries.length > 0 && (
          <motion.div
            ref={bordersRef}
            initial="visible"
            animate={isBordersInView ? "visible" : "visible"}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm mb-4">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-400">Neighbors</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Bordering Countries</h2>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              {borderCountries.map((border) => (
                <motion.div key={border.code} whileHover={{ y: -5, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={`/country/${border.code}`}
                    className="px-5 py-2.5 bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl 
                      hover:bg-slate-800 hover:border-indigo-500/30 transition-all duration-300 
                      inline-block shadow-md"
                  >
                    {border.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Helper Components
const Clock = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0  0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
};

const DollarSign = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
};

export default CountryDetailPage
