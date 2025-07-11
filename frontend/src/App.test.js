import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation with site name', () => {
  render(<App />);
  // Look for the site name, which is part of a Link in Navigation.jsx
  // Using getByRole to be more specific as the text appears multiple times.
  const siteNameElement = screen.getByRole('link', { name: /🌾 AgriLink.com/i });
  expect(siteNameElement).toBeInTheDocument();
});
