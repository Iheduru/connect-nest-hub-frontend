
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Property Management <span className="block">Made Simple</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A comprehensive platform for property listing and user management with secure authentication and verification.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="rounded-md shadow">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
              <div className="ml-3 rounded-md shadow">
                <Link
                  to="/properties"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  View Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Comprehensive features designed for property management efficiency.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="rounded-full bg-brand-primary bg-opacity-10 p-3 w-12 h-12 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-brand-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Secure Authentication</h3>
              <p className="mt-2 text-base text-gray-500">
                Multi-layered security with email verification and two-factor authentication for administrators.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="rounded-full bg-brand-secondary bg-opacity-10 p-3 w-12 h-12 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-brand-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">KYC Verification</h3>
              <p className="mt-2 text-base text-gray-500">
                Built-in Know Your Customer verification process with document upload and approval workflow.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="rounded-full bg-brand-success bg-opacity-10 p-3 w-12 h-12 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-brand-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Profile Management</h3>
              <p className="mt-2 text-base text-gray-500">
                Comprehensive user profile management with image uploads and public profile visibility.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/about"
              className="inline-flex items-center text-brand-primary hover:text-brand-primary/80 font-medium"
            >
              Learn more about our features
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-primary rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:py-16 lg:px-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                  <span className="block">Ready to get started?</span>
                  <span className="block">Create your account today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-indigo-100">
                  Join our platform and experience seamless property management.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="rounded-md shadow">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-brand-primary bg-white hover:bg-gray-50"
                  >
                    Register Now
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow">
                  <Link
                    to="/contact"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
