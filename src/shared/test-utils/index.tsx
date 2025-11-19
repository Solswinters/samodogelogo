/**
 * Test utilities for components and stores
 */

import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'

// Mock providers for testing
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data factories
export const createMockPlayer = (overrides = {}) => ({
  id: 'test-player',
  name: 'Test Player',
  score: 0,
  isAlive: true,
  position: { x: 0, y: 0 },
  ...overrides,
})

export const createMockObstacle = (overrides = {}) => ({
  id: 'test-obstacle',
  x: 100,
  y: 0,
  width: 30,
  height: 60,
  speed: 5,
  ...overrides,
})

export const createMockWalletAddress = () => '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'

export const createMockTransaction = (overrides = {}) => ({
  hash: '0x123456789abcdef',
  status: 'pending' as const,
  timestamp: Date.now(),
  ...overrides,
})
