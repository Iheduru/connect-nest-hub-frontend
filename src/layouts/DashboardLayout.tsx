
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleSidebar } from '@/store/slices/uiSlice';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const DashboardLayout = () => {
  const { isSidebarOpen } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar isOpen={isSidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onToggleSidebar={handleToggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
