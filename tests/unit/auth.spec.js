import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import LoginPage from '@/pages/LoginPage.vue'
import { auth } from '@/utils/auth'
import { authService } from '@/services/api'

// Mock de Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    query: {}
  })
}))

// Mock del servicio de autenticación
vi.mock('@/services/api', () => ({
  authService: {
    login: vi.fn()
  }
}))

describe('LoginPage.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LoginPage)
  })

  it('muestra el formulario de login correctamente', () => {
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('valida campos requeridos', async () => {
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password')
    
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('muestra error con credenciales inválidas', async () => {
    authService.login.mockRejectedValue(new Error('Credenciales incorrectas'))

    await wrapper.find('input[type="email"]').setValue('wrong@example.com')
    await wrapper.find('input[type="password"]').setValue('wrongpass')
    await wrapper.find('button[type="submit"]').trigger('click')

    expect(wrapper.text()).toContain('Credenciales incorrectas')
  })

  it('maneja login exitoso', async () => {
    const mockUser = { 
      id: 1, 
      nombre: 'Test User',
      correo: 'test@example.com',
      rol: 'admin'
    }

    authService.login.mockResolvedValue({
      user: mockUser,
      token: 'fake-token'
    })

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password')
    await wrapper.find('button[type="submit"]').trigger('click')

    expect(authService.login).toHaveBeenCalledWith({
      correo: 'test@example.com',
      password: 'password'
    })
  })

  it('muestra spinner durante la carga', async () => {
    authService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password')
    await wrapper.find('button[type="submit"]').trigger('click')

    expect(wrapper.find('.spinner-border').exists()).toBe(true)
  })
}) 