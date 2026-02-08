import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from '../components/About';
import AIBanner from '../components/AIBanner';
import AIInsight from '../components/AIInsight';
import BackgroundEffect from '../components/BackgroundEffect';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import Menu from '../components/Menu';
import MenuChatbot from '../components/MenuChatbot';
import MenuItem from '../components/MenuItem';
import NeuralBackground from '../components/NeuralBackground';
import PromotionsWidget from '../components/PromotionsWidget';
import Reviews from '../components/Reviews';
import WaitTimeWidget from '../components/WaitTimeWidget';
import WeatherMenuWidget from '../components/WeatherMenuWidget';
import { MENU_ITEMS } from '../constants';

vi.mock('../services/weatherService', () => ({
  default: vi.fn(() => Promise.resolve({ temperature: 25, condition: 'clear', city: 'Test City' })),
}));

vi.mock('../services/geminiService', () => ({
  refineMenuItemDescription: vi.fn((item) => Promise.resolve(item.description)),
  getWeatherBasedRecommendations: vi.fn(() => Promise.resolve([MENU_ITEMS[0].name])),
  generateManagerResponse: vi.fn(() => Promise.resolve('Thank you for your feedback.')),
  processChatbotMessage: vi.fn(() => Promise.resolve('I am a mock response.')),
}));

describe('Component Smoke Tests', () => {
  it('renders About component', () => {
    render(<About />);
    expect(screen.getByText('Our Story')).toBeInTheDocument();
  });

  it('renders AIBanner component', () => {
    render(
        <MemoryRouter>
            <AIBanner />
        </MemoryRouter>
    );
    expect(screen.getByText('See what else AI can do for you')).toBeInTheDocument();
  });

  it('renders AIInsight component', () => {
    render(
      <AIInsight title="Test Insight">
        <p>Test children</p>
      </AIInsight>
    );
    expect(screen.getByText('AI Insight')).toBeInTheDocument();
  });

  it('renders BackgroundEffect component', () => {
    render(<BackgroundEffect />);
  });

  it('renders Footer component', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 Aetheria/i)).toBeInTheDocument();
  });

  it('renders Header component', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('AI Examples')).toBeInTheDocument();
  });

  it('renders Hero component', () => {
    render(<Hero />);
    expect(screen.getByText(/A Culinary Voyage/i)).toBeInTheDocument();
  });

  it('renders Layout component', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    expect(screen.getByText(/© 2026 Aetheria. All rights reserved./i)).toBeInTheDocument();
  });

  it('renders Loader component', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders Menu component', () => {
    render(<Menu />);
    expect(screen.getByText('Our AI-Crafted Menu')).toBeInTheDocument();
  });

  it('renders MenuChatbot component', () => {
    render(<MenuChatbot />);
    expect(screen.getByText(/Welcome to Aetheria/i)).toBeInTheDocument();
  });

  it('renders MenuItem component', () => {
    render(<MenuItem item={MENU_ITEMS[0]} />);
    expect(screen.getByText(MENU_ITEMS[0].name)).toBeInTheDocument();
  });

  it('renders NeuralBackground component', () => {
    render(<NeuralBackground />);
  });

  it('renders PromotionsWidget component', () => {
    render(<PromotionsWidget />);
    expect(screen.getByText("Chef's Special")).toBeInTheDocument();
  });

  it('renders Reviews component', () => {
    render(<Reviews />);
    expect(screen.getByText('Generate Manager Response')).toBeInTheDocument();
  });

  it('renders WaitTimeWidget component', () => {
    render(<WaitTimeWidget />);
    expect(screen.getByText('Wait Time')).toBeInTheDocument();
  });

  it('renders WeatherMenuWidget component', () => {
    render(<WeatherMenuWidget onRecommendations={() => {}} />);
    expect(screen.getByText(/loading weather/i)).toBeInTheDocument();
  });
});