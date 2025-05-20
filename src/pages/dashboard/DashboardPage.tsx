
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { BarChart3, Users, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {greeting}, {user?.first_name || 'User'}! Welcome to your dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <Card className="animate-fade-in [animation-delay:200ms]">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in [animation-delay:300ms]">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in [animation-delay:400ms]">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <FileCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">KYC Status</p>
                <h3 className="text-2xl font-bold">Pending</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 animate-fade-in [animation-delay:500ms]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground">
              No recent activity to display.
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in [animation-delay:600ms]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full hover-scale" variant="default">
                Create New Listing
              </Button>
              <Button className="w-full hover-scale" variant="outline">
                Update Profile
              </Button>
              <Button className="w-full hover-scale" variant="outline">
                Verify KYC
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
