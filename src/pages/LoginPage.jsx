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
      navigate("/")
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
        navigate("/")
      } else {
        dispatch(loginFailure("Invalid email or password"))
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
          {/* Header Section */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md animate-shake">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           transition-all duration-200 hover:border-gray-400"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link 
                  to="#" 
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           transition-all duration-200 hover:border-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent 
                       text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200
                       transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 
                         transition-colors duration-200 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage