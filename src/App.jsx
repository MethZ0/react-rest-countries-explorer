import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import CountryDetailPage from "./pages/CountryDetailPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import FavoritesPage from "./pages/FavoritesPage"
import LandingPage from "./pages/LandingPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <main className="flex-1 pt-16"> {/* Added pt-16 for padding-top */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<HomePage />} />
          <Route path="/country/:code" element={<CountryDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
