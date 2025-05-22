
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Property Management System';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-5xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
                  Property Management Made Simple
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  A complete solution for property listing and user management with secure authentication.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/login')}
                  className="animate-fade-in [animation-delay:200ms] hover:scale-105 transition-transform"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/about')}
                  className="animate-fade-in [animation-delay:400ms] hover:scale-105 transition-transform"
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg bg-white dark:bg-gray-800 p-1 shadow-xl animate-fade-in [animation-delay:300ms]">
              <div className="aspect-video rounded-md bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center overflow-hidden">
                <div className="text-white text-center p-8 animate-pulse">
                  <div className="text-2xl font-bold mb-4">Property Management System</div>
                  <div className="text-lg">Secure • Efficient • User-friendly</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-24 grid gap-8 md:grid-cols-3 animate-fade-in [animation-delay:500ms]">
            <FeatureCard 
              title="User Authentication" 
              description="Secure multi-factor authentication system with email verification."
              delay={600}
            />
            <FeatureCard 
              title="Profile Management" 
              description="Complete user profile system with image uploads and public profiles."
              delay={700}
            />
            <FeatureCard 
              title="KYC Verification" 
              description="Built-in document verification system for regulatory compliance."
              delay={800}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, delay = 0 }) => (
  <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all animate-fade-in [animation-delay:${delay}ms] hover:-translate-y-1`}>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default Index;
