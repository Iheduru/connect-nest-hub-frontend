
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { BarChart3, Users, FileCheck } from 'lucide-react';

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {greeting}, {user?.first_name || 'User'}! Welcome to your dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FileCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">KYC Status</p>
              <h3 className="text-2xl font-bold">Pending</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="rounded-md border">
            <div className="p-4 text-center text-muted-foreground">
              No recent activity to display.
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full py-2 px-4 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90">
              Create New Listing
            </button>
            <button className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
              Update Profile
            </button>
            <button className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
              Verify KYC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
