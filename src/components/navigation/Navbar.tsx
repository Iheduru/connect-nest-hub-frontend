
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-brand-primary text-xl font-bold">
                PropManage
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:border-brand-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/properties" className="border-transparent text-gray-500 hover:border-brand-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Properties
              </Link>
              <Link to="/about" className="border-transparent text-gray-500 hover:border-brand-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                About
              </Link>
              <Link to="/contact" className="border-transparent text-gray-500 hover:border-brand-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user?.first_name || user?.username}</span>
                <Link to="/dashboard" className="bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 flex items-center text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-500 hover:text-gray-700 flex items-center text-sm font-medium">
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Link>
                <Link to="/register" className="bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
