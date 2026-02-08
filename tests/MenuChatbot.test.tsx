import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MenuChatbot from '../components/MenuChatbot';

vi.mock('../services/geminiService', () => ({
    processChatbotMessage: vi.fn(() => Promise.resolve('I am a mock response.')),
}));

describe('MenuChatbot', () => {
    it('sends a message and displays the AI response', async () => {
        render(<MenuChatbot />);
        const input = screen.getByPlaceholderText("e.g., 'Something vegetarian and light...'");
        const submitButton = screen.getByRole('button', { name: /submit/i });

        fireEvent.change(input, { target: { value: 'Hello' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('I am a mock response.')).toBeInTheDocument();
        });
    });
});
