import React from 'react';
import Menu from './Menu';
import Reviews from './Reviews';
import MenuChatbot from './MenuChatbot';
import WaitTimeWidget from './WaitTimeWidget';
import PromotionsWidget from './PromotionsWidget';
import AIInsight from './AIInsight';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4">
      {/* AI Concierge */}
      <div className="w-full flex flex-col gap-3 relative">
        <MenuChatbot isFullScreen={true} />
        <div className="absolute top-0 right-0 z-10 p-2">
          <AIInsight title="Gemini-Powered Recommendations">
            <p>This chatbot uses Google's Gemini AI model, accessed via Vertex AI, to understand your preferences and provide personalized menu recommendations. It processes your natural language queries and matches them with our menu items, offering descriptions and suggestions tailored to your requests.</p>
            <p>The AI helps you discover new dishes, find options that fit your dietary needs, and enhances your overall ordering experience by making it more interactive and intuitive.</p>
          </AIInsight>
        </div>
      </div>

      {/* AI-Powered Widgets Container */}
      <div className="bg-primary rounded-lg p-6 shadow-md w-full relative">
        <h3 className="text-2xl font-bold font-serif mb-6 text-accent text-center">AI-Powered Widgets</h3>
        <div className="flex flex-row flex-wrap justify-center items-start gap-8">
          {/* Wait Time Widget Section */}
          <div className="relative flex flex-col gap-2 items-center">
            <WaitTimeWidget />
            <div className="absolute top-0 right-0 z-10 p-1">
              <AIInsight title="Predictive Wait Times">
                <p>An AI is predicting current wait time based on historical patterns.</p>
              </AIInsight>
            </div>
          </div>

          {/* Promotions Widget Section */}
          <div className="relative flex flex-col gap-2 items-center">
            <PromotionsWidget />
            <div className="absolute top-0 right-0 z-10 p-1">
              <AIInsight title="Personalized Promotions">
                <p>Show customized specials for returning customers.</p>
              </AIInsight>
            </div>
          </div>
        </div>
      </div>

      <Menu />
      <Reviews />
    </div>
  );
};

export default HomePage;
