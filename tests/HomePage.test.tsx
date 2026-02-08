import { render, screen } from '@testing-library/react';
import HomePage from '../components/HomePage';

vi.mock('../services/weatherService', () => ({
  default: vi.fn(() => Promise.resolve({ temperature: 25, condition: 'clear', city: 'Test City' })),
}));

vi.mock('../services/geminiService', () => ({
  refineMenuItemDescription: vi.fn((item) => Promise.resolve(item.description)),
  getWeatherBasedRecommendations: vi.fn(() => Promise.resolve([])),
  generateManagerResponse: vi.fn(() => Promise.resolve('Thank you for your feedback.')),
  processChatbotMessage: vi.fn(() => Promise.resolve('I am a mock response.')),
}));

describe('HomePage', () => {
  it('renders all the main sections', () => {
    render(<HomePage />);
    expect(screen.getByText('AI Concierge')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Widgets')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Hospitality')).toBeInTheDocument();
  });
});
