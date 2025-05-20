
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  User,
  Home,
  Settings,
  FileText,
  Users,
  Shield,
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar = ({ isOpen }: DashboardSidebarProps) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'admin';

  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };

  return (
    <aside
      className={`bg-gray-800 text-white fixed inset-y-0 left-0 z-10 transition-all duration-300 ease-in-out lg:relative ${
        isOpen ? 'w-64' : 'w-0 lg:w-16'
      } overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <h1 className={`text-xl font-bold transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
            PropManage
          </h1>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActiveRoute('/dashboard')
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Home className="h-5 w-5" />
                <span className={`ml-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActiveRoute('/profile')
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <User className="h-5 w-5" />
                <span className={`ml-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                  Profile
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/kyc-verification"
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActiveRoute('/kyc-verification')
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span className={`ml-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                  KYC Verification
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActiveRoute('/settings')
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className={`ml-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                  Settings
                </span>
              </Link>
            </li>

            {isAdmin && (
              <>
                <li className="pt-4 pb-2">
                  <div className={`px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                    Admin
                  </div>
                </li>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      isActiveRoute('/admin/dashboard')
                        ? 'bg-brand-primary text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    <span className={`ml-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                      Admin Dashboard
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/users"
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      isActiveRoute('/admin/users')
                        ? 'bg-brand-primary text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span className={`ml-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                      Manage Users
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/kyc"
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      isActiveRoute('/admin/kyc')
                        ? 'bg-brand-primary text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                    <span className={`ml-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                      KYC Management
                    </span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
