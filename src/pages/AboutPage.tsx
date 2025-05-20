
import { Building, Users, Award, Clock, Shield, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">About PropManage</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're revolutionizing the way you buy, sell, and rent properties with our innovative platform.
        </p>
      </div>
      
      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4 animate-fade-in [animation-delay:200ms]">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            PropManage aims to simplify property transactions by creating a transparent, secure, and 
            efficient platform for buyers, sellers, landlords, and tenants. We believe everyone deserves 
            a seamless experience when finding their next home or investment.
          </p>
        </div>
        
        <div className="space-y-4 animate-fade-in [animation-delay:400ms]">
          <h2 className="text-2xl font-bold">Our Vision</h2>
          <p className="text-muted-foreground">
            To become the leading property marketplace, known for innovation, trust, and exceptional 
            user experience. We envision a world where property transactions are stress-free, 
            accessible, and enjoyable for everyone involved.
          </p>
        </div>
      </div>
      
      {/* Our Values */}
      <div className="mb-16 animate-fade-in [animation-delay:600ms]">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trust & Transparency</h3>
                <p className="text-muted-foreground">
                  We maintain open communication and honest practices in all our dealings.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in every aspect of our service and platform.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Customer First</h3>
                <p className="text-muted-foreground">
                  Our customers' needs and satisfaction are at the heart of everything we do.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Story & Timeline */}
      <div className="mb-16 animate-fade-in [animation-delay:800ms]">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Journey</h2>
        <div className="space-y-8 relative before:content-[''] before:absolute before:left-1/2 before:-ml-0.5 before:w-0.5 before:h-full before:bg-gray-200">
          <div className="relative pl-8 md:ml-[50%]">
            <div className="absolute left-0 md:left-[-8px] top-5 h-4 w-4 rounded-full bg-brand-primary"></div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-brand-primary mr-2" />
                <span className="text-brand-primary font-medium">2020</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Foundation</h3>
              <p className="text-muted-foreground">PropManage was founded with a vision to transform the property market.</p>
            </div>
          </div>
          
          <div className="relative pr-8 md:mr-[50%] md:text-right">
            <div className="absolute right-0 md:right-[-8px] top-5 h-4 w-4 rounded-full bg-brand-primary"></div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-2 justify-start md:justify-end">
                <Clock className="h-5 w-5 text-brand-primary mr-2" />
                <span className="text-brand-primary font-medium">2022</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Expansion</h3>
              <p className="text-muted-foreground">Expanded our services to multiple cities and introduced new features.</p>
            </div>
          </div>
          
          <div className="relative pl-8 md:ml-[50%]">
            <div className="absolute left-0 md:left-[-8px] top-5 h-4 w-4 rounded-full bg-brand-primary"></div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-brand-primary mr-2" />
                <span className="text-brand-primary font-medium">2024</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Going National</h3>
              <p className="text-muted-foreground">Launched nationwide operations with advanced KYC verification for enhanced security.</p>
            </div>
          </div>
          
          <div className="relative pr-8 md:mr-[50%] md:text-right">
            <div className="absolute right-0 md:right-[-8px] top-5 h-4 w-4 rounded-full bg-brand-primary"></div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-2 justify-start md:justify-end">
                <Clock className="h-5 w-5 text-brand-primary mr-2" />
                <span className="text-brand-primary font-medium">2025</span>
              </div>
              <h3 className="text-lg font-bold mb-2">The Future</h3>
              <p className="text-muted-foreground">Continuously innovating to provide the best property platform experience.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team */}
      <div className="animate-fade-in [animation-delay:1000ms]">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Leadership Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center hover-scale">
            <div className="h-40 w-40 mx-auto rounded-full overflow-hidden mb-4">
              <img src="https://source.unsplash.com/photo-1582562124811-c09040d0a901" alt="Team Member" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold">Jane Smith</h3>
            <p className="text-brand-primary">CEO & Founder</p>
          </div>
          
          <div className="text-center hover-scale">
            <div className="h-40 w-40 mx-auto rounded-full overflow-hidden mb-4">
              <img src="https://source.unsplash.com/photo-1618160702438-9b02ab6515c9" alt="Team Member" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold">John Davis</h3>
            <p className="text-brand-primary">CTO</p>
          </div>
          
          <div className="text-center hover-scale">
            <div className="h-40 w-40 mx-auto rounded-full overflow-hidden mb-4">
              <img src="https://source.unsplash.com/photo-1721322800607-8c38375eef04" alt="Team Member" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold">Sarah Johnson</h3>
            <p className="text-brand-primary">Head of Operations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
