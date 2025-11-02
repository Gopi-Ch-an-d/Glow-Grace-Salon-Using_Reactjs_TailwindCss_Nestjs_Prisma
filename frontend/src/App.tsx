import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewBooking from './components/NewBooking';
import BookingsList from './components/BookingsList';
import ServicesManagement from './components/ServicesManagement';
import Customers from './components/Customers';
import StaffManagement from './components/StaffManagement';
import Settings from './components/Settings';
import {
  Scissors,
  User,
  Menu,
  X,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  Users,
  Shield,
  Sparkles,
  Gift,
  Zap,
  Heart,
  TrendingUp,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

// Animation wrapper component
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' }> = ({
  children,
  delay = 0,
  direction = 'up'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(30px)';
      case 'down': return 'translateY(-30px)';
      case 'left': return 'translateX(30px)';
      case 'right': return 'translateX(-30px)';
      default: return 'translateY(30px)';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible
        ? 'opacity-100 transform translate-x-0 translate-y-0'
        : `opacity-0 transform ${getTransform()}`
        }`}
    >
      {children}
    </div>
  );
};

// Floating element component
const FloatingElement: React.FC<{ children: React.ReactNode; duration?: number }> = ({
  children,
  duration = 3
}) => {
  return (
    <div
      className="animate-float"
      style={{ animationDuration: `${duration}s` }}
    >
      {children}
    </div>
  );
};

// Public Website Component
const PublicWebsite: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  interface Service {
    name: string;
    duration: string;
    price: string;
    image: string;
  }

  interface Testimonial {
    name: string;
    rating: number;
    comment: string;
    image: string;
  }

  interface GalleryItem {
    id: number;
    category: string;
    image: string;
    title: string;
  }

  interface TeamMember {
    name: string;
    role: string;
    experience: string;
    image: string;
    specialty: string;
  }

  interface Package {
    name: string;
    services: string[];
    originalPrice: number;
    discountedPrice: number;
    duration: string;
    popular?: boolean;
  }

  const services: Service[] = [
    {
      name: "Premium Haircut & Styling",
      duration: "45 min",
      price: "₹300",
      image: "https://i.pinimg.com/736x/8e/fd/80/8efd803b6d3c4a815fb3d929ba33b0ce.jpg"
    },
    {
      name: "Beard Trim & Shaping",
      duration: "30 min",
      price: "₹150",
      image: "https://img.freepik.com/free-photo/man-barbershop-salon-doing-haircut-beard-trim_1303-20951.jpg"
    },
    {
      name: "Hair Wash & Conditioning",
      duration: "20 min",
      price: "₹100",
      image: "https://media.istockphoto.com/id/1136206577/photo/man-getting-hair-washed-at-hairdresser.jpg?s=612x612&w=0&k=20&c=6BxEROpfli1nDNCP7xIhdOgqASYspKSxC-UlEz-WTbA="
    },
    {
      name: "Face Cleanup & Massage",
      duration: "40 min",
      price: "₹200",
      image: "https://www.glazma.com/static/media/men-facial.0f0bc19c0b2d5e70ee16.jpg"
    },
    {
      name: "Hair Coloring",
      duration: "90 min",
      price: "₹800",
      image: "https://t3.ftcdn.net/jpg/04/86/70/98/360_F_486709876_REbUj7ZkLqUOzEVmQ00SoHeboS44PJSU.jpg"
    },
    {
      name: "Complete Grooming Package",
      duration: "120 min",
      price: "₹600",
      image: "https://manhor.com.au/wp-content/uploads/2022/10/mens-package.jpg"
    }
  ];

  const packages: Package[] = [
    {
      name: "Basic Grooming",
      services: ["Haircut", "Hair Wash", "Basic Styling"],
      originalPrice: 450,
      discountedPrice: 350,
      duration: "60 min"
    },
    {
      name: "Premium Package",
      services: ["Premium Haircut", "Beard Trim", "Face Cleanup", "Hair Wash"],
      originalPrice: 750,
      discountedPrice: 599,
      duration: "90 min",
      popular: true
    },
    {
      name: "Luxury Experience",
      services: ["Premium Haircut", "Beard Styling", "Face Cleanup", "Head Massage", "Hair Treatment"],
      originalPrice: 1200,
      discountedPrice: 899,
      duration: "150 min"
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Excellent service! Best haircut I've ever had. Gopichand sir is truly skilled.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Amit Sharma",
      rating: 5,
      comment: "Professional staff and great ambiance. Highly recommend for all grooming needs.",
      image: "https://randomuser.me/api/portraits/men/65.jpg"
    },
    {
      name: "Vikram Singh",
      rating: 5,
      comment: "Been coming here for 2 years. Consistent quality and friendly service every time.",
      image: "https://randomuser.me/api/portraits/men/44.jpg"
    }
  ];

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      category: 'haircuts',
      image: 'https://i.pinimg.com/736x/ae/ee/d4/aeeed4d0ca8466ca5d76f4619464d17f.jpg',
      title: 'Modern Fade Cut'
    },
    {
      id: 2,
      category: 'beards',
      image: 'https://t4.ftcdn.net/jpg/02/69/63/35/360_F_269633549_QijCLiqbGdwW1ynHsnul7ELl2trMpn25.jpg',
      title: 'Classic Beard Trim'
    },
    {
      id: 3,
      category: 'styling',
      image: 'https://png.pngtree.com/thumb_back/fh260/background/20220609/pngtree-bearded-hipster-confidently-styled-by-skilled-barber-in-barbershop-and-mens-beauty-salon-advertisement-photo-image_45814958.jpg',
      title: 'Professional Styling'
    },
    {
      id: 4,
      category: 'haircuts',
      image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500',
      title: 'Textured Cut'
    },
    {
      id: 5,
      category: 'beards',
      image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=500',
      title: 'Beard Sculpting'
    },
    {
      id: 6,
      category: 'styling',
      image: 'https://t4.ftcdn.net/jpg/03/74/32/65/360_F_374326500_IZuSyagnKizUonpTAxmG9xoJA7LLLavU.jpg',
      title: 'Hair Styling'
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      name: "Gopichand",
      role: "Master Stylist & Owner",
      experience: "15+ Years",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
      specialty: "Classic & Modern Cuts"
    },
    {
      name: "Ravi Kumar",
      role: "Senior Stylist",
      experience: "8 Years",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
      specialty: "Beard Styling Expert"
    },
    {
      name: "Suresh",
      role: "Color Specialist",
      experience: "6 Years",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300",
      specialty: "Hair Coloring & Treatments"
    }
  ];

  const filteredGallery = selectedGalleryCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedGalleryCategory);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      {/* Custom CSS for animations */}
      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.3); }
          50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.6); }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        .gradient-text {
          background: linear-gradient(45deg, #f59e0b, #ea580c, #dc2626);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-black/95 backdrop-blur-md border-b border-amber-500/30 py-2'
        : 'bg-transparent py-4'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <FadeIn direction="down" delay={100}>
              <div className="flex flex-col items-start space-y-1">
                <div className="flex items-center space-x-2">
                  <FloatingElement duration={2}>
                    <Scissors className="h-8 w-8 text-amber-400" />
                  </FloatingElement>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent animate-glow-text relative">
                    Glow & Grace Salon
                    <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-amber-400 to-orange-500 animate-glow-underline rounded-full"></span>
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {['Home', 'About', 'Services', 'Packages', 'Team', 'Gallery', 'Contact'].map((item, index) => (
                <FadeIn key={item} direction="down" delay={100 + index * 50}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="relative group hover:text-amber-400 transition-all duration-300"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </FadeIn>
              ))}
              <FadeIn direction="down" delay={450}>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-pink-500 px-6 py-2 rounded-full text-white font-semibold hover:from-blue-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </button>
              </FadeIn>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-amber-400 transition-all duration-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md animate-slide-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['Home', 'About', 'Services', 'Packages', 'Team', 'Gallery', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-3 py-2 hover:text-amber-400 transition-all duration-300 hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://i.pinimg.com/originals/07/37/42/073742f040891e0c9c517fa63e76c17d.jpg')"
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-brightness-75">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-float" style={{ animationDelay: '0s' }}>
          <div className="w-4 h-4 bg-amber-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-6 h-6 bg-orange-500 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-3 h-3 bg-amber-300 rounded-full opacity-70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* <FadeIn delay={200}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-glow-text bg-clip-text text-transparent">
              Glow & Grace Salon
            </h1>
          </FadeIn> */}

          <FadeIn delay={400}>
            <p className="text-xl md:text-2xl mb-8 mt-60 font-sans font-bold drop-shadow-lg">
              <span className="text-yellow-500">
                Where Style Meets Excellence
              </span>
              <span className="text-white"> — Your Premium Grooming Destination</span>
            </p>
          </FadeIn>


          <FadeIn delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="group relative bg-gradient-to-r from-blue-600 via-white to-pink-600 px-8 py-4 rounded-full text-lg font-bold text-gray-900 shadow-[0_0_25px_rgba(255,105,180,0.7)] hover:shadow-[0_0_35px_rgba(255,105,180,0.9)] transition-all hover:scale-110 animate-pulse"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => {
                  const section = document.getElementById('services');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group border-2 border-amber-500 px-8 py-4 rounded-full text-lg font-semibold text-white hover:bg-amber-500 hover:text-black transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10">View Services</span>
                <div className="absolute inset-0 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={800}>
            <div className="mt-12 animate-bounce">
              <ChevronDown className="h-8 w-8 mx-auto text-amber-400" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Side — Text Content */}
            <FadeIn direction="right" delay={200}>
              <div>
                <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  About Glow & Grace Salon
                </h2>

                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  With over 15 years of experience in the grooming industry, Glow & Grace Salon has established itself as the premier destination for men's styling and grooming in the city. Our master stylists combine traditional techniques with modern trends to deliver exceptional results.
                </p>

                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  We pride ourselves on using only the finest products and maintaining the highest standards of hygiene and customer service. Every visit to our salon is designed to be a relaxing and rejuvenating experience.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center transform hover:scale-105 transition-all duration-300">
                    <div className="text-4xl font-bold text-amber-400 mb-2 animate-pulse">15+</div>
                    <div className="text-gray-400">Years Experience</div>
                  </div>
                  <div className="text-center transform hover:scale-105 transition-all duration-300">
                    <div className="text-4xl font-bold text-amber-400 mb-2 animate-pulse">5000+</div>
                    <div className="text-gray-400">Happy Customers</div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right Side — Image */}
            <FadeIn direction="left" delay={400}>
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://thumbs.dreamstime.com/b/man-line-art-beard-face-beautiful-blue-shade-wallpapers-shop-decoration-scissors-background-pattern-tool-salon-290618461.jpg"
                    alt="Glow & Grace Salon Interior"
                    className="rounded-3xl w-full h-[450px] object-cover brightness-90 hover:brightness-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-3xl"></div>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn direction="down">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Our Premium Services
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {services.map((service, index) => (
              <FadeIn key={index} delay={index * 100} direction="up">
                <div
                  className="group bg-gradient-to-br from-slate-700 to-slate-800 p-3 md:p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-amber-500/20 cursor-pointer"
                >
                  <div className="overflow-hidden rounded-xl mb-2 md:mb-4">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-32 md:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 text-amber-400 group-hover:text-amber-300 transition-colors">
                    {service.name}
                  </h3>
                  <div className="flex items-center justify-between text-gray-400 text-sm md:text-base">
                    <div className="flex items-center group">
                      <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1 group-hover:scale-110 transition-transform" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-white border-2 border-black rounded-lg px-2 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 animate-pulse group-hover:animate-none">
                      {service.price}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn direction="down">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Special Packages
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <FadeIn key={index} delay={index * 150} direction="up">
                <div
                  className={`group relative bg-gradient-to-br from-slate-700 to-slate-800 p-6 md:p-8 rounded-2xl border ${pkg.popular ? 'border-amber-500 animate-glow' : 'border-amber-500/20'
                    } hover:border-amber-500/50 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-amber-500/20 cursor-pointer`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-amber-400 mb-2 group-hover:text-amber-300 transition-colors">
                      {pkg.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl md:text-3xl font-bold text-white">₹{pkg.discountedPrice}</span>
                      <span className="text-base md:text-lg text-gray-400 line-through">₹{pkg.originalPrice}</span>
                    </div>
                    <div className="text-gray-400 text-sm mt-1">{pkg.duration}</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.services.map((service, idx) => (
                      <li key={idx} className="flex items-center text-gray-300 text-sm md:text-base group-hover:text-white transition-colors">
                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn direction="down">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Meet Our Expert Team
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {teamMembers.map((member, index) => (
              <FadeIn key={index} delay={index * 100} direction="up">
                <div
                  className="group bg-gradient-to-br from-slate-700 to-slate-800 p-4 md:p-8 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-amber-500/20 text-center cursor-pointer"
                >
                  <div className="relative inline-block">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-20 md:w-32 h-20 md:h-32 rounded-full mx-auto mb-3 md:mb-6 border-4 border-amber-500 object-cover group-hover:border-amber-300  duration-300 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-amber-400 group-hover:animate-spin"></div>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 group-hover:text-amber-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-gray-300 mb-1 md:mb-2 text-sm md:text-base">{member.role}</p>
                  <p className="text-gray-400 mb-2 md:mb-4 text-xs md:text-base">{member.experience}</p>
                  <div className="bg-slate-600 px-2 md:px-4 py-1 md:py-2 rounded-full group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
                    <span className="text-xs md:text-sm text-amber-300 group-hover:text-black transition-colors">
                      {member.specialty}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn direction="down">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Our Work Gallery
            </h2>
          </FadeIn>

          {/* Gallery Filter */}
          <FadeIn direction="down" delay={200}>
            <div className="flex justify-center mb-12">
              <div className="bg-slate-800 p-2 rounded-full border border-amber-500/20">
                {['all', 'haircuts', 'beards', 'styling'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedGalleryCategory(category)}
                    className={`px-3 md:px-6 py-2 md:py-3 rounded-full mx-1 transition-all duration-300 text-sm md:text-base ${selectedGalleryCategory === category
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white transform scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                      }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {filteredGallery.map((item, index) => (
              <FadeIn key={item.id} delay={index * 100} direction="up">
                <div
                  className="group relative overflow-hidden rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all duration-500 transform hover:scale-105 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white font-bold text-sm md:text-lg">{item.title}</h3>
                      <div className="w-0 group-hover:w-16 h-0.5 bg-amber-400 mt-2 transition-all duration-500 delay-200"></div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn direction="down">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Why We're Different
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: Award, title: "Premium Quality", text: "Only the finest products and equipment for exceptional results" },
              { icon: Users, title: "Expert Team", text: "Highly skilled professionals with years of experience" },
              { icon: Zap, title: "Quick Service", text: "Efficient service without compromising on quality" },
              { icon: Gift, title: "Special Offers", text: "Regular promotions and loyalty rewards for customers" }
            ].map((feature, index) => (
              <FadeIn key={index} delay={index * 100} direction="up">
                <div className="group text-center p-3 md:p-6 transform hover:scale-105 transition-all duration-500 cursor-pointer">
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all duration-500">
                    <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-amber-400 group-hover:scale-110 group-hover:text-amber-300 transition-all duration-300" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-2 md:mb-3 group-hover:text-amber-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base group-hover:text-white transition-colors">
                    {feature.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn direction="down">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              What Our Customers Say
            </h2>
          </FadeIn>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <FadeIn
                  key={index}
                  delay={index * 150}
                  direction="up"
                >
                  <div
                    className={`bg-gradient-to-br from-slate-700 to-slate-800 p-6 md:p-8 rounded-2xl border border-amber-500/20 shadow-2xl transition-all duration-500 transform ${activeTestimonial === index ? 'scale-105 border-amber-500' : 'scale-95'
                      }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 md:w-14 h-12 md:h-14 rounded-full border-2 border-amber-500 object-cover"
                      />
                      <div>
                        <h3 className="text-lg md:text-xl font-bold">{testimonial.name}</h3>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-amber-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 italic text-sm md:text-base">"{testimonial.comment}"</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Testimonial navigation dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === index
                    ? 'bg-amber-500 scale-125'
                    : 'bg-gray-600 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn direction="down">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Special Offers
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FadeIn delay={200} direction="right">
              <div className="group bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-6 md:p-8 rounded-2xl border border-green-500/30 hover:border-green-400 transition-all duration-500 transform hover:scale-105 cursor-pointer">
                <div className="flex items-center mb-4">
                  <Gift className="h-6 w-6 md:h-8 md:w-8 text-green-400 mr-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl md:text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                    First Visit Special
                  </h3>
                </div>
                <p className="text-gray-300 mb-4 text-sm md:text-base group-hover:text-white transition-colors">
                  Get 20% off on your first visit to our salon. Valid for all services.
                </p>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2 animate-pulse group-hover:animate-none">
                  20% OFF
                </div>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Valid till end of this month
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={400} direction="left">
              <div className="group bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 md:p-8 rounded-2xl border border-purple-500/30 hover:border-purple-400 transition-all duration-500 transform hover:scale-105 cursor-pointer">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-400 mr-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl md:text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                    Loyalty Rewards
                  </h3>
                </div>
                <p className="text-gray-300 mb-4 text-sm md:text-base group-hover:text-white transition-colors">
                  Visit 5 times and get your 6th service absolutely free!
                </p>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2 animate-pulse group-hover:animate-none">
                  6th FREE
                </div>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Loyalty card required
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black py-12 border-t border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <FadeIn direction="right">
                <div className="flex items-center space-x-2 mb-6">
                  <Scissors className="h-6 w-6 md:h-8 md:w-8 text-amber-400" />
                  <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    Glow & Grace Salon
                  </span>
                </div>
                <p className="text-gray-400 mb-4 text-sm md:text-base">Your Premium Grooming Destination</p>
                <div className="flex space-x-4">
                  {[Instagram, Facebook, Twitter].map((Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-gray-400 hover:text-amber-400 transition-all duration-300 transform hover:scale-110"
                    >
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    </a>
                  ))}
                </div>
              </FadeIn>
            </div>

            {[
              {
                title: "Quick Links",
                items: ["Home", "About Us", "Services", "Our Team"]
              },
              {
                title: "Services",
                items: ["Hair Cutting & Styling", "Beard Trimming", "Hair Coloring", "Face Treatments"]
              }
            ].map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <FadeIn direction="down" delay={sectionIndex * 100}>
                  <h4 className="text-base md:text-lg font-bold text-amber-400 mb-4">{section.title}</h4>
                  <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="hover:text-amber-400 transition-all duration-300 transform hover:translate-x-1 cursor-pointer"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </FadeIn>
              </div>
            ))}

            <div className="col-span-2 md:col-span-1">
              <FadeIn direction="left">
                <h4 className="text-base md:text-lg font-bold text-amber-400 mb-4">Contact Info</h4>
                <div className="space-y-4 text-gray-400 text-sm md:text-base">
                  {[
                    { icon: MapPin, title: "Address", text: "123 Main Street, City Center, Hyderabad - 500001" },
                    { icon: Phone, title: "Phone", text: "+91 98765 43210" },
                    { icon: Mail, title: "Email", text: "info@glowgracesalon.com" },
                    { icon: Clock, title: "Working Hours", text: "Mon - Sun: 9:00 AM - 9:00 PM" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start group cursor-pointer">
                      <item.icon className="h-4 w-4 md:h-6 md:w-6 text-amber-400 mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-gray-400 group-hover:text-white transition-colors">
                          {item.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>

          <FadeIn direction="up">
            <div className="border-t border-slate-700 pt-6 mt-8 text-center">
              <p className="text-gray-500 text-sm md:text-base">© 2025 Glow & Grace Salon. All rights reserved.</p>
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
};

// Main App Component with Router
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Public Website Route - This will be the first page */}
            <Route path="/" element={<PublicWebsite />} />

            {/* Admin/Staff Routes */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewBooking />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <BookingsList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute requireAdmin>
                  <Layout>
                    <ServicesManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Customers />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requireAdmin>
                  <Layout>
                    <StaffManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;