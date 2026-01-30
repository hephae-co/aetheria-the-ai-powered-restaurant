import React, { useState } from 'react';

interface AIInsightProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const AiIcon: React.FC<{className?: string}> = ({ className }) => (
    // Sparkles icon for "AI Magic"
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || 'w-6 h-6'}>
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
    </svg>
);

const AIInsight: React.FC<AIInsightProps> = ({ title, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={className || 'group w-fit flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 hover:border-accent/50 rounded-full px-3 py-1.5 transition-all duration-300 hover:bg-black/60'}
        aria-label="AI Insight"
      >
        <div className="p-1 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
            <AiIcon className="w-3.5 h-3.5 text-accent" />
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-white/60 group-hover:text-accent transition-colors">AI Insight</span>
      </button>

      {isOpen && (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in"
            onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-primary rounded-lg shadow-2xl p-8 m-4 max-w-lg w-full border border-secondary transform transition-all duration-300 animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-accent flex items-center">
                <AiIcon className="w-6 h-6 mr-3" />
                {title}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-text-primary"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="text-text-primary space-y-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIInsight;
