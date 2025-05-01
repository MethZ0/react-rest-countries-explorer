import { useNavigate, Link } from "react-router-dom";
import { Globe, Search, Heart, MapPin, Users, ArrowRight, Languages, ChevronDown, Star, Compass, Map, Plane, ArrowUpRight, Sparkles, BookOpen, GlobeIcon, Shapes } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";

function LandingPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const features = [
    {
      title: "Explore Countries",
      description:
        "Discover detailed information about countries around the world, from geography to culture and history.",
      icon: <GlobeIcon className="w-12 h-12 text-cyan-400" />,
      color: "from-cyan-600 to-cyan-300",
    },
    {
      title: "Save Favorites",
      description: "Create your personal collection of countries you love or want to visit for quick access anytime.",
      icon: <Heart className="w-12 h-12 text-pink-400" />,
      color: "from-pink-600 to-pink-300",
    },
    {
      title: "Demographic Data",
      description: "Access population statistics and demographic information with interactive visualizations.",
      icon: <Users className="w-12 h-12 text-amber-400" />,
      color: "from-amber-600 to-amber-300",
    },
    {
      title: "Language Insights",
      description: "Learn about languages spoken in different regions with pronunciation guides and key phrases.",
      icon: <BookOpen className="w-12 h-12 text-green-400" />,
      color: "from-green-600 to-green-300",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Travel Blogger",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      content:
        "This platform has completely transformed how I research countries for my travel blog. The detailed information and intuitive interface make planning my adventures so much easier!",
    },
    {
      name: "Michael Chen",
      role: "Geography Teacher",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      content:
        "As an educator, I find this app to be an invaluable resource for my students. The interactive maps and cultural insights bring geography lessons to life in my classroom.",
    },
    {
      name: "Elena Rodriguez",
      role: "Digital Nomad",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      content:
        "I rely on this app daily as I travel the world while working remotely. The language guides and local customs information have saved me from many awkward situations!",
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(testimonialInterval);
    }
  }, [features.length, testimonials.length]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hero Section with Animated Background */}
      <motion.div ref={heroRef} className="relative min-h-screen flex items-center" style={{ opacity, scale }}>
        {/* New background with abstract design elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>

          {/* Animated grid pattern */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: "linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px)", 
            backgroundSize: "40px 40px" 
          }}></div>

          {/* Animated gradient spheres */}
          <motion.div
            className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-1/3 -right-20 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 23,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-pink-500/5 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Animated particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.7, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                  ease: "easeInOut",
                }}
                style={{
                  width: `${Math.random() * 6 + 1}px`,
                  height: `${Math.random() * 6 + 1}px`,
                  background: `rgba(${Math.random() * 155 + 100}, ${Math.random() * 155 + 100}, ${Math.random() * 255}, 0.7)`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(${Math.random() * 155 + 100}, ${Math.random() * 155 + 100}, ${Math.random() * 255}, 0.5)`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 z-10">
          {/* Updated hero content with asymmetrical layout */}
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-12"
            variants={staggerContainer}
            initial="hidden"
            animate={isHeroInView ? "show" : "hidden"}
          >
            <motion.div className="max-w-2xl lg:w-7/12" variants={fadeInUp}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full
                bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 backdrop-blur-sm"
                variants={fadeInUp}
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-400">Discover the world in a new way</span>
              </motion.div>
              
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent 
                bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500 leading-tight"
                variants={fadeInUp}
              >
                Explore Our<br/>Amazing World
              </motion.h1>
              
              <motion.p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed" variants={fadeInUp}>
                Your journey to discover the world begins here. Explore countries, cultures, and connect with the global
                community like never before.
              </motion.p>
              
              <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-xl text-white font-medium 
                    shadow-lg shadow-cyan-500/20 border border-cyan-500/20 transition-all duration-300 
                    text-center inline-block hover:shadow-xl hover:shadow-cyan-500/30"
                  >
                    Sign In
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="px-8 py-3.5 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl 
                    text-white font-medium hover:bg-slate-700/20 transition-all duration-300 
                    flex items-center justify-center gap-2"
                  >
                    Create Account
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="mt-12 flex items-center gap-4 text-slate-400"
                variants={fadeInUp}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 overflow-hidden">
                      <img 
                        src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`} 
                        alt="User" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-sm">Join <b className="text-cyan-400">2,000+</b> explorers worldwide</span>
              </motion.div>
            </motion.div>

            {/* New 3D floating elements design */}
            <motion.div className="relative w-full lg:w-5/12 h-96 lg:h-[500px]" variants={fadeInUp}>
              {/* Central globe */}
              <motion.div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 
                rounded-full bg-gradient-to-br from-slate-800 to-slate-900 
                shadow-[inset_0_0_30px_rgba(79,70,229,0.5)] border border-indigo-500/20 overflow-hidden
                flex items-center justify-center z-10"
                animate={{ 
                  boxShadow: ['0 0 30px rgba(79,70,229,0.3)', '0 0 50px rgba(79,70,229,0.5)', '0 0 30px rgba(79,70,229,0.3)'],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{
                    rotateZ: 360,
                  }}
                  transition={{
                    duration: 120,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    className="w-56 h-56 rounded-full bg-slate-900"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Globe className="w-56 h-56 text-indigo-500 opacity-90" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Orbiting elements */}
              {[0, 1, 2, 3, 4].map((i, index) => {
                const angle = (i * 2 * Math.PI) / 5;
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                const icons = [
                  <Compass className="w-6 h-6 text-cyan-400" />,
                  <Map className="w-6 h-6 text-violet-400" />,
                  <Star className="w-6 h-6 text-amber-400" />,
                  <Languages className="w-6 h-6 text-green-400" />,
                  <Shapes className="w-6 h-6 text-pink-400" />
                ];

                return (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2 w-14 h-14 rounded-2xl 
                    bg-gradient-to-br from-slate-800/90 to-slate-900/90 
                    backdrop-blur-lg flex items-center justify-center
                    shadow-lg border border-slate-700/50 z-20"
                    style={{ 
                      marginLeft: "-24px", 
                      marginTop: "-24px",
                    }}
                    animate={{
                      x: [x, x + 10, x],
                      y: [y, y + 10, y],
                      rotate: [0, i % 2 ? 10 : -10, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 5 + i,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                  >
                    {icons[i]}
                  </motion.div>
                );
              })}

              {/* Decorative rings */}
              <motion.div 
                className="absolute left-1/2 top-1/2 w-80 h-80 rounded-full border border-dashed border-indigo-500/20 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div 
                className="absolute left-1/2 top-1/2 w-[360px] h-[360px] rounded-full border border-dashed border-violet-500/10 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: -360 }}
                transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-8 h-8 text-slate-500" />
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div ref={featuresRef} className="relative py-24 overflow-hidden">
        {/* Background with mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>

        {/* Background grid */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: "linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px" 
        }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isFeaturesInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">Discover the possibilities</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 bg-clip-text text-transparent 
              bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 leading-tight">
              Powerful Features
            </h2>
            
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Explore the world with our comprehensive set of tools designed to make your global discovery journey
              seamless and enjoyable.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={isFeaturesInView ? "show" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-300
                  ${currentFeature === index 
                    ? "ring-2 ring-opacity-50 shadow-xl" 
                    : "bg-slate-900/40 shadow-lg border border-slate-800/50"
                  }`}
                style={{
                  boxShadow: currentFeature === index 
                    ? `0 20px 40px -15px ${feature.color.split(" ")[1].replace("to-", "")}`
                    : undefined,
                  ringColor: currentFeature === index
                    ? feature.color.split(" ")[1].replace("to-", "")
                    : undefined
                }}
              >
                {/* Background gradient that changes on hover */}
                <div 
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20"
                  style={{
                    background: `linear-gradient(120deg, ${feature.color.split(" ")[0].replace("from-", "")}, ${feature.color.split(" ")[1].replace("to-", "")})`
                  }}
                />

                {/* Card Content */}
                <div className="p-8">
                  <motion.div
                    className="mb-6 relative w-16 h-16 rounded-2xl flex items-center justify-center"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      background: `linear-gradient(120deg, ${feature.color.split(" ")[0].replace("from-", "20")}, ${feature.color.split(" ")[1].replace("to-", "30")})`
                    }}
                  >
                    <motion.div 
                      animate={currentFeature === index ? {
                        scale: [1, 1.1, 1],
                      } : {}}
                      transition={{ 
                        duration: 1.5, 
                        repeat: currentFeature === index ? Infinity : 0,
                        ease: "easeInOut" 
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                  </motion.div>
                  
                  <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                  
                  {/* Bottom bar with "Learn more" button */}
                  <div className="mt-8 pt-4 border-t border-slate-700/30 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Discover more</span>
                    <button 
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800/70 border border-slate-700/50"
                      aria-label={`Learn more about ${feature.title}`}
                    >
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-medium 
                  shadow-lg shadow-violet-500/20 border border-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30
                  transition-all duration-300 inline-flex items-center gap-3"
              >
                Start Exploring Now
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* World Map Section */}
      <div className="relative py-28 overflow-hidden">
        {/* New background with dots pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#3B82F620_1px,transparent_1px)] bg-slate-950 [background-size:16px_16px]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-16"
            initial={{ opacity: 0 }}
            animate={isFeaturesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={isFeaturesInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* 3D Card effect */}
                <div className="relative rounded-2xl perspective">
                  <motion.div
                    className="preserve-3d relative group cursor-pointer"
                    whileHover={{ 
                      rotateX: 5,
                      rotateY: 5,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="absolute inset-0 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-slate-950/30 backdrop-blur-sm -z-10 transform translate-z-[-20px] shadow-2xl shadow-cyan-500/10"></div>
                    
                    <div className="rounded-2xl overflow-hidden border border-slate-800 relative z-10">
                      <img
                        src="https://plus.unsplash.com/premium_photo-1712011181415-570ef105f57a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="World Map Visualization"
                        className="w-full aspect-video object-cover"
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-900/30 to-transparent"></div>
                      
                      {/* Interactive points on the map */}
                      {[
                        { top: "30%", left: "20%", color: "bg-cyan-500", label: "North America" },
                        { top: "40%", left: "48%", color: "bg-violet-500", label: "Europe" },
                        { top: "60%", left: "70%", color: "bg-emerald-500", label: "Asia" },
                        { top: "25%", left: "80%", color: "bg-amber-500", label: "Japan" },
                        { top: "70%", left: "30%", color: "bg-pink-500", label: "South America" },
                        { top: "75%", left: "75%", color: "bg-blue-500", label: "Australia" },
                      ].map((point, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-4 h-4 rounded-full ${point.color} shadow-lg
                            flex items-center justify-center z-20 cursor-pointer
                            transform -translate-x-2 -translate-y-2 group-hover:scale-110`}
                          style={{ top: point.top, left: point.left }}
                          whileHover={{ scale: 1.5, zIndex: 30 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {/* Animated ripple effect */}
                          <span className={`absolute inset-0 rounded-full ${point.color} opacity-60
                            transform scale-[0.1] animate-ping`}></span>
                            
                          {/* Label that appears on hover */}
                          <motion.div 
                            className="absolute whitespace-nowrap px-3 py-1.5 bg-slate-800/90 backdrop-blur-sm
                              rounded-lg text-white text-xs font-medium border border-slate-700/50
                              left-full ml-2 pointer-events-none opacity-0 shadow-lg shadow-black/20"
                            animate={{ opacity: 0, x: -10 }}
                            whileHover={{ opacity: 1, x: 0 }}
                          >
                            {point.label}
                          </motion.div>
                        </motion.div>
                      ))}

                      {/* Bottom card content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 to-transparent">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Interactive World Map</h3>
                        <p className="text-slate-300 text-sm md:text-base">
                          Explore countries with our immersive visualization
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="w-full lg:w-1/2"
              initial={{ x: 50, opacity: 0 }}
              animate={isFeaturesInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                  bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm mb-4"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-400">Seamless Exploration</span>
              </motion.div>
              
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent 
                bg-gradient-to-r from-cyan-400 to-blue-400 leading-tight">
                Visualize Your Journey
              </h2>
              
              <p className="text-slate-300 mb-8 text-lg">
                Our interactive world map allows you to visually explore countries and regions. 
                Click on any location to instantly access detailed information about culture, 
                demographics, and travel insights.
              </p>

              <div className="space-y-6 mb-10">
                {[
                  { 
                    title: "Immersive Navigation", 
                    description: "Navigate the globe with intuitive controls and seamless zooming",
                    icon: <Compass className="w-5 h-5 text-cyan-400" />
                  },
                  { 
                    title: "Real-time Data", 
                    description: "Access up-to-date information about any country's demographics and statistics",
                    icon: <Globe className="w-5 h-5 text-blue-400" /> 
                  },
                  { 
                    title: "Custom Routes", 
                    description: "Plan and visualize your travel routes across countries for better planning",
                    icon: <Map className="w-5 h-5 text-violet-400" />
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/30 transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.2 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="mt-1 p-2 rounded-lg bg-slate-800/70 border border-slate-700/50">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-lg">{item.title}</h4>
                      <p className="text-slate-300 text-sm">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/explore"
                  className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-medium 
                  shadow-lg shadow-cyan-500/20 border border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/20
                  transition-all duration-300 inline-flex items-center gap-2"
                >
                  Start Exploring
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <motion.div ref={testimonialsRef} className="relative py-24 overflow-hidden">
        {/* Modern background with gradient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/10 via-violet-900/10 to-slate-950"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-pink-500/5 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-violet-500/5 blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isTestimonialsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 border border-pink-500/20 backdrop-blur-sm mb-4"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-medium text-pink-400">User experiences</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent 
              bg-gradient-to-r from-pink-400 via-fuchsia-400 to-violet-400">
              What Our Explorers Say
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Join thousands of satisfied users who have transformed their global exploration 
              experience with our innovative platform.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* 3D carousel effect */}
            <div className="flex justify-center perspective">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, rotateY: -20, scale: 0.9 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: 20, scale: 0.9 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                  className="w-full max-w-3xl"
                >
                  {/* Card with glass effect */}
                  <div className="rounded-2xl overflow-hidden preserve-3d">
                    {/* Floating accent elements */}
                    <motion.div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-pink-500/10 blur-xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-violet-500/10 blur-xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.7, 0.5],
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                    
                    {/* Glass card */}
                    <div className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 backdrop-blur-sm p-10 
                      border border-slate-700/50 shadow-xl relative z-10 transform-style-3d">
                      
                      {/* Quote marks */}
                      <div className="absolute top-6 left-6 text-7xl text-pink-500/20 font-serif">"</div>
                      <div className="absolute bottom-6 right-6 text-7xl text-pink-500/20 font-serif rotate-180">"</div>
                      
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        {/* Profile column */}
                        <div className="flex-shrink-0 flex flex-col items-center space-y-3">
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-xl transform-style-3d">
                            {/* Card shadow/depth effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 transform translate-z-[-10px]"></div>
                            {/* Gradient border */}
                            <div className="absolute inset-0 rounded-xl border-2 border-gradient-to-r from-pink-500 to-violet-500 opacity-50"></div>
                            {/* Image with proper error handling */}
                            <img
                              src={testimonials[activeTestimonial].image}
                              alt={testimonials[activeTestimonial].name}
                              className="w-full h-full object-cover rounded-xl"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/150";
                              }}
                            />
                            {/* Overlay shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-violet-500/10"></div>
                          </div>
                          
                          <div className="text-center">
                            <h4 className="font-bold text-white text-lg">{testimonials[activeTestimonial].name}</h4>
                            <p className="text-slate-400 text-sm">{testimonials[activeTestimonial].role}</p>
                          </div>
                          
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        
                        {/* Testimonial content */}
                        <div className="flex-1">
                          <p className="text-slate-200 text-lg leading-relaxed italic">
                            "{testimonials[activeTestimonial].content}"
                          </p>
                          
                          <div className="mt-6 flex items-center">
                            <div className="h-0.5 flex-1 bg-gradient-to-r from-pink-500/20 to-violet-500/20"></div>
                            <div className="mx-2">
                              <Globe className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="h-0.5 flex-1 bg-gradient-to-r from-violet-500/20 to-pink-500/20"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation controls */}
            <div className="flex justify-between items-center mt-10">
              <motion.button
                className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800/70 
                  border border-slate-700/50 hover:bg-slate-700/70 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <div className="flex items-center gap-3">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeTestimonial === index ? "w-8 bg-pink-500" : "w-2.5 bg-slate-600"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <motion.button
                className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800/70 
                  border border-slate-700/50 hover:bg-slate-700/70 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
            
            {/* Call to action */}
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-slate-300 mb-6">Ready to join our community of explorers?</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="px-8 py-3.5 bg-gradient-to-r from-pink-600 to-fuchsia-600 rounded-xl text-white font-medium 
                    shadow-lg shadow-pink-500/20 border border-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30
                    transition-all duration-300 inline-flex items-center gap-2"
                >
                  Create Your Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="relative py-16 bg-black border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Amazing World
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Your journey to discover the world begins here. Explore countries, cultures, and connect with the global
                community.
              </p>
              <div className="flex gap-4">
                {["twitter", "facebook", "instagram", "youtube"].map((social) => (
                  <Link
                    key={social}
                    to="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-900/50 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "API", "Integrations", "Documentation"],
              },
              {
                title: "Resources",
                links: ["Blog", "Guides", "Help Center", "Community", "Webinars"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Press", "Contact", "Partners"],
              },
            ].map((column, i) => (
              <div key={i}>
                <h3 className="text-white font-bold mb-4">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Amazing World. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="#" className="text-gray-500 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-500 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="#" className="text-gray-500 hover:text-white text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;