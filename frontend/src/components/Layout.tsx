import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  UserPlus,
  BarChart3,
  Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Detect screen size changes
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

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Booking', href: '/bookings/new', icon: Calendar },
    { name: 'All Bookings', href: '/bookings', icon: BarChart3 },
    { name: 'Customers', href: '/customers', icon: Users },
    ...(isAdmin
      ? [
          { name: 'Services', href: '/services', icon: Scissors },
          { name: 'Staff Management', href: '/users', icon: UserPlus },
        ]
      : []),
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Mobile sidebar overlay */}
      <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar panel */}
          <div className="relative flex w-80 max-w-[85vw] flex-1 flex-col bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 transform transition-transform duration-300 ease-in-out">
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <SidebarContent 
              navigation={navigation} 
              user={user} 
              onLogout={handleLogout}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </div>
        </div>
      </div>

      {/* Tablet sidebar - Collapsible */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:w-20 lg:flex-col xl:w-64 transition-all duration-300 ${isTablet ? 'lg:w-20' : 'xl:w-64'}`}>
        <div className="flex flex-1 flex-col min-h-0 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 shadow-2xl">
          <SidebarContent 
            navigation={navigation} 
            user={user} 
            onLogout={handleLogout}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        </div>
      </div>

      {/* Desktop sidebar - Full width */}
      <div className="hidden xl:fixed xl:inset-y-0 xl:flex xl:w-64 xl:flex-col">
        <div className="flex flex-1 flex-col min-h-0 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 shadow-2xl">
          <SidebarContent 
            navigation={navigation} 
            user={user} 
            onLogout={handleLogout}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        </div>
      </div>

      {/* Main content area with responsive padding */}
      <div className={`
        ${isMobile ? 'pl-0' : ''}
        ${isTablet ? 'lg:pl-20' : ''}
        ${!isMobile && !isTablet ? 'xl:pl-64' : ''}
      `}>
        {/* Mobile header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm lg:hidden border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
                  <img 
                    src="/logo.png" 
                    alt="Glow & Grace Salon" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Scissors className="w-4 h-4 text-indigo-600 hidden" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Glow & Grace</h1>
                  <p className="text-xs text-gray-500">Salon</p>
                </div>
              </div>
            </div>
            
            {/* Mobile user info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden xs:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
              <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet/Desktop header */}
        <div className="hidden lg:block sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Home className="w-4 h-4" />
                <span>/</span>
                <span className="text-indigo-600 font-medium">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1">
          <div className="py-4 md:py-6">
            <div className={`
              mx-auto
              ${isMobile ? 'px-3' : ''}
              ${isTablet ? 'px-5' : ''}
              ${!isMobile && !isTablet ? 'px-6' : ''}
              max-w-7xl
            `}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarContent: React.FC<{
  navigation: any[];
  user: any;
  onLogout: () => void;
  isMobile: boolean;
  isTablet: boolean;
}> = ({ navigation, user, onLogout, isMobile, isTablet }) => {
  const location = useLocation();

  return (
    <>
      {/* Logo/Brand section */}
      <div className="flex flex-1 flex-col pt-6 pb-4 overflow-y-auto">
        {/* Brand/Logo - Different layouts for different screens */}
        <div className={`flex items-center ${isTablet ? 'justify-center px-2' : 'px-4'} ${isMobile ? 'px-4' : ''}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/salon.png" 
                  alt="Glow & Grace Salon" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Scissors className="w-6 h-6 text-indigo-600 hidden" />
              </div>
            </div>
            {/* Hide text on tablet, show on mobile and desktop */}
            <div className={`${isTablet ? 'hidden' : 'ml-3'}`}>
              <h1 className="text-lg font-semibold text-white">Glow & Grace</h1>
              <p className="text-sm text-indigo-200">Salon</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`mt-8 flex-1 space-y-1 ${isTablet ? 'px-2' : 'px-3'}`}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center rounded-lg transition-all duration-200
                  ${isTablet ? 'justify-center px-2 py-3' : 'px-3 py-2.5'}
                  ${isMobile ? 'px-3 py-2.5' : ''}
                  ${
                    isActive
                      ? 'bg-white text-indigo-900 shadow-lg transform scale-105'
                      : 'text-indigo-100 hover:bg-indigo-800 hover:text-white hover:shadow-md'
                  }
                `}
                title={isTablet ? item.name : ''}
              >
                <Icon
                  className={`
                    flex-shrink-0
                    ${isTablet ? 'h-6 w-6' : 'h-5 w-5 mr-3'}
                    ${isMobile ? 'h-5 w-5 mr-3' : ''}
                    ${
                      isActive 
                        ? 'text-indigo-600' 
                        : 'text-indigo-300 group-hover:text-indigo-100'
                    }
                  `}
                />
                {/* Hide text on tablet */}
                {!isTablet && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
                
                {/* Tooltip for tablet view */}
                {isTablet && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User section */}
      <div className="flex-shrink-0 sticky bottom-0 bg-indigo-950 border-t border-indigo-800 p-4 z-10">
        <div className={`flex items-center w-full ${isTablet ? 'justify-center' : ''}`}>
          {/* User avatar */}
          <div>
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-sm font-medium text-white">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* User info - Hidden on tablet */}
          {!isTablet && (
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-indigo-300 capitalize truncate">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          )}
          
          {/* Logout button */}
          <button
            onClick={onLogout}
            className={`
              flex-shrink-0 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-800 transition-colors duration-150
              ${isTablet ? 'p-2 ml-2' : 'p-2 ml-2'}
            `}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tablet user info tooltip */}
        {isTablet && (
          <div className="absolute left-full bottom-4 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
            <p className="font-medium">{user?.name}</p>
            <p className="capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Layout;