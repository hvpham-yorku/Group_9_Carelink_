import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../components/landingpage/Footer';

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