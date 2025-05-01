"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { registerStart, registerSuccess, registerFailure, mockUsers } from "../redux/userSlice"
import { Loader2, User, Mail, Lock, AlertCircle } from "lucide-react"

function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, isAuthenticated } = useSelector((state) => state.user)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/explore")
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      dispatch(registerFailure("Passwords do not match"))
      return
    }

    dispatch(registerStart())

    const userExists = mockUsers.some((user) => user.email === email)
    if (userExists) {
      dispatch(registerFailure("Email already exists"))
      return
    }

    setTimeout(() => {
      const newUser = {
        id: (mockUsers.length + 1).toString(),
        email,
        name,
        favoriteCountries: [],
      }
      dispatch(registerSuccess(newUser))
      navigate("/explore")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-primary relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-violet-900/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-[-5%] left-[-10%] w-[30%] h-[30%] rounded-full bg-blue-900/10 blur-3xl animate-pulse-slow"></div>
        {/* Grid background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: "linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)", 
          backgroundSize: "40px 40px" 
        }}></div>
      </div>

      <div className="w-full max-w-md z-10 px-6">
        <div className="relative bg-dark-secondary rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Background glow effects */}
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[30%] rounded-full bg-violet-600/10 blur-3xl"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[30%] rounded-full bg-indigo-600/10 blur-3xl"></div>
          
          <div className="relative p-8 md:p-10">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 animate-glow">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Header Section */}
            <div className="text-center space-y-2 mb-8 animate-slide-down">
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-dark-text-secondary">
                Join us to explore countries around the world
              </p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 rounded-md animate-shake">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <label htmlFor="name" className="block text-sm font-medium text-dark-text-secondary">
                  Full Name
                </label>
                <div className="group relative rounded-xl overflow-hidden transition-all duration-300 border border-dark-border hover:border-indigo-500/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 group-hover:text-indigo-400 group-focus-within:text-indigo-500">
                    <User className="h-5 w-5 text-dark-text-secondary" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-dark-primary/50 
                             text-dark-text-primary focus:outline-none placeholder:text-dark-text-secondary/50"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary">
                  Email Address
                </label>
                <div className="group relative rounded-xl overflow-hidden transition-all duration-300 border border-dark-border hover:border-indigo-500/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 group-hover:text-indigo-400 group-focus-within:text-indigo-500">
                    <Mail className="h-5 w-5 text-dark-text-secondary" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-dark-primary/50 
                             text-dark-text-primary focus:outline-none placeholder:text-dark-text-secondary/50"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <label htmlFor="password" className="block text-sm font-medium text-dark-text-secondary">
                  Password
                </label>
                <div className="group relative rounded-xl overflow-hidden transition-all duration-300 border border-dark-border hover:border-indigo-500/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 group-hover:text-indigo-400 group-focus-within:text-indigo-500">
                    <Lock className="h-5 w-5 text-dark-text-secondary" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-dark-primary/50 
                             text-dark-text-primary focus:outline-none placeholder:text-dark-text-secondary/50"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-text-secondary">
                  Confirm Password
                </label>
                <div className="group relative rounded-xl overflow-hidden transition-all duration-300 border border-dark-border hover:border-indigo-500/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 group-hover:text-indigo-400 group-focus-within:text-indigo-500">
                    <Lock className="h-5 w-5 text-dark-text-secondary" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-dark-primary/50 
                             text-dark-text-primary focus:outline-none placeholder:text-dark-text-secondary/50"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 animate-slide-up" style={{ animationDelay: "0.6s" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3.5 px-4
                         text-white font-medium rounded-xl
                         bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                         disabled:opacity-70 disabled:cursor-not-allowed
                         transition-all duration-300 shadow-lg shadow-indigo-600/20
                         transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-3 h-5 w-5" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center">Create Account</span>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Section */}
            <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: "0.7s" }}>
              <p className="text-sm text-dark-text-secondary">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="font-medium text-indigo-400 hover:text-indigo-300 
                           transition-colors duration-200 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage