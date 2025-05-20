
import { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions about our properties or services? We're here to help!
        </p>
      </div>
      
      {/* Contact Methods Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="animate-fade-in [animation-delay:200ms] hover-scale">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Phone</h3>
            <p className="text-muted-foreground mb-4">Our team is available during business hours</p>
            <a href="tel:+11234567890" className="text-brand-primary hover:underline">+1 (123) 456-7890</a>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in [animation-delay:300ms] hover-scale">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-muted-foreground mb-4">We'll respond within 24 hours</p>
            <a href="mailto:info@propmanage.com" className="text-brand-primary hover:underline">info@propmanage.com</a>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in [animation-delay:400ms] hover-scale">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Office</h3>
            <p className="text-muted-foreground mb-4">Visit our headquarters</p>
            <address className="not-italic text-center">
              1234 Property Street<br />
              Real Estate City, RE 12345
            </address>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Contact Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Form */}
        <div className="animate-fade-in [animation-delay:500ms]">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="John Doe" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="john@example.com" 
                    required
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="+1 (123) 456-7890" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    placeholder="Property Inquiry" 
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">Message</label>
                <Textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  placeholder="Your message here..." 
                  rows={5} 
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Map and Info */}
        <div className="space-y-6 animate-fade-in [animation-delay:600ms]">
          <div className="h-[300px] bg-gray-200 rounded-lg overflow-hidden relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1630588868675!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="Office Location"
            ></iframe>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Business Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Monday - Friday</span>
                  </div>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Saturday</span>
                  </div>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Sunday</span>
                  </div>
                  <span>Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Need Immediate Assistance?</h3>
              <p className="text-muted-foreground mb-4">
                For urgent inquiries, our customer support team is just a call away.
              </p>
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Call Our Hotline
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* FAQ */}
      <div className="animate-fade-in [animation-delay:700ms]">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">How do I schedule a property viewing?</h3>
              <p className="text-muted-foreground">
                You can schedule a viewing directly through our platform by clicking the "Schedule Viewing" button on any property listing, or by contacting our team via phone or email.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">What documents do I need for KYC verification?</h3>
              <p className="text-muted-foreground">
                For KYC verification, you'll need a government-issued ID (passport, driver's license), proof of address (utility bill), and in some cases, additional documentation depending on your location.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">How long does the verification process take?</h3>
              <p className="text-muted-foreground">
                Our verification process typically takes 24-48 hours once all required documents are submitted correctly.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Can I list my property on your platform?</h3>
              <p className="text-muted-foreground">
                Yes! Property owners can list their properties by creating an account, completing the KYC verification, and submitting property details through our listing form.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
