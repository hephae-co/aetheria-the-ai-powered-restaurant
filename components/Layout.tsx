import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { MENU_ITEMS } from '../constants';

const Layout: React.FC = () => {
  const [currentBackground, setCurrentBackground] = useState('');
  const location = useLocation();

  useEffect(() => {
    const images = MENU_ITEMS.filter(item => item.initialImage).map(item => item.initialImage);
    if (images.length === 0) return;

    let currentIndex = 0;
    setCurrentBackground(images[currentIndex]);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setCurrentBackground(images[currentIndex]);
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, []);

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
      className="min-h-screen font-sans bg-cover bg-center transition-all duration-1000 relative"
      style={{ backgroundImage: `url(${currentBackground})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div> {/* Overlay for readability */}
      <Header />
      
      <main className="pt-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet /> {/* This is where the routed components will be rendered */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
