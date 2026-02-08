import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AIExamples from '../components/AIExamples';

vi.mock('../services/weatherService', () => ({
  default: vi.fn(() => Promise.resolve({ temperature: 25, condition: 'clear', city: 'Test City' })),
}));

vi.mock('../services/geminiService', () => ({
  refineMenuItemDescription: vi.fn((item) => Promise.resolve(item.description)),
  getWeatherBasedRecommendations: vi.fn(() => Promise.resolve([])),
  generateManagerResponse: vi.fn(() => Promise.resolve('Thank you for your feedback.')),
  processChatbotMessage: vi.fn(() => Promise.resolve('I am a mock response.')),
}));

describe('AIExamples', () => {
  it('renders all the AI example cards', () => {
    render(<AIExamples />);
    expect(screen.getByText('AI Customer Service Chatbot')).toBeInTheDocument();
    expect(screen.getByText('AI Menu Description Enhancer')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered SEO')).toBeInTheDocument();
    expect(screen.getByText('AI Phone Answering')).toBeInTheDocument();
    expect(screen.getByText('AI Marketing Content')).toBeInTheDocument();
    expect(screen.getByText('AI Food Photo Enhancer')).toBeInTheDocument();
  });

  it('allows typing and sending a message in the chat', async () => {
    render(<AIExamples />);
    const input = screen.getByPlaceholderText('Ask a question...');
    const sendButton = screen.getByText('Send');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    await waitFor(() => {
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('enhances menu description on button click', async () => {
    render(<AIExamples />);
    const enhanceButton = screen.getByText('✨ Enhance with AI');
    fireEvent.click(enhanceButton);
    await waitFor(() => {
        expect(screen.getByText(/Thinking/i)).toBeInTheDocument();
    });
  });

  it('optimizes SEO on button click', async () => {
    render(<AIExamples />);
    const optimizeButton = screen.getByText('Optimize with AI');
    fireEvent.click(optimizeButton);
    await waitFor(() => {
        expect(screen.getByText('Revert to Original')).toBeInTheDocument();
    });
  });

  it('simulates a phone call on button click', async () => {
    render(<AIExamples />);
    const simulateButton = screen.getByText('Simulate a Call to Aetheria');
    fireEvent.click(simulateButton);
    await waitFor(() => {
        expect(screen.getByText('Simulation in progress...')).toBeInTheDocument();
    });
  });

  it('generates marketing content on button click', async () => {
    render(<AIExamples />);
    const generateButton = screen.getByText('✨ Generate with AI for Aetheria');
    fireEvent.click(generateButton);
    await waitFor(() => {
        expect(screen.getByText(/Thinking/i)).toBeInTheDocument();
    });
  });

  
});