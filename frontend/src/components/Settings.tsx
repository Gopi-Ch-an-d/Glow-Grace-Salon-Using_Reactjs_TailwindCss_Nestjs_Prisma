import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock, Save } from 'lucide-react';
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
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-gray-400 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <div className="input-field bg-gray-50 cursor-not-allowed">
              {user?.name}
            </div>
            <p className="text-xs text-gray-500 mt-1">Contact admin to change your name</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="input-field bg-gray-50 cursor-not-allowed capitalize">
              {user?.role?.toLowerCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Mail className="w-6 h-6 text-gray-400 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Email Settings</h2>
        </div>

        <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
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
              className="input-field"
            />
            {emailErrors.email && (
              <p className="mt-1 text-sm text-red-600">{emailErrors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingEmail}
              className="btn-primary flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {loadingEmail ? 'Updating...' : 'Update Email'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Settings */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Lock className="w-6 h-6 text-gray-400 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                {...registerPassword('currentPassword', {
                  required: 'Current password is required',
                })}
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                className="input-field pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
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
                className="input-field pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                {...registerPassword('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) =>
                    value === newPassword || 'Passwords do not match',
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="input-field pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingPassword}
              className="btn-primary flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {loadingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;