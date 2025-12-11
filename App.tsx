
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import MenuChatbot from './components/MenuChatbot';
import WaitTimeWidget from './components/WaitTimeWidget';
import PromotionsWidget from './components/PromotionsWidget';
import AIInsight from './components/AIInsight'; // Import AIInsight component
import AIBanner from './components/AIBanner'; // Import AIBanner component
import { MENU_ITEMS } from './constants';

const App: React.FC = () => {
  const [currentBackground, setCurrentBackground] = useState('');

  useEffect(() => {
    // Filter out items without an initialImage
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

  return (
    <div
      className="min-h-screen font-sans bg-cover bg-center transition-all duration-1000 relative"
      style={{ backgroundImage: `url(${currentBackground})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div> {/* Overlay for readability */}
      <Header />
      <AIBanner /> {/* Render AIBanner below the Header */}
      
      <main className="pt-24 relative z-10"> {/* Adjusted padding-top */}
        <div className="w-full max-w-[95%] mx-auto px-4 md:px-8 mb-12 flex flex-col gap-8 items-center">
           
           {/* Row 1: Chatbot (Full Width) */}
           <div className="w-full flex flex-col gap-3">
              <MenuChatbot isFullScreen={true} />
              <div className="flex justify-end px-2">
                 <AIInsight title="Gemini-Powered Recommendations">
                    <p>This chatbot uses Google's Gemini AI model, accessed via Vertex AI, to understand your preferences and provide personalized menu recommendations. It processes your natural language queries and matches them with our menu items, offering descriptions and suggestions tailored to your requests.</p>
                    <p>The AI helps you discover new dishes, find options that fit your dietary needs, and enhances your overall ordering experience by making it more interactive and intuitive.</p>
                 </AIInsight>
              </div>
           </div>

           {/* Row 2: Widgets (Side-by-Side, Centered) */}
           <div className="w-full flex flex-row flex-wrap justify-center items-start gap-8">
             
             {/* Wait Time Widget Section */}
             <div className="flex flex-col gap-2 items-center">
               <WaitTimeWidget />
               <AIInsight title="Predictive Wait Times">
                   <p>An AI is predicting current wait time based on historical patterns.</p>
               </AIInsight>
             </div>

             {/* Promotions Widget Section */}
             <div className="flex flex-col gap-2 items-center">
               <PromotionsWidget />
               <AIInsight title="Personalized Promotions">
                  <p>Show customized specials for returning customers.</p>
               </AIInsight>
             </div>

           </div>

        </div>
        <Menu />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
};

export default App;
