import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeatherMenuWidget from '../components/WeatherMenuWidget';

vi.mock('../services/weatherService', () => ({
    default: vi.fn(() => Promise.resolve({ temperature: 25, condition: 'clear', city: 'Test City' })),
}));

vi.mock('../services/geminiService', () => ({
    getWeatherBasedRecommendations: vi.fn(() => Promise.resolve(['item1', 'item2'])),
}));

describe('WeatherMenuWidget', () => {
    it('calls onRecommendations with the correct data when the button is clicked', async () => {
        const onRecommendations = vi.fn();
        render(<WeatherMenuWidget onRecommendations={onRecommendations} />);

        // Wait for the weather to be loaded
        await waitFor(() => {
            expect(screen.getByText('Get Weather-Based Picks')).toBeInTheDocument();
        });

        const button = screen.getByText('Get Weather-Based Picks');
        fireEvent.click(button);

        await waitFor(() => {
            expect(onRecommendations).toHaveBeenCalledWith(['item1', 'item2']);
        });
    });
});
