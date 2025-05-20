
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { Menu, User, Bell, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

const DashboardHeader = ({ onToggleSidebar }: DashboardHeaderProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 md:ml-6">
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              2
            </span>
          </button>
          
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                  {user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-700">
                    {user?.first_name || user?.username}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-1 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
