import { authApi } from '@/lib/auth'
import { AccountInfo, LoginDto } from "@/types/nestapi"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

interface AuthState {
  user: AccountInfo | null
  token: string | null
  perms: string[] | null
  isAuthenticated: boolean
  // Actions
  login: (params: LoginDto) => Promise<void>
  logout: () => Promise<void>
  getToken: () => Promise<string | null>
  setToken: (token: string) => Promise<void>
  setUser: (user: AccountInfo) => void
  // 初始化方法
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  perms: null,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token')
      if (storedToken) {
        set({ token: storedToken, isAuthenticated: true })
        const userInfo = await authApi.getCurrentUser()
        const userPerms = await authApi.getCurrentUserPerm()
        set({ user: userInfo, perms: userPerms })
      }
    } catch (error) {
      console.error('Failed to restore user:', error)
      await AsyncStorage.removeItem('token')
      set({ token: null, user: null, perms: null, isAuthenticated: false })
    }
  },

  setToken: async (newToken: string) => {
    set({ token: newToken, isAuthenticated: true })
    await AsyncStorage.setItem('token', newToken)
  },

  login: async (params: LoginDto) => {
    try {
      const response = await authApi.login(params)
      if (!response || !response.token) {
        throw new Error('登录失败：未获取到有效的token')
      }
      const { token: newToken } = response
      await get().setToken(newToken)
      const user = await authApi.getCurrentUser()
      if (!user) {
        throw new Error('登录失败：未获取到用户信息')
      }
      const perms = await authApi.getCurrentUserPerm()
      set({ user, perms })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  logout: async () => {
    set({ token: null, user: null, perms: null, isAuthenticated: false })
    await AsyncStorage.removeItem('token')
  },

  getToken: async () => {
    const { token } = get()
    if (token) return token
    return await AsyncStorage.getItem('token')
  },

  setUser: (user: AccountInfo) => {
    set({ user })
  },
}))

// 导出静态方法供API拦截器使用
export const AuthStoreStatic = {
  getToken: async () => await AsyncStorage.getItem('token'),
  logout: async () => {
    await AsyncStorage.removeItem('token')
  },
} 