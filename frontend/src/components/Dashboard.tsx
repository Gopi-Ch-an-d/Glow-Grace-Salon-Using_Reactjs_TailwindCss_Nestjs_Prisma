import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Target,
  BarChart3,
  Sun,
  Moon,
  Cloud,
  Sparkles,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { DashboardStats, Booking } from '../types';
import { apiService } from '../services/api';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [todayStats, setTodayStats] = useState<DashboardStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [yearlyStats, setYearlyStats] = useState<any>(null);
  const [incomeAnalytics, setIncomeAnalytics] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userName, setUserName] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.username || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const getGreeting = () => {
    const hour = currentDateTime.getHours();
    if (hour >= 6 && hour < 12) {
      return { 
        text: 'Good Morning', 
        icon: Sun, 
        color: 'text-yellow-500',
        gradient: 'from-yellow-400 to-orange-500'
      };
    } else if (hour >= 12 && hour < 17) {
      return { 
        text: 'Good Afternoon', 
        icon: Cloud, 
        color: 'text-orange-600',
        gradient: 'from-orange-400 to-red-500'
      };
    } else {
      return { 
        text: 'Good Evening', 
        icon: Moon, 
        color: 'text-indigo-600',
        gradient: 'from-indigo-500 to-purple-600'
      };
    }
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [todayData, monthlyData, yearlyData, incomeData, recentData] = await Promise.all([
          apiService.getTodayStats(),
          apiService.getMonthlyStats(),
          apiService.getYearlyStats(),
          apiService.getIncomeAnalytics(),
          apiService.getRecentBookings(8),
        ]);

        setTodayStats(todayData);
        setMonthlyStats(monthlyData);
        setYearlyStats(yearlyData);
        setIncomeAnalytics(incomeData);
        setRecentBookings(recentData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeWithSeconds = (date: Date) => {
    return format(date, 'h:mm:ss a');
  };

  const formatTimeMobile = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const incomeData = {
    dailyIncome: incomeAnalytics?.dailyIncome ?? todayStats?.totalRevenue ?? 0,
    monthlyIncome: incomeAnalytics?.monthlyIncome ?? monthlyStats?.monthlyRevenue ?? 0,
    yearlyIncome: incomeAnalytics?.yearlyIncome ?? yearlyStats?.yearlyRevenue ?? 0,
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-4 md:p-6 animate-pulse">
              <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 md:h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const incomeCards = [
    {
      title: "Daily Income",
      value: `₹${incomeData.dailyIncome.toLocaleString('en-IN')}`,
      icon: Activity,
      gradient: 'from-green-500 to-emerald-600',
      period: 'Today'
    },
    {
      title: "Monthly Income",
      value: `₹${incomeData.monthlyIncome.toLocaleString('en-IN')}`,
      icon: BarChart3,
      gradient: 'from-blue-500 to-indigo-600',
      period: 'This Month'
    },
    {
      title: "Yearly Income",
      value: `₹${incomeData.yearlyIncome.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-600',
      period: 'This Year'
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Enhanced Header with Greeting and Time - Responsive */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-white opacity-5 rounded-full -mr-24 md:-mr-48 -mt-24 md:-mt-48"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white opacity-5 rounded-full -ml-16 md:-ml-32 -mb-16 md:-mb-32"></div>
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-4 rounded-xl md:rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm">
              <GreetingIcon className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
                {greeting.text}
                {userName && (
                  <span className="block md:inline">
                    {isMobile ? <br /> : ', '}
                    {userName}
                  </span>
                )}!
              </h1>
              <p className="text-indigo-100 text-sm md:text-lg">
                Welcome to your business dashboard
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

      {/* Enhanced Income Overview Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {incomeCards.map((stat, index) => {
          const isZero = stat.title === "Daily Income" && incomeData.dailyIncome === 0;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              <div className={`p-4 md:p-6 pb-3 md:pb-4 bg-gradient-to-r ${stat.gradient}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-white text-opacity-90 font-medium mb-1">{stat.title}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className="p-2 md:p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl">
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-3 md:p-4 bg-gradient-to-br from-gray-50 to-white">
                <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.period}</p>
                {isZero && (
                  <p className="text-xs text-gray-400 mt-1 italic flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    No completed bookings today
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Quick Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Today's Overview */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-indigo-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900">Today's Stats</h3>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
            </div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-700 font-medium">Revenue:</span>
              <span className="font-bold text-green-600 text-sm md:text-base">₹{(todayStats?.totalRevenue || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-700 font-medium">Bookings:</span>
              <span className="font-bold text-gray-900 text-sm md:text-base">{todayStats?.totalBookings || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-700 font-medium">Customers:</span>
              <span className="font-bold text-gray-900 text-sm md:text-base">{todayStats?.totalCustomers || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-700 font-medium">Completed:</span>
              <span className="font-bold text-green-600 text-sm md:text-base">{todayStats?.completedBookings || 0}</span>
            </div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-yellow-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900">Pending</h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
            {todayStats?.pendingBookings || 0}
          </div>
          <p className="text-xs md:text-sm text-gray-600 font-medium">Awaiting confirmation</p>
        </div>

        {/* Monthly Overview */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-blue-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900">This Month</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-700 font-medium">Revenue:</span>
              <span className="font-bold text-blue-600 text-sm md:text-base">₹{(monthlyStats?.monthlyRevenue || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-700 font-medium">Bookings:</span>
              <span className="font-bold text-gray-900 text-sm md:text-base">{monthlyStats?.monthlyBookings || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-700 font-medium">Customers:</span>
              <span className="font-bold text-gray-900 text-sm md:text-base">{monthlyStats?.monthlyCustomers || 0}</span>
            </div>
          </div>
        </div>

        {/* Yearly Overview */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-purple-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900">This Year</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-700 font-medium">Revenue:</span>
              <span className="font-bold text-purple-600 text-sm md:text-base">₹{(yearlyStats?.yearlyRevenue || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-700 font-medium">Bookings:</span>
              <span className="font-bold text-gray-900 text-sm md:text-base">{yearlyStats?.yearlyBookings || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-700 font-medium">Customers:</span>
              <span className="font-bold text-gray-900 text-sm md:text-base">{yearlyStats?.yearlyCustomers || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions - Responsive */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-1 md:p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <Link
            to="/bookings/new"
            className="group relative overflow-hidden px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-between transform hover:-translate-y-1 text-sm md:text-base"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              <span>New Booking</span>
            </div>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/customers"
            className="group relative overflow-hidden px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-between transform hover:-translate-y-1 text-sm md:text-base"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              <span>View Customers</span>
            </div>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/bookings"
            className="group relative overflow-hidden px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-between transform hover:-translate-y-1 text-sm md:text-base col-span-1 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
              <span>View Bookings</span>
            </div>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Enhanced Recent Bookings - Responsive */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1 md:p-2 bg-white rounded-lg shadow-sm">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-700" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Recent Bookings</h3>
            </div>
            <Link 
              to="/bookings"
              className="text-xs md:text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>
          </div>
        </div>
        
        {recentBookings.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="inline-block p-4 md:p-6 bg-white rounded-full shadow-lg mb-3 md:mb-4">
              <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
            </div>
            <p className="text-gray-500 text-base md:text-lg font-medium">No recent bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                    Service
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-150">
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {booking.customer.name}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {booking.service.name}
                        </div>
                        <div className="text-xs text-gray-500">{booking.customer.mobile}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden sm:table-cell">
                      {booking.service.name}
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(booking.bookingTime), isMobile ? 'MMM d' : 'MMM d, h:mm a')}
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                          booking.status === 'COMPLETED'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm'
                            : booking.status === 'CONFIRMED'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm'
                            : booking.status === 'POSTPONED'
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-sm'
                            : 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-sm'
                        }`}
                      >
                        {isMobile 
                          ? booking.status.charAt(0)
                          : booking.status
                        }
                      </span>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ₹{booking.totalPrice.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-green-50 to-emerald-50">
                <tr>
                  <td colSpan={isMobile ? 3 : 4} className="px-4 py-3 md:px-6 md:py-4 text-right text-sm font-bold text-gray-900">
                    Total Amount:
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    ₹{recentBookings.reduce((sum, booking) => sum + booking.totalPrice, 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;