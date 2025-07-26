import axios, { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import {
  User,
  Service,
  Customer,
  Booking,
  LoginCredentials,
  AuthResponse,
  CreateServiceData,
  CreateBookingData,
  DashboardStats,
  AvailableSeats,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<User> {
    const response: AxiosResponse<User> = await this.api.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  async changeEmail(email: string): Promise<User> {
    const response: AxiosResponse<User> = await this.api.patch('/auth/change-email', { email });
    return response.data;
  }

  // Service APIs
  async getServices(): Promise<Service[]> {
    const response: AxiosResponse<Service[]> = await this.api.get('/services');
    return response.data;
  }

  async createService(data: CreateServiceData): Promise<Service> {
    const response: AxiosResponse<Service> = await this.api.post('/services', data);
    return response.data;
  }

  async updateService(id: number, data: Partial<CreateServiceData>): Promise<Service> {
    const response: AxiosResponse<Service> = await this.api.patch(`/services/${id}`, data);
    return response.data;
  }

  async deleteService(id: number): Promise<Service> {
    const response: AxiosResponse<Service> = await this.api.delete(`/services/${id}`);
    return response.data;
  }

  async searchServices(query: string): Promise<Service[]> {
    const response: AxiosResponse<Service[]> = await this.api.get(`/services/search?q=${query}`);
    return response.data;
  }

  // Booking APIs
  async getBookings(): Promise<Booking[]> {
    const response: AxiosResponse<Booking[]> = await this.api.get('/bookings');
    return response.data;
  }

  async getTodayBookings(): Promise<Booking[]> {
    const response: AxiosResponse<Booking[]> = await this.api.get('/bookings/today');
    return response.data;
  }

  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response: AxiosResponse<Booking> = await this.api.post('/bookings', data);
    return response.data;
  }

  async updateBooking(id: number, data: Partial<CreateBookingData>): Promise<Booking> {
    const response: AxiosResponse<Booking> = await this.api.patch(`/bookings/${id}`, data);
    return response.data;
  }

  async postponeBooking(id: number, bookingTime: string): Promise<Booking> {
    const response: AxiosResponse<Booking> = await this.api.patch(`/bookings/${id}/postpone`, {
      bookingTime,
    });
    return response.data;
  }

  async cancelBooking(id: number): Promise<Booking> {
    const response: AxiosResponse<Booking> = await this.api.patch(`/bookings/${id}/cancel`);
    return response.data;
  }

  async completeBooking(id: number): Promise<Booking> {
    const response: AxiosResponse<Booking> = await this.api.patch(`/bookings/${id}/complete`);
    return response.data;
  }

  async deleteBooking(id: number): Promise<void> {
    await this.api.delete(`/bookings/${id}`);
  }

  async getAvailableSeats(datetime: string): Promise<AvailableSeats> {
    const response: AxiosResponse<AvailableSeats> = await this.api.get(
      `/bookings/available-seats?datetime=${datetime}`
    );
    return response.data;
  }

  // Customer APIs
  async getCustomers(): Promise<Customer[]> {
    const response: AxiosResponse<Customer[]> = await this.api.get('/customers');
    return response.data;
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    const response: AxiosResponse<Customer[]> = await this.api.get(`/customers/search?q=${query}`);
    return response.data;
  }

  async getCustomerByMobile(mobile: string): Promise<Customer | null> {
    try {
      const response: AxiosResponse<Customer> = await this.api.get(`/customers/mobile/${mobile}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  // Dashboard APIs
  async getTodayStats(): Promise<DashboardStats> {
    const response: AxiosResponse<DashboardStats> = await this.api.get('/dashboard/today-stats');
    return response.data;
  }

  async getMonthlyStats(): Promise<{ monthlyRevenue: number; monthlyCustomers: number; monthlyBookings: number }> {
    const response = await this.api.get('/dashboard/monthly-stats');
    return response.data;
  }

  async getRecentBookings(limit = 10): Promise<Booking[]> {
    const response: AxiosResponse<Booking[]> = await this.api.get(`/dashboard/recent-bookings?limit=${limit}`);
    return response.data;
  }

  // User APIs (Admin only)
  async getUsers(): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/users');
    return response.data;
  }

  async createUser(data: { email: string; password: string; name: string; role: 'ADMIN' | 'STAFF' }): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/users', data);
    return response.data;
  }

  async updateUser(id: number, data: Partial<{ email: string; name: string; role: 'ADMIN' | 'STAFF' }>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.patch(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.delete(`/users/${id}`);
    return response.data;
  }
}

export const apiService = new ApiService();