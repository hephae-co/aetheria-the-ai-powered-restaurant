import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Reviews from '../components/Reviews';

vi.mock('../services/geminiService', () => ({
    generateManagerResponse: vi.fn(() => Promise.resolve('Thank you for your feedback.')),
}));

describe('Reviews', () => {
    it('submits a review and displays the manager response', async () => {
        render(<Reviews />);
        const textarea = screen.getByPlaceholderText('Write a sample review...');
        const submitButton = screen.getByText('Generate Manager Response');

        fireEvent.change(textarea, { target: { value: 'Great service!' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Thank you for your feedback.')).toBeInTheDocument();
        });
    });
});
