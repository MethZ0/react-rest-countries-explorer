"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { loginStart, loginSuccess, loginFailure, mockUsers } from "../redux/userSlice"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
    dispatch(loginStart())

    setTimeout(() => {
      const user = mockUsers.find((user) => user.email === email && user.password === password)
      if (user) {
        const { password: _, ...userWithoutPassword } = user
        dispatch(loginSuccess(userWithoutPassword))
        navigate("/explore")
      } else {
        dispatch(loginFailure("Invalid email or password"))
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-primary relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-5%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-[-5%] left-[-10%] w-[30%] h-[30%] rounded-full bg-blue-900/10 blur-3xl animate-pulse-slow"></div>
        {/* Grid background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: "linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)", 
          backgroundSize: "40px 40px" 
        }}></div>
      </div>

      <div className="w-full max-w-md z-10 px-6">
        <div className="relative bg-dark-secondary rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Background glow effects */}
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[30%] rounded-full bg-blue-600/10 blur-3xl"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[30%] rounded-full bg-indigo-600/10 blur-3xl"></div>
          
          <div className="relative p-8 md:p-10">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-glow">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Header Section */}
            <div className="text-center space-y-2 mb-8 animate-slide-down">
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-dark-text-secondary">
                Enter your credentials to continue your journey
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

              {/* Email Field */}
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary">
                  Email Address
                </label>
                <div className="group relative rounded-xl overflow-hidden transition-all duration-300 border border-dark-border hover:border-blue-500/50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 group-hover:text-blue-400 group-focus-within:text-blue-500">
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
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-dark-text-secondary">
                    Password
                  </label>
                  <Link 
                    to="#" 
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="group relative rounded-xl overflow-hidden transition-all duration-300 border border-dark-border hover:border-blue-500/50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 group-hover:text-blue-400 group-focus-within:text-blue-500">
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

              {/* Demo Info */}
              <div className="px-5 py-4 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-slide-up flex items-start gap-3" style={{ animationDelay: "0.3s" }}>
                <div className="mt-1 rounded-full bg-blue-500/20 p-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-dark-text-secondary">
                    <span className="font-semibold text-blue-400">Demo credentials:</span> 
                    <br className="md:hidden" />
                    <span className="md:ml-1">user@example.com / password123</span>
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3.5 px-4
                         text-white font-medium rounded-xl
                         bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50
                         disabled:opacity-70 disabled:cursor-not-allowed
                         transition-all duration-300 shadow-lg shadow-blue-600/20
                         transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-3 h-5 w-5" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">Sign in</span>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Section */}
            <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <p className="text-sm text-dark-text-secondary">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="font-medium text-blue-400 hover:text-blue-300 
                           transition-colors duration-200 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage