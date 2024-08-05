

import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

test('renders Header component', () => {
  render(<Header />);
  const buttonElement = screen.getByRole('button');
  expect(buttonElement).toBeInTheDocument();
});
