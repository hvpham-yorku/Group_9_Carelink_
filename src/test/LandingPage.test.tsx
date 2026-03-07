import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../components/landingpage/Footer';
import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Header from '../components/landingpage/Header';


/* Tests for the Footer. */
describe('Footer Component', () => {
  
  it('renders the copyright text with the correct year', () => {
    render(<Footer />);
    const copyrightElement = screen.getByText(/© 2026 CareLink. All rights reserved./i);
    expect(copyrightElement).toBeInTheDocument();
  });

  it('contains the correct Bootstrap styling classes for the copyright section', () => {
    render(<Footer />);
    const copyrightText = screen.getByText(/© 2026 CareLink/i);
    expect(copyrightText).toHaveClass('small');
    expect(copyrightText).toHaveClass('text-secondary');
  });

  it('does NOT render the product links (since they are commented out)', () => {
    render(<Footer />);
    const featuresLink = screen.queryByText(/Features/i);
    const pricingLink = screen.queryByText(/Pricing/i);
    
    expect(featuresLink).not.toBeInTheDocument();
    expect(pricingLink).not.toBeInTheDocument();
  });

  it('renders the top border line container', () => {
    const { container } = render(<Footer />);
    const borderDiv = container.querySelector('.border-top');
    expect(borderDiv).toBeInTheDocument();
    expect(borderDiv).toHaveClass('border-secondary');
  });
});

/* Tests for the Header */

// 1. Mock the useNavigate hook so we can track if it's called
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Header Component', () => {
  
  it('renders the logo and brand name', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText(/CareLink/i)).toBeInTheDocument();
    // Check if the heart icon (SVG) is rendered by searching for its class
    const heartIcon = document.querySelector('.text-primary');
    expect(heartIcon).toBeInTheDocument();
  });

  it('contains the correct anchor links for page sections', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    const featuresLink = screen.getByRole('link', { name: /features/i });
    const whoLink = screen.getByRole('link', { name: /who it's for/i });

    expect(featuresLink).toHaveAttribute('href', '#features');
    expect(whoLink).toHaveAttribute('href', '#who-its-for');
  });

  it('navigates to /login when the Sign in button is clicked', () => {
    const mockNavigate = vi.fn();
    (useNavigate as any).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('has the correct Bootstrap classes for the sign-in button', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const btn = screen.getByRole('button', { name: /sign in/i });
    expect(btn).toHaveClass('btn-primary', 'px-5');
  });
});