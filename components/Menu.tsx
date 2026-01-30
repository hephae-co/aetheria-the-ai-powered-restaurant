import { useState } from 'react'; // Import useState
import { MENU_ITEMS } from '../constants';
import MenuItem from './MenuItem';
import AIInsight from './AIInsight';
import WeatherMenuWidget from './WeatherMenuWidget';
import { refineMenuItemDescription } from '../services/geminiService'; // Import the new service
import Loader from './Loader'; // Import Loader

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [isRefining, setIsRefining] = useState(false);
  const [recommendedItems, setRecommendedItems] = useState<string[]>([]);

  const handleRefineMenu = async () => {
    setIsRefining(true);
    const refinedItems = await Promise.all(
      MENU_ITEMS.map(async (item) => {
        const refinedDescription = await refineMenuItemDescription(item);
        return { ...item, description: refinedDescription };
      }),
    );
    setMenuItems(refinedItems);
    setIsRefining(false);
  };

  return (
    <section id="menu" className="relative py-12 bg-background rounded-lg overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <AIInsight title="How AI Refines Our Menu">
            <p>
              Our menu descriptions are enhanced by Google's Gemini AI model,
              accessed via Vertex AI. The AI analyzes various culinary aspects to
              generate enticing and accurate descriptions for each dish, helping
              you make informed choices.
            </p>
            <p>Click the "Refine Menu Descriptions" button to see AI-generated descriptions for our dishes!</p>
            <button
              onClick={handleRefineMenu}
                            className="mt-4 px-6 py-3 bg-accent text-primary font-bold rounded-full
                            hover:bg-yellow-300 transition-colors duration-300 focus:outline-none
                            focus:ring-2 focus:ring-accent focus:ring-opacity-50"
              disabled={isRefining}
            >
              {isRefining ? <Loader text="Refining..." /> : 'Refine Menu Descriptions'}
            </button>
          </AIInsight>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center font-serif mb-8 text-accent">Our AI-Crafted Menu</h2>

            <div className="flex justify-center mb-8">
              <WeatherMenuWidget onRecommendations={setRecommendedItems} />
            </div>

            {isRefining && (
              <div className="flex justify-center items-center py-8">
                <Loader text="Refining menu descriptions..." />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.map((item) => (
                <MenuItem
                  key={item.name}
                  item={item}
                  isRecommended={recommendedItems.includes(item.name)}
                />
              ))}
            </div>
        </div>
    </section>
  );
};

export default Menu;
