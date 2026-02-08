import axios from 'axios';
import getCurrentWeather, { getWeatherCondition } from '../../services/weatherService';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('weatherService', () => {
  it('fetches and processes weather data correctly', async () => {
    const mockWeatherData = {
      current: {
        temperature_2m: 25,
        weather_code: 0,
        is_day: 1
      },
    };

    mockedAxios.get.mockResolvedValue({ data: mockWeatherData });

    const weather = await getCurrentWeather();

    expect(weather).toEqual({
      temperature: 25,
      condition: 'Clear sky',
      city: 'New York',
      isDay: true,
    });
  });

  it('handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    const weather = await getCurrentWeather();

    expect(weather).toEqual({
      temperature: 20,
      condition: 'Sunny',
      city: 'New York',
      isDay: true
    });
  });
  
  it('returns the correct weather condition for a given WMO code', () => {
    expect(getWeatherCondition(0)).toBe('Clear sky');
    expect(getWeatherCondition(1)).toBe('Partly cloudy');
    expect(getWeatherCondition(45)).toBe('Foggy');
    expect(getWeatherCondition(51)).toBe('Drizzle');
    expect(getWeatherCondition(61)).toBe('Rainy');
    expect(getWeatherCondition(71)).toBe('Snowy');
    expect(getWeatherCondition(80)).toBe('Rain showers');
    expect(getWeatherCondition(95)).toBe('Thunderstorm');
    expect(getWeatherCondition(100)).toBe('Thunderstorm');
  });
});