import React, { PropsWithChildren } from 'react';

const PromotionsWidget: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative group h-full rounded-lg">

      
      <div className="relative h-full bg-black/80 backdrop-blur-xl p-4 rounded-lg border border-white/10 shadow-2xl flex flex-col justify-between gap-3">
        
        <div className="absolute top-0 right-0 z-10 p-1">{children}</div>

        {/* Header */}
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="bg-purple-500/10 text-purple-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-500/20 uppercase animate-pulse">
                    Chef's Special
                </span>
            </div>
            <h4 className="text-base font-bold text-white leading-tight">Nebula Noodle Soup</h4>
        </div>

        {/* Image/Visual */}
        <div className="w-full flex-grow rounded-lg bg-cover bg-center min-h-[100px]" style={{ backgroundImage: "url('https://storage.googleapis.com/hephae/aetheria/data/Nebula Noodle Soup.png')" }}></div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-bold text-white">$19</span>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:bg-purple-400 hover:text-white transition-colors shadow-lg hover:shadow-purple-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
            </button>
        </div>

      </div>
    </div>
  );
};

export default PromotionsWidget;