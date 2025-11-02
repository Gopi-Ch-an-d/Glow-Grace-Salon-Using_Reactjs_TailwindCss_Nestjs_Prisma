import React, { useEffect, useState } from 'react';
import { Search, User, Phone, MapPin, Calendar, Users, TrendingUp, Award, Sparkles, Filter, ChevronLeft } from 'lucide-react';
import { Customer } from '../types';
import { apiService } from '../services/api';
import { format } from 'date-fns';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'bookings' | 'recent'>('name');
  const [showFilters, setShowFilters] = useState(false);

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

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterAndSortCustomers();
  }, [customers, searchTerm, sortBy]);

  const fetchCustomers = async () => {
    try {
      const data = await apiService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCustomers = () => {
    let filtered = [...customers];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.mobile.includes(searchTerm) ||
          customer.place.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort customers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'bookings':
          const aBookings = a.bookings?.length || 0;
          const bBookings = b.bookings?.length || 0;
          return bBookings - aBookings;
        case 'recent':
          const aLastBooking = a.bookings && a.bookings.length > 0 
            ? Math.max(...a.bookings.map(b => new Date(b.bookingTime).getTime()))
            : 0;
          const bLastBooking = b.bookings && b.bookings.length > 0 
            ? Math.max(...b.bookings.map(b => new Date(b.bookingTime).getTime()))
            : 0;
          return bLastBooking - aLastBooking;
        default:
          return 0;
      }
    });

    setFilteredCustomers(filtered);
  };

  // Calculate statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.bookings && c.bookings.length > 0).length;
  const totalBookings = customers.reduce((sum, c) => sum + (c.bookings?.length || 0), 0);
  const avgBookingsPerCustomer = totalCustomers > 0 ? (totalBookings / totalCustomers).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 md:p-8 animate-pulse">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 rounded-full bg-white bg-opacity-20">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white bg-opacity-30 rounded-full"></div>
            </div>
            <div>
              <div className="h-6 md:h-8 bg-white bg-opacity-30 rounded w-32 md:w-48 mb-2"></div>
              <div className="h-3 md:h-4 bg-white bg-opacity-20 rounded w-48 md:w-64"></div>
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-4 md:p-6 animate-pulse">
              <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 md:h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-4 md:p-6 animate-pulse">
              <div className="h-12 md:h-16 bg-gray-200 rounded mb-3 md:mb-4"></div>
              <div className="space-y-2 md:space-y-3">
                <div className="h-3 md:h-4 bg-gray-200 rounded"></div>
                <div className="h-3 md:h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Enhanced Header - Responsive */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white opacity-5 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-white opacity-5 rounded-full -ml-16 md:-ml-24 -mb-16 md:-mb-24"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-4 rounded-xl md:rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm">
              <Users className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">Customers</h1>
              <p className="text-indigo-100 text-sm md:text-lg">
                Manage your customer relationships
              </p>
            </div>
          </div>
          
          {/* Total Customers Badge - Responsive */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 border border-white border-opacity-30">
            <div className="flex items-center gap-2 md:gap-3">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-yellow-300" />
              <div>
                <p className="text-xs text-white text-opacity-80 font-medium">Total Customers</p>
                <p className="text-xl md:text-3xl font-bold text-white">{totalCustomers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Customers */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-indigo-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Total Customers</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{totalCustomers}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">All registrations</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Users className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-green-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Active Customers</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{activeCustomers}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">{((activeCustomers / totalCustomers) * 100 || 0).toFixed(1)}% with bookings</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <TrendingUp className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-blue-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Total Bookings</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{totalBookings}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">Cumulative</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
              <Calendar className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Average Bookings */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-orange-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Avg per Customer</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{avgBookingsPerCustomer}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">Bookings average</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
              <Award className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section - Responsive */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or place..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
            />
          </div>

          {/* Mobile Filter Toggle */}
          {isMobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              Sort
              <ChevronLeft className={`w-4 h-4 transition-transform ${showFilters ? '-rotate-90' : 'rotate-90'}`} />
            </button>
          )}

          {/* Sort Options - Desktop/Tablet or Mobile when expanded */}
          <div className={`${isMobile ? (showFilters ? 'block' : 'hidden') : 'flex'} items-center gap-3`}>
            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm"
            >
              <option value="name">Name</option>
              <option value="bookings">Most Bookings</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-3 md:mt-2">
          {searchTerm ? `Found ${filteredCustomers.length} matching customers` : `Showing all ${customers.length} customers`}
        </p>
      </div>

      {/* Customers Grid - Responsive */}
      <div className={`grid gap-4 md:gap-6 ${
        isMobile ? 'grid-cols-1' : 
        isTablet ? 'grid-cols-2' : 
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {filteredCustomers.map((customer, index) => {
          const bookingCount = customer.bookings?.length || 0;
          const isVIP = bookingCount >= 5;
          const isNew = bookingCount === 0;
          const isRegular = bookingCount > 0 && bookingCount < 5;
          
          return (
            <div 
              key={customer.id} 
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
            >
              {/* Card Header with Gradient */}
              <div className={`p-4 md:p-6 pb-3 md:pb-4 ${
                isVIP 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                  : isNew
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center shadow-lg ${
                      isMobile ? 'w-10 h-10' : 'w-12 h-12 md:w-14 md:h-14'
                    } bg-white rounded-full`}>
                      <User className={`${
                        isMobile ? 'w-5 h-5' : 'w-6 h-6 md:w-7 md:h-7'
                      } ${
                        isVIP 
                          ? 'text-orange-600' 
                          : isNew
                          ? 'text-green-600'
                          : 'text-indigo-600'
                      }`} />
                    </div>
                    <div className="ml-2 md:ml-3">
                      <h3 className={`font-bold text-white ${
                        isMobile ? 'text-base' : 'text-lg'
                      }`}>{customer.name}</h3>
                      <p className="text-xs text-white text-opacity-80">ID: #{customer.id}</p>
                    </div>
                  </div>
                  {isVIP && (
                    <div className="bg-white bg-opacity-30 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        <span className="text-xs font-bold text-white">VIP</span>
                      </div>
                    </div>
                  )}
                  {isNew && (
                    <div className="bg-white bg-opacity-30 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs font-bold text-white">NEW</span>
                    </div>
                  )}
                  {isRegular && !isMobile && (
                    <div className="bg-white bg-opacity-30 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs font-bold text-white">{bookingCount} visits</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 md:p-6 pt-3 md:pt-4">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center text-gray-700 bg-gray-50 rounded-lg p-2 md:p-3">
                    <Phone className="w-4 h-4 mr-2 md:mr-3 text-indigo-600 flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base truncate">{customer.mobile}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700 bg-gray-50 rounded-lg p-2 md:p-3">
                    <MapPin className="w-4 h-4 mr-2 md:mr-3 text-purple-600 flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base truncate">{customer.place}</span>
                  </div>

                  {customer.bookings && customer.bookings.length > 0 && (
                    <div className="border-t border-gray-200 pt-3 md:pt-4 mt-3 md:mt-4">
                      <div className={`grid gap-3 md:gap-4 ${
                        isMobile ? 'grid-cols-2' : 'grid-cols-2'
                      }`}>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2 md:p-3 text-center">
                          <p className="text-xs text-gray-600 mb-1">Total Bookings</p>
                          <p className={`font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ${
                            isMobile ? 'text-lg' : 'text-xl md:text-2xl'
                          }`}>
                            {customer.bookings.length}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-2 md:p-3 text-center">
                          <p className="text-xs text-gray-600 mb-1">Last Visit</p>
                          <p className="text-xs font-bold text-purple-700">
                            {format(
                              new Date(
                                Math.max(
                                  ...customer.bookings.map((b) => new Date(b.bookingTime).getTime())
                                )
                              ),
                              isMobile ? 'MMM d' : 'MMM d, yyyy'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(!customer.bookings || customer.bookings.length === 0) && (
                    <div className="border-t border-gray-200 pt-3 md:pt-4 mt-3 md:mt-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 md:p-4 text-center">
                        <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-green-600 mx-auto mb-1 md:mb-2" />
                        <p className="text-sm font-medium text-green-800">New Customer</p>
                        <p className="text-xs text-green-600 mt-1">No bookings yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <div className="inline-block p-4 md:p-6 bg-white rounded-full shadow-lg mb-3 md:mb-4">
            <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
          </div>
          <p className="text-gray-500 text-base md:text-lg font-medium">No customers found</p>
          <p className="text-gray-400 text-sm mt-1 md:mt-2">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first customer'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Customers;