import { render, screen } from '@testing-library/react';
import App from './App';

test('renders HustleHub+ title', () => {
  render(<App />);
  const titles = screen.getAllByText(/HustleHub\+/i);
  expect(titles.length).toBeGreaterThan(0);
});

test('renders Login button', () => {
  render(<App />);
  const loginButton = screen.getByText(/Login/i);
  expect(loginButton).toBeInTheDocument();
});