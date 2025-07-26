import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { DashboardStats, Booking } from '../types';
import { apiService } from '../services/api';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [todayStats, setTodayStats] = useState<DashboardStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [todayData, monthlyData, recentData] = await Promise.all([
          apiService.getTodayStats(),
          apiService.getMonthlyStats(),
          apiService.getRecentBookings(8),
        ]);

        setTodayStats(todayData);
        setMonthlyStats(monthlyData);
        setRecentBookings(recentData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Today's Revenue",
      value: `₹${todayStats?.totalRevenue || 0}`,
      icon: IndianRupee,
      color: 'text-green-600',
      bg: 'bg-green-100',
      change: monthlyStats?.monthlyRevenue ? '+12%' : '',
    },
    {
      title: "Total Customers",
      value: todayStats?.totalCustomers || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      change: monthlyStats?.monthlyCustomers ? '+8%' : '',
    },
    {
      title: "Today's Bookings",
      value: todayStats?.totalBookings || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      change: monthlyStats?.monthlyBookings ? '+15%' : '',
    },
    {
      title: "Completed",
      value: todayStats?.completedBookings || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      change: '',
    },
  ];

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="text-sm text-gray-500">
            Today: {format(currentDateTime, 'EEEE, MMMM d, yyyy')} at {format(currentDateTime, 'h:mm a')}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">{stat.change}</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Bookings */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Bookings</h3>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {todayStats?.pendingBookings || 0}
            </div>
            <p className="text-sm text-gray-600">Bookings awaiting confirmation</p>
          </div>

          {/* Monthly Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue:</span>
                <span className="font-semibold">₹{monthlyStats?.monthlyRevenue || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bookings:</span>
                <span className="font-semibold">{monthlyStats?.monthlyBookings || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customers:</span>
                <span className="font-semibold">{monthlyStats?.monthlyCustomers || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/bookings/new"
                className="w-full btn-primary text-left block"
              >
                <Calendar className="w-4 h-4 mr-2 inline" />
                New Booking
              </Link>
              <Link
                to="/customers"
                className="w-full btn-secondary text-left block"
              >
                <Users className="w-4 h-4 mr-2 inline" />
                View Customers
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">{booking.customer.mobile}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.service.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(booking.bookingTime), 'MMM d, h:mm a')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-800'
                              : booking.status === 'POSTPONED'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{booking.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;