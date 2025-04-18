"use client"
import { Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/userSlice"
import { Globe, User, LogOut, Heart, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

function Navbar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { currentUser, isAuthenticated } = useSelector((state) => state.user)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  return (
    <header className="bg-white border-b shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
          >
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Countries Explorer
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className={`md:flex items-center space-x-4 ${isMobileMenuOpen ? 
            'absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4 space-y-4 md:space-y-0' : 
            'hidden md:flex'}`}>
            <Link 
              to="/" 
              className={`${location.pathname === "/" 
                ? "font-medium text-blue-600" 
                : "text-gray-600 hover:text-blue-600"} 
                transition-colors duration-200`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-4 py-2 border rounded-full hover:border-blue-500 hover:shadow-md transition-all duration-200"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">{currentUser?.name}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10 overflow-hidden transform origin-top scale-y-100 transition-transform duration-200">
                    <Link 
                      to="/favorites" 
                      className="flex items-center gap-2 px-4 py-3 hover:bg-blue-50 transition-colors duration-200"
                      onClick={() => {
                        setIsDropdownOpen(false)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <Heart className="h-4 w-4 text-blue-600" />
                      <span>Favorites</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 w-full transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <button className="px-4 py-2 border rounded-full hover:border-blue-500 hover:shadow-md transition-all duration-200">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:shadow-md transition-all duration-200">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar