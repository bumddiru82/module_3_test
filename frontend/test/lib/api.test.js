import apiClient from '@/lib/api'

describe('API Client', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  describe('기본 요청 메서드', () => {
    it('GET 요청을 올바르게 수행한다', async () => {
      const mockResponse = { data: 'test' }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('GET 요청에 쿼리 파라미터를 포함한다', async () => {
      const mockResponse = { data: 'test' }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await apiClient.get('/test', { page: 1, limit: 10 })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1&limit=10'),
        expect.any(Object)
      )
    })

    it('POST 요청을 올바르게 수행한다', async () => {
      const mockData = { name: 'test' }
      const mockResponse = { id: 1, ...mockData }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.post('/test', mockData)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('PUT 요청을 올바르게 수행한다', async () => {
      const mockData = { name: 'updated' }
      const mockResponse = { id: 1, ...mockData }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.put('/test/1', mockData)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(mockData),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('DELETE 요청을 올바르게 수행한다', async () => {
      const mockResponse = { success: true }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.delete('/test/1')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('에러 처리', () => {
    it('HTTP 에러 응답을 처리한다', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' }),
      })

      await expect(apiClient.get('/test')).rejects.toThrow('Not found')
    })

    it('응답에 메시지가 없을 때 기본 에러 메시지를 사용한다', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      })

      await expect(apiClient.get('/test')).rejects.toThrow('HTTP error! status: 500')
    })

    it('네트워크 에러를 처리한다', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(apiClient.get('/test')).rejects.toThrow('Network error')
    })
  })

  describe('로그 관련 API', () => {
    it('getLogs를 올바르게 호출한다', async () => {
      const mockLogs = [{ id: 1, message: 'log' }]
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLogs,
      })

      const result = await apiClient.getLogs({ page: 1 })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/logs'),
        expect.any(Object)
      )
      expect(result).toEqual(mockLogs)
    })

    it('getLogById를 올바르게 호출한다', async () => {
      const mockLog = { id: 1, message: 'log' }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLog,
      })

      const result = await apiClient.getLogById(1)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/logs/1'),
        expect.any(Object)
      )
      expect(result).toEqual(mockLog)
    })

    it('getLogStats를 올바르게 호출한다', async () => {
      const mockStats = { total: 100 }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })

      const result = await apiClient.getLogStats()

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/logs/stats'),
        expect.any(Object)
      )
      expect(result).toEqual(mockStats)
    })
  })

  describe('사용자 관련 API', () => {
    it('getUsers를 올바르게 호출한다', async () => {
      const mockUsers = [{ id: 1, name: 'user' }]
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      })

      const result = await apiClient.getUsers()

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.any(Object)
      )
      expect(result).toEqual(mockUsers)
    })

    it('getUserById를 올바르게 호출한다', async () => {
      const mockUser = { id: 1, name: 'user' }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })

      const result = await apiClient.getUserById(1)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.any(Object)
      )
      expect(result).toEqual(mockUser)
    })

    it('createUser를 올바르게 호출한다', async () => {
      const userData = { name: 'newuser', email: 'new@test.com' }
      const mockUser = { id: 1, ...userData }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })

      const result = await apiClient.createUser(userData)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(userData),
        })
      )
      expect(result).toEqual(mockUser)
    })

    it('updateUser를 올바르게 호출한다', async () => {
      const userData = { name: 'updated' }
      const mockUser = { id: 1, ...userData }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })

      const result = await apiClient.updateUser(1, userData)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(userData),
        })
      )
      expect(result).toEqual(mockUser)
    })

    it('deleteUser를 올바르게 호출한다', async () => {
      const mockResponse = { success: true }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.deleteUser(1)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('설정 관련 API', () => {
    it('getSettings를 올바르게 호출한다', async () => {
      const mockSettings = { theme: 'dark' }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSettings,
      })

      const result = await apiClient.getSettings()

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/settings'),
        expect.any(Object)
      )
      expect(result).toEqual(mockSettings)
    })

    it('updateSettings를 올바르게 호출한다', async () => {
      const settings = { theme: 'light' }
      const mockSettings = { ...settings }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSettings,
      })

      const result = await apiClient.updateSettings(settings)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/settings'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(settings),
        })
      )
      expect(result).toEqual(mockSettings)
    })
  })
})
