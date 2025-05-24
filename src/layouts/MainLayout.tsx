
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const MainLayout = () => {
  const { animationsEnabled } = useSelector((state: RootState) => state.ui);
  
  useEffect(() => {
    // Add animation class to the body when the layout mounts
    document.body.classList.add('page-transition');
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('page-transition');
    };
  }, []);

  return (
    <div className={`flex flex-col min-h-screen ${animationsEnabled ? 'animate-fade-in' : ''}`}>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
