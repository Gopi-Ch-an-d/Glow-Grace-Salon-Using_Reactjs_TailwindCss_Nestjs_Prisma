import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, UserPlus, Eye, EyeOff, Users, Shield, Mail, Clock, Sparkles, Filter, ChevronLeft, MoreVertical } from 'lucide-react';
import { User } from '../types';
import { apiService } from '../services/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'STAFF';
}

const StaffManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'all' | 'ADMIN' | 'STAFF'>('all');
  const [showFilters, setShowFilters] = useState(false);
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserData>();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
      });
    } else {
      setEditingUser(null);
      reset({
        name: '',
        email: '',
        password: '',
        role: 'STAFF',
      });
    }
    setShowModal(true);
    setMobileMenuOpen(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    reset();
    setShowPassword(false);
  };

  const onSubmit = async (data: CreateUserData) => {
    try {
      if (editingUser) {
        const updateData: any = {
          name: data.name,
          email: data.email,
          role: data.role,
        };
        // Only include password if it's provided
        if (data.password) {
          updateData.password = data.password;
        }
        const updatedUser = await apiService.updateUser(editingUser.id, updateData);
        setUsers((prev) =>
          prev.map((user) => (user.id === editingUser.id ? updatedUser : user))
        );
        toast.success('User updated successfully');
      } else {
        const newUser = await apiService.createUser(data);
        setUsers((prev) => [...prev, newUser]);
        toast.success('User created successfully');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(userId);
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        toast.success('User deleted successfully');
        setMobileMenuOpen(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  // Calculate statistics
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const staffCount = users.filter(u => u.role === 'STAFF').length;

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 md:p-8 animate-pulse">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 rounded-full bg-white bg-opacity-20">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-white bg-opacity-30 rounded-full"></div>
            </div>
            <div>
              <div className="h-6 md:h-8 bg-white bg-opacity-30 rounded w-32 md:w-48 mb-2"></div>
              <div className="h-3 md:h-4 bg-white bg-opacity-20 rounded w-48 md:w-64"></div>
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">Staff Management</h1>
              <p className="text-indigo-100 text-sm md:text-lg">
                Manage your team members and permissions
              </p>
            </div>
          </div>
          
          {/* Total Staff Badge - Responsive */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 border border-white border-opacity-30">
            <div className="flex items-center gap-2 md:gap-3">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-yellow-300" />
              <div>
                <p className="text-xs text-white text-opacity-80 font-medium">Total Staff</p>
                <p className="text-xl md:text-3xl font-bold text-white">{totalUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-indigo-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Total Users</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{totalUsers}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">All team members</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Users className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Administrators */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-purple-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Administrators</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{adminCount}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">{((adminCount / totalUsers) * 100 || 0).toFixed(1)}% of team</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <Shield className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Staff Members */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border-l-4 border-blue-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Staff Members</p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{staffCount}</p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">{((staffCount / totalUsers) * 100 || 0).toFixed(1)}% of team</p>
            </div>
            <div className="p-2 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
              <UserPlus className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 shadow-sm">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">Team Members</h2>
          <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm md:text-base">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Showing {filteredUsers.length} of {totalUsers} users
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center transform hover:-translate-y-0.5 text-sm md:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
          Add User
        </button>
      </div>

      {/* Enhanced Search and Filters - Responsive */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
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

          {/* Role Filter - Desktop/Tablet or Mobile when expanded */}
          <div className={`${isMobile ? (showFilters ? 'block' : 'hidden') : 'flex'} items-center gap-3`}>
            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin Only</option>
              <option value="STAFF">Staff Only</option>
            </select>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-3 md:mt-2">
          {searchTerm || roleFilter !== 'all' 
            ? `Found ${filteredUsers.length} matching users` 
            : `Browse all ${users.length} team members`
          }
        </p>
      </div>

      {/* Enhanced Users Table - Responsive */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {isMobile ? (
          /* Mobile Cards View */
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-150">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                      user.role === 'ADMIN' 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    }`}>
                      <span className="text-sm font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base truncate">{user.name}</h3>
                      <p className="text-gray-600 text-sm truncate flex items-center gap-1">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setMobileMenuOpen(mobileMenuOpen === user.id ? null : user.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {mobileMenuOpen === user.id && (
                      <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg border border-gray-200 z-10 min-w-[120px]">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 flex items-center gap-2 text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Role:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      }`}
                    >
                      {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Joined:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
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
                    User
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-150">
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md ${
                          user.role === 'ADMIN' 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                            : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        }`}>
                          <span className="text-sm md:text-lg font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3 md:ml-4">
                          <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 md:px-3 py-1 text-xs font-bold rounded-full ${
                          user.role === 'ADMIN'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                        }`}
                      >
                        {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-gray-400" />
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 md:p-2 rounded-lg transition-all"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 md:p-2 rounded-lg transition-all"
                          title="Delete user"
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="inline-block p-4 md:p-6 bg-white rounded-full shadow-lg mb-3 md:mb-4">
              <UserPlus className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
            </div>
            <p className="text-gray-500 text-base md:text-lg font-medium">No users found</p>
            <p className="text-gray-400 text-sm mt-1 md:mt-2">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Add your first team member to get started'
              }
            </p>
          </div>
        )}
      </div>

      {/* Enhanced User Modal - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 rounded-t-xl md:rounded-t-2xl">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1 md:p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg">
                  <UserPlus className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 space-y-4 md:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                  placeholder="Enter name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                    placeholder="Enter email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: !editingUser ? 'Password is required' : false,
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base pr-12"
                    placeholder={editingUser ? "Enter new password" : "Enter password"}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  {...register('role', { required: 'Role is required' })}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                >
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
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
                  {editingUser ? 'Update' : 'Create'} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;