import { APIClient } from '@/lib/api/client'

// Mock fetch
global.fetch = jest.fn()

describe('APIClient', () => {
  let client: APIClient
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    client = new APIClient('https://api.example.com')
    mockFetch.mockClear()
  })

  describe('GET requests', () => {
    it('should make a GET request', async () => {
      const mockData = { id: 1, name: 'Test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await client.get('/users')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'GET',
        })
      )
      expect(result).toEqual(mockData)
    })
  })

  describe('POST requests', () => {
    it('should make a POST request with data', async () => {
      const mockData = { success: true }
      const postData = { name: 'Test' }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await client.post('/users', postData)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result).toEqual(mockData)
    })
  })

  describe('Error handling', () => {
    it('should throw error on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(client.get('/users')).rejects.toThrow()
    })

    it('should retry on failure', async () => {
      const mockData = { success: true }

      // Fail twice, succeed on third attempt
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        } as Response)

      const result = await client.get('/users', { retries: 2 })

      expect(mockFetch).toHaveBeenCalledTimes(3)
      expect(result).toEqual(mockData)
    })

    it('should call onRetry callback', async () => {
      const onRetry = jest.fn()

      mockFetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response)

      await client.get('/users', { retries: 1, onRetry })

      expect(onRetry).toHaveBeenCalledWith(1)
    })
  })

  describe('PUT requests', () => {
    it('should make a PUT request', async () => {
      const mockData = { success: true }
      const putData = { name: 'Updated' }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await client.put('/users/1', putData)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({
          method: 'PUT',
        })
      )
      expect(result).toEqual(mockData)
    })
  })

  describe('DELETE requests', () => {
    it('should make a DELETE request', async () => {
      const mockData = { success: true }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await client.delete('/users/1')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      )
      expect(result).toEqual(mockData)
    })
  })
})
