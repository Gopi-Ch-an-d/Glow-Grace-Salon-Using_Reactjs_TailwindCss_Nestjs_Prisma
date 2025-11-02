export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF';
  createdAt: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  name: string;
  mobile: string;
  place: string;
  bookings?: Booking[];
}

export interface Booking {
  id: number;
  customerId: number;
  serviceId: number;
  seatNumber: number;
  bookingTime: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'POSTPONED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  service: Service;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CreateServiceData {
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface CreateBookingData {
  customer: {
    name: string;
    mobile: string;
    place: string;
  };
  serviceId: number;
  seatNumber: number;
  bookingTime: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalCustomers: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
}

export interface AvailableSeats {
  availableSeats: number[];
  bookedSeats: number[];
}

export interface OTPResponse {
  success: boolean;
  message: string;
}