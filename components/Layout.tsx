import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import NeuralBackground from './NeuralBackground';

const Layout: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/' && !location.hash) {
      // If on the homepage and no specific hash, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (location.pathname === '/ai-examples' && !location.hash) {
      // If on the AI Examples page and no specific hash, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (location.hash) {
      // If there's a hash, scroll to the element
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure the element is rendered
      }
    }
  }, [location]);

  return (
    <div
      className="min-h-screen font-sans bg-black text-white relative"
    >
      <NeuralBackground />
      <Header />

      <main className="pt-24 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          <Outlet /> {/* This is where the routed components will be rendered */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
