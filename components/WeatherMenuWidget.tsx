import React, { useState, useEffect } from 'react';
import getCurrentWeather from '../services/weatherService';
import { getWeatherBasedRecommendations } from '../services/geminiService';
import Loader from './Loader';
import { MENU_ITEMS } from '../constants';

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('rain')) return '🌧️';
  if (lowerCondition.includes('cloud')) return '☁️';
  if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return '☀️';
  if (lowerCondition.includes('snow')) return '❄️';
  if (lowerCondition.includes('thunder')) return '⚡';
  return '🌤️';
};

interface WeatherMenuWidgetProps {
  onRecommendations: (recommendedItemNames: string[]) => void;
}

const WeatherMenuWidget: React.FC<WeatherMenuWidgetProps> = ({ onRecommendations }) => {
  const [weather, setWeather] = useState<{ temp: number; condition: string; city: string } | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await getCurrentWeather();
      setWeather({ temp: data.temperature, condition: data.condition, city: data.city });
    };

    fetchWeather();

    // Set initial time
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleGetRecommendations = async () => {
    if (!weather) return;
    setLoading(true);
    try {
      const recommendations = await getWeatherBasedRecommendations(
        weather.condition,
        currentTime,
        weather.temp,
        MENU_ITEMS,
      );
      onRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to get recommendations', error);
    } finally {
      setLoading(false);
    }
  };

  if (!weather) return <div className="text-white">Loading weather...</div>;

  return (
    <div className="bg-secondary/80 backdrop-blur-md p-4 rounded-xl border border-accent shadow-lg max-w-sm mx-auto mb-8 text-center animate-fade-in">
      <div className="flex justify-center items-center mb-1 text-text-secondary text-xs tracking-wider uppercase opacity-70">
        <span className="mr-2">{weather.city}</span> • <span className="ml-2">{currentTime}</span>
      </div>
      <div className="flex items-center justify-center space-x-4 mb-4">
        <div className="text-4xl">{getWeatherIcon(weather.condition)}</div>
        <div className="text-left">
          <div className="text-2xl font-bold text-accent">{weather.temp}°C</div>
          <div className="text-text-secondary capitalize">{weather.condition}</div>
        </div>
      </div>

      <button
        onClick={handleGetRecommendations}
        disabled={loading}
        className="w-full py-2 px-4 bg-accent text-primary font-bold rounded-lg
        hover:bg-yellow-400 transition-all transform hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader text="Consulting AI Chef..." /> : 'Get Weather-Based Picks'}
      </button>
    </div>
  );
};

export default WeatherMenuWidget;
