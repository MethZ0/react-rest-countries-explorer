"use client"
import { Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/userSlice"
import { Globe, User, LogOut, Heart, Menu, X, Sparkles, MapPin, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

function Navbar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { currentUser, isAuthenticated } = useSelector((state) => state.user)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Check if current page is landing page to apply transparent background when at top
  const isLandingPage = location.pathname === "/"

  const handleLogout = () => {
    dispatch(logout())
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Handle scroll behavior for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isLandingPage && !isScrolled 
          ? 'bg-transparent backdrop-blur-0' 
          : 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/40 shadow-lg'
      }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:scale-105 transition-all duration-200 group"
          >
            <img 
              src="https://i.imgur.com/XrNlgPK.png" 
              alt="Amazing World Logo" 
              className="h-9 w-9 object-contain" 
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500 leading-none">
                Amazing World
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-indigo-400 transition-colors">Explore the globe</span>
            </div>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-800/70 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <AnimatePresence>
            <motion.nav 
              className={`md:flex items-center space-x-4 ${isMobileMenuOpen ? 
                'absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl p-5 space-y-5 md:space-y-0' : 
                'hidden md:flex'}`}
              initial={isMobileMenuOpen ? { opacity: 0, height: 0 } : false}
              animate={isMobileMenuOpen ? { opacity: 1, height: 'auto' } : false}
              exit={isMobileMenuOpen ? { opacity: 0, height: 0 } : false}
              transition={{ duration: 0.2 }}
            >
              <Link 
                to="/explore" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === "/explore" 
                    ? "bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <MapPin className="h-4 w-4" />
                Explore Countries
              </Link>

              {isAuthenticated ? (
                <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900/70 hover:bg-slate-800 border border-slate-700 rounded-xl hover:shadow-lg hover:shadow-indigo-900/10 transition-all duration-200"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-medium text-sm">
                      {currentUser?.name?.charAt(0)}
                    </div>
                    <span className="text-white">{currentUser?.name}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-xl z-10 overflow-hidden"
                      >
                        <div className="p-3 border-b border-slate-800">
                          <p className="text-sm text-slate-400">Signed in as</p>
                          <p className="font-medium text-white">{currentUser?.email}</p>
                        </div>
                        
                        <Link 
                          to="/favorites" 
                          className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800/80 transition-colors duration-200"
                          onClick={() => {
                            setIsDropdownOpen(false)
                            setIsMobileMenuOpen(false)
                          }}
                        >
                          <Heart className="h-4 w-4 text-pink-400" />
                          <span className="text-white">Favorites</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-3 hover:bg-rose-500/10 w-full transition-colors duration-200 border-t border-slate-800"
                        >
                          <LogOut className="h-4 w-4 text-rose-400" />
                          <span className="text-rose-400">Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-white rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
                    >
                      Register
                    </motion.button>
                  </Link>
                </div>
              )}
            </motion.nav>
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar