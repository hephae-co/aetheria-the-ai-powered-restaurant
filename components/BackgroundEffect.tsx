import React from 'react';

const BackgroundEffect: React.FC = () => {
  // Create a grid of dots
  const dots = Array.from({ length: 50 }).map((_, i) => (
    <div
      key={`dot-${i}`}
      className="absolute rounded-full bg-accent/10"
      style={{
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `twinkle ${Math.random() * 5 + 3}s linear infinite`,
      }}
    />
  ));

  // Create some lines
  const lines = Array.from({ length: 10 }).map((_, i) => (
    <div
      key={`line-${i}`}
      className="absolute h-px bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0"
      style={{
        width: `${Math.random() * 20 + 10}%`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100 - 50}%`,
        animation: `strafe ${Math.random() * 20 + 20}s linear infinite`,
      }}
    />
  ));

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {dots}
      {lines}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
          @keyframes strafe {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}
      </style>
    </div>
  );
};

export default BackgroundEffect;
