
import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/#menu', label: 'Menu' },
    { to: '/#reviews', label: 'Reviews' },
    { to: '/ai-examples', label: 'AI Examples' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-primary shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-accent font-serif">Aetheria</h1>
        <nav>
          <ul className="flex space-x-6">
            {navLinks.map(link => (
              <li key={link.to}>
                <NavLink 
                  to={link.to} 
                  className={({ isActive }) => 
                    "text-text-primary hover:text-accent transition-colors duration-300 relative group" +
                    (isActive ? " text-accent" : "")
                  }
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
