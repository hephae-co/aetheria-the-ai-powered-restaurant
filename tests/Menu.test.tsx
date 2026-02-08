import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Menu from '../components/Menu';

vi.mock('../services/geminiService', () => ({
    refineMenuItemDescription: vi.fn((item) => Promise.resolve(`Refined ${item.description}`)),
    getWeatherBasedRecommendations: vi.fn(() => Promise.resolve([])),
}));

vi.mock('../services/weatherService', () => ({
    default: vi.fn(() => Promise.resolve({ temperature: 25, condition: 'clear', city: 'Test City' })),
}));

describe('Menu', () => {
    it('refines the menu descriptions when the button is clicked', async () => {
        render(<Menu />);
        // The button to open the modal is inside AIInsight, so we first need to open it
        const aiInsightButton = screen.getByText('AI Insight');
        fireEvent.click(aiInsightButton);

        const refineButton = await screen.findByText('Refine Menu Descriptions');
        fireEvent.click(refineButton);

        await waitFor(() => {
            const refinedDescription = screen.getAllByText(/Refined/);
            expect(refinedDescription.length).toBeGreaterThan(0);
        });
    });
});
