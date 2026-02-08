import axios from 'axios';

interface WeatherData {
  temperature: number;
  condition: string;
  isDay: boolean;
  city: string; // Hardcoded to New York for this demo
}

// New York Coordinates
const LAT = 40.7128;
const LON = -74.0060;

export const getWeatherCondition = (code: number): string => {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  if (code === 0) return 'Clear sky';
  if (code === 1 || code === 2 || code === 3) return 'Partly cloudy';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy'; // Default
};

const getCurrentWeather = async (): Promise<WeatherData> => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,is_day`,
    );

    const { current } = response.data;

    return {
      temperature: current.temperature_2m,
      condition: getWeatherCondition(current.weather_code),
      isDay: current.is_day === 1,
      city: 'New York',
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    // Fallback data
    return {
      temperature: 20,
      condition: 'Sunny',
      isDay: true,
      city: 'New York',
    };
  }
};

export default getCurrentWeather;
