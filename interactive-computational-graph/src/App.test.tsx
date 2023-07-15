import App from './App'

import { render, screen } from '@testing-library/react'
import renderer from 'react-test-renderer'

test('renders the app', () => {
  const tree = renderer.create(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('renders title', () => {
  render(<App />)
  const linkElement = screen.getByText(/Interactive Computational Graph/i)
  expect(linkElement).toBeInTheDocument()
})
