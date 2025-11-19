/**
 * Test mocks and fixtures
 */

export const mockWalletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'

export const mockTransaction = {
  hash: '0xabc123',
  from: mockWalletAddress,
  to: '0x123abc',
  value: '1000000000000000000',
  gasLimit: '21000',
  gasPrice: '20000000000',
  nonce: 1,
  chainId: 8453,
}

export const mockGameState = {
  score: 1000,
  level: 5,
  lives: 3,
  combo: 2,
  isPaused: false,
  isGameOver: false,
}

export const mockPlayer = {
  address: mockWalletAddress,
  username: 'TestPlayer',
  score: 1000,
  level: 5,
  rank: 1,
  achievements: [],
}

export function createMockCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600
  return canvas
}

export function createMockContext2D(): CanvasRenderingContext2D {
  const canvas = createMockCanvas()
  return canvas.getContext('2d')!
}

export function mockConsoleError() {
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  afterAll(() => {
    console.error = originalError
  })
}

export function mockConsoleWarn() {
  const originalWarn = console.warn
  beforeAll(() => {
    console.warn = jest.fn()
  })
  afterAll(() => {
    console.warn = originalWarn
  })
}
