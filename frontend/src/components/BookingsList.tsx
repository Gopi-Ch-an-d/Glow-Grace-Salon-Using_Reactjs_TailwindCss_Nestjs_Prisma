import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  CheckCircle,
  X,
  Trash2,
  BarChart3,
  Sun,
  Moon,
  Cloud,
  TrendingUp,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Booking } from '../types';
import { apiService } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const BookingsList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<number | null>(null);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentDateTime.getHours();
    if (hour >= 6 && hour < 12) {
      return { text: 'Good Morning', icon: Sun, color: 'text-yellow-500', gradient: 'from-yellow-400 to-orange-500' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon', icon: Cloud, color: 'text-orange-500', gradient: 'from-orange-400 to-red-500' };
    } else {
      return { text: 'Good Evening', icon: Moon, color: 'text-blue-500', gradient: 'from-blue-500 to-indigo-600' };
    }
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const fetchBookings = async () => {
    try {
      const data = await apiService.getBookings();
      // Sort bookings by bookingTime in descending order (latest first)
      const sortedBookings = data.sort((a, b) => 
        new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime()
      );
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.customer.mobile.includes(searchTerm) ||
          booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (booking) => format(new Date(booking.bookingTime), 'yyyy-MM-dd') === dateFilter
      );
    }

    // Maintain the latest first order after filtering
    setFilteredBookings(filtered);
  };

  const handleStatusUpdate = async (bookingId: number, action: string) => {
    try {
      let updatedBooking: Booking;

      switch (action) {
        case 'complete':
          updatedBooking = await apiService.completeBooking(bookingId);
          toast.success('Booking marked as completed');
          break;
        case 'cancel':
          updatedBooking = await apiService.cancelBooking(bookingId);
          toast.success('Booking cancelled');
          break;
        default:
          return;
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? updatedBooking : booking
        ).sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime())
      );
      setMobileMenuOpen(null);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleDelete = async (bookingId: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await apiService.deleteBooking(bookingId);
        setBookings((prev) => 
          prev.filter((booking) => booking.id !== bookingId)
            .sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime())
        );
        toast.success('Booking deleted successfully');
        setMobileMenuOpen(null);
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm';
      case 'CONFIRMED':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm';
      case 'POSTPONED':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-sm';
      case 'CANCELLED':
        return 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-sm';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm';
    }
  };

  // Format time with seconds only
  const formatTimeWithSeconds = (date: Date) => {
    return format(date, 'h:mm:ss a');
  };

  const formatTimeMobile = (date: Date) => {
    return format(date, 'h:mm a');
  };

  // Calculate booking statistics
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const pendingBookings = bookings.filter(b => b.status === 'POSTPONED').length;
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 md:p-8 animate-pulse">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-full bg-white bg-opacity-20">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-white bg-opacity-30 rounded-full"></div>
              </div>
              <div>
                <div className="h-6 md:h-8 bg-white bg-opacity-30 rounded w-32 md:w-48 mb-2"></div>
                <div className="h-3 md:h-4 bg-white bg-opacity-20 rounded w-48 md:w-64"></div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 md:p-4 min-w-[200px] md:min-w-[280px]">
              <div className="h-3 md:h-4 bg-white bg-opacity-30 rounded w-24 md:w-32 mb-2 mx-auto"></div>
              <div className="h-6 md:h-8 bg-white bg-opacity-30 rounded w-32 md:w-40 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-4 md:p-6 animate-pulse">
              <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 md:h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Enhanced Header with Greeting and Time - Responsive */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-white opacity-5 rounded-full -mr-24 md:-mr-48 -mt-24 md:-mt-48"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white opacity-5 rounded-full -ml-16 md:-ml-32 -mb-16 md:-mb-32"></div>
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-4 rounded-xl md:rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm">
              <GreetingIcon className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">{greeting.text}!</h1>
              <p className="text-indigo-100 text-sm md:text-lg">
                Manage and track all your bookings
              </p>
            </div>
          </div>
          
          {/* Live Clock - Responsive */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 md:px-6 md:py-4 min-w-[200px] md:min-w-[280px] border border-white border-opacity-30">
            <div className="text-center">
              <div className="text-xs md:text-sm text-white text-opacity-80 mb-1 font-medium">
                {format(currentDateTime, 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="text-lg md:text-2xl lg:text-3xl font-mono font-bold text-white tracking-wider flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 md:w-6 md:h-6" />
                {isMobile ? formatTimeMobile(currentDateTime) : formatTimeWithSeconds(currentDateTime)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Booking Statistics Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Bookings */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-blue-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Total Bookings</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{totalBookings}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                All time
              </p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <BarChart3 className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Completed Bookings */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-green-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Completed</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{completedBookings}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">{((completedBookings / totalBookings) * 100 || 0).toFixed(1)}% success</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <CheckCircle className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-indigo-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Confirmed</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{confirmedBookings}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">Awaiting service</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Calendar className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-yellow-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Pending</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{pendingBookings}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">Postponed</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg">
              <Calendar className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Page Header and New Booking Button - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 shadow-sm">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">All Bookings</h2>
          <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm md:text-base">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Showing {filteredBookings.length} of {totalBookings} bookings
            <span className="text-xs text-gray-500 ml-2">(Latest first)</span>
          </p>
        </div>
        <Link 
          to="/bookings/new" 
          className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center transform hover:-translate-y-0.5 text-sm md:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
          New Booking
        </Link>
      </div>

      {/* Enhanced Filters - Responsive */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
        <div className={`grid gap-3 md:gap-4 ${
          isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-4'
        }`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
          >
            <option value="ALL">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="POSTPONED">Postponed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
          />

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
              setDateFilter('');
            }}
            className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center text-sm md:text-base"
          >
            <Filter className="w-4 h-4 mr-1 md:mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Enhanced Bookings Table - Responsive */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {isMobile ? (
          /* Mobile Cards View */
          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-150">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{booking.customer.name}</h3>
                    <p className="text-gray-600 text-sm">📱 {booking.customer.mobile}</p>
                    <p className="text-gray-500 text-sm">📍 {booking.customer.place}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setMobileMenuOpen(mobileMenuOpen === booking.id ? null : booking.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {mobileMenuOpen === booking.id && (
                      <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg border border-gray-200 z-10 min-w-[140px]">
                        {booking.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'complete')}
                            className="w-full px-4 py-2 text-left text-green-600 hover:bg-green-50 flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Complete
                          </button>
                        )}

                        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'cancel')}
                            className="w-full px-4 py-2 text-left text-orange-600 hover:bg-orange-50 flex items-center gap-2 text-sm"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Service:</span>
                    <span className="font-medium text-sm">{booking.service.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Date & Time:</span>
                    <span className="font-medium text-sm">
                      {format(new Date(booking.bookingTime), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Seat:</span>
                    <span className="font-medium text-sm">Seat {booking.seatNumber}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Status:</span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Amount:</span>
                    <span className="font-bold text-sm">₹{booking.totalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop/Tablet Table View */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Seat
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-150">
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {booking.customer.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          📱 {booking.customer.mobile}
                        </div>
                        <div className="text-sm text-gray-500">
                          📍 {booking.customer.place}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {booking.service.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.service.duration} minutes
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {format(new Date(booking.bookingTime), 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(booking.bookingTime), 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800">
                        Seat {booking.seatNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ₹{booking.totalPrice}
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {booking.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'complete')}
                            className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded-lg transition-all"
                            title="Mark as completed"
                          >
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        )}

                        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'cancel')}
                            className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-2 rounded-lg transition-all"
                            title="Cancel booking"
                          >
                            <X className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
                          title="Delete booking"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="inline-block p-4 md:p-6 bg-white rounded-full shadow-lg mb-3 md:mb-4">
              <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
            </div>
            <p className="text-gray-500 text-base md:text-lg font-medium">No bookings found</p>
            <p className="text-gray-400 text-sm mt-1 md:mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsList;