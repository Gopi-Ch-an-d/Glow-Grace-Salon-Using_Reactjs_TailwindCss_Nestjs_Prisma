import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Scissors, Clock, IndianRupee, BarChart3, Sun, Moon, Cloud, Sparkles, TrendingUp, Filter, ChevronLeft } from 'lucide-react';
import { Service, CreateServiceData } from '../types';
import { apiService } from '../services/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
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

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentDateTime.getHours();
    if (hour >= 6 && hour < 12) {
      return { text: 'Good Morning', icon: Sun, color: 'text-yellow-500' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon', icon: Cloud, color: 'text-orange-500' };
    } else {
      return { text: 'Good Evening', icon: Moon, color: 'text-blue-500' };
    }
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateServiceData>();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, statusFilter]);

  const fetchServices = async () => {
    try {
      const data = await apiService.getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((service) => 
        statusFilter === 'active' ? service.isActive : !service.isActive
      );
    }

    setFilteredServices(filtered);
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      reset({
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description || '',
      });
    } else {
      setEditingService(null);
      reset({
        name: '',
        price: 0,
        duration: 5,
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    reset();
  };

  const onSubmit = async (data: CreateServiceData) => {
    try {
      if (editingService) {
        const updatedService = await apiService.updateService(editingService.id, data);
        setServices((prev) =>
          prev.map((service) =>
            service.id === editingService.id ? updatedService : service
          )
        );
        toast.success('Service updated successfully');
      } else {
        const newService = await apiService.createService(data);
        setServices((prev) => [...prev, newService]);
        toast.success('Service created successfully');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    }
  };

  const handleDelete = async (serviceId: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await apiService.deleteService(serviceId);
        setServices((prev) => prev.filter((service) => service.id !== serviceId));
        toast.success('Service deleted successfully');
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service');
      }
    }
  };

  const formatTimeWithSeconds = (date: Date) => {
    return format(date, 'h:mm:ss a');
  };

  const formatTimeMobile = (date: Date) => {
    return format(date, 'h:mm a');
  };

  // Calculate service statistics
  const totalServices = services.length;
  const activeServices = services.filter(s => s.isActive).length;
  const inactiveServices = services.filter(s => !s.isActive).length;
  const averagePrice = services.length > 0 
    ? services.reduce((sum, service) => sum + service.price, 0) / services.length 
    : 0;
  const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);

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
              <Scissors className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">{greeting.text}!</h1>
              <p className="text-indigo-100 text-sm md:text-lg">
                Manage your salon services and pricing
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

      {/* Enhanced Service Statistics Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Services */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-blue-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Total Services</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{totalServices}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">All services</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <BarChart3 className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Active Services */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-green-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Active Services</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{activeServices}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">
                {totalServices > 0 ? ((activeServices / totalServices) * 100).toFixed(1) : 0}% active
              </p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <Scissors className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Average Price */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-purple-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Average Price</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹{averagePrice.toFixed(0)}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">Per service</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <IndianRupee className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Total Duration */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-orange-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Total Duration</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{totalDuration}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">Minutes available</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
              <Clock className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Page Header and Add Service Button - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 shadow-sm">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">Services Management</h2>
          <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm md:text-base">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Showing {filteredServices.length} of {totalServices} services
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center transform hover:-translate-y-0.5 text-sm md:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
          Add Service
        </button>
      </div>

      {/* Enhanced Search and Filters - Responsive */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
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
              Filter
              <ChevronLeft className={`w-4 h-4 transition-transform ${showFilters ? '-rotate-90' : 'rotate-90'}`} />
            </button>
          )}

          {/* Status Filter - Desktop/Tablet or Mobile when expanded */}
          <div className={`${isMobile ? (showFilters ? 'block' : 'hidden') : 'flex'} items-center gap-3`}>
            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm"
            >
              <option value="all">All Services</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-3 md:mt-2">
          {searchTerm || statusFilter !== 'all' 
            ? `Found ${filteredServices.length} matching services` 
            : `Browse all ${services.length} services`
          }
        </p>
      </div>

      {/* Enhanced Services Grid - Responsive */}
      <div className={`grid gap-4 md:gap-6 ${
        isMobile ? 'grid-cols-1' : 
        isTablet ? 'grid-cols-2' : 
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {filteredServices.map((service) => (
          <div 
            key={service.id} 
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
          >
            {/* Card Header with Gradient */}
            <div className={`p-4 md:p-6 pb-3 md:pb-4 ${
              service.isActive 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className={`p-2 md:p-3 bg-white rounded-lg md:rounded-xl shadow-lg ${
                    isMobile ? 'mr-2' : 'mr-3'
                  }`}>
                    <Scissors className={`${
                      isMobile ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'
                    } ${
                      service.isActive ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className={isMobile ? 'flex-1 min-w-0' : ''}>
                    <h3 className={`font-bold text-white ${
                      isMobile ? 'text-base truncate' : 'text-lg'
                    }`}>{service.name}</h3>
                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold rounded-full bg-white bg-opacity-30 backdrop-blur-sm text-white mt-1">
                      {service.isActive ? '✓ Active' : '✕ Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1 md:space-x-2 ml-2">
                  <button
                    onClick={() => handleOpenModal(service)}
                    className="p-1 md:p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all text-white"
                    title="Edit service"
                  >
                    <Edit className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-1 md:p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all text-white"
                    title="Delete service"
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 md:p-4">
                  <div className="flex items-center text-purple-700">
                    <IndianRupee className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    <span className="text-sm font-medium">Price</span>
                  </div>
                  <span className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${
                    isMobile ? 'text-xl' : 'text-2xl'
                  }`}>
                    ₹{service.price}
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 md:p-4">
                  <div className="flex items-center text-blue-700">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <span className={`font-bold text-blue-900 ${
                    isMobile ? 'text-lg' : 'text-xl'
                  }`}>
                    {service.duration} min
                  </span>
                </div>

                {service.description && (
                  <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200">
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <div className="inline-block p-4 md:p-6 bg-white rounded-full shadow-lg mb-3 md:mb-4">
            <Scissors className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
          </div>
          <p className="text-gray-500 text-base md:text-lg font-medium">No services found</p>
          <p className="text-gray-400 text-sm mt-1 md:mt-2">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Add your first service to get started'
            }
          </p>
        </div>
      )}

      {/* Enhanced Service Modal - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 rounded-t-xl md:rounded-t-2xl">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1 md:p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg">
                  <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 space-y-4 md:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  {...register('name', { required: 'Service name is required' })}
                  type="text"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                  placeholder="Enter service name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    {...register('price', {
                      required: 'Price is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Price must not be less than 0' },
                      validate: (value) => !isNaN(value) || 'Price must be a valid number'
                    })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                    placeholder="Enter price"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    {...register('duration', {
                      required: 'Duration is required',
                      valueAsNumber: true,
                      min: { value: 5, message: 'Duration must not be less than 5 minutes' },
                      validate: (value) => !isNaN(value) || 'Duration must be a valid number'
                    })}
                    type="number"
                    min="5"
                    className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                    placeholder="Enter duration in minutes"
                  />
                </div>
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                  rows={3}
                  placeholder="Enter service description (optional)"
                />
              </div>

              <div className="flex justify-end space-x-2 md:space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm md:text-base"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  {editingService ? 'Update' : 'Create'} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;