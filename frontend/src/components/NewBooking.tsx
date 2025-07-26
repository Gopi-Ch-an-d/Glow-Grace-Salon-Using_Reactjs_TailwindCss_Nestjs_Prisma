import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, MapPin, Scissors, Loader2 } from 'lucide-react';
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
  const navigate = useNavigate();

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
  const watchedSeatNumber = watch('seatNumber'); // Watch selected seat

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await apiService.getServices();
        setServices(servicesData.filter(service => service.isActive));
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  // Check for existing customer when mobile number changes
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

  // Fetch available seats when date and time change
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

  // Function to get seat styling based on its status
  const getSeatStyling = (seatNum: number) => {
    const isAvailable = availableSeats?.availableSeats.includes(seatNum);
    const isBooked = availableSeats?.bookedSeats.includes(seatNum);
    const isSelected = watchedSeatNumber === seatNum.toString();

    if (isBooked) {
      // Booked seats - Red/unavailable
      return {
        className: 'border-red-500 bg-red-100 cursor-not-allowed opacity-75',
        textColor: 'text-red-700',
        status: 'Booked'
      };
    } else if (isSelected) {
      // Selected seat - Black/Dark
      return {
        className: 'border-black bg-black cursor-pointer shadow-lg transform scale-105',
        textColor: 'text-white',
        status: 'Selected'
      };
    } else if (isAvailable) {
      // Available seats - White/Light
      return {
        className: 'border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer shadow-sm',
        textColor: 'text-gray-700',
        status: 'Available'
      };
    } else {
      // Unavailable seats - Gray
      return {
        className: 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50',
        textColor: 'text-gray-400',
        status: 'Unavailable'
      };
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">New Booking</h1>
        <p className="text-gray-600 mt-2">Create a new booking for a customer</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Customer Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customerMobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                    className="input-field pl-10"
                    placeholder="Enter mobile number"
                    maxLength={10}
                  />
                </div>
                {errors.customerMobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerMobile.message}</p>
                )}
                {existingCustomer && (
                  <p className="mt-1 text-sm text-green-600">✓ Existing customer found</p>
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
                  className="input-field"
                  placeholder="Enter customer name"
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="customerPlace" className="block text-sm font-medium text-gray-700 mb-2">
                  Place *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('customerPlace', { required: 'Place is required' })}
                    type="text"
                    id="customerPlace"
                    className="input-field pl-10"
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
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Scissors className="w-5 h-5 mr-2" />
              Service Selection
            </h2>
            <div>
              <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Service *
              </label>
              <select
                {...register('serviceId', { required: 'Please select a service' })}
                id="serviceId"
                className="input-field"
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
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Date & Time Selection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Date *
                </label>
                <input
                  {...register('bookingDate', { required: 'Please select a date' })}
                  type="date"
                  id="bookingDate"
                  className="input-field"
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
                  className="input-field"
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
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Seat Selection
              </h2>
              {loadingSeats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                  <span className="ml-2 text-gray-600">Loading available seats...</span>
                </div>
              ) : availableSeats ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Seats *
                    </label>
                    
                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 bg-white rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black bg-black rounded"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-red-500 bg-red-100 rounded"></div>
                        <span>Booked</span>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-200 bg-gray-100 rounded opacity-50"></div>
                        <span>Unavailable</span>
                      </div> */}
                    </div>
                  </div>

                  {availableSeats.availableSeats.length > 0 ? (
                    <div className="grid grid-cols-5 gap-4 mb-4">
                      {[1, 2, 3, 4, 5].map((seatNum) => {
                        const isAvailable = availableSeats.availableSeats.includes(seatNum);
                        const styling = getSeatStyling(seatNum);
                        
                        return (
                          <label
                            key={seatNum}
                            className={`relative flex items-center justify-center p-4 border-2 rounded-lg transition-all duration-200 ${styling.className}`}
                          >
                            <input
                              {...register('seatNumber', { required: 'Please select a seat' })}
                              type="radio"
                              value={seatNum}
                              disabled={!isAvailable}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <div className={`text-lg font-semibold ${styling.textColor}`}>
                                Seat {seatNum}
                              </div>
                              <div className={`text-xs ${styling.textColor} opacity-75`}>
                                {styling.status}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-red-600 text-sm">No seats available for the selected time slot.</p>
                  )}
                  {errors.seatNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.seatNumber.message}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Please select date and time to view available seats.</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/bookings')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
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