import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ExternalLink, ImageOff, Plus } from "lucide-react"

const CountryImages = ({ countryName }) => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visibleImages, setVisibleImages] = useState(6)
  const [allImagesShown, setAllImagesShown] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      // Don't fetch for empty country name
      if (!countryName) return
      
      try {
        setLoading(true)
        
        // Use Pexels API to get images related to the country
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${countryName} landscape&per_page=15&orientation=landscape`,
          {
            headers: {
              // You should replace this with your own Pexels API key
              Authorization: "WrTRIJc2Pba7CHZ1NdeQF45yowMwtoDHeomLWCr3QgpHhPX4b9MYQ29T"
            }
          }
        )
        
        if (!response.ok) throw new Error("Failed to fetch images")
        
        const data = await response.json()
        setImages(data.photos || [])
        setAllImagesShown(data.photos?.length <= visibleImages)
      } catch (err) {
        console.error("Error fetching country images:", err)
        setError("Failed to load images")
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [countryName])

  const loadMoreImages = () => {
    setVisibleImages(prev => {
      const newCount = prev + 6
      setAllImagesShown(newCount >= images.length)
      return newCount
    })
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

  if (loading) {
    return (
      <div className="grid place-items-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading images of {countryName}...</p>
        </div>
      </div>
    )
  }

  if (error || images.length === 0) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 rounded-full bg-gray-700/50">
            <ImageOff className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-white text-xl font-semibold">No images available</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {error || `We couldn't find any images for ${countryName}. Try again later or explore another country.`}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {images.slice(0, visibleImages).map((image, index) => (
          <motion.div
            key={image.id}
            variants={fadeInUp}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-800/70 backdrop-blur-sm border border-gray-700"
          >
            <img
              src={image.src.large}
              alt={`${countryName} - ${image.alt || 'Landscape'}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/25 rounded-lg text-white flex items-center gap-2 hover:bg-white/20 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
              >
                View on Pexels
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm truncate">Photo by {image.photographer}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* View More Button */}
      {!allImagesShown && images.length > visibleImages && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 flex justify-center"
        >
          <motion.button
            onClick={loadMoreImages}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600 hover:to-purple-600 
                      text-blue-400 hover:text-white border border-blue-500/30 rounded-full flex items-center gap-2
                      transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            View More Images
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default CountryImages