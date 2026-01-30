import React from 'react';
import { MenuItem as MenuItemType } from '../types';

interface MenuItemProps {
  item: MenuItemType;
  isRecommended?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, isRecommended = false }) => (
    <div className={`bg-primary rounded-xl shadow-2xl overflow-hidden border transition-all duration-300 hover:scale-102 hover:shadow-glow animate-fade-in relative ${isRecommended ? 'border-accent shadow-[0_0_20px_rgba(255,215,0,0.3)] scale-105 z-10' : 'border-accent-light'}`}>
      {isRecommended && (
        <div className="absolute top-4 right-4 z-20 bg-accent text-primary px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
          ✨ Perfect Match
        </div>
      )}
      <div className="relative h-56 bg-gradient-to-br from-secondary to-primary-dark flex items-center justify-center p-2">
        {item.initialImage ? (
          <img src={item.initialImage} alt={item.name} className="w-full h-full object-cover rounded-lg border border-accent-light" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white text-lg rounded-lg border border-accent-light">
            No Image Available
          </div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col text-center">
        <h3 className="text-2xl font-bold text-accent mb-2 font-serif">{item.name}</h3>
        <p className="text-lg font-semibold text-text-primary mb-1">{item.price}</p>
        <p className="text-sm text-text-secondary mb-4 italic">{item.category}</p>
        <p className="text-text-primary text-base">{item.description}</p>
      </div>
    </div>
);

export default MenuItem;
