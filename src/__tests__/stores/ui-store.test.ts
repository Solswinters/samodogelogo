import { act } from '@testing-library/react'
import { useUIStore } from '@/stores/ui-store'

describe('uiStore', () => {
  beforeEach(() => {
    act(() => {
      useUIStore.setState(
        {
          theme: 'dark',
          sidebarOpen: false,
          modalOpen: false,
          toastMessage: null,
        },
        true
      )
    })
  })

  it('should initialize with default values', () => {
    const { theme, sidebarOpen, modalOpen } = useUIStore.getState()
    expect(theme).toBe('dark')
    expect(sidebarOpen).toBe(false)
    expect(modalOpen).toBe(false)
  })

  it('should toggle theme', () => {
    act(() => {
      useUIStore.getState().setTheme('light')
    })
    expect(useUIStore.getState().theme).toBe('light')

    act(() => {
      useUIStore.getState().setTheme('dark')
    })
    expect(useUIStore.getState().theme).toBe('dark')
  })

  it('should toggle sidebar', () => {
    act(() => {
      useUIStore.getState().toggleSidebar()
    })
    expect(useUIStore.getState().sidebarOpen).toBe(true)

    act(() => {
      useUIStore.getState().toggleSidebar()
    })
    expect(useUIStore.getState().sidebarOpen).toBe(false)
  })

  it('should open/close modal', () => {
    act(() => {
      useUIStore.getState().openModal()
    })
    expect(useUIStore.getState().modalOpen).toBe(true)

    act(() => {
      useUIStore.getState().closeModal()
    })
    expect(useUIStore.getState().modalOpen).toBe(false)
  })

  it('should show toast message', () => {
    act(() => {
      useUIStore.getState().showToast('Test message', 'success')
    })

    const { toastMessage } = useUIStore.getState()
    expect(toastMessage).toEqual({ message: 'Test message', type: 'success' })
  })

  it('should clear toast', () => {
    act(() => {
      useUIStore.getState().showToast('Test', 'info')
      useUIStore.getState().clearToast()
    })

    expect(useUIStore.getState().toastMessage).toBeNull()
  })
})
