import React from 'react'

import App from './App'

import { render, screen } from '@testing-library/react'

test('renders title', () => {
  render(<App />)
  const linkElement = screen.getByText(/Interactive Computational Graph/i)
  expect(linkElement).toBeInTheDocument()
})
