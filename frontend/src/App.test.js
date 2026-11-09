import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('HustleHub+ App', () => {
  test('shows the application title and tagline', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'HustleHub+' })).toBeInTheDocument();
    expect(screen.getByText('Secure freelance marketplace')).toBeInTheDocument();
  });

  test('shows all navigation buttons', () => {
    render(<App />);
    ['Login', 'Register', 'Browse Gigs', 'Create Gig', 'Book a Gig'].forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  test('shows the login form by default', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Log In' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  test('the password field hides what the user types', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
  });

  test('the user can type into the email field', async () => {
    render(<App />);
    const email = screen.getByPlaceholderText('Email address');
    await userEvent.type(email, 'client@example.com');
    expect(email).toHaveValue('client@example.com');
  });
});