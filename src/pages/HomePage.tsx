
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Users, Building, Shield, CheckCircle, TrendingUp, MapPin } from 'lucide-react';
import AnimatedContainer from '@/components/ui/animated-container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <AnimatedContainer animation="fade-in" className="w-full">
        <section className="bg-gradient-to-r from-indigo-600 to-blue-500 py-20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight">
                Property Management <span className="block">Made Simple</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Nigeria's premier platform for property listing and user management with secure authentication and verification.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <div className="rounded-md shadow">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-700 transition-all hover:scale-105 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="rounded-md shadow">
                  <Link
                    to="/properties"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 transition-all hover:scale-105 md:py-4 md:text-lg md:px-10"
                  >
                    View Properties
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedContainer>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedContainer animation="fade-in" delay={100}>
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-brand-primary">5,000+</div>
                <div className="text-gray-600">Properties Listed</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-brand-primary">2,500+</div>
                <div className="text-gray-600">Verified Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-brand-primary">₦50B+</div>
                <div className="text-gray-600">Property Value</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-brand-primary">25+</div>
                <div className="text-gray-600">Cities Covered</div>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedContainer animation="fade-in" delay={200} className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Comprehensive features designed for Nigeria's property management needs.
            </p>
          </AnimatedContainer>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <AnimatedContainer animation="fade-in" delay={300}>
              <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-2 duration-300 h-full border border-gray-100">
                <div className="rounded-full bg-brand-primary bg-opacity-10 p-3 w-12 h-12 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">Secure Authentication</h3>
                <p className="mt-3 text-base text-gray-500">
                  Multi-layered security with email verification and two-factor authentication for administrators.
                </p>
              </Card>
            </AnimatedContainer>

            {/* Feature 2 */}
            <AnimatedContainer animation="fade-in" delay={400}>
              <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-2 duration-300 h-full border border-gray-100">
                <div className="rounded-full bg-brand-secondary bg-opacity-10 p-3 w-12 h-12 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-brand-secondary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">KYC Verification</h3>
                <p className="mt-3 text-base text-gray-500">
                  Built-in Know Your Customer verification process with document upload and approval workflow.
                </p>
              </Card>
            </AnimatedContainer>

            {/* Feature 3 */}
            <AnimatedContainer animation="fade-in" delay={500}>
              <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-2 duration-300 h-full border border-gray-100">
                <div className="rounded-full bg-brand-success bg-opacity-10 p-3 w-12 h-12 flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-success" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">Profile Management</h3>
                <p className="mt-3 text-base text-gray-500">
                  Comprehensive user profile management with image uploads and public profile visibility.
                </p>
              </Card>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedContainer animation="fade-in" delay={300} className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Property Types We Cover
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              From residential homes to commercial spaces across Nigeria.
            </p>
          </AnimatedContainer>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            <AnimatedContainer animation="fade-in" delay={400}>
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <Building className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Apartments</h3>
                <p className="text-gray-600">Modern apartments in prime locations</p>
                <p className="text-sm text-brand-primary mt-2">From ₦500K/year</p>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer animation="fade-in" delay={500}>
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <Building className="w-12 h-12 text-brand-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Houses</h3>
                <p className="text-gray-600">Family homes with gardens and space</p>
                <p className="text-sm text-brand-primary mt-2">From ₦2M/year</p>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer animation="fade-in" delay={600}>
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <Building className="w-12 h-12 text-brand-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Commercial</h3>
                <p className="text-gray-600">Office spaces and retail locations</p>
                <p className="text-sm text-brand-primary mt-2">From ₦1M/year</p>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer animation="fade-in" delay={700}>
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <MapPin className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Land</h3>
                <p className="text-gray-600">Plots and lots for development</p>
                <p className="text-sm text-brand-primary mt-2">From ₦5M</p>
              </Card>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedContainer animation="fade-in" delay={200} className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Trusted by property owners and seekers across Nigeria.
            </p>
          </AnimatedContainer>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <AnimatedContainer animation="fade-in" delay={400}>
              <Card className="p-6 h-full">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The verification process gave me confidence in the platform. Found my dream apartment in Lagos within a week!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">Adaora Okafor</p>
                    <p className="text-sm text-gray-500">Lagos, Nigeria</p>
                  </div>
                </div>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer animation="fade-in" delay={500}>
              <Card className="p-6 h-full">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a property owner, the management tools are excellent. The KYC verification ensures quality tenants."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">Musa Ibrahim</p>
                    <p className="text-sm text-gray-500">Abuja, Nigeria</p>
                  </div>
                </div>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer animation="fade-in" delay={600}>
              <Card className="p-6 h-full">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The platform's security features and user-friendly interface made property hunting stress-free."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-brand-success rounded-full flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">Chioma Nwosu</p>
                    <p className="text-sm text-gray-500">Port Harcourt, Nigeria</p>
                  </div>
                </div>
              </Card>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedContainer animation="fade-in" delay={200} className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Simple steps to find or list your perfect property.
            </p>
          </AnimatedContainer>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <AnimatedContainer animation="fade-in" delay={400}>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Create Account</h3>
                <p className="text-gray-600">
                  Sign up and complete your profile with our secure verification process.
                </p>
              </div>
            </AnimatedContainer>

            <AnimatedContainer animation="fade-in" delay={500}>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Browse or List</h3>
                <p className="text-gray-600">
                  Search through verified properties or list your own with detailed information.
                </p>
              </div>
            </AnimatedContainer>

            <AnimatedContainer animation="fade-in" delay={600}>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-success rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Connect & Transact</h3>
                <p className="text-gray-600">
                  Connect with verified users and complete transactions with confidence.
                </p>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <AnimatedContainer animation="fade-in" delay={700}>
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-brand-primary rounded-lg shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
              <div className="px-6 py-12 sm:px-12 lg:py-16 lg:px-16 lg:flex lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                    <span className="block">Ready to get started?</span>
                    <span className="block">Join Nigeria's trusted property platform.</span>
                  </h2>
                  <p className="mt-4 text-lg leading-6 text-indigo-100">
                    Experience seamless property management with verified users and secure transactions.
                  </p>
                </div>
                <div className="mt-8 lg:mt-0 lg:ml-8 space-y-4">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-brand-primary bg-white hover:bg-gray-50 transition-all hover:scale-105"
                    >
                      Register Now
                    </Link>
                  </div>
                  <div className="rounded-md shadow">
                    <Link
                      to="/contact"
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 transition-all hover:scale-105"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedContainer>
    </div>
  );
};

export default HomePage;
