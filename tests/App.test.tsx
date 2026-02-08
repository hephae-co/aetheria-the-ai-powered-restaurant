import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
  it('renders HomePage for the root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /AI Concierge/i })).toBeInTheDocument();
  });

  it('renders AIExamples for the /ai-examples route', () => {
    render(
      <MemoryRouter initialEntries={['/ai-examples']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Interactive AI Examples/i })).toBeInTheDocument();
  });
});
