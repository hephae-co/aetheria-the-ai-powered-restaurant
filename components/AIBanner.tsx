import React from 'react';

const AIBanner: React.FC = () => {
  return (
    <div className="relative z-50 bg-primary text-text-primary py-3 text-center shadow-lg mb-16">
      <a 
        href="/ai-examples"
        className="text-accent hover:underline font-semibold text-lg flex items-center justify-center space-x-2"
      >
        <span>See what else AI can do for you</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </a>
    </div>
  );
};

export default AIBanner;