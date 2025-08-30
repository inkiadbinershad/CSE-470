import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main navigation links', () => {
  render(<App />);
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Catalog/i)).toBeInTheDocument();
  expect(screen.getByText(/Cart/i)).toBeInTheDocument();
  expect(screen.getByText(/Wishlist/i)).toBeInTheDocument();
  expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  expect(screen.getByText(/Virtual Try-On/i)).toBeInTheDocument();
  expect(screen.getByText(/TrendBoxx/i)).toBeInTheDocument();
});