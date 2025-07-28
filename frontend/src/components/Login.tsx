import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Scissors, Loader2, ArrowLeft, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LoginCredentials } from '../types';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

type FormStep = 'login' | 'forgotPassword' | 'verifyOtp' | 'resetPassword';

interface ForgotPasswordForm {
  email: string;
}

interface VerifyOtpForm {
  otp: string;
}

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Forms
  const loginForm = useForm<LoginCredentials>();
  const forgotPasswordForm = useForm<ForgotPasswordForm>();
  const verifyOtpForm = useForm<VerifyOtpForm>({ defaultValues: { otp: '' } });
  const resetPasswordForm = useForm<ResetPasswordForm>();

  const onLoginSubmit = async (data: LoginCredentials) => {
    const isValid = await loginForm.trigger();
    if (!isValid) return;

    setLoading(true);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid email or password. Please try again.');
      loginForm.setValue('password', '');
      loginForm.setFocus('password');
    } finally {
      setLoading(false);
    }
  };

  const onForgotPasswordSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      await apiService.forgotPassword(data.email);
      setResetEmail(data.email);
      setCurrentStep('verifyOtp');
      verifyOtpForm.reset({ otp: '' });
      toast.success('OTP sent to your email address');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtpSubmit = async (data: VerifyOtpForm) => {
    const isValid = await verifyOtpForm.trigger();
    if (!isValid) return;

    setLoading(true);
    try {
      await apiService.verifyOtp(resetEmail, data.otp);
      setCurrentStep('resetPassword');
      resetPasswordForm.reset({
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('OTP verified successfully');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
      verifyOtpForm.setError('otp', {
        type: 'manual',
        message: 'Invalid OTP'
      });
    } finally {
      setLoading(false);
    }
  };

  const onResetPasswordSubmit = async (data: ResetPasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      resetPasswordForm.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    if (data.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const otpValue = verifyOtpForm.getValues('otp');
      await apiService.resetPassword(resetEmail, otpValue, data.newPassword);

      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');

      toast.success('Password updated successfully! Please login with your new password.');
      setCurrentStep('login');
      setResetEmail('');

      loginForm.reset();
      forgotPasswordForm.reset();
      verifyOtpForm.reset();
      resetPasswordForm.reset();
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
    setResetEmail('');
    forgotPasswordForm.reset();
    verifyOtpForm.reset();
    resetPasswordForm.reset();
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const email = forgotPasswordForm.getValues('email');
      if (!email) {
        toast.error('Email is required');
        return;
      }

      await apiService.forgotPassword(email);
      toast.success('New OTP has been sent to your email');
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
      console.error('Error resending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <div className="text-center mb-4">
        <div
          className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-full mb-3 shadow-lg"
          style={{ animation: 'dynamicWobble 3s ease-in-out infinite' }}
        >
          <Scissors className="w-6 h-6 text-white" />
        </div>

        <h1 className="text-2xl font-bold font-serif text-gray-900 mb-1">Glow & Grace Salon</h1>
        <p className="text-sm text-gray-800">Booking Management System</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-slate-500 to-gray-500 mx-auto mt-2 rounded-full"></div>
      </div>

      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4" autoComplete="off">
        <div>
          <label htmlFor="login-email" className="block text-xs font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              {...loginForm.register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                },
              })}
              type="email"
              id="login-email"
              onChange={(e) => {
                loginForm.setValue('email', e.target.value.trim());
                loginForm.trigger('email');
              }}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          {loginForm.formState.errors.email && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {loginForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="login-password" className="block text-xs font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              {...loginForm.register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                validate: (value) => {
                  if (value.includes(' ')) {
                    return 'Password cannot contain spaces';
                  }
                  return true;
                }
              })}
              type={showPassword ? 'text' : 'password'}
              id="login-password"
              className="w-full pl-8 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-2 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {loginForm.formState.errors.password && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {loginForm.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-700">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={() => setCurrentStep('forgotPassword')}
            className="text-xs font-medium text-slate-600 hover:text-slate-800 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => navigate('/PublicWebsite')}
          className="inline-block text-xs font-semibold text-black hover:text-slate-900 hover:underline transition"
        >
          Back to Home
        </button>
      </div>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h1>
        <p className="text-sm text-gray-600">Enter your email to receive an OTP</p>
      </div>

      <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
        <div>
          <label htmlFor="forgotEmail" className="block text-xs font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              {...forgotPasswordForm.register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                },
              })}
              type="email"
              id="forgotEmail"
              onChange={(e) => {
                forgotPasswordForm.setValue('email', e.target.value.trim());
                forgotPasswordForm.trigger('email');
              }}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your registered email"
            />
          </div>
          {forgotPasswordForm.formState.errors.email && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {forgotPasswordForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>

        <button
          type="button"
          onClick={handleBackToLogin}
          className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium py-1 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>
      </form>
    </>
  );

  const renderVerifyOtpForm = () => (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
        <p className="text-gray-600">Enter the 6-digit code sent to</p>
        <p className="text-gray-800 font-medium">{resetEmail}</p>
      </div>

      <form onSubmit={verifyOtpForm.handleSubmit(onVerifyOtpSubmit)} className="space-y-6">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              {...verifyOtpForm.register('otp', {
                required: 'OTP is required',
                minLength: {
                  value: 6,
                  message: 'OTP must be 6 digits'
                },
                maxLength: {
                  value: 6,
                  message: 'OTP must be 6 digits'
                },
                pattern: {
                  value: /^\d{6}$/,
                  message: 'OTP must be exactly 6 digits',
                }
              })}
              type="text"
              id="otp"
              inputMode="numeric"
              maxLength={6}
              className="w-full pl-10 pr-3 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="000000"
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;
                let value = target.value.replace(/\D/g, '');
                if (value.length > 6) {
                  value = value.slice(0, 6);
                }
                target.value = value;
                verifyOtpForm.setValue('otp', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
              }}
            />
          </div>
          {verifyOtpForm.formState.errors.otp && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {verifyOtpForm.formState.errors.otp.message}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500 text-center">
            The OTP expires in 10 minutes
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !verifyOtpForm.formState.isValid}
          className="w-full btn-primary flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Shield className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="flex-1 flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Login
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading}
            className="flex-1 text-blue-600 hover:text-blue-800 font-medium py-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
      </form>
    </>
  );

  const renderResetPasswordForm = () => (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Lock className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-600">Enter your new password</p>
      </div>

      <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-6">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              {...resetPasswordForm.register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter new password"
              onChange={(e) => {
                resetPasswordForm.setValue('newPassword', e.target.value);
                const confirmPasswordValue = resetPasswordForm.getValues('confirmPassword');
                if (confirmPasswordValue) {
                  resetPasswordForm.trigger('confirmPassword');
                }
              }}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {resetPasswordForm.formState.errors.newPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {resetPasswordForm.formState.errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              {...resetPasswordForm.register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => {
                  const newPassword = resetPasswordForm.getValues('newPassword');
                  if (!newPassword) return 'Please enter new password first';
                  if (!value) return 'Please confirm your password';
                  return value === newPassword || 'Passwords do not match';
                }
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Confirm new password"
              onChange={(e) => {
                resetPasswordForm.setValue('confirmPassword', e.target.value);
                setTimeout(() => {
                  resetPasswordForm.trigger('confirmPassword');
                }, 0);
              }}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {resetPasswordForm.formState.errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {resetPasswordForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !resetPasswordForm.formState.isValid}
          className="w-full btn-primary flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Lock className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>

        <button
          type="button"
          onClick={handleBackToLogin}
          className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Login
        </button>
      </form>
    </>
  );

  const getCurrentForm = () => {
    switch (currentStep) {
      case 'login': return renderLoginForm();
      case 'forgotPassword': return renderForgotPasswordForm();
      case 'verifyOtp': return renderVerifyOtpForm();
      case 'resetPassword': return renderResetPasswordForm();
      default: return renderLoginForm();
    }
  };

  return (
    <div className="h-screen relative flex items-center justify-center p-2 overflow-hidden">
      <style>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%) rotate(-15deg); }
          100% { transform: translateX(100vw) rotate(-15deg); }
        }
        
        @keyframes slideLeft {
          0% { transform: translateX(100vw) rotate(10deg); }
          100% { transform: translateX(-100%) rotate(10deg); }
        }
        
        @keyframes slideUp {
          0% { transform: translateY(100vh) rotate(-8deg); }
          100% { transform: translateY(-100%) rotate(-8deg); }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; }
        }
        
        @keyframes rotateCenter {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes floatScissors {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-5px) rotate(-3deg); }
          75% { transform: translateY(-12px) rotate(2deg); }
        }

        @keyframes scissorsOpenClose {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }

        @keyframes formScissorsFloat {
          0%, 100% { transform: translateY(0px) rotate(-10deg) scale(1); }
          33% { transform: translateY(-8px) rotate(-5deg) scale(1.05); }
          66% { transform: translateY(-3px) rotate(-15deg) scale(0.95); }
        }

        @keyframes dynamicWobble {
          0% { transform: rotate(0deg) scale(1); }
          10% { transform: rotate(-3deg) scale(1.05); }
          20% { transform: rotate(2deg) scale(0.95); }
          30% { transform: rotate(-1deg) scale(1.02); }
          40% { transform: rotate(1deg) scale(0.98); }
          50% { transform: rotate(-2deg) scale(1.03); }
          60% { transform: rotate(1deg) scale(1.01); }
          70% { transform: rotate(-1deg) scale(0.99); }
          80% { transform: rotate(2deg) scale(1.02); }
          90% { transform: rotate(-1deg) scale(1.01); }
          100% { transform: rotate(0deg) scale(1); }
        }
      `}</style>

      {/* Dynamic Salon Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-700 to-slate-600">

        {/* Central Rotating Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="text-white opacity-8 text-6xl md:text-8xl font-bold select-none"
            style={{ animation: 'rotateCenter 20s linear infinite' }}
          >
            Glow & Grace SALON
          </div>
        </div>

        {/* Sliding Text Banners */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 text-white opacity-6 text-4xl font-bold whitespace-nowrap select-none"
            style={{ animation: 'slideRight 12s linear infinite' }}
          >
            Glow & Grace SALON • Glow & Grace SALON • Glow & Grace SALON • Glow & Grace SALON •
          </div>

          <div
            className="absolute top-60 text-white opacity-4 text-3xl font-bold whitespace-nowrap select-none"
            style={{ animation: 'slideLeft 15s linear infinite' }}
          >
            SALON Glow & Grace • SALON Glow & Grace • SALON Glow & Grace • SALON Glow & Grace •
          </div>

          <div
            className="absolute bottom-20 text-white opacity-5 text-2xl font-bold whitespace-nowrap select-none"
            style={{ animation: 'slideRight 18s linear infinite' }}
          >
            Glow & Grace • SALON • Glow & Grace • SALON • Glow & Grace • SALON • Glow & Grace •
          </div>

          <div
            className="absolute left-10 text-white opacity-3 text-xl font-bold whitespace-nowrap select-none origin-center"
            style={{
              animation: 'slideUp 14s linear infinite',
              writingMode: 'vertical-lr',
              textOrientation: 'mixed'
            }}
          >
            Glow & Grace SALON Glow & Grace SALON Glow & Grace SALON
          </div>

          <div
            className="absolute right-10 text-white opacity-4 text-lg font-bold whitespace-nowrap select-none"
            style={{
              animation: 'slideUp 16s linear infinite reverse',
              writingMode: 'vertical-lr',
              textOrientation: 'mixed'
            }}
          >
            SALON Glow & Grace SALON Glow & Grace SALON Glow & Grace
          </div>
        </div>

        {/* Animated Floating Text Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-32 left-1/4 text-white text-2xl font-bold select-none"
            style={{ animation: 'fadeInOut 4s ease-in-out infinite' }}
          >
            Glow & Grace
          </div>

          <div
            className="absolute top-1/2 right-1/4 text-white text-xl font-bold select-none"
            style={{ animation: 'fadeInOut 5s ease-in-out infinite', animationDelay: '1s' }}
          >
            SALON
          </div>

          <div
            className="absolute bottom-1/3 left-1/3 text-white text-3xl font-bold select-none"
            style={{ animation: 'fadeInOut 6s ease-in-out infinite', animationDelay: '2s' }}
          >
            Glow & Grace
          </div>

          <div
            className="absolute top-1/4 right-1/6 text-white text-lg font-bold select-none"
            style={{ animation: 'fadeInOut 3s ease-in-out infinite', animationDelay: '0.5s' }}
          >
            SALON
          </div>

          <div
            className="absolute bottom-1/4 left-1/6 text-white text-2xl font-bold select-none"
            style={{ animation: 'fadeInOut 4.5s ease-in-out infinite', animationDelay: '1.5s' }}
          >
            Glow & Grace
          </div>

          <div
            className="absolute top-3/4 right-1/3 text-white text-xl font-bold select-none"
            style={{ animation: 'fadeInOut 5.5s ease-in-out infinite', animationDelay: '2.5s' }}
          >
            SALON
          </div>
        </div>

        {/* Dynamic Salon Elements Background */}
        <div className="absolute inset-0 opacity-15">
          {/* Animated Scissors with Text */}
          <div
            className="absolute top-10 left-10 flex flex-col items-center text-white"
            style={{ animation: 'rotateCenter 8s linear infinite' }}
          >
            <Scissors className="w-16 h-16" />
            <span className="text-xs font-bold mt-2">Glow & Grace</span>
          </div>

          <div
            className="absolute top-32 right-20 flex flex-col items-center text-white animate-bounce"
            style={{ animationDelay: '1s' }}
          >
            <Scissors className="w-12 h-12" />
            <span className="text-xs font-bold mt-1">SALON</span>
          </div>

          <div
            className="absolute bottom-20 left-32 flex flex-col items-center text-white"
            style={{ animation: 'rotateCenter 12s linear infinite reverse' }}
          >
            <Scissors className="w-20 h-20" />
            <span className="text-sm font-bold mt-2">Glow & Grace</span>
          </div>

          <div
            className="absolute bottom-40 right-10 flex flex-col items-center text-white animate-bounce"
            style={{ animationDelay: '2s' }}
          >
            <Scissors className="w-14 h-14" />
            <span className="text-xs font-bold mt-2">SALON</span>
          </div>

          <div
            className="absolute top-1/2 left-5 flex flex-col items-center text-white"
            style={{ animation: 'rotateCenter 10s linear infinite' }}
          >
            <Scissors className="w-11 h-11" />
            <span className="text-xs font-bold mt-1">Glow & Grace</span>
          </div>

          <div
            className="absolute top-1/2 right-5 flex flex-col items-center text-white animate-bounce"
            style={{ animationDelay: '0.5s' }}
          >
            <Scissors className="w-13 h-13" />
            <span className="text-xs font-bold mt-1">SALON</span>
          </div>

          {/* Animated Salon Equipment */}
          <div
            className="absolute top-1/3 left-1/6 animate-pulse"
            style={{ animation: 'fadeInOut 4s ease-in-out infinite' }}
          >
            <div className="w-8 h-12 bg-white rounded-t-full"></div>
            <div className="w-12 h-4 bg-white rounded-b-lg -mt-2"></div>
          </div>

          <div
            className="absolute bottom-1/3 right-1/6 animate-bounce"
            style={{ animationDelay: '1s' }}
          >
            <div className="w-6 h-10 bg-white rounded-t-full"></div>
            <div className="w-10 h-3 bg-white rounded-b-lg -mt-2"></div>
          </div>

          <div
            className="absolute top-1/4 right-1/6"
            style={{ animation: 'rotateCenter 15s linear infinite' }}
          >
            <div className="w-3 h-8 bg-white rounded-t-lg"></div>
            <div className="w-6 h-6 bg-white rounded-full -mt-1"></div>
          </div>

          <div
            className="absolute bottom-1/4 left-1/5 animate-bounce"
            style={{ animationDelay: '1.5s' }}
          >
            <div className="w-2 h-6 bg-white rounded-t-lg"></div>
            <div className="w-5 h-5 bg-white rounded-full -mt-1"></div>
          </div>

          {/* Animated Decorative Elements */}
          <div
            className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-white"
            style={{ animation: 'rotateCenter 25s linear infinite' }}
          ></div>

          <div
            className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full border-2 border-white"
            style={{ animation: 'rotateCenter 30s linear infinite reverse' }}
          ></div>

          <div
            className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full border-2 border-white"
            style={{ animation: 'rotateCenter 20s linear infinite' }}
          ></div>

          {/* Mirror Frames */}
          <div
            className="absolute top-1/2 left-1/5 w-16 h-20 border-2 border-white rounded-lg"
            style={{ animation: 'fadeInOut 3s ease-in-out infinite' }}
          ></div>

          <div
            className="absolute bottom-1/3 right-1/5 w-12 h-16 border-2 border-white rounded-lg"
            style={{ animation: 'fadeInOut 4s ease-in-out infinite', animationDelay: '1s' }}
          ></div>
        </div>

        {/* Animated Floating Particles */}
        <div className="absolute inset-0">
          <div
            className="absolute top-20 left-1/4 w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '0s', animationDuration: '3s', opacity: '0.4' }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '1s', animationDuration: '4s', opacity: '0.3' }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '2s', animationDuration: '5s', opacity: '0.5' }}
          ></div>
          <div
            className="absolute top-3/4 right-1/6 w-1 h-1 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '1.5s', animationDuration: '3.5s', opacity: '0.6' }}
          ></div>
          <div
            className="absolute bottom-1/2 left-1/8 w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '0.8s', animationDuration: '4.5s', opacity: '0.3' }}
          ></div>
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-black opacity-25"></div>
      </div>

    
      <div className="max-w-sm w-full relative z-10">
       
        <div className="relative mb-4">
         
          <div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-slate-600"
            style={{ animation: 'floatScissors 3s ease-in-out infinite', animationDelay: '0.5s' }}
          >
            <Scissors className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 border border-white/20">
          {getCurrentForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;