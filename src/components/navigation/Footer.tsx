
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">PropManage</h3>
            <p className="text-gray-300 text-sm">
              A comprehensive property listing and user management system built with the latest technologies.
            </p>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-white text-sm">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white text-sm">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white text-sm">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <address className="text-gray-300 text-sm not-italic">
              <p>1234 Property Street</p>
              <p>Real Estate City, RE 12345</p>
              <p className="mt-2">Email: info@propmanage.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-300 text-sm text-center">
            &copy; {currentYear} PropManage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
