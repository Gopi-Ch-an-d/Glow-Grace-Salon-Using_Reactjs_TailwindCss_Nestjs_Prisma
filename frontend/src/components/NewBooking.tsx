import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, MapPin, Scissors, Loader2, BarChart3, Sparkles, ChevronLeft } from 'lucide-react';
import { Service, Customer, CreateBookingData, AvailableSeats } from '../types';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface BookingFormData {
  customerName: string;
  customerMobile: string;
  customerPlace: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  seatNumber: string;
}

const NewBooking: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [availableSeats, setAvailableSeats] = useState<AvailableSeats | null>(null);
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [loadingTotal, setLoadingTotal] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const navigate = useNavigate();

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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>();

  const watchedMobile = watch('customerMobile');
  const watchedDate = watch('bookingDate');
  const watchedTime = watch('bookingTime');
  const watchedSeatNumber = watch('seatNumber');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [servicesData, bookingsData] = await Promise.all([
          apiService.getServices(),
          apiService.getBookings(),
        ]);
        setServices(servicesData.filter(service => service.isActive));
        setTotalBookings(bookingsData.length);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoadingTotal(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const checkExistingCustomer = async () => {
      if (watchedMobile && watchedMobile.length === 10) {
        try {
          const customer = await apiService.getCustomerByMobile(watchedMobile);
          if (customer) {
            setExistingCustomer(customer);
            setValue('customerName', customer.name);
            setValue('customerPlace', customer.place);
            toast.success('Customer found! Details auto-filled.');
          } else {
            setExistingCustomer(null);
          }
        } catch (error) {
          setExistingCustomer(null);
        }
      }
    };

    const timeoutId = setTimeout(checkExistingCustomer, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedMobile, setValue]);

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      if (watchedDate && watchedTime) {
        setLoadingSeats(true);
        try {
          const datetime = `${watchedDate}T${watchedTime}:00`;
          const seats = await apiService.getAvailableSeats(datetime);
          setAvailableSeats(seats);
        } catch (error) {
          console.error('Error fetching available seats:', error);
          setAvailableSeats(null);
        } finally {
          setLoadingSeats(false);
        }
      }
    };

    fetchAvailableSeats();
  }, [watchedDate, watchedTime]);

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true);
    try {
      const bookingData: CreateBookingData = {
        customer: {
          name: data.customerName,
          mobile: data.customerMobile,
          place: data.customerPlace,
        },
        serviceId: parseInt(data.serviceId),
        seatNumber: parseInt(data.seatNumber),
        bookingTime: `${data.bookingDate}T${data.bookingTime}:00`,
      };

      await apiService.createBooking(bookingData);
      toast.success('Booking created successfully!');
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const getTodayDate = () => {
    return format(new Date(), 'yyyy-MM-dd');
  };

  const getSeatStyling = (seatNum: number) => {
    const isAvailable = availableSeats?.availableSeats.includes(seatNum);
    const isBooked = availableSeats?.bookedSeats.includes(seatNum);
    const isSelected = watchedSeatNumber === seatNum.toString();

    if (isBooked) {
      return {
        className: 'border-red-400 bg-gradient-to-br from-red-50 to-red-100 cursor-not-allowed opacity-75',
        textColor: 'text-red-700',
        status: 'Booked'
      };
    } else if (isSelected) {
      return {
        className: 'border-indigo-600 bg-gradient-to-br from-indigo-600 to-indigo-700 cursor-pointer shadow-xl transform scale-105 ring-4 ring-indigo-200',
        textColor: 'text-white',
        status: 'Selected'
      };
    } else if (isAvailable) {
      return {
        className: 'border-indigo-200 bg-gradient-to-br from-white to-indigo-50 hover:from-indigo-50 hover:to-indigo-100 hover:border-indigo-300 cursor-pointer shadow-md hover:shadow-lg transition-all',
        textColor: 'text-gray-700',
        status: 'Available'
      };
    } else {
      return {
        className: 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50',
        textColor: 'text-gray-400',
        status: 'Unavailable'
      };
    }
  };

  return (
    <div className={`
      mx-auto
      ${isMobile ? 'px-3' : ''}
      ${isTablet ? 'px-4' : ''}
      ${!isMobile && !isTablet ? 'max-w-5xl px-6' : ''}
    `}>
      {/* Enhanced Responsive Header */}
      <div className="mb-6 md:mb-8">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white opacity-5 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-white opacity-5 rounded-full -ml-16 md:-ml-24 -mb-16 md:-mb-24"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white bg-opacity-20 rounded-lg p-2">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">New Booking</h1>
              </div>
              <p className="text-indigo-100 text-base md:text-lg">Create a new booking for your customer</p>
            </div>
            
            {/* Total Bookings Badge - Responsive */}
            <div className="bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl shadow-lg px-4 py-3 md:px-6 md:py-5 min-w-[140px] md:min-w-[200px] border border-white border-opacity-30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white text-opacity-80 uppercase tracking-wide">Total Bookings</p>
                  {loadingTotal ? (
                    <div className="mt-1 md:mt-2">
                      <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                    </div>
                  ) : (
                    <p className="text-2xl md:text-4xl font-bold mt-1">{totalBookings}</p>
                  )}
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-2 md:p-3">
                  <BarChart3 className="w-5 h-5 md:w-7 md:h-7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Back Button */}
      {isMobile && (
        <button
          onClick={() => navigate('/bookings')}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Bookings</span>
        </button>
      )}

      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          {/* Customer Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-indigo-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
              <div className="bg-indigo-100 rounded-lg p-1 md:p-2 mr-2 md:mr-3">
                <User className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
              </div>
              Customer Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <div>
                <label htmlFor="customerMobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    {...register('customerMobile', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit mobile number',
                      },
                    })}
                    type="tel"
                    id="customerMobile"
                    className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                    placeholder="Enter mobile number"
                    maxLength={10}
                  />
                </div>
                {errors.customerMobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerMobile.message}</p>
                )}
                {existingCustomer && (
                  <p className="mt-2 text-sm text-green-600 font-medium flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Existing customer found
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  {...register('customerName', { required: 'Customer name is required' })}
                  type="text"
                  id="customerName"
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                  placeholder="Enter customer name"
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="customerPlace" className="block text-sm font-medium text-gray-700 mb-2">
                  Place *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    {...register('customerPlace', { required: 'Place is required' })}
                    type="text"
                    id="customerPlace"
                    className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                    placeholder="Enter customer's place"
                  />
                </div>
                {errors.customerPlace && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerPlace.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-purple-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
              <div className="bg-purple-100 rounded-lg p-1 md:p-2 mr-2 md:mr-3">
                <Scissors className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              </div>
              Service Selection
            </h2>
            <div>
              <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Service *
              </label>
              <select
                {...register('serviceId', { required: 'Please select a service' })}
                id="serviceId"
                className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
              >
                <option value="">Choose a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ₹{service.price} ({service.duration} min)
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceId.message}</p>
              )}
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-green-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
              <div className="bg-green-100 rounded-lg p-1 md:p-2 mr-2 md:mr-3">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </div>
              Date & Time Selection
            </h2>
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <div>
                <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Date *
                </label>
                <input
                  {...register('bookingDate', { required: 'Please select a date' })}
                  type="date"
                  id="bookingDate"
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                  min={getTodayDate()}
                />
                {errors.bookingDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.bookingDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Time *
                </label>
                <select
                  {...register('bookingTime', { required: 'Please select a time' })}
                  id="bookingTime"
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                >
                  <option value="">Choose time</option>
                  {generateTimeSlots().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.bookingTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.bookingTime.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Seat Selection */}
          {watchedDate && watchedTime && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-amber-100">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                <div className="bg-amber-100 rounded-lg p-1 md:p-2 mr-2 md:mr-3">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                </div>
                Seat Selection
              </h2>
              {loadingSeats ? (
                <div className="flex items-center justify-center py-8 md:py-12 bg-white rounded-lg">
                  <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-indigo-600" />
                  <span className="ml-2 text-sm md:text-base text-gray-600">Loading available seats...</span>
                </div>
              ) : availableSeats ? (
                <div>
                  <div className="mb-4 md:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3 md:mb-4">
                      Available Seats *
                    </label>
                    
                    {/* Legend - Responsive */}
                    <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6 p-3 md:p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-1 md:gap-2">
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50 rounded"></div>
                        <span className="text-xs md:text-sm font-medium text-gray-700">Available</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-indigo-600 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded"></div>
                        <span className="text-xs md:text-sm font-medium text-gray-700">Selected</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-red-400 bg-gradient-to-br from-red-50 to-red-100 rounded"></div>
                        <span className="text-xs md:text-sm font-medium text-gray-700">Booked</span>
                      </div>
                    </div>
                  </div>

                  {availableSeats.availableSeats.length > 0 ? (
                    <div className={`grid gap-3 md:gap-4 mb-4 ${
                      isMobile ? 'grid-cols-3' : 'grid-cols-5'
                    }`}>
                      {[1, 2, 3, 4, 5].map((seatNum) => {
                        const isAvailable = availableSeats.availableSeats.includes(seatNum);
                        const styling = getSeatStyling(seatNum);
                        
                        return (
                          <label
                            key={seatNum}
                            className={`relative flex items-center justify-center p-3 md:p-6 border-2 rounded-lg md:rounded-xl transition-all duration-200 ${styling.className} ${
                              isMobile ? 'min-h-[80px]' : ''
                            }`}
                          >
                            <input
                              {...register('seatNumber', { required: 'Please select a seat' })}
                              type="radio"
                              value={seatNum}
                              disabled={!isAvailable}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <div className={`font-bold ${styling.textColor} mb-1 ${
                                isMobile ? 'text-lg' : 'text-xl'
                              }`}>
                                {seatNum}
                              </div>
                              <div className={`text-xs font-medium ${styling.textColor} opacity-75 ${
                                isMobile ? 'hidden' : 'block'
                              }`}>
                                {styling.status}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
                      <p className="text-red-700 text-sm font-medium">No seats available for the selected time slot.</p>
                    </div>
                  )}
                  {errors.seatNumber && (
                    <p className="mt-2 text-sm text-red-600">{errors.seatNumber.message}</p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
                  <p className="text-gray-600 text-sm">Please select date and time to view available seats.</p>
                </div>
              )}
            </div>
          )}

          {/* Submit Button - Responsive */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/bookings')}
              className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center text-sm md:text-base"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin mr-2" />
              ) : null}
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBooking;