import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Scissors, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LoginCredentials } from '../types';


const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
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

      {/* Login Form */}
      <div className="max-w-md w-full relative z-10 mt-0">
        {/* Dynamic Scissors Above Form */}
        <div className="relative mb-8">
          {/* Left Scissors */}
          <div
            className="absolute -top-6 -left-12 text-slate-600"
            style={{ animation: 'formScissorsFloat 4s ease-in-out infinite' }}
          >
            <Scissors className="w-8 h-8" />
          </div>

          {/* Right Scissors */}
          <div
            className="absolute -top-6 -right-12 text-slate-600"
            style={{ animation: 'formScissorsFloat 4s ease-in-out infinite reverse', animationDelay: '1s' }}
          >
            <Scissors className="w-8 h-8" />
          </div>

          {/* Top Center Scissors */}
          <div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-slate-600"
            style={{ animation: 'floatScissors 3s ease-in-out infinite', animationDelay: '0.5s' }}
          >
            <Scissors className="w-10 h-10" />
          </div>

          {/* Additional Floating Scissors */}
          <div
            className="absolute -top-8 left-8 text-slate-500"
            style={{ animation: 'scissorsOpenClose 2s ease-in-out infinite', animationDelay: '2s' }}
          >
            <Scissors className="w-6 h-6" />
          </div>

          <div
            className="absolute -top-8 right-8 text-slate-500"
            style={{ animation: 'scissorsOpenClose 2s ease-in-out infinite', animationDelay: '3s' }}
          >
            <Scissors className="w-6 h-6" />
          </div>

          {/* Small decorative scissors */}
          <div
            className="absolute -top-12 left-16 text-slate-400"
            style={{ animation: 'fadeInOut 3s ease-in-out infinite', animationDelay: '1s' }}
          >
            <Scissors className="w-4 h-4" />
          </div>

          <div
            className="absolute -top-12 right-16 text-slate-400"
            style={{ animation: 'fadeInOut 3s ease-in-out infinite', animationDelay: '2.5s' }}
          >
            <Scissors className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4 shadow-lg"
              style={{ animation: 'dynamicWobble 3s ease-in-out infinite' }}
            >
              <Scissors className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-4xl font-bold font-serif text-gray-900 mb-2">Glow & Grace Salon</h1>
            <p className="text-gray-800">Booking Management System</p>
            <div className="w-16 h-1 bg-gradient-to-r from-slate-500 to-gray-500 mx-auto mt-3 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                id="email"
                className="input-field"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="input-field pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/PublicWebsite')}
              className="inline-block mt-2 text-sm font-semibold text-black hover:text-slate-900 hover:underline transition"
            >
               Back to Home
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};


export default Login;