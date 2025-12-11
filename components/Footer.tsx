
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary border-t border-secondary py-8">
      <div className="container mx-auto px-6 text-center text-text-secondary">
        <p className="text-xl font-bold text-accent font-serif mb-2">Aetheria</p>
        <p>123 Innovation Drive, Tech City</p>
        <p>(555) 123-4567</p>
        <div className="flex justify-center space-x-6 my-4">
          <a href="#" className="hover:text-accent transition-colors">Facebook</a>
          <a href="#" className="hover:text-accent transition-colors">Instagram</a>
          <a href="#" className="hover:text-accent transition-colors">Twitter</a>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Aetheria. All Rights Reserved. An AI-powered demonstration.</p>
      </div>
    </footer>
  );
};

export default Footer;
