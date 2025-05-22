
import { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const AuthLayout = () => {
  const { animationsEnabled } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    // Adding a subtle animation to the background
    document.body.classList.add('bg-animate');
    
    return () => {
      document.body.classList.remove('bg-animate');
    };
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 ${animationsEnabled ? 'animate-fade-in' : ''}`}>
      <div className="max-w-md w-full space-y-8">
        <div className={`text-center ${animationsEnabled ? 'animate-fade-in [animation-delay:100ms]' : ''}`}>
          <Link to="/" className="inline-block">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white hover:scale-105 transition-transform">
              Property Management
            </h2>
          </Link>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your properties and users efficiently
          </p>
        </div>
        <div className={`bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 ${animationsEnabled ? 'animate-scale-in [animation-delay:200ms]' : ''}`}>
          <Outlet />
        </div>
        
        <div className={`text-center text-sm ${animationsEnabled ? 'animate-fade-in [animation-delay:300ms]' : ''}`}>
          <p className="text-gray-500 dark:text-gray-400">
            &copy; 2025 Property Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
