import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Products';
import Gallery from '@/components/Gallery';
import OrderForm from '@/components/OrderForm';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/AdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'site' | 'admin'>('site');

  useEffect(() => {
    const handleLocation = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('site');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSite = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('site');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'admin') {
    return <AdminDashboard onBackToSite={navigateToSite} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onOpenAdmin={navigateToAdmin} />
      <main>
        <Hero />
        <About />
        <Products />
        <Gallery />
        <OrderForm />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
