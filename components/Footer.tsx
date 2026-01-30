import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => (
    <footer className="bg-primary border-t border-secondary py-8 mt-16 relative z-20">
      <div className="container mx-auto px-6 text-center text-text-secondary">
        <p className="text-xl font-bold text-accent font-serif mb-2">Aetheria</p>
        <p>123 Innovation Drive, Tech City</p>
        <p>(555) 123-4567</p>
        <div className="flex justify-center space-x-6 my-4">
          <a href="#" className="hover:text-accent transition-colors">Facebook</a>
          <a href="#" className="hover:text-accent transition-colors">Instagram</a>
          <a href="#" className="hover:text-accent transition-colors">Twitter</a>
        </div>

        <div className="flex flex-col items-center space-y-4 mt-6">
          {/* Navigation Links */}
          <nav className="flex items-center justify-center space-x-6 text-sm">
            <a
              href="https://hephae.co"
              className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors"
            >
              <span className="material-icons text-lg">home</span>
              <span>Home</span>
            </a>

            <span className="text-text-secondary">|</span>

            <a
              href="https://hephae.co/toolkit/hephae"
              className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors"
            >
              <span className="material-icons text-lg">apps</span>
              <span>Hephae Apps</span>
            </a>

            <span className="text-text-secondary">|</span>

            <a
              href="https://hephae.co/schedule"
              className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors"
            >
              <span className="material-icons text-lg">contact_mail</span>
              <span>Contact</span>
            </a>

            <span className="text-text-secondary hidden sm:inline">|</span>

            <a
              href="https://github.com/hephae-co/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors"
            >
              <Github size={18} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </nav>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-400">
            © 2026 hephae.co. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
);

export default Footer;
