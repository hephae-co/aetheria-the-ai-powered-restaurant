import React, { useState, useEffect } from 'react';

const WaitTimeWidget: React.FC = () => {
  const [partySize, setPartySize] = useState<number>(4);
  const [waitTime, setWaitTime] = useState<number>(0);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  // Simulate wait time calculation
  const calculateWaitTime = (size: number) => {
    // Base calculation: 15 mins base + 5 mins per person
    // Add some randomness for "simulation" realism
    const base = 15;
    const perPerson = 5;
    const randomFactor = Math.floor(Math.random() * 10); 
    
    // Simulate busy times (e.g., if it's "busy" add more time)
    // For this demo, we'll just use a simple multiplier for larger groups
    const sizeMultiplier = size > 6 ? 1.5 : 1;

    return Math.round((base + (size * perPerson) + randomFactor) * sizeMultiplier);
  };

  useEffect(() => {
    // Recalculate when party size changes
    const time = calculateWaitTime(partySize);
    setWaitTime(time);
    setIsBusy(time > 45); // Consider it "busy" if wait is over 45 mins
  }, [partySize]);

  return (
    <div className="relative w-64 group h-full">
      {/* Holographic Border Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br from-accent/50 to-blue-500/50 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse`}></div>
      
      <div className="relative bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl flex flex-col gap-3 h-full justify-between">
        
        {/* Header with Status Dot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isBusy ? 'bg-red-400' : 'bg-green-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isBusy ? 'bg-red-500' : 'bg-green-500'}`}></span>
            </span>
            <h3 className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">Wait Time</h3>
          </div>
          <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${isBusy ? 'text-red-300 border-red-500/30 bg-red-500/10' : 'text-green-300 border-green-500/30 bg-green-500/10'} uppercase`}>
            {isBusy ? 'High Traffic' : 'Live'}
          </div>
        </div>

        {/* Time Display */}
        <div className="flex items-baseline justify-center py-1">
          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">
            {waitTime}
          </span>
          <span className="text-xs font-medium text-accent ml-1">min</span>
        </div>

        {/* Party Size Control */}
        <div className="flex items-center justify-between bg-white/5 rounded-lg p-1.5 border border-white/5">
          <span className="text-[10px] text-white/40 font-medium pl-1 uppercase">Party</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPartySize(Math.max(1, partySize - 1))}
              className="w-5 h-5 flex items-center justify-center rounded bg-white/10 text-white hover:bg-accent hover:text-black transition-colors"
            >
              -
            </button>
            <span className="text-sm font-bold text-white w-4 text-center">{partySize}</span>
            <button 
              onClick={() => setPartySize(Math.min(20, partySize + 1))}
              className="w-5 h-5 flex items-center justify-center rounded bg-white/10 text-white hover:bg-accent hover:text-black transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitTimeWidget;