import React, { useState } from 'react';
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
  Twitter
} from 'lucide-react';

// Public Website Component
const PublicWebsite: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('all');

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
    { id: 1, category: 'haircuts', image: 'https://i.pinimg.com/736x/ae/ee/d4/aeeed4d0ca8466ca5d76f4619464d17f.jpg', title: 'Modern Fade Cut' },
    { id: 2, category: 'beards', image: 'https://t4.ftcdn.net/jpg/02/69/63/35/360_F_269633549_QijCLiqbGdwW1ynHsnul7ELl2trMpn25.jpg', title: 'Classic Beard Trim' },
    { id: 3, category: 'styling', image: 'https://png.pngtree.com/thumb_back/fh260/background/20220609/pngtree-bearded-hipster-confidently-styled-by-skilled-barber-in-barbershop-and-mens-beauty-salon-advertisement-photo-image_45814958.jpg', title: 'Professional Styling' },
    { id: 4, category: 'haircuts', image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500', title: 'Textured Cut' },
    { id: 5, category: 'beards', image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=500', title: 'Beard Sculpting' },
    { id: 6, category: 'styling', image: 'https://t4.ftcdn.net/jpg/03/74/32/65/360_F_374326500_IZuSyagnKizUonpTAxmG9xoJA7LLLavU.jpg', title: 'Hair Styling' }
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

  // 
  const navigate = useNavigate();
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-silver" />
              <span className="text-2xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-extrabold">
                Glow & Grace Salon
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#home" className="hover:text-amber-400 transition-colors">Home</a>
              <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
              <a href="#services" className="hover:text-amber-400 transition-colors">Services</a>
              <a href="#packages" className="hover:text-amber-400 transition-colors">Packages</a>
              <a href="#team" className="hover:text-amber-400 transition-colors">Team</a>
              <a href="#gallery" className="hover:text-amber-400 transition-colors">Gallery</a>
              <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2 rounded-full hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-amber-400"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 hover:text-amber-400 transition-colors">Home</a>
              <a href="#about" className="block px-3 py-2 hover:text-amber-400 transition-colors">About</a>
              <a href="#services" className="block px-3 py-2 hover:text-amber-400 transition-colors">Services</a>
              <a href="#packages" className="block px-3 py-2 hover:text-amber-400 transition-colors">Packages</a>
              <a href="#team" className="block px-3 py-2 hover:text-amber-400 transition-colors">Team</a>
              <a href="#gallery" className="block px-3 py-2 hover:text-amber-400 transition-colors">Gallery</a>
              <a href="#contact" className="block px-3 py-2 hover:text-amber-400 transition-colors">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
         <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-red-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
          Glow & Grace Salon
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 font-serif">
            Where Style Meets Excellence - Your Premium Grooming Destination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-red-500 to-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-2xl">
              Book Appointment
            </button>
            <button
              onClick={() => {
                const section = document.getElementById('services');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-amber-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-500 hover:text-black transition-all"
            >
              View Services
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
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
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-400 mb-2">15+</div>
                  <div className="text-gray-400">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-400 mb-2">5000+</div>
                  <div className="text-gray-400">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-8 rounded-3xl border border-amber-500/30">
                <div className="bg-slate-800 p-6 rounded-2xl">
                  <h3 className="text-2xl font-bold text-amber-400 mb-4">Why Choose Us?</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center">
                      <Star className="h-5 w-5 text-amber-400 mr-3" />
                      Expert stylists with 15+ years experience
                    </li>
                    <li className="flex items-center">
                      <Shield className="h-5 w-5 text-amber-400 mr-3" />
                      Premium quality products and equipment
                    </li>
                    <li className="flex items-center">
                      <Sparkles className="h-5 w-5 text-amber-400 mr-3" />
                      Hygienic and comfortable environment
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-5 w-5 text-amber-400 mr-3" />
                      Personalized service for every customer
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Updated for mobile 2 columns */}
      <section id="services" className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Our Premium Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-700 to-slate-800 p-3 md:p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all transform hover:scale-105 shadow-2xl"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-32 md:h-48 object-cover rounded-xl mb-2 md:mb-4"
                />
                <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 text-amber-400">
                  {service.name}
                </h3>
                <div className="flex items-center justify-between text-gray-400 text-sm md:text-base">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="text-lg md:text-2xl font-bold text-white border-2 border-black rounded-lg px-2 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 animate-pulse">{service.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section - Updated for mobile 2 columns */}
      <section id="packages" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Special Packages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br from-slate-700 to-slate-800 p-6 md:p-8 rounded-2xl border ${
                  pkg.popular ? 'border-amber-500' : 'border-amber-500/20'
                } hover:border-amber-500/50 transition-all transform hover:scale-105 shadow-2xl`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-amber-400 mb-2">{pkg.name}</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl md:text-3xl font-bold text-white">₹{pkg.discountedPrice}</span>
                    <span className="text-base md:text-lg text-gray-400 line-through">₹{pkg.originalPrice}</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1">{pkg.duration}</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.services.map((service, idx) => (
                    <li key={idx} className="flex items-center text-gray-300 text-sm md:text-base">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-400 mr-3 flex-shrink-0" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Updated for mobile 2 columns */}
      <section id="team" className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Meet Our Expert Team
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-700 to-slate-800 p-4 md:p-8 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all transform hover:scale-105 shadow-2xl text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 md:w-32 h-20 md:h-32 rounded-full mx-auto mb-3 md:mb-6 border-4 border-amber-500 object-cover"
                />
                <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2">{member.name}</h3>
                <p className="text-gray-300 mb-1 md:mb-2 text-sm md:text-base">{member.role}</p>
                <p className="text-gray-400 mb-2 md:mb-4 text-xs md:text-base">{member.experience}</p>
                <div className="bg-slate-600 px-2 md:px-4 py-1 md:py-2 rounded-full">
                  <span className="text-xs md:text-sm text-amber-300">{member.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Updated for mobile 2 columns */}
      <section id="gallery" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Our Work Gallery
          </h2>
          
          {/* Gallery Filter */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-800 p-2 rounded-full border border-amber-500/20">
              {['all', 'haircuts', 'beards', 'styling'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedGalleryCategory(category)}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-full mx-1 transition-all text-sm md:text-base ${
                    selectedGalleryCategory === category
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid - Updated for mobile 2 columns */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="relative group overflow-hidden rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4">
                    <h3 className="text-white font-bold text-sm md:text-lg">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Updated for mobile 2 columns */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Why We're Different
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center p-3 md:p-6">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                <Award className="h-8 w-8 md:h-10 md:w-10 text-amber-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-2 md:mb-3">Premium Quality</h3>
              <p className="text-gray-300 text-sm md:text-base">Only the finest products and equipment for exceptional results</p>
            </div>
            <div className="text-center p-3 md:p-6">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                <Users className="h-8 w-8 md:h-10 md:w-10 text-amber-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-2 md:mb-3">Expert Team</h3>
              <p className="text-gray-300 text-sm md:text-base">Highly skilled professionals with years of experience</p>
            </div>
            <div className="text-center p-3 md:p-6">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                <Zap className="h-8 w-8 md:h-10 md:w-10 text-amber-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-2 md:mb-3">Quick Service</h3>
              <p className="text-gray-300 text-sm md:text-base">Efficient service without compromising on quality</p>
            </div>
            <div className="text-center p-3 md:p-6">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                <Gift className="h-8 w-8 md:h-10 md:w-10 text-amber-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-2 md:mb-3">Special Offers</h3>
              <p className="text-gray-300 text-sm md:text-base">Regular promotions and loyalty rewards for customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Updated for mobile 2 columns */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-700 to-slate-800 p-6 md:p-8 rounded-2xl border border-amber-500/20 shadow-2xl"
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
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Section - Updated for mobile 2 columns */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Special Offers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-6 md:p-8 rounded-2xl border border-green-500/30">
              <div className="flex items-center mb-4">
                <Gift className="h-6 w-6 md:h-8 md:w-8 text-green-400 mr-3" />
                <h3 className="text-xl md:text-2xl font-bold text-green-400">First Visit Special</h3>
              </div>
              <p className="text-gray-300 mb-4 text-sm md:text-base">Get 20% off on your first visit to our salon. Valid for all services.</p>
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">20% OFF</div>
              <p className="text-xs md:text-sm text-gray-400">Valid till end of this month</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 md:p-8 rounded-2xl border border-purple-500/30">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-400 mr-3" />
                <h3 className="text-xl md:text-2xl font-bold text-purple-400">Loyalty Rewards</h3>
              </div>
              <p className="text-gray-300 mb-4 text-sm md:text-base">Visit 5 times and get your 6th service absolutely free!</p>
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">6th FREE</div>
              <p className="text-xs md:text-sm text-gray-400">Loyalty card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black py-12 border-t border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <Scissors className="h-6 w-6 md:h-8 md:w-8 text-amber-400" />
                <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Glow & Grace Salon
                </span>
              </div>
              <p className="text-gray-400 mb-4 text-sm md:text-base">Your Premium Grooming Destination</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-bold text-amber-400 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-amber-400 transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Services</a></li>
                <li><a href="#team" className="hover:text-amber-400 transition-colors">Our Team</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-bold text-amber-400 mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li>Hair Cutting & Styling</li>
                <li>Beard Trimming</li>
                <li>Hair Coloring</li>
                <li>Face Treatments</li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-base md:text-lg font-bold text-amber-400 mb-4">Contact Info</h4>
              <div className="space-y-4 text-gray-400 text-sm md:text-base">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 md:h-6 md:w-6 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Address</div>
                    <div className="text-gray-400">123 Main Street, City Center, Hyderabad - 500001</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-4 w-4 md:h-6 md:w-6 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Phone</div>
                    <div className="text-gray-400">+91 98765 43210</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-4 w-4 md:h-6 md:w-6 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Email</div>
                    <div className="text-gray-400">info@gopichandsalon.com</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-4 w-4 md:h-6 md:w-6 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Working Hours</div>
                    <div className="text-gray-400">Mon - Sun: 9:00 AM - 9:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-6 mt-8 text-center">
            <p className="text-gray-500 text-sm md:text-base">© 2025 Gopichand Salon. All rights reserved.</p>
          </div>
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