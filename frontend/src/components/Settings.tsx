import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock, Save, Shield, Settings as SettingsIcon, Sparkles, KeyRound, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface EmailChangeData {
  email: string;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    email: true,
    password: true,
    security: false
  });

  // Detect screen size
  React.useEffect(() => {
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
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeData>();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailChangeData>({
    defaultValues: {
      email: user?.email || '',
    },
  });

  const newPassword = watch('newPassword');

  const onPasswordSubmit = async (data: PasswordChangeData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoadingPassword(true);
    try {
      await apiService.changePassword(data.currentPassword, data.newPassword);
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const onEmailSubmit = async (data: EmailChangeData) => {
    setLoadingEmail(true);
    try {
      await apiService.changeEmail(data.email);
      toast.success('Email updated successfully');
    } catch (error) {
      console.error('Error changing email:', error);
      toast.error('Failed to update email');
    } finally {
      setLoadingEmail(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    if (isMobile) {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    }
  };

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
              <SettingsIcon className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">Settings</h1>
              <p className="text-indigo-100 text-sm md:text-lg">
                Manage your account preferences
              </p>
            </div>
          </div>
          
          {/* User Badge - Responsive */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 border border-white border-opacity-30">
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg ${
                isMobile ? 'w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12'
              }`}>
                <span className={`font-bold text-white ${
                  isMobile ? 'text-sm' : 'text-lg md:text-xl'
                }`}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-white text-opacity-80 font-medium">Logged in as</p>
                <p className="font-bold text-white text-sm md:text-lg">{user?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Card Header */}
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 md:p-6 cursor-pointer md:cursor-auto"
          onClick={() => toggleSection('profile')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1 md:p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg">
                <User className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Profile Information</h2>
            </div>
            {isMobile && (
              expandedSections.profile ? 
                <ChevronUp className="w-5 h-5 text-white" /> : 
                <ChevronDown className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Card Body */}
        {(isMobile ? expandedSections.profile : true) && (
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <div className="relative">
                  <div className="flex items-center px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg">
                    <User className="w-4 h-4 text-gray-400 mr-2 md:mr-3" />
                    <span className="font-medium text-gray-900 text-sm md:text-base">{user?.name}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Contact admin to change your name
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="relative">
                  <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-gray-400 mr-2 md:mr-3" />
                      <span className="font-medium text-gray-900 text-sm md:text-base capitalize">{user?.role?.toLowerCase()}</span>
                    </div>
                    <span className={`inline-flex px-2 md:px-3 py-1 text-xs font-bold rounded-full ${
                      user?.role === 'ADMIN'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-sm'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm'
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Card Header */}
        <div 
          className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 md:p-6 cursor-pointer md:cursor-auto"
          onClick={() => toggleSection('email')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1 md:p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg">
                <Mail className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Email Settings</h2>
            </div>
            {isMobile && (
              expandedSections.email ? 
                <ChevronUp className="w-5 h-5 text-white" /> : 
                <ChevronDown className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Card Body */}
        {(isMobile ? expandedSections.email : true) && (
          <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="p-4 md:p-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  {...registerEmail('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  id="email"
                  className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                />
              </div>
              {emailErrors.email && (
                <p className="mt-1 text-sm text-red-600">{emailErrors.email.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loadingEmail}
                className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base w-full md:w-auto justify-center"
              >
                <Save className="w-4 h-4 mr-1 md:mr-2" />
                {loadingEmail ? 'Updating...' : 'Update Email'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Password Settings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Card Header */}
        <div 
          className="bg-gradient-to-r from-orange-500 to-red-600 p-4 md:p-6 cursor-pointer md:cursor-auto"
          onClick={() => toggleSection('password')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1 md:p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg">
                <KeyRound className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Change Password</h2>
            </div>
            {isMobile && (
              expandedSections.password ? 
                <ChevronUp className="w-5 h-5 text-white" /> : 
                <ChevronDown className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Card Body */}
        {(isMobile ? expandedSections.password : true) && (
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="p-4 md:p-6 space-y-4 md:space-y-5">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  {...registerPassword('currentPassword', {
                    required: 'Current password is required',
                  })}
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  className="w-full pl-9 md:pl-10 pr-12 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  className="w-full pl-9 md:pl-10 pr-12 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Must be at least 6 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  {...registerPassword('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (value) =>
                      value === newPassword || 'Passwords do not match',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full pl-9 md:pl-10 pr-12 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all text-sm md:text-base"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-200">
              <button
                type="submit"
                disabled={loadingPassword}
                className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base w-full md:w-auto justify-center"
              >
                <Save className="w-4 h-4 mr-1 md:mr-2" />
                {loadingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-200">
        <div 
          className="flex items-start gap-3 md:gap-4 cursor-pointer md:cursor-auto"
          onClick={() => toggleSection('security')}
        >
          <div className="p-2 md:p-3 bg-blue-100 rounded-lg flex-shrink-0">
            <Shield className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Security Best Practices</h3>
              {isMobile && (
                expandedSections.security ? 
                  <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                  <ChevronDown className="w-4 h-4 text-blue-600" />
              )}
            </div>
            {(isMobile ? expandedSections.security : true) && (
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Use a strong password with a mix of letters, numbers, and symbols</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Never share your password with anyone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Change your password regularly for better security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Contact an administrator if you notice any suspicious activity</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;