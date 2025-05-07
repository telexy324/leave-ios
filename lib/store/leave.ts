import { leaveBalanceApi } from "@/lib/leaveBalance"
import { LeaveRequest } from '@/types'
import { LeaveStats } from '@/types/nestapi'
import { create } from 'zustand'

interface LeaveState {
  // 状态
  leaveRequests: LeaveRequest[]
  leaveStats: LeaveStats
  isLoading: boolean
  error: string | null

  // Actions
  clearError: () => void
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>
  fetchLeaveRequests: () => Promise<void>
  fetchLeaveStats: () => Promise<void>
}

const initialLeaveStats: LeaveStats = {
  totalCompensatoryLeaves: 0,
  usedCompensatoryLeaves: 0,
  totalAnnualLeaves: 0,
  usedAnnualLeaves: 0,
  totalSickLeaves: 0,
  usedSickLeaves: 0,
  totalPersonalLeaves: 0,
  usedPersonalLeaves: 0,
}

export const useLeaveStore = create<LeaveState>((set, get) => ({
  // 初始状态
  leaveRequests: [],
  leaveStats: initialLeaveStats,
  isLoading: false,
  error: null,

  // Actions
  clearError: () => set({ error: null }),

  submitLeaveRequest: async (request) => {
    try {
      set({ isLoading: true, error: null })
      
      // TODO: 调用实际的API
      const newRequest: LeaveRequest = {
        ...request,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      set(state => ({
        leaveRequests: [...state.leaveRequests, newRequest]
      }))
    } catch (err) {
      set({ error: '提交请假申请失败' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  fetchLeaveRequests: async () => {
    try {
      set({ isLoading: true, error: null })
      
      // TODO: 调用实际的API
      const mockRequests: LeaveRequest[] = [
        {
          id: '1',
          userId: '1',
          type: 'annual',
          startDate: '2024-05-01',
          endDate: '2024-05-05',
          reason: '个人原因',
          status: 'pending',
          createdAt: '2024-04-20T10:00:00Z',
          updatedAt: '2024-04-20T10:00:00Z',
        },
      ]
      
      set({ leaveRequests: mockRequests })
    } catch (err) {
      set({ error: '获取请假申请列表失败' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  fetchLeaveStats: async () => {
    try {
      set({ isLoading: true, error: null })
      const stats = await leaveBalanceApi.getLeaveStats()
      set({ leaveStats: stats })
    } catch (err) {
      set({ error: '获取假期统计失败' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },
})) 