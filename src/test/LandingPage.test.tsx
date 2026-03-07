import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../components/landingpage/Footer';
import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Header from '../components/landingpage/Header';
import Hero from '../components/landingpage/Hero';
import Section2 from '../components/landingpage/Section2';


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

/* Tests for the Hero Section */

describe('Hero Component', () => {
  
  it('renders both parts of the main heading', () => {
    render(<Hero />);
    // Checking for the two-part heading
    expect(screen.getByText(/Home Care Coordination,/i)).toBeInTheDocument();
    expect(screen.getByText(/Simplified/i)).toBeInTheDocument();
  });

  it('renders the supportive sub-headline', () => {
    render(<Hero />);
    const subHeadline = screen.getByText(/CareLink centralizes daily care tasks/i);
    expect(subHeadline).toBeInTheDocument();
    expect(subHeadline).toHaveClass('text-secondary', 'fw-light');
  });

  it('contains a functional "Learn More" anchor link pointing to #about', () => {
    render(<Hero />);
    const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
    expect(learnMoreLink).toHaveAttribute('href', '#about');
    // Verify it has the bold border classes you added
    expect(learnMoreLink).toHaveClass('border-2', 'border-primary');
  });

  it('renders the primary CTA button', () => {
    render(<Hero />);
    const getStartedBtn = screen.getByRole('button', { name: /get started!/i });
    expect(getStartedBtn).toBeInTheDocument();
    expect(getStartedBtn).toHaveClass('btn-primary');
  });

  it('renders the hero image with correct accessibility alt text (or exists)', () => {
    render(<Hero />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
    // Check for your Bootstrap sizing classes
    expect(image).toHaveClass('w-75', 'shadow');
  });

  it('applies the correct background gradient style', () => {
    const { container } = render(<Hero />);
    const section = container.querySelector('.Hero');
    // Verify the custom linear gradient is applied
    expect(section).toHaveStyle({ 
      background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)' 
    });
  });
});

/* Tests for Section 2 */

describe('Section2 Component', () => {
  
  it('renders the main heading correctly', () => {
    render(<Section2 />);
    const heading = screen.getByRole('heading', { level: 2, name: /Home Care Needs Better Tools/i });
    expect(heading).toBeInTheDocument();
  });

  it('contains the "about" ID for anchor navigation', () => {
    const { container } = render(<Section2 />);
    const section = container.querySelector('#about');
    expect(section).toBeInTheDocument();
  });

  it('renders the paragraph with correct typography and spacing classes', () => {
    render(<Section2 />);
    // Since h5 is used as a paragraph here
    const textBlock = screen.getByRole('heading', { level: 5 });
    
    expect(textBlock).toHaveClass('text-secondary', 'fw-light', 'fs-5', 'lh-base');
    expect(textBlock.textContent).toContain('Large hospital EHR systems');
  });

  it('uses the correct Bootstrap grid column classes for centering', () => {
    const { container } = render(<Section2 />);
    const column = container.querySelector('.col-11');
    
    // Verifying the responsive column widths you set
    expect(column).toHaveClass('col-md-8');
    expect(column).toHaveClass('col-lg-5');
  });

  it('applies the light background color to the section', () => {
    const { container } = render(<Section2 />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-light');
  });
});