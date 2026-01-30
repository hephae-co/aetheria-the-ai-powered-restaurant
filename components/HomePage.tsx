import React from 'react';
import Menu from './Menu';
import Reviews from './Reviews';
import MenuChatbot from './MenuChatbot';
import WaitTimeWidget from './WaitTimeWidget';
import PromotionsWidget from './PromotionsWidget';
import AIInsight from './AIInsight';

const HomePage: React.FC = () => (
    <div className="flex flex-col space-y-12">
      {/* AI Concierge Container (Styled but no holographic effect here) */}
      <div className="bg-primary rounded-lg px-12 py-6 shadow-md w-full relative">
        <h2 className="text-3xl font-bold font-serif mb-8 text-accent text-center">AI Concierge</h2>

        {/* New holographic wrapper specifically for MenuChatbot */}
        <div className="relative group mx-auto max-w-2xl">
            {/* Holographic Border Effect */}
            <div className={'absolute -inset-px bg-gradient-to-br from-accent/50 to-purple-500/50 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse'}></div>
            <MenuChatbot>
              <AIInsight title="Gemini-Powered Recommendations">
                <p>
                  This chatbot uses Google's Gemini AI model, accessed via Vertex AI,
                  to understand your preferences and provide personalized menu
                  recommendations. It processes your natural language queries and
                  matches them with our menu items, offering descriptions and
                  suggestions tailored to your requests.
                </p>
                <p>
                  The AI helps you discover new dishes, find options that fit your
                  dietary needs, and enhances your overall ordering experience by
                  making it more interactive and intuitive.
                </p>
              </AIInsight>
            </MenuChatbot>
        </div>
      </div>
      {/* AI-Powered Widgets Container */}
      <div className="bg-primary rounded-lg px-12 py-6 shadow-md w-full relative">
        <h2 className="text-3xl font-bold font-serif mb-8 text-accent text-center">AI-Powered Widgets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">

          <div className="relative group">
            {/* Holographic Border Effect */}
            <div className={'absolute -inset-px bg-gradient-to-br from-accent/50 to-blue-500/50 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse'}></div>
            <WaitTimeWidget>
              <AIInsight title="Predictive Wait Times">
                <p>An AI is predicting current wait time based on historical patterns.</p>
              </AIInsight>
            </WaitTimeWidget>
          </div>

          <div className="relative group">
            {/* Holographic Border Effect */}
            <div className="absolute -inset-px bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <PromotionsWidget>
              <AIInsight title="Personalized Promotions">
                <p>Show customized specials for returning customers.</p>
              </AIInsight>
            </PromotionsWidget>
          </div>

        </div>
      </div>

      <Menu />
      {/* AI-Powered Hospitality Container */}
      <div className="bg-primary rounded-lg px-12 py-6 shadow-md w-full relative">
        <h2 className="text-3xl font-bold font-serif mb-8 text-accent text-center">AI-Powered Hospitality</h2>
        <Reviews />
      </div>
    </div>
);

export default HomePage;
